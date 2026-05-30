// epicure-names.js — Noms d'ingrédients traduits (alignés par index PTS)
// Fourni progressivement. Repli : EPICURE_NAMES[lang][i] → PTS.n (EN natif) → PTS.fr
// À charger AVANT atlas.js dans index.html.
// Format : chaque tableau doit être aligné par index PTS (1790 entrées).
// Une case '' ou undefined → langue suivante dans la chaîne de repli.
window.EPICURE_NAMES = {
  // L'anglais vient déjà de PTS.n — ce tableau permet des corrections éventuelles.
  en: [],
  de: [],
  it: [],
  es: [],
};
