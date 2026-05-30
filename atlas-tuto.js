// atlas-tuto.js — tutoriel guidé (démo des contrôles, avancement manuel)
// KLE / La Réserve de Val. AUTONOME. À charger APRÈS atlas-intro.js.
// Expose window.ATLAS_TUTO = { start, finish }.
(function () {
  const SEEN_KEY = 'atlas_tuto_seen_v1';
  let seen = false;
  try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}

  // ── CSS ──────────────────────────────────────────────────────────────
  const st = document.createElement('style');
  st.textContent = `
  .atb { position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    z-index:9800; max-width:340px; width:calc(100% - 32px);
    background:#DCDDB2;
    border:1px solid rgba(33,48,41,.18); border-radius:14px; padding:18px 18px 14px;
    color:#1a2e28; font-family:-apple-system,BlinkMacSystemFont,sans-serif;
    box-shadow:0 8px 28px rgba(0,0,0,.18); display:none; }
  .atb.show { display:block; animation:atb-in .25s ease; }
  @keyframes atb-in { from { opacity:0; transform:translateX(-50%) translateY(10px); }
                      to   { opacity:1; transform:translateX(-50%) translateY(0); } }
  .atb-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .atb-title { font:700 14px/1.2 Impact,Haettenschweiler,sans-serif;
    letter-spacing:.5px; color:#0f1c1a; text-transform:uppercase; }
  .atb-step { font-family:var(--mono,monospace); font-size:9.5px;
    color:#5a7a6f; text-transform:uppercase; letter-spacing:.08em; }
  .atb-body { font-size:13.5px; line-height:1.55; color:#2a3c35; margin:0 0 14px; }
  .atb-foot { display:flex; align-items:center; gap:10px; }
  .atb-next { flex:1; padding:9px 0; border:none; border-radius:9px;
    background:var(--signature,#E8B94E); color:#08100F;
    font:700 13px/1 -apple-system,sans-serif; cursor:pointer; transition:opacity .15s; }
  .atb-next:hover { opacity:.82; }
  .atb-skip { background:none; border:none; color:#5a7a6f; font-size:12px;
    cursor:pointer; padding:0; transition:color .15s; white-space:nowrap; }
  .atb-skip:hover { color:#1a2e28; }
  /* Halo sur l'élément pointé — collé à l'élément, sans débordement sur les voisins */
  .tuto-focus { outline:2px solid var(--signature,#E8B94E) !important;
    outline-offset:1px; box-shadow:none !important;
    position:relative; z-index:2;
    animation:tuto-pulse 1.8s ease-in-out infinite; }
  @keyframes tuto-pulse {
    0%,100% { outline-color:var(--signature,#E8B94E); }
    50%      { outline-color:rgba(232,185,78,.4); }
  }
  .atb-replay { display:block; width:100%; margin-top:10px; padding:9px;
    border:1px solid rgba(33,48,41,.2); border-radius:9px; background:transparent;
    color:#5a7a6f; font-size:13px; cursor:pointer;
    transition:color .15s,border-color .15s;
    font-family:-apple-system,BlinkMacSystemFont,sans-serif; }
  .atb-replay:hover { color:#1a2e28; border-color:rgba(33,48,41,.35); }
  `;
  document.head.appendChild(st);

  // ── Duos curatés pour la démo ─────────────────────────────────────────
  const DEMO_PAIRS = [
    ['chocolat', 'orange'],
    ['tomate', 'basilic'],
    ['saumon', 'citron'],
    ['ail', 'romarin'],
    ['cannelle', 'pomme'],
  ];

  // Garantit N ingrédients sélectionnés. Fallback absolu sur les premiers de PTS.
  function ensureN(n) {
    const chips = document.querySelectorAll('#panel .qchip').length;
    if (chips >= n) return;
    const PTS = window.EPICURE && window.EPICURE.PTS;
    if (!PTS || !window.select) return;
    if (window.clearSel) window.clearSel();
    for (const pair of DEMO_PAIRS) {
      const idx = pair
        .map(nm => PTS.findIndex(p => p.fr.toLowerCase() === nm))
        .filter(i => i >= 0);
      if (idx.length >= n) { idx.slice(0, n).forEach(i => window.select(i)); return; }
    }
    // Fallback absolu : premiers éléments disponibles dans PTS
    for (let i = 0, added = 0; i < PTS.length && added < n; i++) {
      window.select(i); added++;
    }
  }

  // ── Animation d'intro : saisie "chocolat" + sélection (1er ingrédient seulement) ──
  // Le 2e ingrédient est ajouté à l'arrivée de l'étape 1, pas ici.
  function playIntroDemo(onDone) {
    demoAborted = false;
    const WORD = 'chocolat';
    const sbox = document.getElementById('search');
    if (!sbox) { onDone(); return; }

    if (window.clearSel) window.clearSel();
    sbox.value = '';
    setFocus('searchWrapBtn');

    let charIdx = 0;

    function typeNext() {
      if (demoAborted) return;
      if (charIdx >= WORD.length) { setTimeout(pickResult, 600); return; }
      sbox.value += WORD[charIdx++];
      sbox.dispatchEvent(new Event('input', { bubbles: true }));
      setTimeout(typeNext, 150);
    }

    function pickResult() {
      if (demoAborted) return;
      const acBox = document.getElementById('ac');
      const firstItem = acBox && acBox.querySelector('.ac-item');
      if (firstItem) {
        firstItem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      } else {
        // Fallback : sélection directe
        const PTS = window.EPICURE && window.EPICURE.PTS;
        if (PTS && window.select) {
          const idx = PTS.findIndex(p => p.fr.toLowerCase() === 'chocolat');
          if (idx >= 0) window.select(idx);
        }
        sbox.value = '';
        sbox.dispatchEvent(new Event('input', { bubbles: true }));
      }
      setTimeout(() => {
        if (demoAborted) return;
        setFocus(null);
        onDone();
      }, 800);
    }

    setTimeout(typeNext, 700);
  }

  // ── Helpers d'action réelle (clics sur les vrais boutons) ─────────────

  // Filtrer par catégorie : ouvre la légende, clique le 1er item si rien n'est filtré
  function autoFilterCat() {
    const legEl = document.getElementById('leg');
    if (legEl) legEl.classList.remove('collapsed');
    const legReset = document.getElementById('legReset');
    const noFilter = !legReset || legReset.classList.contains('hidden');
    if (noFilter) {
      const firstItem = document.querySelector('#leg .leg-item');
      if (firstItem) firstItem.click();
    }
  }

  // Réinitialiser le filtre catégorie (nettoyage entre étapes)
  function resetCatFilter() {
    const legReset = document.getElementById('legReset');
    if (legReset && !legReset.classList.contains('hidden')) legReset.click();
  }

  // Lancer la rotation si elle est arrêtée
  function autoSpin() {
    const btn = document.getElementById('spinBtn');
    if (btn && !btn.classList.contains('on')) btn.click();
  }

  // Centrer sur la sélection si pas encore centré et sélection non vide
  function autoCenter() {
    const btn = document.getElementById('centerBtn');
    if (btn && !btn.classList.contains('disabled') && !btn.classList.contains('on')) btn.click();
  }

  // Ajouter le 2e ingrédient (orange) à l'arrivée de l'étape "combinaison"
  function autoAddSecond() {
    if (document.querySelectorAll('#panel .qchip').length >= 2) return;
    const PTS = window.EPICURE && window.EPICURE.PTS;
    if (PTS && window.select) {
      const idx = PTS.findIndex(p => p.fr.toLowerCase() === 'orange');
      if (idx >= 0) window.select(idx);
    }
  }

  // Ouvrir le menu langue (si langBtn existe)
  function autoOpenLang() {
    const btn = document.getElementById('langBtn');
    if (btn) btn.click();
  }

  // Fermer le menu langue (click document = handler de fermeture dans atlas.js)
  function autoCloseLang() {
    document.dispatchEvent(new MouseEvent('click'));
  }

  // ── Étapes ─────────────────────────────────────────────────────────────
  // targetId  : ID DOM de l'élément surligné (doit exister dans le DOM actuel)
  // onEnter   : déclenché à l'ARRIVÉE sur l'étape (démo auto si pas encore fait)
  // onAdvance : déclenché au clic "Suivant" (garantit l'état pour l'étape suivante)
  // Étapes — titres/corps via t() pour multilingue
  function makeSteps() {
    const T = window.t || (k => k);
    return [
      { title: T('tuto_s0_title'), body: T('tuto_s0_body'), targetId: 'searchWrapBtn', onAdvance: () => ensureN(1) },
      { title: T('tuto_s1_title'), body: T('tuto_s1_body'), targetId: 'searchWrapBtn', onEnter: autoAddSecond, onAdvance: () => ensureN(2) },
      { title: T('tuto_s2_title'), body: T('tuto_s2_body'), targetId: 'leg', onEnter: autoFilterCat, onAdvance: resetCatFilter },
      { title: T('tuto_s3_title'), body: T('tuto_s3_body'), targetId: 'centerBtn', onEnter: autoCenter, onAdvance: null },
      { title: T('tuto_s4_title'), body: T('tuto_s4_body'), targetId: 'textBtn', onAdvance: null },
      { title: T('tuto_s5_title'), body: T('tuto_s5_body'), targetId: 'gCarnetBtn', onAdvance: null },
      { title: T('tuto_s6_title'), body: T('tuto_s6_body'), targetId: 'langBtn', onEnter: autoOpenLang, onAdvance: autoCloseLang },
      { title: T('tuto_s7_title'), body: T('tuto_s7_body'), targetId: 'spinBtn', onEnter: autoSpin, onAdvance: null },
    ];
  }
  let STEPS = makeSteps();

  // ── Bubble DOM ────────────────────────────────────────────────────────
  const bub = document.createElement('div');
  bub.className = 'atb';
  bub.setAttribute('role', 'dialog');
  bub.setAttribute('aria-live', 'polite');
  const T0 = window.t || (k => k);
  bub.innerHTML = `
    <div class="atb-head">
      <span class="atb-title" id="atbTitle"></span>
      <span class="atb-step"  id="atbStep"></span>
    </div>
    <p class="atb-body" id="atbBody"></p>
    <div class="atb-foot">
      <button class="atb-next" id="atbNext">${T0('tuto_next')}</button>
      <button class="atb-skip" id="atbSkip">${T0('tuto_skip')}</button>
    </div>`;
  document.body.appendChild(bub);

  // ── State ─────────────────────────────────────────────────────────────
  let step = -1, focusEl = null, demoAborted = false;

  function setFocus(id) {
    if (focusEl) { focusEl.classList.remove('tuto-focus'); focusEl = null; }
    if (id) { focusEl = document.getElementById(id); if (focusEl) focusEl.classList.add('tuto-focus'); }
  }

  function showStep(n) {
    step = n;
    const s = STEPS[n];
    document.getElementById('atbTitle').textContent = s.title;
    document.getElementById('atbBody').textContent  = s.body;
    document.getElementById('atbStep').textContent  = `${n + 1} / ${STEPS.length}`;
    const T = window.t || (k => k);
    document.getElementById('atbNext').textContent  = n === STEPS.length - 1 ? T('tuto_finish') : T('tuto_next');
    setFocus(s.targetId);
    bub.classList.add('show');
    if (focusEl) focusEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (s.onEnter) s.onEnter();
  }

  function advance() {
    if (step >= 0) {
      const fn = STEPS[step].onAdvance;
      if (fn) fn();
    }
    if (step >= 0 && step < STEPS.length - 1) showStep(step + 1);
    else finish();
  }

  function finish() {
    demoAborted = true;
    bub.classList.remove('show');
    setFocus(null);
    step = -1;
    seen = true;
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
    // Déverrouiller la barre d'outils
    window.ATLAS_CTRL?.lock(false);
    // Terminer : rotation lancée, sélection vidée
    autoSpin();
    if (window.clearSel) window.clearSel();
  }

  function start() {
    // Ouvrir et verrouiller la barre d'outils pendant tout le tuto
    window.ATLAS_CTRL?.setOpen(true);
    window.ATLAS_CTRL?.lock(true);
    demoAborted = false;
    playIntroDemo(() => showStep(0));
  }

  document.getElementById('atbNext').onclick = (e) => { e.stopPropagation(); advance(); };
  document.getElementById('atbSkip').onclick = (e) => { e.stopPropagation(); finish(); };
  bub.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('keydown', (e) => {
    if (step < 0) return;
    if (e.key === 'ArrowRight') advance();
  });

  // ── "Revoir le tuto" dans la modale intro ────────────────────────────
  function addReplayBtn() {
    if (document.getElementById('atbReplay')) return;
    const goBtn = document.querySelector('.ai-go');
    if (!goBtn) return;
    const btn = document.createElement('button');
    btn.id = 'atbReplay'; btn.className = 'atb-replay';
    btn.textContent = (window.t || (k=>k))('tuto_replay');
    btn.onclick = (e) => {
      e.stopPropagation();
      window.ATLAS_INTRO && window.ATLAS_INTRO.close();
      setTimeout(start, 350);
    };
    goBtn.insertAdjacentElement('afterend', btn);
  }
  addReplayBtn();

  // ── Auto-start : après fermeture de la modale intro ───────────────────
  if (!seen) {
    const introEl = document.querySelector('.ai-ov');
    if (introEl) {
      let wasShown = false;
      const mo = new MutationObserver(() => {
        if (introEl.style.display === 'flex')  wasShown = true;
        if (wasShown && introEl.style.display === 'none') {
          mo.disconnect();
          if (!seen) setTimeout(start, 350);
        }
      });
      mo.observe(introEl, { attributes: true, attributeFilter: ['style'] });
    }
  }

  window.ATLAS_TUTO = { start, finish };
})();
