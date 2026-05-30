// game.js — couche jeu "Compose & score" de l'Atlas des Saveurs.
// Deux axes indépendants : HARMONIE (le plat tient) et SURPRISE (audacieux mais juste).
// Dépend de : window.EPICURE(.PTS), window.EPICURE_PAIRING(.sim/.strengthColor),
//             window.EPICURE_DEG (degrés de promiscuité + constantes de normalisation).
window.EPICURE_GAME = (function () {
  const PR  = window.EPICURE_PAIRING;
  const PTS = window.EPICURE.PTS;
  const DG  = window.EPICURE_DEG || { deg: [], maxMapDist: 1, surpriseNorm: 1 };
  const deg = DG.deg || [], MAXD = DG.maxMapDist || 1, NORM = DG.surpriseNorm || 1;

  function mapDist(i, j) {
    const A = PTS[i], B = PTS[j];
    const dx = A.x - B.x, dy = A.y - B.y, dz = A.z - B.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
  }
  // spécificité = anti passe-partout (deux ingrédients peu promiscuous => surprise forte)
  function spec(i, j) { return 1 / Math.sqrt(((deg[i]||0)+1) * ((deg[j]||0)+1)); }

  // surprise d'une paire -> 0..100 (force réelle MALGRÉ éloignement carte, hors passe-partout)
  function pairSurprise(i, j) {
    const f = PR.sim(i, j);
    if (f < 0.30) return 0;                 // pas d'affinité réelle => aucune surprise
    const raw = f * (mapDist(i, j) / MAXD) * spec(i, j);
    return Math.max(0, Math.min(100, Math.round(raw / NORM * 100)));
  }
  function surpriseVerdict(s) {
    if (s >= 70) return { color: '#E8B94E', label: 'pépite' };
    if (s >= 45) return { color: '#E0B255', label: 'audacieux' };
    if (s >= 20) return { color: '#9BD6A8', label: 'un peu osé' };
    return { color: '#7d7e60', label: 'sage' };
  }

  // Score d'une composition (>= 2 ingrédients). null sinon.
  function compositionScore(sel) {
    const q = [...new Set(sel)].filter(i => i >= 0);
    if (q.length < 2) return null;
    let minF = Infinity, sumF = 0, nP = 0, weakest = null, maxS = -1, bold = null;
    for (let a = 0; a < q.length; a++) for (let b = a + 1; b < q.length; b++) {
      const f = PR.sim(q[a], q[b]); sumF += f; nP++;
      if (f < minF) { minF = f; weakest = { i: q[a], j: q[b], v: f }; }
      const s = pairSurprise(q[a], q[b]);
      if (s > maxS) { maxS = s; bold = { i: q[a], j: q[b], s }; }
    }
    const harmony = Math.round(minF * 100);   // cohésion = maillon faible
    const surprise = Math.max(0, maxS);
    return {
      harmony, harmonyVerdict: PR.strengthColor(minF), weakest,
      surprise, surpriseVerdict: surpriseVerdict(surprise), bold,
      avg: Math.round(sumF / nP * 100),
      pepite: (minF >= 0.25) && (surprise >= 60)   // tient ET ose
    };
  }

  // ── Verdict de chef (barème sur harmonie + surprise) ──────────────────
  // Aligné sur strengthColor : faible<25 / correct 25-31 / bon 32-39 / excellent 40+
  function chefVerdict(G) {
    if (!G || G.harmony < 25) return { stars: 0, title: 'Le plat ne tient pas' };
    if (G.pepite || (G.harmony >= 40 && G.surprise >= 45)) return { stars: 3, title: 'Coup de génie' };
    if (G.harmony >= 32) return { stars: 2, title: 'Belle assiette' };   // bon accord = épingnable
    if (G.surprise >= 30) return { stars: 2, title: 'Audacieux' };       // surprise seule, même si correct
    return { stars: 1, title: 'Correct' };
  }

  // ── Carnet de découvertes (localStorage) ──────────────────────────────
  const CARNET_KEY = 'atlas_carnet_v1';
  function carnetLoad() {
    try { return JSON.parse(localStorage.getItem(CARNET_KEY)) || []; } catch (e) { return []; }
  }
  function carnetSave(entries) {
    try { localStorage.setItem(CARNET_KEY, JSON.stringify(entries)); } catch (e) {}
  }
  function carnetEntryKey(names) { return [...names].sort().join('|'); }
  function carnetHas(names) {
    const key = carnetEntryKey(names);
    return carnetLoad().some(e => carnetEntryKey(e.names) === key);
  }
  function carnetAdd(names, G) {
    const entries = carnetLoad();
    const key = carnetEntryKey(names);
    if (entries.some(e => carnetEntryKey(e.names) === key)) return { added: false };
    const v = chefVerdict(G);
    entries.unshift({ names, harmony: G.harmony, surprise: G.surprise, stars: v.stars, ts: Date.now() });
    carnetSave(entries);
    return { added: true };
  }
  function carnetCount() { return carnetLoad().length; }

  // ── Fiche d'accord (données statiques, sans IA) ────────────────────────
  const CAT_FR_G = {
    Pantry:'Épicerie', Vegetable:'Légume', Beverage:'Boisson', Grain:'Céréale',
    Fruit:'Fruit', Spice:'Épice', Fish:'Poisson', Dairy:'Laitier', Meat:'Viande',
    Herb:'Herbe', Sweet:'Sucré', Legume:'Légumineuse', 'Fat/Oil':'Huile / Gras',
    Seafood:'Fruit de mer', 'Nut/Seed':'Noix / Graine', Bakery:'Boulangerie', Seed:'Graine'
  };
  const catFRG = (c) => CAT_FR_G[c] || c;

  const ROLE_MAP = {
    Vegetable:'légume', Herb:'fraîcheur herbacée', Legume:'base légumineuse',
    Fruit:'acidité & sucre', Spice:'épice', Grain:'base céréalière',
    Bakery:'base boulangère', Meat:'protéine', Fish:'protéine marine',
    Seafood:'protéine marine', Dairy:'onctuosité', Beverage:'liquide / mouillage',
    Sweet:'sucré', 'Fat/Oil':'corps gras / liant', 'Nut/Seed':'texture & gras',
    Seed:'texture & gras', Pantry:'assaisonnement'
  };

  // Règles triées par spécificité (plus de catégories requis = plus précis)
  const USAGE_RULES = [
    { n:['Meat','Fat/Oil','Herb'],    t:['marinade / poêlée', 'rôti aux herbes'] },
    { n:['Fish','Herb'],              t:['tartare / ceviche', 'poisson poêlé aux herbes'] },
    { n:['Seafood','Herb'],           t:['fruits de mer aux herbes', 'salade marine fraîche'] },
    { n:['Grain','Vegetable','Spice'],t:['plat complet épicé', 'riz / couscous parfumé'] },
    { n:['Meat','Spice'],             t:['viande épicée / curry', 'brochettes marinées'] },
    { n:['Meat','Dairy'],             t:['sauce à la crème', 'gratin de viande'] },
    { n:['Meat','Grain'],             t:['plat complet', 'gratin / tian'] },
    { n:['Fish','Dairy'],             t:['sauce crémeuse', 'gratin de poisson'] },
    { n:['Fish','Spice'],             t:['poisson épicé', 'tajine de poisson'] },
    { n:['Seafood','Dairy'],          t:['bisque crémeuse', 'gratin de fruits de mer'] },
    { n:['Vegetable','Herb','Fat/Oil'],t:['légumes rôtis aux herbes', 'salade verte'] },
    { n:['Vegetable','Spice'],        t:['légumes épicés', 'curry végétarien'] },
    { n:['Legume','Spice'],           t:['dal / ragoût épicé', 'houmous aromatisé'] },
    { n:['Grain','Vegetable'],        t:['potage / grain bowl', 'plat végétarien'] },
    { n:['Fruit','Dairy'],            t:['dessert fruité', 'fromage & fruit'] },
    { n:['Fruit','Spice'],            t:['chutney / confiture épicée', 'dessert exotique'] },
    { n:['Dairy','Herb'],             t:['fromage aux herbes', 'sauce blanche fraîche'] },
    { n:['Sweet','Dairy'],            t:['dessert lacté', 'crème / mousse'] },
    { n:['Fat/Oil','Herb'],           t:['huile aromatisée', 'vinaigrette maison'] },
    { n:['Nut/Seed','Dairy'],         t:['fromage aux noix', 'sauce aux noix'] },
    { n:['Grain','Spice'],            t:['riz / couscous parfumé', 'boulgour épicé'] },
    // fallbacks mono-catégorie
    { n:['Fish'],      t:['filet au beurre', 'poisson vapeur citronné'] },
    { n:['Seafood'],   t:['fruits de mer grillés', 'bisque légère'] },
    { n:['Meat'],      t:['viande sautée', 'rôti / braisé'] },
    { n:['Vegetable'], t:['légumes rôtis', 'sauté au wok'] },
    { n:['Grain'],     t:['riz / pâtes', 'céréales en salade'] },
    { n:['Dairy'],     t:['sauce blanche / crème', 'fromage fondu'] },
    { n:['Fruit'],     t:['compote / coulis', 'salade de fruits'] },
    { n:['Herb'],      t:['herbes en assaisonnement', 'pesto / chimichurri'] },
    { n:['Spice'],     t:['mélange d\'épices', 'épice en fond de sauce'] },
    { n:['Legume'],    t:['ragoût de légumineuses', 'légumes secs en salade'] },
    { n:['Sweet'],     t:['dessert', 'sauce sucrée'] },
  ];

  function buildUsages(cats) {
    const tips = [];
    const sorted = [...USAGE_RULES].sort((a, b) => b.n.length - a.n.length);
    for (const rule of sorted) {
      if (rule.n.every(c => cats.has(c))) {
        for (const t of rule.t) { if (!tips.includes(t)) tips.push(t); }
        if (tips.length >= 2) break;
      }
    }
    if (!tips.length) tips.push('accord libre à explorer', 'à tester en cuisine');
    return tips.slice(0, 2);
  }

  function platFiche(sel) {
    const q = [...new Set(sel)].filter(i => i >= 0);
    if (q.length < 2) return null;
    const G = compositionScore(q);
    const V = chefVerdict(G);
    const ingredients = q.map(i => ({
      i, fr: PTS[i].fr, e: PTS[i].e, c: PTS[i].c,
      catFR: catFRG(PTS[i].c), role: ROLE_MAP[PTS[i].c] || catFRG(PTS[i].c)
    }));
    let boldText = null;
    if (G.bold && G.bold.s > 0) {
      const A = PTS[G.bold.i], B = PTS[G.bold.j];
      boldText = A.c === B.c
        ? `${A.fr} et ${B.fr} partagent une forte affinité aromatique au sein de la même famille (${catFRG(A.c)}).`
        : `${A.fr} (${catFRG(A.c)}) et ${B.fr} (${catFRG(B.c)}) ont une forte affinité aromatique malgré des univers éloignés.`;
    }
    const cats = new Set(q.map(i => PTS[i].c));
    return { G, V, ingredients, boldText, usages: buildUsages(cats) };
  }

  return { compositionScore, chefVerdict, pairSurprise, surpriseVerdict,
           carnetAdd, carnetHas, carnetCount, carnetLoad, platFiche };
})();
