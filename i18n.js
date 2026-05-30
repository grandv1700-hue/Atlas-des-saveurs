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
      btn_remove: 'Retirer',
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
      challenge_instr: 'Compose la meilleure combinaison autour de cet ingrédient. Score = Harmonie + Surprise (max ~150). L\'ingrédient imposé sera pré-sélectionné.',
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
      tuto_s6_title: 'Langue',
      tuto_s6_body: 'Le globe te permet d\'explorer l\'Atlas en français, anglais, allemand, italien ou espagnol — la terminologie et les noms d\'ingrédients s\'adaptent automatiquement.',
      tuto_s7_title: 'Rotation automatique',
      tuto_s7_body: 'Ce bouton lance ou arrête la rotation 3D. Utile pour explorer l\'ensemble du nuage.',
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
    en: {"search_placeholder": "Add an ingredient…", "search_label": "Add an ingredient", "panel_single": "Pairs with", "panel_multi": "Common pairings", "panel_empty": "No common pairing", "panel_empty_cat": " in these categories", "panel_empty_hint": "Remove an ingredient or broaden the categories.", "panel_tag": "Search", "score_harmony": "Harmony", "score_surprise": "Surprise", "score_weak": "Weak link:", "score_bold": "Find:", "score_pairs": "Pair strengths", "score_gate": "One notch more to unlock the card →", "btn_fiche": "View the card ↗", "btn_pin": "+ Pin to notebook", "btn_pin_done": "✓ Pinned", "btn_pin_already": "✓ Already pinned", "btn_share": "📸 Discovery card", "fiche_title": "Pairing card", "fiche_ingredient": "ingredient", "fiche_ingredients": "ingredients", "fiche_verdict": "Verdict", "fiche_roles": "Roles", "fiche_uses": "Suggested uses", "fiche_bold": "✨ Surprising link", "fiche_share": "Share ↗", "fiche_close": "Close", "verdict_0": "Doesn't hold", "verdict_1": "Decent", "verdict_2": "Fine combination", "verdict_3": "Genius combination", "surprise_sage": "safe", "surprise_ose": "a bit bold", "surprise_audacieux": "bold", "surprise_pepite": "gem", "toast_fiche": "✨ Card unlocked!", "toast_pepite_first": "✨ First gem!", "toast_pepite": "✨ Gem!", "toast_pin_ok": "Added to notebook ✓", "toast_pin_dup": "Already in the notebook", "toast_share_gen": "Generating the card…", "toast_badge": "🏅 Badge unlocked:", "cat_Pantry": "Pantry", "cat_Vegetable": "Vegetable", "cat_Beverage": "Beverage", "cat_Grain": "Grain", "cat_Fruit": "Fruit", "cat_Spice": "Spice", "cat_Fish": "Fish", "cat_Dairy": "Dairy", "cat_Meat": "Meat", "cat_Herb": "Herb", "cat_Sweet": "Sweet", "cat_Legume": "Legume", "cat_Fat/Oil": "Fat / Oil", "cat_Seafood": "Seafood", "cat_Nut/Seed": "Nut / Seed", "cat_Bakery": "Bakery", "cat_Seed": "Seed", "leg_title": "Categories", "leg_reset": "show all", "btn_remove": "Remove", "btn_spin": "Rotation", "btn_spin_title": "Toggle automatic rotation", "btn_center": "Center", "btn_center_title": "Center the selection on screen", "btn_text_title": "Text size", "btn_lang_title": "Language", "btn_toolbar_title": "Show / hide labels", "textpop_label": "Text size", "carnet_title": "Notebook", "carnet_empty": "No discovery yet.\nCreate a notable combination and pin it!", "carnet_badges": "Badges", "challenge_title": "Daily challenge", "challenge_instr": "Create the best combination around this ingredient. Score = Harmony + Surprise (max ~150). The imposed ingredient will be pre-selected.", "challenge_streak": "🔥 {n}-day streak", "challenge_go": "Start the challenge →", "challenge_improve": "Improve my score →", "challenge_copied": "Result copied ✓", "challenge_share": "Share ↗", "badge_first_pepite_title": "First gem", "badge_first_pepite_desc": "Discover your first aromatic gem", "badge_explorateur_title": "Explorer", "badge_explorateur_desc": "25 different combinations tried", "badge_collectionneur_title": "Collector", "badge_collectionneur_desc": "10 discoveries pinned to the notebook", "badge_audacieux_title": "Daring", "badge_audacieux_desc": "Surprise ≥ 60 on a combination", "badge_tour_title": "Terroir tour", "badge_tour_desc": "Gems in 6 different categories", "badge_serie_title": "Streak", "badge_serie_desc": "3 daily challenges in a row", "tuto_next": "Next →", "tuto_skip": "Skip", "tuto_finish": "Finish ✓", "tuto_replay": "↺ Replay the tutorial", "tuto_s0_title": "Search for an ingredient", "tuto_s0_body": "Type a name in the search bar, or click a point in the cloud directly to add it to your selection.", "tuto_s1_title": "Explore a combination", "tuto_s1_body": "Add a second one — the combination Score (Harmony + Surprise) appears in the right-hand panel.", "tuto_s2_title": "Filter by category", "tuto_s2_body": "Click an item in the legend (bottom left) to show only one family of ingredients and read their names on the map.", "tuto_s3_title": "Center the view", "tuto_s3_body": "Reframe the map on the ingredients of your current selection.", "tuto_s4_title": "Text size", "tuto_s4_body": "Adjust the size of the labels shown on the map — handy on a large screen or mobile.", "tuto_s5_title": "Notebook & gems", "tuto_s5_body": "Pin your best pairings (★★+) to the Notebook to come back to them. Gems are bold pairings that hold together aromatically.", "tuto_s6_title": "Language", "tuto_s6_body": "The globe lets you explore the Atlas in French, English, German, Italian or Spanish — terminology and ingredient names adapt automatically.", "tuto_s7_title": "Automatic rotation", "tuto_s7_body": "This button starts or stops the 3D rotation. Useful for exploring the whole cloud.", "intro_title": "Atlas des Saveurs", "intro_sub": "1790 ingredients · proximity = aromatic kinship", "intro_go": "Explore", "share_card_header": "LA RÉSERVE DE VAL  ·  ATLAS DES SAVEURS", "share_card_pepite": "✨  GEM", "share_card_harmony": "HARMONY", "share_card_surprise": "SURPRISE", "share_title": "Atlas des Saveurs — My discovery", "share_text": "Discover this combination on the Atlas des Saveurs", "subline": "{n} ingredients · proximity = aromatic kinship", "hint": "<span class=\"k\">drag</span> rotate · <span class=\"k\">scroll</span> zoom · <span class=\"k\">click</span> add · <span class=\"k\">2+</span> common pairings", "loader_msg": "Loading the map…"},
    de: {"search_placeholder": "Zutat hinzufügen…", "search_label": "Zutat hinzufügen", "panel_single": "Passt zu", "panel_multi": "Gemeinsame Kombinationen", "panel_empty": "Keine gemeinsame Kombination", "panel_empty_cat": " in diesen Kategorien", "panel_empty_hint": "Entferne eine Zutat oder erweitere die Kategorien.", "panel_tag": "Suche", "score_harmony": "Harmonie", "score_surprise": "Überraschung", "score_weak": "Schwachstelle:", "score_bold": "Entdeckung:", "score_pairs": "Stärke der Paare", "score_gate": "Noch ein Schritt zum Freischalten der Karte →", "btn_fiche": "Karte ansehen ↗", "btn_pin": "+ Ins Notizbuch heften", "btn_pin_done": "✓ Geheftet", "btn_pin_already": "✓ Bereits geheftet", "btn_share": "📸 Entdeckungskarte", "fiche_title": "Kombinationskarte", "fiche_ingredient": "Zutat", "fiche_ingredients": "Zutaten", "fiche_verdict": "Urteil", "fiche_roles": "Rollen", "fiche_uses": "Verwendungsideen", "fiche_bold": "✨ Überraschende Verbindung", "fiche_share": "Teilen ↗", "fiche_close": "Schließen", "verdict_0": "Hält nicht", "verdict_1": "Solide", "verdict_2": "Schöne Kombination", "verdict_3": "Geniale Kombination", "surprise_sage": "brav", "surprise_ose": "etwas gewagt", "surprise_audacieux": "gewagt", "surprise_pepite": "Juwel", "toast_fiche": "✨ Karte freigeschaltet!", "toast_pepite_first": "✨ Erstes Juwel!", "toast_pepite": "✨ Juwel!", "toast_pin_ok": "Zum Notizbuch hinzugefügt ✓", "toast_pin_dup": "Bereits im Notizbuch", "toast_share_gen": "Karte wird erstellt…", "toast_badge": "🏅 Abzeichen freigeschaltet:", "cat_Pantry": "Vorrat", "cat_Vegetable": "Gemüse", "cat_Beverage": "Getränk", "cat_Grain": "Getreide", "cat_Fruit": "Obst", "cat_Spice": "Gewürz", "cat_Fish": "Fisch", "cat_Dairy": "Milchprodukt", "cat_Meat": "Fleisch", "cat_Herb": "Kraut", "cat_Sweet": "Süßes", "cat_Legume": "Hülsenfrucht", "cat_Fat/Oil": "Fett / Öl", "cat_Seafood": "Meeresfrüchte", "cat_Nut/Seed": "Nuss / Samen", "cat_Bakery": "Backwaren", "cat_Seed": "Samen", "leg_title": "Kategorien", "leg_reset": "alle anzeigen", "btn_remove": "Entfernen", "btn_spin": "Rotation", "btn_spin_title": "Automatische Rotation ein/aus", "btn_center": "Zentrieren", "btn_center_title": "Auswahl auf dem Bildschirm zentrieren", "btn_text_title": "Textgröße", "btn_lang_title": "Sprache", "btn_toolbar_title": "Beschriftungen ein-/ausblenden", "textpop_label": "Textgröße", "carnet_title": "Notizbuch", "carnet_empty": "Noch keine Entdeckung.\nStelle eine bemerkenswerte Kombination zusammen und hefte sie an!", "carnet_badges": "Abzeichen", "challenge_title": "Tägliche Herausforderung", "challenge_instr": "Erstelle die beste Kombination rund um diese Zutat. Punktzahl = Harmonie + Überraschung (max ~150). Die vorgegebene Zutat wird vorab ausgewählt.", "challenge_streak": "🔥 {n} Tage in Folge", "challenge_go": "Herausforderung starten →", "challenge_improve": "Meine Punktzahl verbessern →", "challenge_copied": "Ergebnis kopiert ✓", "challenge_share": "Teilen ↗", "badge_first_pepite_title": "Erstes Juwel", "badge_first_pepite_desc": "Entdecke dein erstes aromatisches Juwel", "badge_explorateur_title": "Entdecker", "badge_explorateur_desc": "25 verschiedene Kombinationen getestet", "badge_collectionneur_title": "Sammler", "badge_collectionneur_desc": "10 Entdeckungen im Notizbuch geheftet", "badge_audacieux_title": "Gewagt", "badge_audacieux_desc": "Überraschung ≥ 60 bei einer Kombination", "badge_tour_title": "Terroir-Tour", "badge_tour_desc": "Juwelen in 6 verschiedenen Kategorien", "badge_serie_title": "Serie", "badge_serie_desc": "3 Tagesherausforderungen in Folge", "tuto_next": "Weiter →", "tuto_skip": "Überspringen", "tuto_finish": "Fertig ✓", "tuto_replay": "↺ Tutorial wiederholen", "tuto_s0_title": "Eine Zutat suchen", "tuto_s0_body": "Tippe einen Namen in die Suchleiste oder klicke direkt auf einen Punkt in der Wolke, um ihn zur Auswahl hinzuzufügen.", "tuto_s1_title": "Eine Kombination erkunden", "tuto_s1_body": "Füge eine zweite hinzu — der Kombinations-Score (Harmonie + Überraschung) erscheint im rechten Panel.", "tuto_s2_title": "Nach Kategorie filtern", "tuto_s2_body": "Klicke einen Eintrag in der Legende (unten links), um nur eine Zutatenfamilie anzuzeigen und ihre Namen auf der Karte zu lesen.", "tuto_s3_title": "Ansicht zentrieren", "tuto_s3_body": "Richtet die Karte auf die Zutaten deiner aktuellen Auswahl aus.", "tuto_s4_title": "Textgröße", "tuto_s4_body": "Passe die Größe der auf der Karte angezeigten Beschriftungen an — praktisch auf großem Bildschirm oder Handy.", "tuto_s5_title": "Notizbuch & Juwelen", "tuto_s5_body": "Hefte deine besten Kombinationen (★★+) ins Notizbuch, um sie wiederzufinden. Juwelen sind gewagte Kombinationen, die aromatisch funktionieren.", "tuto_s6_title": "Sprache", "tuto_s6_body": "Der Globus ermöglicht es, den Atlas auf Französisch, Englisch, Deutsch, Italienisch oder Spanisch zu erkunden — Begriffe und Zutatennamen passen sich automatisch an.", "tuto_s7_title": "Automatische Rotation", "tuto_s7_body": "Diese Schaltfläche startet oder stoppt die 3D-Rotation. Nützlich, um die ganze Wolke zu erkunden.", "intro_title": "Atlas des Saveurs", "intro_sub": "1790 Zutaten · Nähe = aromatische Verwandtschaft", "intro_go": "Entdecken", "share_card_header": "LA RÉSERVE DE VAL  ·  ATLAS DES SAVEURS", "share_card_pepite": "✨  JUWEL", "share_card_harmony": "HARMONIE", "share_card_surprise": "ÜBERRASCHUNG", "share_title": "Atlas des Saveurs — Meine Entdeckung", "share_text": "Entdecke diese Kombination im Atlas des Saveurs", "subline": "{n} Zutaten · Nähe = aromatische Verwandtschaft", "hint": "<span class=\"k\">ziehen</span> drehen · <span class=\"k\">scrollen</span> zoomen · <span class=\"k\">klicken</span> hinzufügen · <span class=\"k\">2+</span> gemeinsame Kombinationen", "loader_msg": "Karte wird geladen…"},
    it: {"search_placeholder": "Aggiungi un ingrediente…", "search_label": "Aggiungi un ingrediente", "panel_single": "Si abbina con", "panel_multi": "Abbinamenti comuni", "panel_empty": "Nessun abbinamento comune", "panel_empty_cat": " in queste categorie", "panel_empty_hint": "Togli un ingrediente o amplia le categorie.", "panel_tag": "Ricerca", "score_harmony": "Armonia", "score_surprise": "Sorpresa", "score_weak": "Anello debole:", "score_bold": "Scoperta:", "score_pairs": "Forza delle coppie", "score_gate": "Ancora un po' per sbloccare la scheda →", "btn_fiche": "Vedi la scheda ↗", "btn_pin": "+ Aggiungi al taccuino", "btn_pin_done": "✓ Aggiunto", "btn_pin_already": "✓ Già aggiunto", "btn_share": "📸 Carta della scoperta", "fiche_title": "Scheda dell'abbinamento", "fiche_ingredient": "ingrediente", "fiche_ingredients": "ingredienti", "fiche_verdict": "Giudizio", "fiche_roles": "Ruoli", "fiche_uses": "Idee d'uso", "fiche_bold": "✨ Legame sorprendente", "fiche_share": "Condividi ↗", "fiche_close": "Chiudi", "verdict_0": "Non regge", "verdict_1": "Discreto", "verdict_2": "Bella combinazione", "verdict_3": "Combinazione geniale", "surprise_sage": "prudente", "surprise_ose": "un po' audace", "surprise_audacieux": "audace", "surprise_pepite": "gemma", "toast_fiche": "✨ Scheda sbloccata!", "toast_pepite_first": "✨ Prima gemma!", "toast_pepite": "✨ Gemma!", "toast_pin_ok": "Aggiunto al taccuino ✓", "toast_pin_dup": "Già nel taccuino", "toast_share_gen": "Creazione della carta…", "toast_badge": "🏅 Distintivo sbloccato:", "cat_Pantry": "Dispensa", "cat_Vegetable": "Verdura", "cat_Beverage": "Bevanda", "cat_Grain": "Cereale", "cat_Fruit": "Frutta", "cat_Spice": "Spezia", "cat_Fish": "Pesce", "cat_Dairy": "Latticini", "cat_Meat": "Carne", "cat_Herb": "Erba", "cat_Sweet": "Dolce", "cat_Legume": "Legume", "cat_Fat/Oil": "Grasso / Olio", "cat_Seafood": "Frutti di mare", "cat_Nut/Seed": "Frutta secca / Semi", "cat_Bakery": "Panificio", "cat_Seed": "Seme", "leg_title": "Categorie", "leg_reset": "mostra tutto", "btn_remove": "Rimuovi", "btn_spin": "Rotazione", "btn_spin_title": "Attiva/disattiva la rotazione automatica", "btn_center": "Centra", "btn_center_title": "Centra la selezione sullo schermo", "btn_text_title": "Dimensione del testo", "btn_lang_title": "Lingua", "btn_toolbar_title": "Mostra/nascondi le etichette", "textpop_label": "Dimensione del testo", "carnet_title": "Taccuino", "carnet_empty": "Ancora nessuna scoperta.\nCrea una combinazione notevole e aggiungila!", "carnet_badges": "Distintivi", "challenge_title": "Sfida del giorno", "challenge_instr": "Crea la miglior combinazione attorno a questo ingrediente. Punteggio = Armonia + Sorpresa (max ~150). L'ingrediente imposto sarà pre-selezionato.", "challenge_streak": "🔥 Serie di {n} giorni consecutivi", "challenge_go": "Inizia la sfida →", "challenge_improve": "Migliora il mio punteggio →", "challenge_copied": "Risultato copiato ✓", "challenge_share": "Condividi ↗", "badge_first_pepite_title": "Prima gemma", "badge_first_pepite_desc": "Scopri la tua prima gemma aromatica", "badge_explorateur_title": "Esploratore", "badge_explorateur_desc": "25 combinazioni diverse provate", "badge_collectionneur_title": "Collezionista", "badge_collectionneur_desc": "10 scoperte aggiunte al taccuino", "badge_audacieux_title": "Audace", "badge_audacieux_desc": "Sorpresa ≥ 60 su una combinazione", "badge_tour_title": "Giro del terroir", "badge_tour_desc": "Gemme in 6 categorie diverse", "badge_serie_title": "Serie", "badge_serie_desc": "3 sfide del giorno di fila", "tuto_next": "Avanti →", "tuto_skip": "Salta", "tuto_finish": "Fine ✓", "tuto_replay": "↺ Rivedi il tutorial", "tuto_s0_title": "Cerca un ingrediente", "tuto_s0_body": "Digita un nome nella barra di ricerca, oppure clicca direttamente un punto nella nuvola per aggiungerlo alla selezione.", "tuto_s1_title": "Esplora una combinazione", "tuto_s1_body": "Aggiungine un secondo — il Punteggio della combinazione (Armonia + Sorpresa) appare nel pannello a destra.", "tuto_s2_title": "Filtra per categoria", "tuto_s2_body": "Clicca una voce nella legenda (in basso a sinistra) per mostrare solo una famiglia di ingredienti e leggerne i nomi sulla mappa.", "tuto_s3_title": "Centra la vista", "tuto_s3_body": "Inquadra la mappa sugli ingredienti della tua selezione attuale.", "tuto_s4_title": "Dimensione del testo", "tuto_s4_body": "Regola la dimensione delle etichette mostrate sulla mappa — comodo su schermo grande o mobile.", "tuto_s5_title": "Taccuino e gemme", "tuto_s5_body": "Aggiungi i tuoi migliori abbinamenti (★★+) al Taccuino per ritrovarli. Le gemme sono abbinamenti audaci che reggono dal punto di vista aromatico.", "tuto_s6_title": "Lingua", "tuto_s6_body": "Il globo ti permette di esplorare l'Atlas in francese, inglese, tedesco, italiano o spagnolo — la terminologia e i nomi degli ingredienti si adattano automaticamente.", "tuto_s7_title": "Rotazione automatica", "tuto_s7_body": "Questo pulsante avvia o ferma la rotazione 3D. Utile per esplorare tutta la nuvola.", "intro_title": "Atlas des Saveurs", "intro_sub": "1790 ingredienti · prossimità = parentela aromatica", "intro_go": "Esplora", "share_card_header": "LA RÉSERVE DE VAL  ·  ATLAS DES SAVEURS", "share_card_pepite": "✨  GEMMA", "share_card_harmony": "ARMONIA", "share_card_surprise": "SORPRESA", "share_title": "Atlas des Saveurs — La mia scoperta", "share_text": "Scopri questa combinazione sull'Atlas des Saveurs", "subline": "{n} ingredienti · prossimità = parentela aromatica", "hint": "<span class=\"k\">trascina</span> ruota · <span class=\"k\">rotella</span> zoom · <span class=\"k\">clic</span> aggiungi · <span class=\"k\">2+</span> abbinamenti comuni", "loader_msg": "Caricamento della mappa…"},
    es: {"search_placeholder": "Añadir un ingrediente…", "search_label": "Añadir un ingrediente", "panel_single": "Combina con", "panel_multi": "Combinaciones comunes", "panel_empty": "Ninguna combinación común", "panel_empty_cat": " en estas categorías", "panel_empty_hint": "Quita un ingrediente o amplía las categorías.", "panel_tag": "Búsqueda", "score_harmony": "Armonía", "score_surprise": "Sorpresa", "score_weak": "Eslabón débil:", "score_bold": "Hallazgo:", "score_pairs": "Fuerza de los pares", "score_gate": "Un paso más para desbloquear la ficha →", "btn_fiche": "Ver la ficha ↗", "btn_pin": "+ Guardar en el cuaderno", "btn_pin_done": "✓ Guardado", "btn_pin_already": "✓ Ya guardado", "btn_share": "📸 Tarjeta de descubrimiento", "fiche_title": "Ficha de combinación", "fiche_ingredient": "ingrediente", "fiche_ingredients": "ingredientes", "fiche_verdict": "Veredicto", "fiche_roles": "Funciones", "fiche_uses": "Ideas de uso", "fiche_bold": "✨ Vínculo sorprendente", "fiche_share": "Compartir ↗", "fiche_close": "Cerrar", "verdict_0": "No cuaja", "verdict_1": "Correcto", "verdict_2": "Buena combinación", "verdict_3": "Combinación genial", "surprise_sage": "prudente", "surprise_ose": "algo atrevido", "surprise_audacieux": "atrevido", "surprise_pepite": "joya", "toast_fiche": "✨ ¡Ficha desbloqueada!", "toast_pepite_first": "✨ ¡Primera joya!", "toast_pepite": "✨ ¡Joya!", "toast_pin_ok": "Añadido al cuaderno ✓", "toast_pin_dup": "Ya está en el cuaderno", "toast_share_gen": "Generando la tarjeta…", "toast_badge": "🏅 Insignia desbloqueada:", "cat_Pantry": "Despensa", "cat_Vegetable": "Verdura", "cat_Beverage": "Bebida", "cat_Grain": "Cereal", "cat_Fruit": "Fruta", "cat_Spice": "Especia", "cat_Fish": "Pescado", "cat_Dairy": "Lácteo", "cat_Meat": "Carne", "cat_Herb": "Hierba", "cat_Sweet": "Dulce", "cat_Legume": "Legumbre", "cat_Fat/Oil": "Grasa / Aceite", "cat_Seafood": "Marisco", "cat_Nut/Seed": "Fruto seco / Semilla", "cat_Bakery": "Panadería", "cat_Seed": "Semilla", "leg_title": "Categorías", "leg_reset": "mostrar todo", "btn_remove": "Quitar", "btn_spin": "Rotación", "btn_spin_title": "Activar/desactivar la rotación automática", "btn_center": "Centrar", "btn_center_title": "Centrar la selección en la pantalla", "btn_text_title": "Tamaño del texto", "btn_lang_title": "Idioma", "btn_toolbar_title": "Mostrar/ocultar las etiquetas", "textpop_label": "Tamaño del texto", "carnet_title": "Cuaderno", "carnet_empty": "Aún no hay descubrimientos.\n¡Crea una combinación destacada y guárdala!", "carnet_badges": "Insignias", "challenge_title": "Reto del día", "challenge_instr": "Crea la mejor combinación alrededor de este ingrediente. Puntuación = Armonía + Sorpresa (máx ~150). El ingrediente impuesto estará preseleccionado.", "challenge_streak": "🔥 Racha de {n} días seguidos", "challenge_go": "Empezar el reto →", "challenge_improve": "Mejorar mi puntuación →", "challenge_copied": "Resultado copiado ✓", "challenge_share": "Compartir ↗", "badge_first_pepite_title": "Primera joya", "badge_first_pepite_desc": "Descubre tu primera joya aromática", "badge_explorateur_title": "Explorador", "badge_explorateur_desc": "25 combinaciones diferentes probadas", "badge_collectionneur_title": "Coleccionista", "badge_collectionneur_desc": "10 descubrimientos guardados en el cuaderno", "badge_audacieux_title": "Atrevido", "badge_audacieux_desc": "Sorpresa ≥ 60 en una combinación", "badge_tour_title": "Vuelta al terruño", "badge_tour_desc": "Joyas en 6 categorías diferentes", "badge_serie_title": "Racha", "badge_serie_desc": "3 retos del día seguidos", "tuto_next": "Siguiente →", "tuto_skip": "Saltar", "tuto_finish": "Terminar ✓", "tuto_replay": "↺ Volver a ver el tutorial", "tuto_s0_title": "Buscar un ingrediente", "tuto_s0_body": "Escribe un nombre en la barra de búsqueda, o haz clic directamente en un punto de la nube para añadirlo a tu selección.", "tuto_s1_title": "Explorar una combinación", "tuto_s1_body": "Añade un segundo — la Puntuación de la combinación (Armonía + Sorpresa) aparece en el panel de la derecha.", "tuto_s2_title": "Filtrar por categoría", "tuto_s2_body": "Haz clic en un elemento de la leyenda (abajo a la izquierda) para mostrar solo una familia de ingredientes y leer sus nombres en el mapa.", "tuto_s3_title": "Centrar la vista", "tuto_s3_body": "Reencuadra el mapa sobre los ingredientes de tu selección actual.", "tuto_s4_title": "Tamaño del texto", "tuto_s4_body": "Ajusta el tamaño de las etiquetas mostradas en el mapa — práctico en pantalla grande o móvil.", "tuto_s5_title": "Cuaderno y joyas", "tuto_s5_body": "Guarda tus mejores combinaciones (★★+) en el Cuaderno para volver a ellas. Las joyas son combinaciones atrevidas que funcionan aromáticamente.", "tuto_s6_title": "Idioma", "tuto_s6_body": "El globo te permite explorar el Atlas en francés, inglés, alemán, italiano o español — la terminología y los nombres de los ingredientes se adaptan automáticamente.", "tuto_s7_title": "Rotación automática", "tuto_s7_body": "Este botón inicia o detiene la rotación 3D. Útil para explorar toda la nube.", "intro_title": "Atlas des Saveurs", "intro_sub": "1790 ingredientes · proximidad = parentesco aromático", "intro_go": "Explorar", "share_card_header": "LA RÉSERVE DE VAL  ·  ATLAS DES SAVEURS", "share_card_pepite": "✨  JOYA", "share_card_harmony": "ARMONÍA", "share_card_surprise": "SORPRESA", "share_title": "Atlas des Saveurs — Mi descubrimiento", "share_text": "Descubre esta combinación en el Atlas des Saveurs", "subline": "{n} ingredientes · proximidad = parentesco aromático", "hint": "<span class=\"k\">arrastra</span> girar · <span class=\"k\">rueda</span> zoom · <span class=\"k\">clic</span> añadir · <span class=\"k\">2+</span> combinaciones comunes", "loader_msg": "Cargando el mapa…"},
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
