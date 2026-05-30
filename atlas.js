// atlas.js — Atlas des Saveurs (carte 3D des ingrédients), DA KLE
// Rendu : sprites soft-glow, depth fog, arêtes dégradées. Tactile + desktop.

(function () {
  const { PTS, PAL: _PAL } = window.EPICURE;

  // ── Palettes KLE (couvrent les 17 catégories réelles) ──────────────────
  const PALETTES = {
    marche: {
      Vegetable:'#6FA85A', Herb:'#9BC06E', Legume:'#C2C56B', Fruit:'#E0594C',
      Spice:'#E8943E', Grain:'#D8B24A', Bakery:'#D9975A', Meat:'#B43F36',
      Fish:'#52A9C2', Seafood:'#7FCBD6', Dairy:'#EDE7C6', Beverage:'#9E80C9',
      Sweet:'#DE86AD', 'Fat/Oil':'#E6C84F', 'Nut/Seed':'#A07B57', Seed:'#BC9A66',
      Pantry:'#8C8C7A'
    },
    vif: {
      Vegetable:'#37C871', Herb:'#7BE05A', Legume:'#C6E33D', Fruit:'#FF5247',
      Spice:'#FF8A1E', Grain:'#FFC53D', Bakery:'#FF9F4A', Meat:'#E23B30',
      Fish:'#27C6E0', Seafood:'#52E0D6', Dairy:'#FFF4D6', Beverage:'#A36BFF',
      Sweet:'#FF6FB0', 'Fat/Oil':'#FFD426', 'Nut/Seed':'#C98A4F', Seed:'#E0B25C',
      Pantry:'#A8A894'
    },
    spectre: {
      Fruit:'#F0475A', Meat:'#E84C8A', Sweet:'#D964B8', Beverage:'#9E6CE0',
      Seafood:'#5C8AF0', Fish:'#39B6E0', Dairy:'#37D6C4', Vegetable:'#3FCB7A',
      Herb:'#7BD645', Legume:'#B6D43E', Grain:'#E8C53D', 'Fat/Oil':'#F0B038',
      Spice:'#F08C32', Bakery:'#E87A45', 'Nut/Seed':'#C98A5C', Seed:'#D9A86A',
      Pantry:'#9AA0A6'
    }
  };
  let palName = 'vif';
  const colorOf = (c) => PALETTES[palName][c] || '#8C8C7A';

  // ── Traduction FR des catégories ───────────────────────────────────────
  const CAT_FR = {
    Pantry:'Épicerie', Vegetable:'Légume', Beverage:'Boisson', Grain:'Céréale',
    Fruit:'Fruit', Spice:'Épice', Fish:'Poisson', Dairy:'Laitier', Meat:'Viande',
    Herb:'Herbe', Sweet:'Sucré', Legume:'Légumineuse', 'Fat/Oil':'Huile / Gras',
    Seafood:'Fruit de mer', 'Nut/Seed':'Noix / Graine', Bakery:'Boulangerie', Seed:'Graine'
  };
  const catFR = (c) => CAT_FR[c] || c;

  // ── Canvas setup ────────────────────────────────────────────────────────
  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const tip = document.getElementById('tip'), panel = document.getElementById('panel');
  const sbox = document.getElementById('search');
  let W, H, cx, cy, DPR = Math.min(window.devicePixelRatio || 1, 2);
  function rs() {
    W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = W / 2; cy = H / 2 + 14;
  }

  // ── State ─────────────────────────────────────────────────────────────
  let ax = 0.42, ay = 0.45, zoom = 1, autorot = true, centered = false;
  let query = [];     // indices des ingrédients de la requête
  let results = [];   // résultats classés : [{ i, count, dist, rank }]
  let textScale = (() => { const v = parseFloat(localStorage.getItem('atlas_textscale')); return (v >= 1 && v <= 2) ? v : 1; })();
  const mq = window.matchMedia('(max-width: 640px)');
  const isMobile = () => mq.matches;
  const activeCats = new Set();           // vide = toutes
  const FOC = 3.2;

  // ── Projection 3D → 2D ──────────────────────────────────────────────────
  function proj(p) {
    const x = p.x, y = p.y, z = p.z;
    const x1 = x * Math.cos(ay) + z * Math.sin(ay);
    const z1 = -x * Math.sin(ay) + z * Math.cos(ay);
    const y2 = y * Math.cos(ax) - z1 * Math.sin(ax);
    const z2 = y * Math.sin(ax) + z1 * Math.cos(ax);
    const f = FOC / (FOC + z2), s = Math.min(W, H) * 0.46 * zoom;
    return { sx: cx + x1 * s * f, sy: cy - y2 * s * f, depth: z2, f };
  }
  function offset() {
    if (query.length === 0 || !centered) return [0, 0];
    let sx = 0, sy = 0;
    for (const i of query) { const p = proj(PTS[i]); sx += p.sx; sy += p.sy; }
    sx /= query.length; sy /= query.length;
    const ty = isMobile() ? H * 0.45 : cy;   // à peine au-dessus du milieu sur mobile
    return [cx - sx, ty - sy];
  }

  // ── Sprite cache (soft radial glow) ──────────────────────────────────────
  const spriteCache = {};
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  function sprite(color) {
    if (spriteCache[color]) return spriteCache[color];
    const S = 128, c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d'), [r, gr, b] = hexToRgb(color);
    const grad = g.createRadialGradient(S/2, S/2, 0, S/2, S/2, S/2);
    grad.addColorStop(0,    `rgba(${r},${gr},${b},1)`);
    grad.addColorStop(0.16, `rgba(${r},${gr},${b},0.92)`);
    grad.addColorStop(0.40, `rgba(${r},${gr},${b},0.30)`);
    grad.addColorStop(1,    `rgba(${r},${gr},${b},0)`);
    g.fillStyle = grad; g.fillRect(0, 0, S, S);
    spriteCache[color] = c; return c;
  }
  const clearSprites = () => { for (const k in spriteCache) delete spriteCache[k]; };

  // ── Background : vignette charbon + chaleur sarcelle ──────────────────────
  let bgGrad;
  function buildBg() {
    bgGrad = ctx.createRadialGradient(cx, cy - 30, 40, cx, cy, Math.max(W, H) * 0.75);
    bgGrad.addColorStop(0, '#0d1a18');
    bgGrad.addColorStop(0.55, '#0a1311');
    bgGrad.addColorStop(1, '#070d0c');
  }

  // ── Draw ──────────────────────────────────────────────────────────────
  function isActive(i) { return activeCats.size === 0 || activeCats.has(PTS[i].c); }

  function draw() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    const oo = offset();
    const P = PTS.map((p, i) => ({ i, pr: proj(p) }));
    P.sort((a, b) => b.pr.depth - a.pr.depth);

    const hasQuery = query.length > 0;
    const qset = new Set(query);
    const rset = new Set(results.map(r => r.i));

    // ── arêtes : de chaque ingrédient-requête vers les meilleurs résultats ──
    if (hasQuery) {
      ctx.globalCompositeOperation = 'lighter';
      const topR = results.slice(0, 14);
      for (const qi of query) {
        const q = PTS[qi], ca = proj(q);
        for (const r of topR) {
          const t = PTS[r.i];
          if (!(q.nb.includes(r.i) || t.nb.includes(qi))) continue;
          const c = proj(t);
          const x0 = ca.sx + oo[0], y0 = ca.sy + oo[1], x1 = c.sx + oo[0], y1 = c.sy + oo[1];
          const lg = ctx.createLinearGradient(x0, y0, x1, y1);
          lg.addColorStop(0, 'rgba(195,69,60,0.8)');
          lg.addColorStop(1, hexToRgba(colorOf(t.c), 0.4));
          ctx.strokeStyle = lg; ctx.globalAlpha = 0.26; ctx.lineWidth = 3 * c.f;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
          ctx.globalAlpha = 0.75; ctx.lineWidth = 1 * c.f;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }

    // ── nuage : halo additif (A) + points nets (B) ──
    ctx.globalCompositeOperation = 'lighter';
    for (const o of P) {
      const i = o.i, pr = o.pr;
      if (hasQuery && (qset.has(i) || rset.has(i))) continue;
      const sx = pr.sx + oo[0], sy = pr.sy + oo[1];
      const fog = Math.max(0, Math.min(1, (pr.f - 0.62) / 0.5));
      let alpha;
      if (hasQuery) alpha = 0.05;
      else if (activeCats.size) alpha = isActive(i) ? (0.16 + 0.26 * fog) : 0.015;
      else alpha = 0.10 + 0.26 * fog;
      if (alpha < 0.02) continue;
      const baseR = 2.2 * pr.f * Math.sqrt(zoom);
      const D = baseR * 3.0;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite(colorOf(PTS[i].c)), sx - D/2, sy - D/2, D, D);
    }
    ctx.globalCompositeOperation = 'source-over';
    for (const o of P) {
      const i = o.i, p = PTS[i], pr = o.pr;
      if (hasQuery && (qset.has(i) || rset.has(i))) continue;
      const sx = pr.sx + oo[0], sy = pr.sy + oo[1];
      const fog = Math.max(0, Math.min(1, (pr.f - 0.62) / 0.5));
      let alpha;
      if (hasQuery) alpha = 0.09;
      else if (activeCats.size) alpha = isActive(i) ? (0.55 + 0.45 * fog) : 0.05;
      else alpha = 0.5 + 0.5 * fog;
      if (alpha < 0.03) continue;
      let r = 1.9 * pr.f * Math.sqrt(zoom); if (r < 0.85) r = 0.85;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colorOf(p.c);
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (!hasQuery) {
      // labels des plus proches en mode filtre catégorie
      if (activeCats.size) {
        const labeled = P.filter(o => isActive(o.i)).slice(-70);
        for (const o of labeled) {
          const p = PTS[o.i], pr = o.pr;
          if (pr.f < 0.86) continue;
          const sx = pr.sx, sy = pr.sy;
          ctx.font = '600 ' + (11 * textScale) + 'px Figtree, sans-serif';
          ctx.fillStyle = 'rgba(7,13,12,0.85)';
          ctx.fillText(p.fr, sx + 0.5, sy + 13.5);
          ctx.fillStyle = 'rgba(220,221,178,0.75)';
          ctx.fillText(p.fr, sx, sy + 13);
        }
      } else if (zoom >= 3.0) {
        // texte discret flottant pour les plus proches, seulement aux gros zooms
        const nearest = P.slice(-70);   // P trié loin→près : la fin = les plus proches
        const op = Math.min(1, (zoom - 3.0) / 1.0);
        ctx.font = '600 ' + (11 * textScale) + 'px Figtree, sans-serif';
        for (const o of nearest) {
          const p = PTS[o.i], pr = o.pr;
          const sx = pr.sx, sy = pr.sy;
          if (sx < -60 || sx > W + 60 || sy < 0 || sy > H) continue;
          ctx.fillStyle = 'rgba(7,13,12,' + (0.8 * op).toFixed(2) + ')';
          ctx.fillText(p.fr, sx + 0.6, sy + 13.6);
          ctx.fillStyle = 'rgba(220,221,178,' + (0.72 * op).toFixed(2) + ')';
          ctx.fillText(p.fr, sx, sy + 13);
        }
      }
      return;
    }

    // ── nœuds résultats : glow + point net ──
    const resByDepth = P.filter(o => rset.has(o.i)).sort((a, b) => a.pr.f - b.pr.f);
    for (const o of resByDepth) {
      const p = PTS[o.i], pr = o.pr;
      const sx = pr.sx + oo[0], sy = pr.sy + oo[1];
      const col = colorOf(p.c);
      const r = 4 * pr.f * Math.sqrt(zoom);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.6;
      const gd = r * 5.5;
      ctx.drawImage(sprite(col), sx - gd/2, sy - gd/2, gd, gd);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, 7); ctx.fillStyle = col; ctx.fill();
      ctx.strokeStyle = 'rgba(220,221,178,0.45)'; ctx.lineWidth = 1; ctx.stroke();
    }
    // labels résultats : les plus près de la caméra
    const labelCap = isMobile() ? 8 : 16;
    const resNear = [...resByDepth].reverse().slice(0, labelCap);
    for (const o of resNear) {
      const p = PTS[o.i], pr = o.pr;
      const sx = pr.sx + oo[0], sy = pr.sy + oo[1];
      const r = 4 * pr.f * Math.sqrt(zoom);
      ctx.font = '600 ' + (12 * textScale) + 'px Figtree, sans-serif';
      ctx.fillStyle = 'rgba(7,13,12,0.9)';
      ctx.fillText(p.fr, sx + 0.6, sy + r + 13.6);
      ctx.fillStyle = '#b5b58c';
      ctx.fillText(p.fr, sx, sy + r + 13);
    }

    // ── ingrédients de la requête (par-dessus, accent) ──
    for (const o of P) {
      if (!qset.has(o.i)) continue;
      const p = PTS[o.i], pr = o.pr;
      const sx = pr.sx + oo[0], sy = pr.sy + oo[1];
      const col = colorOf(p.c);
      const r = 6 * pr.f * Math.sqrt(zoom);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.95;
      const gd = r * 7;
      ctx.drawImage(sprite(col), sx - gd/2, sy - gd/2, gd, gd);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, 7); ctx.fillStyle = col; ctx.fill();
      ctx.strokeStyle = '#C3453C'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.strokeStyle = '#DCDDB2'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(sx, sy, r + 3, 0, 7); ctx.stroke();
      ctx.font = (19 * textScale) + 'px ' + getComputedStyle(document.body).fontFamily;
      ctx.fillText(p.e, sx, sy - r - 16);
      ctx.font = '700 ' + (15 * textScale) + 'px Figtree, sans-serif';
      ctx.fillStyle = 'rgba(7,13,12,0.9)';
      ctx.fillText(p.fr, sx + 0.6, sy + r + 16.6);
      ctx.fillStyle = '#DCDDB2';
      ctx.fillText(p.fr, sx, sy + r + 16);
    }
  }

  function hexToRgba(hex, a) { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }

  // ── Recherche multicritère : requête + résultats ───────────────────────
  function dist3(a, b) { const dx = a.x-b.x, dy = a.y-b.y, dz = a.z-b.z; return Math.sqrt(dx*dx+dy*dy+dz*dz); }

  function computeResults() {
    results = [];
    if (query.length === 0) return;
    const cats = activeCats.size ? activeCats : null;
    const r = (query.length === 1)
      ? EPICURE_PAIRING.neighbors(query[0], { catFilter: cats, topN: 40 })
      : EPICURE_PAIRING.score(query,      { catFilter: cats, topN: 40 });
    results = r.map((x, k) => ({ i: x.i, count: x.matches, dist: x.minProx, rank: k }));
  }

  // ── Force d'accord (paire directe entre ingrédients sélectionnés) ───────
  // CSS auto-injecté : la feature tient dans ce seul fichier (facile à coller
  // dans Claude Design ou à retirer). Tokens DA KLE réutilisés.
  (function injectForceCSS() {
    const s = document.createElement('style');
    s.textContent = `
    #panel .facc { margin-bottom: 13px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
    #panel .facc .lbl { font-family: var(--mono); font-size: 9.5px; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 9px; }
    .fpair-row { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink); margin-bottom: 8px; }
    .fpair-name { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .fpair-x { color: var(--ink-3); flex-shrink: 0; }
    .fbar { height: 7px; border-radius: 4px; background: var(--surface-2); overflow: hidden; }
    .fbar-fill { height: 100%; border-radius: 4px; transition: width .3s ease; }
    .fpair-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 7px;
      font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .07em; }
    .fpair-foot .lab { font-weight: 600; }
    .fpair-foot .val { font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; }
    .fcells { display: flex; flex-wrap: wrap; gap: 6px; }
    .fcell { display: flex; align-items: center; gap: 5px; padding: 3px 5px 3px 7px;
      background: var(--surface-2); border-radius: 8px; }
    .fcell-pair { font-size: 14px; letter-spacing: -1px; }
    .fcell-v { font-family: var(--mono); font-size: 10px; font-weight: 700; border-radius: 5px;
      padding: 1px 6px; font-variant-numeric: tabular-nums; }
    .fcoh { display: flex; align-items: center; gap: 7px; margin-top: 10px;
      font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-3); }
    .fcoh-v { font-weight: 700; border-radius: 5px; padding: 1px 6px; font-variant-numeric: tabular-nums; }
    `;
    document.head.appendChild(s);
  })();

  const pctOf = (v) => Math.round(v * 100);
  // Largeur de jauge : on etale 0-0.5 (plage utile des cosinus Epicure) sur 0-100 %.
  const barW = (v) => Math.max(3, Math.min(100, (v / 0.5) * 100));

  function renderForce() {
    const q = query;
    if (q.length === 2) {
      const v = EPICURE_PAIRING.sim(q[0], q[1]);
      const sc = EPICURE_PAIRING.strengthColor(v);
      const a = PTS[q[0]], b = PTS[q[1]];
      return `<div class="facc">
        <div class="lbl">Force de l'accord</div>
        <div class="fpair-row">
          <span class="fpair-name">${a.e} ${a.fr}</span>
          <span class="fpair-x">&times;</span>
          <span class="fpair-name" style="text-align:right">${b.fr} ${b.e}</span>
        </div>
        <div class="fbar"><div class="fbar-fill" style="width:${barW(v)}%;background:${sc.color}"></div></div>
        <div class="fpair-foot">
          <span class="lab" style="color:${sc.color}">${sc.label}</span>
          <span class="val">${pctOf(v)}</span>
        </div>
      </div>`;
    }
    let mn = Infinity;
    const cells = [];
    for (let a = 0; a < q.length; a++) for (let b = a + 1; b < q.length; b++) {
      const v = EPICURE_PAIRING.sim(q[a], q[b]);
      if (v < mn) mn = v;
      const sc = EPICURE_PAIRING.strengthColor(v);
      cells.push(`<div class="fcell" title="${PTS[q[a]].fr} × ${PTS[q[b]].fr} · ${sc.label}">
        <span class="fcell-pair">${PTS[q[a]].e}${PTS[q[b]].e}</span>
        <span class="fcell-v" style="background:${sc.color};color:#08100F">${pctOf(v)}</span>
      </div>`);
    }
    const scMn = EPICURE_PAIRING.strengthColor(mn);
    return `<div class="facc">
      <div class="lbl">Forces des paires</div>
      <div class="fcells">${cells.join('')}</div>
      <div class="fcoh">Maillon faible
        <span class="fcoh-v" style="background:${scMn.color};color:#08100F">${pctOf(mn)}</span>
        <span style="color:${scMn.color}">${scMn.label}</span>
      </div>
    </div>`;
  }

  function renderPanel() {
    if (query.length === 0) { panel.style.display = 'none'; return; }
    panel.style.display = 'block';
    const chips = query.map(i =>
      `<span class="qchip"><span class="qe">${PTS[i].e}</span>${PTS[i].fr}<button class="qx" data-i="${i}" title="Retirer">&#x2715;</button></span>`
    ).join('');
    const title = query.length === 1 ? 'Se marie avec' : `Accords communs · ${query.length} ingrédients`;
    const rows = results.map(r => {
      const t = PTS[r.i];
      const sc = EPICURE_PAIRING.strengthColor(r.dist);
      const strength = `<span class="rstr" title="${sc.label} · proximité ${Math.round(r.dist * 100)} %" style="background:${sc.color};color:#08100F;border-radius:6px;padding:1px 7px;font-weight:700;font-size:12px;margin-left:6px">${Math.round(r.dist * 100)}</span>`;
      const badge = (query.length > 1
        ? `<span class="rscore ${r.count === query.length ? 'full' : ''}" title="Accord commun à ${r.count} des ${query.length} ingrédients sélectionnés">${r.count}/${query.length}</span>`
        : `<span class="rank">${String(r.rank + 1).padStart(2, '0')}</span>`) + strength;
      return `<div class="accord" data-i="${r.i}" title="Ajouter à la recherche">
        <span class="emoji">${t.e}</span>
        <span class="txt"><div class="fr">${t.fr}</div><div class="meta">${catFR(t.c)} · ${t.n}</div></span>
        ${badge}
      </div>`;
    }).join('');
    const empty = `<div class="empty">Aucun accord commun${activeCats.size ? ' dans ces catégories' : ''}.<br/>Retire un ingrédient ou élargis les catégories.</div>`;
    panel.innerHTML = `
      <div class="ph" id="phHead">
        <div class="x" id="panelX"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></div>
        <div class="cat-tag"><span class="dot" style="background:var(--accent);color:var(--accent)"></span>Recherche</div>
        <div class="qchips">${chips}</div>
        <button class="ph-toggle" id="phToggle" title="Réduire / agrandir"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>
      </div>
      <div class="pb">
        ${query.length >= 2 ? renderForce() : ''}
        <div class="lbl">${title}${results.length ? ` <span class="n">${results.length}</span>` : ''}</div>
        <div class="accords">${results.length ? rows : empty}</div>
      </div>`;
    panel.classList.remove('expanded');
    panel.querySelector('#panelX').onclick = (e) => { e.stopPropagation(); clearQuery(); };
    panel.querySelector('#phHead').onclick = (e) => {
      if (e.target.closest('.x') || e.target.closest('.qx')) return;
      panel.classList.toggle('expanded');
    };
    panel.querySelectorAll('.qx').forEach(b =>
      b.onclick = (e) => { e.stopPropagation(); removeFromQuery(+b.dataset.i); });
    panel.querySelectorAll('.accord').forEach(el =>
      el.onclick = () => addToQuery(+el.dataset.i));
  }

  function afterQueryChange() { computeResults(); renderPanel(); refreshCenterBtn(); draw(); }
  function addToQuery(i) {
    if (!query.includes(i)) { query.push(i); autorot = false; setSpin(false); }
    afterQueryChange();
  }
  function removeFromQuery(i) {
    const k = query.indexOf(i); if (k >= 0) query.splice(k, 1);
    afterQueryChange();
  }
  function toggleQuery(i) {
    const k = query.indexOf(i);
    if (k >= 0) query.splice(k, 1);
    else { query.push(i); autorot = false; setSpin(false); }
    afterQueryChange();
  }
  function clearQuery() { query = []; results = []; centered = false; sbox.value = ''; afterQueryChange(); }
  window.select = toggleQuery; window.clearSel = clearQuery;

  // ── Picking ───────────────────────────────────────────────────────────
  function pick(px, py, radius) {
    const oo = offset(); let best = -1, bd = radius * radius;
    for (let i = 0; i < PTS.length; i++) {
      if (activeCats.size && !isActive(i)) continue;
      const pr = proj(PTS[i]);
      const dx = pr.sx + oo[0] - px, dy = pr.sy + oo[1] - py;
      const d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  // ── Pointer interaction (souris + tactile unifiés) ───────────────────────
  const pointers = new Map();
  let moved = 0, lastX = 0, lastY = 0, pinchDist = 0;
  cv.addEventListener('pointerdown', e => {
    cv.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) { moved = 0; lastX = e.clientX; lastY = e.clientY; }
    else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
  });
  cv.addEventListener('pointermove', e => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist) { zoom *= d / pinchDist; zoom = Math.max(0.35, Math.min(7, zoom)); }
      pinchDist = d; draw(); return;
    }
    if (pointers.size === 1 && e.buttons || (pointers.size === 1 && e.pointerType !== 'mouse')) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 6 && autorot) { autorot = false; setSpin(false); }
      ay += dx * 0.01; ax += dy * 0.01;
      ax = Math.max(-1.45, Math.min(1.45, ax));
      lastX = e.clientX; lastY = e.clientY; draw(); return;
    }
    // hover (souris uniquement)
    if (e.pointerType === 'mouse') {
      const oo = offset(); const best = pick(e.clientX, e.clientY, 20);
      if (best >= 0) {
        const p = PTS[best];
        tip.style.display = 'block';
        tip.style.left = (e.clientX + 14) + 'px';
        tip.style.top = (e.clientY + 14) + 'px';
        tip.innerHTML = `${p.e} ${p.fr}<span class="tip-en">${p.n}</span>`;
        cv.style.cursor = 'pointer';
      } else { tip.style.display = 'none'; cv.style.cursor = 'grab'; }
    }
  });
  function endPointer(e) {
    const wasOne = pointers.size === 1;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;
    if (wasOne && moved < 7) {
      const best = pick(e.clientX, e.clientY, 26);
      if (best >= 0) toggleQuery(best);
    }
  }
  cv.addEventListener('pointerup', endPointer);
  cv.addEventListener('pointercancel', e => { pointers.delete(e.pointerId); pinchDist = 0; });
  cv.addEventListener('wheel', e => {
    e.preventDefault();
    zoom *= e.deltaY < 0 ? 1.12 : 0.89;
    zoom = Math.max(0.35, Math.min(7, zoom)); draw();
  }, { passive: false });

  // ── Recherche : autocomplétion + ajout à la requête ───────────────────
  const acBox = document.createElement('div');
  acBox.id = 'ac';
  sbox.parentElement.appendChild(acBox);
  const allSorted = [...Array(PTS.length).keys()].sort((a, b) => PTS[a].fr.localeCompare(PTS[b].fr));
  acBox.addEventListener('mousedown', (e) => {
    const el = e.target.closest('.ac-item'); if (!el) return;
    e.preventDefault(); pickAC(+el.dataset.i);
  });
  let acMatches = [];
  function rankMatches(q) {
    const out = [];
    for (let i = 0; i < PTS.length; i++) {
      if (query.includes(i)) continue;
      const n = PTS[i].n.toLowerCase(), fr = PTS[i].fr.toLowerCase();
      let pr = -1;
      if (fr === q || n === q) pr = 0;
      else if (fr.startsWith(q) || n.startsWith(q)) pr = 1;
      else if (fr.indexOf(q) >= 0 || n.indexOf(q) >= 0) pr = 2;
      if (pr >= 0) out.push({ i, pr });
    }
    out.sort((a, b) => a.pr - b.pr);
    return out.slice(0, 7).map(o => o.i);
  }
  function renderAC() {
    if (!acMatches.length) { acBox.style.display = 'none'; acBox.innerHTML = ''; return; }
    acBox.innerHTML = acMatches.map((i, k) =>
      `<div class="ac-item${k === 0 ? ' sel' : ''}" data-i="${i}"><span class="ac-e">${PTS[i].e}</span><span class="ac-fr">${PTS[i].fr}</span><span class="ac-c">${catFR(PTS[i].c)}</span></div>`
    ).join('');
    acBox.style.display = 'block';
  }
  function pickAC(i) { addToQuery(i); sbox.value = ''; acMatches = []; renderAC(); }
  function hideAC() { acBox.style.display = 'none'; acBox.innerHTML = ''; acMatches = []; }
  sbox.addEventListener('input', () => {
    const q = sbox.value.toLowerCase().trim();
    acMatches = q ? rankMatches(q) : [];
    renderAC();
  });
  sbox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { if (acMatches.length) pickAC(acMatches[0]); }
    else if (e.key === 'Escape') { hideAC(); sbox.blur(); }
  });
  sbox.addEventListener('blur', () => setTimeout(hideAC, 120));
  let fullHTML = '', fullKey = '';
  function buildFullList() {
    const key = query.join(',');
    if (key === fullKey && fullHTML) return fullHTML;
    const rows = [];
    for (const i of allSorted) {
      if (query.includes(i)) continue;
      const t = PTS[i];
      rows.push(`<div class="ac-item" data-i="${i}"><span class="ac-e">${t.e}</span><span class="ac-fr">${t.fr}</span><span class="ac-c">${catFR(t.c)}</span></div>`);
    }
    fullHTML = rows.join(''); fullKey = key; return fullHTML;
  }
  sbox.addEventListener('focus', () => {
    if (sbox.value.trim()) return;            // si on a déjà tapé, on garde le filtre
    acMatches = [];                           // liste complète : Entrée n'auto-ajoute pas
    acBox.innerHTML = buildFullList();        // toute la base (déjà en mémoire), triée A→Z
    acBox.style.display = 'block';
    requestAnimationFrame(() => {             // démarre à un endroit aléatoire
      acBox.scrollTop = Math.random() * Math.max(0, acBox.scrollHeight - acBox.clientHeight);
    });
  });

  // ── Palette : verrouillée sur "Vif" (la plus saturée) ────────────────

  // ── Spin toggle ───────────────────────────────────────────────────────
  const spinBtn = document.getElementById('spinBtn');
  function setSpin(on) { autorot = on; spinBtn.classList.toggle('on', on); }
  spinBtn.onclick = () => setSpin(!autorot);

  // ── Centrer sur la sélection (manuel) ─────────────────────────────────
  const centerBtn = document.getElementById('centerBtn');
  function refreshCenterBtn() {
    centerBtn.classList.toggle('disabled', query.length === 0);
    centerBtn.classList.toggle('on', centered && query.length > 0);
  }
  centerBtn.onclick = () => {
    if (query.length === 0) return;
    centered = !centered;
    refreshCenterBtn(); draw();
  };

  // ── Taille du texte (popover "Aa") ────────────────────────────────────
  const textBtn = document.getElementById('textBtn');
  const textPop = document.getElementById('textpop');
  const textRange = document.getElementById('textrange');
  const textVal = document.getElementById('textval');
  function applyTextScale(persist) {
    document.body.style.setProperty('--ts', String(textScale));
    textVal.textContent = Math.round(textScale * 100) + ' %';
    textRange.value = Math.round(textScale * 100);
    textBtn.classList.toggle('on', textScale > 1.001);
    if (persist) { try { localStorage.setItem('atlas_textscale', String(textScale)); } catch (e) {} }
    draw();
  }
  textBtn.onclick = (e) => { e.stopPropagation(); textPop.classList.toggle('show'); };
  textRange.addEventListener('input', () => { textScale = (+textRange.value) / 100; applyTextScale(true); });
  document.addEventListener('pointerdown', (e) => {
    if (!textPop.classList.contains('show')) return;
    if (textPop.contains(e.target) || textBtn.contains(e.target)) return;
    textPop.classList.remove('show');
  });
  applyTextScale(false);

  // ── Legend (catégories + filtre) ────────────────────────────────────────
  const counts = {};
  for (const p of PTS) counts[p.c] = (counts[p.c] || 0) + 1;
  const catsByCount = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const legGrid = document.getElementById('legGrid');
  const legReset = document.getElementById('legReset');
  function buildLegend() {
    legGrid.innerHTML = catsByCount.map(c =>
      `<div class="leg-item" data-c="${c}">
        <span class="dot" style="background:${colorOf(c)};color:${colorOf(c)}"></span>
        <span class="nm">${catFR(c)}</span><span class="ct">${counts[c]}</span>
      </div>`).join('');
    legGrid.querySelectorAll('.leg-item').forEach(el => {
      el.onclick = () => {
        const c = el.dataset.c;
        if (activeCats.has(c)) activeCats.delete(c); else activeCats.add(c);
        computeResults(); renderPanel();
        refreshLegend(); draw();
      };
    });
    refreshLegend();
  }
  function refreshLegend() {
    legGrid.querySelectorAll('.leg-item').forEach(el =>
      el.classList.toggle('dim', activeCats.size > 0 && !activeCats.has(el.dataset.c)));
    legReset.classList.toggle('hidden', activeCats.size === 0);
  }
  legReset.onclick = () => { activeCats.clear(); refreshLegend(); draw(); };

  // ── Légende repliable ──────────────────────────────────────────────────
  const legEl = document.getElementById('leg');
  document.getElementById('legHead').onclick = (e) => {
    if (e.target.closest('#legReset')) return;
    legEl.classList.toggle('collapsed');
  };

  // ── Loop ─────────────────────────────────────────────────────────────
  function tick() { if (autorot) { ay += 0.0032; draw(); } requestAnimationFrame(tick); }

  // ── Boot ─────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => { rs(); buildBg(); draw(); });
  rs(); buildBg(); buildLegend(); setSpin(true);
  if (isMobile()) legEl.classList.add('collapsed');   // repliée par défaut sur mobile
  document.getElementById('subline').textContent =
    PTS.length + ' ingrédients · proximité = parenté aromatique';
  tick();
  setTimeout(() => document.getElementById('loader').classList.add('gone'), 380);
})();
