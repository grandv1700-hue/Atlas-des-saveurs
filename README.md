# Atlas des Saveurs

Carte vivante de ~1790 ingrédients et de leurs accords aromatiques.
La proximité = parenté aromatique (vecteurs 300 dimensions, projetés en 3D).
Pièce vitrine de **La Réserve de Val**, propulsée par **KLE**.

## Lancer en local
Ouvrir `index.html` dans un navigateur (ou servir le dossier :
`python3 -m http.server` puis http://localhost:8000).

## Structure
- `index.html` — page + styles (DA KLE), charge les scripts dans l'ordre.
- `epicure-data.js` — 1790 ingrédients (coords PCA 3D) + métadonnées.
- `epicure-embeddings.js` — vecteurs aromatiques 300-dim (normalisés).
- `pairing.js` — moteur d'accords (cosinus 300-dim, seuil TAU).
- `atlas.js` — rendu de la carte 3D + panneau de recherche + **Force d'accord**.
- `atlas-intro.js` — modale d'accueil / bouton "?".
- `game.js` — couche jeu (en construction).

## Calibration
Seuil d'accord `TAU` dans `pairing.js` (défaut 0.25). À ajuster au palais.

## Données
Projet Epicure — KAIKAKU-AI/epicure-mcp, licence MIT.
