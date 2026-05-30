// atlas-badges.js — système de badges à débloquer (Pokédex aromatique)
// KLE / La Réserve de Val. AUTONOME. À charger après atlas.js.
// Expose window.ATLAS_BADGES = { onCompose, onCarnetAdd, onDaily, renderBadgesIn }.
(function () {
  'use strict';

  // ── CSS ───────────────────────────────────────────────────────────────
  (function () {
    const s = document.createElement('style');
    s.textContent = `
    /* Section badges dans le carnet */
    .gcn-badges-wrap {
      border-top:1px solid #1c2a25; padding:14px 16px 4px; }
    .gcn-badges-head {
      font-family:var(--mono,monospace); font-size:10px; letter-spacing:.08em;
      text-transform:uppercase; color:#7f9a8f; margin-bottom:10px; }
    .gcn-badges-list { display:flex; flex-direction:column; gap:6px; }
    .gbadge {
      display:flex; align-items:center; gap:10px; padding:9px 10px;
      border-radius:9px; border:1px solid #1c2a25;
      background:rgba(255,255,255,.02); opacity:.45; transition:opacity .15s; }
    .gbadge.on { opacity:1; border-color:rgba(232,185,78,.3); background:rgba(232,185,78,.06); }
    .gbadge-icon { font-size:20px; line-height:1; flex-shrink:0; filter:grayscale(1) opacity(.5); }
    .gbadge.on .gbadge-icon { filter:none; }
    .gbadge-info { display:flex; flex-direction:column; gap:2px; min-width:0; }
    .gbadge-title { font-size:13px; font-weight:600; color:#c8d8cc; white-space:nowrap; }
    .gbadge.on .gbadge-title { color:var(--signature,#E8B94E); }
    .gbadge-desc { font-size:11px; color:#7f9a8f; }
    .gbadge-prog { color:#3a5a4f; margin-left:4px; }
    `;
    document.head.appendChild(s);
  })();

  // ── Clés localStorage ────────────────────────────────────────────────
  const KEY_UNLOCKED  = 'atlas_badges_v1';
  const KEY_EXPLORED  = 'atlas_explored_v1';  // JSON array de fingerprints
  const KEY_AUDACIEUX = 'atlas_badge_audacieux_v1';

  // ── Helpers de stockage ───────────────────────────────────────────────
  function loadUnlocked() {
    try { return JSON.parse(localStorage.getItem(KEY_UNLOCKED) || '{}'); } catch (e) { return {}; }
  }
  function markUnlocked(id) {
    const u = loadUnlocked(); u[id] = true;
    try { localStorage.setItem(KEY_UNLOCKED, JSON.stringify(u)); } catch (e) {}
  }
  function isUnlocked(id) { return !!loadUnlocked()[id]; }

  // ── Suivi des combinaisons explorées ─────────────────────────────────
  function addExplored(fp) {
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem(KEY_EXPLORED) || '[]'); } catch (e) {}
    if (arr.includes(fp)) return arr.length;
    arr.push(fp);
    try { localStorage.setItem(KEY_EXPLORED, JSON.stringify(arr)); } catch (e) {}
    return arr.length;
  }
  function getExploredCount() {
    try { return JSON.parse(localStorage.getItem(KEY_EXPLORED) || '[]').length; } catch (e) { return 0; }
  }

  // ── Pépites par catégorie (calculé depuis le carnet) ─────────────────
  function getPepiteCatCount() {
    if (!window.EPICURE_GAME || !window.EPICURE) return 0;
    const entries = EPICURE_GAME.carnetLoad();
    const PTS = window.EPICURE.PTS;
    const cats = new Set();
    entries.forEach(e => {
      if (e.harmony >= 30 && e.surprise >= 45) { // formule pépite : harmony=round(blend*100), blend>=0.30 & surprise>=45
        e.names.forEach(fr => { const pt = PTS.find(p => p.fr === fr); if (pt) cats.add(pt.c); });
      }
    });
    return cats.size;
  }

  // ── Définitions des badges (titres/desc via t()) ─────────────────────
  const BADGES = [
    { id: 'first_pepite', icon: '✨',
      get title() { return (window.t||((k)=>k))('badge_first_pepite_title'); },
      get desc()  { return (window.t||((k)=>k))('badge_first_pepite_desc'); },
      progress: () => ({ cur: localStorage.getItem('atlas_first_pepite_v1') ? 1 : 0, max: 1 }) },

    { id: 'explorateur', icon: '🗺️',
      get title() { return (window.t||((k)=>k))('badge_explorateur_title'); },
      get desc()  { return (window.t||((k)=>k))('badge_explorateur_desc'); },
      progress: () => ({ cur: Math.min(getExploredCount(), 25), max: 25 }) },

    { id: 'collectionneur', icon: '📌',
      get title() { return (window.t||((k)=>k))('badge_collectionneur_title'); },
      get desc()  { return (window.t||((k)=>k))('badge_collectionneur_desc'); },
      progress: () => {
        const n = window.EPICURE_GAME ? EPICURE_GAME.carnetCount() : 0;
        return { cur: Math.min(n, 10), max: 10 };
      } },

    { id: 'audacieux', icon: '⚡',
      get title() { return (window.t||((k)=>k))('badge_audacieux_title'); },
      get desc()  { return (window.t||((k)=>k))('badge_audacieux_desc'); },
      progress: () => ({ cur: localStorage.getItem(KEY_AUDACIEUX) ? 1 : 0, max: 1 }) },

    { id: 'tour_terroir', icon: '🌍',
      get title() { return (window.t||((k)=>k))('badge_tour_title'); },
      get desc()  { return (window.t||((k)=>k))('badge_tour_desc'); },
      progress: () => ({ cur: Math.min(getPepiteCatCount(), 6), max: 6 }) },

    { id: 'serie', icon: '🔥',
      get title() { return (window.t||((k)=>k))('badge_serie_title'); },
      get desc()  { return (window.t||((k)=>k))('badge_serie_desc'); },
      progress: () => {
        const sk = window.EPICURE_GAME ? EPICURE_GAME.streakLoad() : { count: 0 };
        return { cur: Math.min(sk.count, 3), max: 3 };
      } },
  ];

  // ── Vérifier et débloquer ─────────────────────────────────────────────
  function checkAll() {
    BADGES.forEach(b => {
      if (isUnlocked(b.id)) return;
      const p = b.progress();
      if (p.cur >= p.max) {
        markUnlocked(b.id);
        const title = b.title;
        setTimeout(() => {
          if (typeof window.showToast === 'function') {
            const T = window.t || ((k) => k);
            window.showToast(T('toast_badge') + ' ' + title, 3500);
          }
        }, 200);
      }
    });
  }

  // ── Hooks appelés depuis atlas.js ─────────────────────────────────────

  // Après chaque calcul de score (renderForce)
  function onCompose(G, query) {
    if (!G || !query || query.length < 2) return;
    const PTS = window.EPICURE && window.EPICURE.PTS;
    if (PTS) {
      const fp = query.map(i => (PTS[i] ? PTS[i].fr : String(i))).sort().join('|');
      addExplored(fp);
    }
    if (G.surprise >= 60) {
      try { localStorage.setItem(KEY_AUDACIEUX, '1'); } catch (e) {}
    }
    checkAll();
  }

  // Après ajout au carnet
  function onCarnetAdd() { checkAll(); }

  // Après complétion du défi du jour
  function onDaily() { checkAll(); }

  // ── Injecter la section badges dans la modale carnet ─────────────────
  function renderBadgesIn(carnetOv) {
    if (!carnetOv) return;
    const card = carnetOv.querySelector('.gcn-card');
    if (!card) return;

    let el = card.querySelector('.gcn-badges-wrap');
    if (!el) { el = document.createElement('div'); card.appendChild(el); }

    const unlocked = loadUnlocked();
    el.className = 'gcn-badges-wrap';
    el.innerHTML = `
      <div class="gcn-badges-head">${(window.t||((k)=>k))('carnet_badges')}</div>
      <div class="gcn-badges-list">
        ${BADGES.map(b => {
          const on = !!unlocked[b.id];
          const p = b.progress();
          const prog = on ? '' : ` <span class="gbadge-prog">${p.cur} / ${p.max}</span>`;
          return `<div class="gbadge${on ? ' on' : ''}">
            <span class="gbadge-icon">${b.icon}</span>
            <div class="gbadge-info">
              <span class="gbadge-title">${b.title}</span>
              <span class="gbadge-desc">${b.desc}${prog}</span>
            </div>
          </div>`;
        }).join('')}
      </div>`;
  }

  window.ATLAS_BADGES = { onCompose, onCarnetAdd, onDaily, renderBadgesIn };
})();
