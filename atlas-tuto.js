// atlas-tuto.js — tutoriel guidé première utilisation de l'Atlas des Saveurs
// KLE / La Réserve de Val. AUTONOME : injecte ses styles, sa bulle, son observer.
// À charger APRÈS atlas-intro.js. Expose window.ATLAS_TUTO = { start, finish }.
(function () {
  const SEEN_KEY = 'atlas_tuto_seen_v1';
  let seen = false;
  try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}

  // ── CSS ──────────────────────────────────────────────────────────────
  const st = document.createElement('style');
  st.textContent = `
  .atb { position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    z-index:9800; max-width:340px; width:calc(100% - 32px);
    background:linear-gradient(160deg,#0f1c1a,#0a1311);
    border:1px solid #213029; border-radius:14px; padding:18px 18px 14px;
    color:#DCDDB2; font-family:-apple-system,BlinkMacSystemFont,sans-serif;
    box-shadow:0 16px 40px rgba(0,0,0,.5); display:none; }
  .atb.show { display:block; animation:atb-in .25s ease; }
  @keyframes atb-in { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
  .atb-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .atb-title { font:700 14px/1.2 Impact,Haettenschweiler,sans-serif; letter-spacing:.5px; color:#fff; text-transform:uppercase; }
  .atb-step { font-family:var(--mono,monospace); font-size:9.5px; color:#7f9a8f; text-transform:uppercase; letter-spacing:.08em; }
  .atb-body { font-size:13.5px; line-height:1.55; color:#c8d8cc; margin:0 0 14px; }
  .atb-foot { display:flex; align-items:center; gap:10px; }
  .atb-next { flex:1; padding:9px 0; border:none; border-radius:9px;
    background:var(--signature,#E8B94E); color:#08100F;
    font:700 13px/1 -apple-system,sans-serif; cursor:pointer; transition:opacity .15s; }
  .atb-next:hover { opacity:.82; }
  .atb-skip { background:none; border:none; color:#7f9a8f; font-size:12px;
    cursor:pointer; padding:0; transition:color .15s; white-space:nowrap; }
  .atb-skip:hover { color:#DCDDB2; }
  .tuto-focus { outline:2px solid var(--accent,#E8B94E) !important;
    outline-offset:4px; border-radius:6px !important;
    animation:tuto-pulse 1.8s ease-in-out infinite; }
  @keyframes tuto-pulse {
    0%,100% { outline-color:var(--accent,#E8B94E); }
    50%      { outline-color:rgba(232,185,78,.2); }
  }
  .atb-replay { display:block; width:100%; margin-top:10px; padding:9px;
    border:1px solid #1c2a25; border-radius:9px; background:transparent;
    color:#7f9a8f; font-size:13px; cursor:pointer;
    transition:color .15s,border-color .15s;
    font-family:-apple-system,BlinkMacSystemFont,sans-serif; }
  .atb-replay:hover { color:#DCDDB2; border-color:#2a3a37; }
  `;
  document.head.appendChild(st);

  // ── Steps ─────────────────────────────────────────────────────────────
  // advance : 'chips:N' = auto quand N chips dans #panel | 'manual' = Suivant seulement
  const STEPS = [
    { title: 'Explorer la carte',
      body: 'Clique un point dans le nuage, ou tape un nom dans la barre de recherche.',
      targetId: 'search',
      advance: 'chips:1' },
    { title: 'Compose un duo',
      body: 'Ajoutes-en un deuxième pour voir leurs accords communs.',
      targetId: 'panel',
      advance: 'chips:2' },
    { title: 'Score du plat',
      body: 'Harmonie mesure si la combinaison tient. Surprise récompense les accords audacieux. Un accord ★★ ou plus peut être épinglé au Carnet.',
      targetId: 'panel',
      advance: 'manual' },
    { title: 'Carnet de découvertes',
      body: 'Bouton Carnet en haut à gauche — tes meilleures trouvailles. Clique une entrée pour recharger le plat.',
      targetId: 'gCarnetBtn',
      advance: 'manual' },
  ];

  // ── Bubble DOM ────────────────────────────────────────────────────────
  const bub = document.createElement('div');
  bub.className = 'atb';
  bub.setAttribute('role', 'dialog');
  bub.setAttribute('aria-live', 'polite');
  bub.innerHTML = `
    <div class="atb-head">
      <span class="atb-title" id="atbTitle"></span>
      <span class="atb-step"  id="atbStep"></span>
    </div>
    <p class="atb-body" id="atbBody"></p>
    <div class="atb-foot">
      <button class="atb-next" id="atbNext">Suivant →</button>
      <button class="atb-skip" id="atbSkip">Passer</button>
    </div>`;
  document.body.appendChild(bub);

  // ── State ─────────────────────────────────────────────────────────────
  let step = -1, focusEl = null;

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
    document.getElementById('atbNext').textContent  = n === STEPS.length - 1 ? 'Terminer ✓' : 'Suivant →';
    setFocus(s.targetId);
    bub.classList.add('show');
    if (s.advance !== 'manual') obs.observe(document.body, { childList: true, subtree: true });
    else obs.disconnect();
  }

  function advance() {
    if (step >= 0 && step < STEPS.length - 1) showStep(step + 1);
    else finish();
  }

  function finish() {
    obs.disconnect();
    bub.classList.remove('show');
    setFocus(null);
    step = -1;
    seen = true;
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
  }

  function start() {
    obs.disconnect();
    showStep(0);
  }

  document.getElementById('atbNext').onclick = (e) => { e.stopPropagation(); advance(); };
  document.getElementById('atbSkip').onclick = (e) => { e.stopPropagation(); finish(); };
  bub.addEventListener('click', (e) => e.stopPropagation());

  // ── Observer : avance sur action (chips dans #panel) ──────────────────
  const obs = new MutationObserver(() => {
    if (step < 0) return;
    const adv = STEPS[step].advance;
    const n = document.querySelectorAll('#panel .qchip').length;
    if      (adv === 'chips:1' && n >= 1) advance();
    else if (adv === 'chips:2' && n >= 2) advance();
  });

  // ── "Revoir le tuto" dans la modale ? ────────────────────────────────
  function addReplayBtn() {
    if (document.getElementById('atbReplay')) return;
    const goBtn = document.querySelector('.ai-go');
    if (!goBtn) return;
    const btn = document.createElement('button');
    btn.id = 'atbReplay'; btn.className = 'atb-replay';
    btn.textContent = '↺ Revoir le tutoriel';
    btn.onclick = (e) => {
      e.stopPropagation();
      window.ATLAS_INTRO && window.ATLAS_INTRO.close();
      setTimeout(start, 350);
    };
    goBtn.insertAdjacentElement('afterend', btn);
  }
  addReplayBtn(); // tente immédiatement (intro déjà dans le DOM à ce stade)

  // ── Auto-start : déclenché quand la modale intro se ferme ─────────────
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
