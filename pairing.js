// pairing.js — moteur d'accords multi-ingrédients (Atlas des Saveurs / KLE)
// Dépend de window.EPICURE (PTS) + window.EPICURE_EMB (vecteurs 300-dim normalisés).
// UI-agnostique : tu lui passes des index d'ingrédients, il te rend une liste classée.
//
// Idée : on garde TA sémantique "2/2 → 1/2", mais "match" ne veut plus dire
// "présent dans le top-10 figé" — ça veut dire "proximité aromatique réelle ≥ seuil".
// Du coup même un ingrédient hors top-10 peut compter, et le classement reste fin
// quand rien n'est commun à tous (tri secondaire = proximité au maillon faible).

window.EPICURE_PAIRING = (function () {
  const EMB = window.EPICURE_EMB;
  const PTS = window.EPICURE.PTS;
  const DIM = EMB.DIM;

  // Seuil de "match" : proximité cosinus au-dessus de laquelle on considère
  // qu'un candidat s'accorde VRAIMENT avec un ingrédient sélectionné.
  // Calibré sur la data Epicure (accords forts ≈ 0.30–0.45). À ajuster au feeling.
  const TAU = 0.25;

  // Produit scalaire (= cosinus, car vecteurs déjà L2-normalisés au build).
  function sim(i, j) {
    const a = i * DIM, b = j * DIM, V = EMB.V;
    let s = 0;
    for (let d = 0; d < DIM; d++) s += V[a + d] * V[b + d];
    return s;
  }

  // selIdx : tableau d'index PTS sélectionnés (clics nœud / chips).
  // opts :
  //   catFilter : Set/array de catégories EN (PTS[i].c) à garder, ou null = toutes
  //   tau       : seuil de match (défaut TAU)
  //   topN      : nb max de résultats (défaut 40)
  //   minMatches: n'afficher que les candidats avec ≥ ce nb de matches (défaut 1)
  //   agg       : 'common' (défaut, tri matches puis minProx) | 'min' | 'avg'
  function score(selIdx, opts = {}) {
    const sel = [...new Set(selIdx)].filter((i) => i >= 0);
    const k = sel.length;
    if (k === 0) return [];

    const tau = opts.tau != null ? opts.tau : TAU;
    const topN = opts.topN != null ? opts.topN : 40;
    const minMatches = opts.minMatches != null ? opts.minMatches : 1;
    const agg = opts.agg || "common";

    let cats = null;
    if (opts.catFilter) {
      cats = opts.catFilter instanceof Set ? opts.catFilter : new Set(opts.catFilter);
      if (cats.size === 0) cats = null;
    }

    const selSet = new Set(sel);
    const out = [];

    for (let i = 0; i < PTS.length; i++) {
      if (selSet.has(i)) continue;
      if (cats && !cats.has(PTS[i].c)) continue;

      let mn = Infinity, sum = 0, matches = 0;
      for (const s of sel) {
        const v = sim(i, s);
        sum += v;
        if (v < mn) mn = v;
        if (v >= tau) matches++;
      }
      if (matches < minMatches && k > 1) continue;

      out.push({
        i,
        n: PTS[i].n,
        fr: PTS[i].fr,
        c: PTS[i].c,
        matches,               // combien d'ingrédients sélectionnés ce candidat "matche"
        total: k,              // pour le badge "matches/total"
        badge: matches + "/" + k,
        common: matches === k, // true => badge doré
        minProx: mn,           // proximité au maillon faible
        avgProx: sum / k,      // proximité moyenne
      });
    }

    // Tri
    if (agg === "min") out.sort((a, b) => b.minProx - a.minProx);
    else if (agg === "avg") out.sort((a, b) => b.avgProx - a.avgProx);
    else // 'common' : d'abord le nb de matches (2/2 avant 1/2), puis le maillon faible
      out.sort((a, b) => b.matches - a.matches || b.minProx - a.minProx);

    return out.slice(0, topN);
  }

  // Force d'un accord -> couleur (rampe verte calibrée sur la vraie distribution
  // Epicure : faible <0.25 / correct 0.25-0.32 / bon 0.32-0.40 / excellent >0.40).
  // Une seule teinte, intensite croissante : pas de rouge (un accord faible n'est
  // pas une "erreur"). Le chiffre affiche reste BRUT (non normalise).
  function strengthColor(v) {
    if (v >= 0.40) return { color: "#2BC46E", label: "excellent" };
    if (v >= 0.32) return { color: "#5FB85A", label: "bon" };
    if (v >= 0.25) return { color: "#9BD6A8", label: "correct" };
    return { color: "#D2E9D6", label: "faible" };
  }

  // Accords d'UN seul ingrédient (cas 1 chip).
  // On ne garde que les VRAIS accords (proximité ≥ tau), classés par proximité.
  // Conséquence : le compteur affiché (results.length) = nb d'accords réels,
  // pas le plafond topN. Il varie donc selon l'ingrédient (polyvalent vs niche).
  function neighbors(idx, opts = {}) {
    const tau = opts.tau != null ? opts.tau : TAU;
    const topN = opts.topN != null ? opts.topN : 40;
    const all = score([idx], { ...opts, agg: "min", minMatches: 0, topN: PTS.length });
    return all.filter((x) => x.minProx >= tau).slice(0, topN);
  }

  return { score, neighbors, sim, strengthColor, TAU, DIM };
})();
