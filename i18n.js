// i18n.js — Système multilingue Atlas des Saveurs (FR/EN/DE/IT/ES)
// Expose window.ATLAS_I18N (chaînes) + window.ATLAS_LANG (API langue)
// À charger AVANT atlas.js dans index.html.
// EN/DE/IT/ES : stubs vides — Cowork fournira les traductions.
// Le repli FR est actif pour toutes les clés manquantes.
(function () {
  'use strict';

  // ── Chaînes d'interface ───────────────────────────────────────────────
  window.ATLAS_I18N = {

    // ── Français (référence complète) ────────────────────────────────────
    fr: {
      // Recherche
      search_placeholder: 'Ajouter un ingrédient…',
      search_label: 'Ajouter un ingrédient',
      // Panel
      panel_single: 'Se marie avec',
      panel_multi: 'Accords communs',
      panel_empty: 'Aucun accord commun',
      panel_empty_cat: ' dans ces catégories',
      panel_empty_hint: 'Retire un ingrédient ou élargis les catégories.',
      panel_tag: 'Recherche',
      // Score
      score_harmony: 'Harmonie',
      score_surprise: 'Surprise',
      score_weak: 'Maillon faible :',
      score_bold: 'Trouvaille :',
      score_pairs: 'Forces des paires',
      score_gate: 'Encore un cran pour débloquer la fiche →',
      // Boutons score
      btn_fiche: 'Voir la fiche ↗',
      btn_pin: '+ Épingler au carnet',
      btn_pin_done: '✓ Épinglé',
      btn_pin_already: '✓ Déjà épinglé',
      btn_share: '📸 Carte de découverte',
      // Fiche d'accord
      fiche_title: "Fiche d'accord",
      fiche_ingredient: 'ingrédient',
      fiche_ingredients: 'ingrédients',
      fiche_verdict: 'Verdict',
      fiche_roles: 'Rôles',
      fiche_uses: "Pistes d'usage",
      fiche_bold: '✨ Lien surprenant',
      fiche_share: 'Partager ↗',
      fiche_close: 'Fermer',
      // Verdicts chef
      verdict_0: 'Ne tient pas',
      verdict_1: 'Correct',
      verdict_2: 'Belle combinaison',
      verdict_3: 'Combinaison de génie',
      // Surprise labels
      surprise_sage: 'sage',
      surprise_ose: 'un peu osé',
      surprise_audacieux: 'audacieux',
      surprise_pepite: 'pépite',
      // Toasts
      toast_fiche: '✨ Fiche débloquée !',
      toast_pepite_first: '✨ Première pépite !',
      toast_pepite: '✨ Pépite !',
      toast_pin_ok: 'Ajouté au carnet ✓',
      toast_pin_dup: 'Déjà dans le carnet',
      toast_share_gen: 'Génération de la carte…',
      toast_badge: '🏅 Badge débloqué :',
      // Catégories
      cat_Pantry: 'Épicerie',
      cat_Vegetable: 'Légume',
      cat_Beverage: 'Boisson',
      cat_Grain: 'Céréale',
      cat_Fruit: 'Fruit',
      cat_Spice: 'Épice',
      cat_Fish: 'Poisson',
      cat_Dairy: 'Laitier',
      cat_Meat: 'Viande',
      cat_Herb: 'Herbe',
      cat_Sweet: 'Sucré',
      cat_Legume: 'Légumineuse',
      'cat_Fat/Oil': 'Huile / Gras',
      cat_Seafood: 'Fruit de mer',
      'cat_Nut/Seed': 'Noix / Graine',
      cat_Bakery: 'Boulangerie',
      cat_Seed: 'Graine',
      // Légende
      leg_title: 'Catégories',
      leg_reset: 'tout afficher',
      // Barre d'outils
      btn_spin: 'Rotation',
      btn_spin_title: 'Activer / couper la rotation automatique',
      btn_center: 'Centrer',
      btn_center_title: 'Centrer la sélection à l\'écran',
      btn_text_title: 'Taille du texte',
      btn_lang_title: 'Langue / Language',
      btn_toolbar_title: 'Afficher / masquer les libellés',
      // Taille du texte
      textpop_label: 'Taille du texte',
      // Carnet
      carnet_title: 'Carnet',
      carnet_empty: 'Aucune découverte encore.\nComposez une combinaison notable et épinglez-la !',
      carnet_badges: 'Badges',
      // Défi du jour
      challenge_title: 'Défi du jour',
      challenge_streak: '🔥 Série de {n} jours consécutifs',
      challenge_go: 'Commencer le défi →',
      challenge_improve: 'Améliorer mon score →',
      challenge_copied: 'Résultat copié ✓',
      challenge_share: 'Partager ↗',
      // Badges
      badge_first_pepite_title: 'Première pépite',
      badge_first_pepite_desc: 'Découvrir ta 1re pépite aromatique',
      badge_explorateur_title: 'Explorateur',
      badge_explorateur_desc: '25 combinaisons différentes testées',
      badge_collectionneur_title: 'Collectionneur',
      badge_collectionneur_desc: '10 découvertes épinglées au carnet',
      badge_audacieux_title: 'Audacieux',
      badge_audacieux_desc: 'Surprise ≥ 60 sur une combinaison',
      badge_tour_title: 'Tour du terroir',
      badge_tour_desc: 'Pépites dans 6 catégories différentes',
      badge_serie_title: 'Série',
      badge_serie_desc: '3 défis du jour d\'affilée',
      // Tutoriel
      tuto_next: 'Suivant →',
      tuto_skip: 'Passer',
      tuto_finish: 'Terminer ✓',
      tuto_replay: '↺ Revoir le tutoriel',
      tuto_s0_title: 'Rechercher un ingrédient',
      tuto_s0_body: 'Tape un nom dans la barre de recherche, ou clique directement un point du nuage pour l\'ajouter à ta sélection.',
      tuto_s1_title: 'Explorer une combinaison',
      tuto_s1_body: 'Ajoutes-en un deuxième — le Score de la combinaison (Harmonie + Surprise) apparaît dans le panneau de droite.',
      tuto_s2_title: 'Filtrer par catégorie',
      tuto_s2_body: 'Clique un item dans la légende (bas gauche) pour n\'afficher qu\'une famille d\'ingrédients et lire leurs noms sur la carte.',
      tuto_s3_title: 'Centrer la vue',
      tuto_s3_body: 'Recadre la carte sur les ingrédients de ta sélection courante.',
      tuto_s4_title: 'Taille du texte',
      tuto_s4_body: 'Ajuste la taille des labels affichés sur la carte — pratique sur grand écran ou mobile.',
      tuto_s5_title: 'Carnet & pépites',
      tuto_s5_body: 'Épingle tes meilleurs accords (★★+) au Carnet pour y revenir. Les pépites sont des accords audacieux qui tiennent aromatiquement.',
      tuto_s6_title: 'Rotation automatique',
      tuto_s6_body: 'Ce bouton lance ou arrête la rotation 3D. Utile pour explorer l\'ensemble du nuage.',
      // Intro
      intro_title: 'Atlas des Saveurs',
      intro_sub: '1790 ingrédients · proximité = parenté aromatique',
      intro_go: 'Explorer',
      // Partage carte canvas
      share_card_header: 'LA RÉSERVE DE VAL  ·  ATLAS DES SAVEURS',
      share_card_pepite: '✨  PÉPITE',
      share_card_harmony: 'HARMONIE',
      share_card_surprise: 'SURPRISE',
      share_title: 'Atlas des Saveurs — Ma découverte',
      share_text: 'Découvrez cette combinaison sur l\'Atlas des Saveurs',
      // Subline / hint
      subline: '{n} ingrédients · proximité = parenté aromatique',
      hint: '<span class="k">glisser</span> pivoter · <span class="k">molette</span> zoom · <span class="k">clic</span> ajouter · <span class="k">2+</span> accords communs',
      // Loader
      loader_msg: 'Chargement de la carte…',
    },

    // ── EN / DE / IT / ES — à remplir par Cowork ─────────────────────────
    // Repli FR actif pour toutes les clés manquantes (t() → FR si lang[key] absent).
    en: {},
    de: {},
    it: {},
    es: {},
  };

  // ── Gestionnaire de langue ────────────────────────────────────────────
  var SUPPORTED = ['fr', 'en', 'de', 'it', 'es'];
  var KEY = 'atlas_lang_v1';

  function detect() {
    try {
      var stored = localStorage.getItem(KEY);
      if (stored && SUPPORTED.indexOf(stored) >= 0) return stored;
    } catch (e) {}
    var nav = (navigator.language || 'fr').substring(0, 2).toLowerCase();
    return SUPPORTED.indexOf(nav) >= 0 ? nav : 'fr';
  }

  var _lang = detect();

  function t(key) {
    var strings = window.ATLAS_I18N;
    if (!strings) return key;
    return (strings[_lang] && strings[_lang][key] != null ? strings[_lang][key] :
           (strings.fr && strings.fr[key] != null ? strings.fr[key] : key));
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) < 0) return;
    _lang = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    if (typeof window.ATLAS_RERENDER === 'function') window.ATLAS_RERENDER();
  }

  function getLang() { return _lang; }

  // Nom d'ingrédient dans la langue active (avec replis PTS.n → PTS.fr)
  function ingName(pts_entry, index) {
    if (_lang === 'fr') return pts_entry.fr;
    var names = window.EPICURE_NAMES;
    if (names && names[_lang] && names[_lang][index]) return names[_lang][index];
    // Repli sur PTS.n (nom anglais natif des données Epicure) puis FR
    if (_lang !== 'en' && pts_entry.n) return pts_entry.n;
    return pts_entry.fr;
  }

  window.ATLAS_LANG = { t: t, setLang: setLang, getLang: getLang, ingName: ingName, SUPPORTED: SUPPORTED };
  window.t = t; // raccourci global
})();
