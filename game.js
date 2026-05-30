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
  return { compositionScore, pairSurprise, surpriseVerdict };
})();
