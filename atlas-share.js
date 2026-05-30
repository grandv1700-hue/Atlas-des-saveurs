// atlas-share.js — carte de découverte partageable (canvas PNG, 100% client-side)
// KLE / La Réserve de Val. AUTONOME. À charger après atlas.js.
// Expose window.ATLAS_SHARE = { generate(G, query) }.
(function () {
  'use strict';

  // ── CSS bouton ─────────────────────────────────────────────────────────
  (function () {
    const s = document.createElement('style');
    s.textContent = `
    .gshare-btn {
      display:block; width:100%; margin-top:8px; padding:7px 12px;
      border:1px solid var(--signature,#E8B94E); border-radius:8px;
      background:rgba(232,185,78,.06); color:var(--signature,#E8B94E);
      font-family:var(--mono,monospace); font-size:10px; font-weight:600;
      text-transform:uppercase; letter-spacing:.07em;
      cursor:pointer; transition:background .15s; }
    .gshare-btn:hover { background:rgba(232,185,78,.13); }
    .gshare-btn:active { opacity:.7; }
    `;
    document.head.appendChild(s);
  })();

  // ── Cache logo ─────────────────────────────────────────────────────────
  let _logoPromise = null;
  function loadLogo() {
    if (_logoPromise) return _logoPromise;
    _logoPromise = fetch('logo-lrv.svg')
      .then(r => r.text())
      .then(svg => {
        // Adapter pour fond sombre : remplacement des couleurs sombres par du blanc
        svg = svg.replace(/fill:\s*#1d1d1b/gi, 'fill:#ffffff');
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        return new Promise(resolve => {
          const img = new Image();
          img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
          img.onerror = () => resolve(null);
          img.src = url;
        });
      })
      .catch(() => null);
    return _logoPromise;
  }

  // ── Helpers canvas ─────────────────────────────────────────────────────
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function scoreBar(ctx, label, val, color, bx, y, bw) {
    // Label
    ctx.font = '500 19px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(220,221,178,.5)';
    ctx.textAlign = 'left';
    ctx.fillText(label, bx, y + 17);
    // Valeur
    ctx.font = '700 24px Impact, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'right';
    ctx.fillText(String(val), bx + bw, y + 17);
    // Piste
    const BAR_H = 10;
    ctx.fillStyle = 'rgba(255,255,255,.07)';
    rrect(ctx, bx, y + 26, bw, BAR_H, BAR_H / 2); ctx.fill();
    // Remplissage
    ctx.fillStyle = color;
    rrect(ctx, bx, y + 26, Math.max(BAR_H, (val / 100) * bw), BAR_H, BAR_H / 2); ctx.fill();
  }

  // ── Génération de la carte ─────────────────────────────────────────────
  async function generateCard(G, query) {
    const PTS = window.EPICURE && window.EPICURE.PTS;
    if (!PTS || !window.EPICURE_GAME) return null;

    // Attendre que les fonts soient chargées
    await document.fonts.ready;

    const SZ = 1080;
    const FM = 38;    // marge du cadre
    const PAD = 72;   // padding horizontal du contenu
    const CX = SZ / 2;
    const BX = PAD;   // x gauche des barres
    const BW = SZ - 2 * PAD; // largeur des barres

    const canvas = document.createElement('canvas');
    canvas.width = SZ; canvas.height = SZ;
    const ctx = canvas.getContext('2d');

    // ── Fond ──────────────────────────────────────────────────────────
    ctx.fillStyle = '#0b1610';
    ctx.fillRect(0, 0, SZ, SZ);

    // Halo doré en haut
    const grd = ctx.createRadialGradient(CX, 0, 0, CX, 0, SZ * 0.55);
    grd.addColorStop(0, 'rgba(232,185,78,.09)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, SZ, SZ);

    // ── Cadre ─────────────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(232,185,78,.18)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(FM, FM, SZ - 2 * FM, SZ - 2 * FM);

    // Coins accent
    const CL = 48;
    ctx.strokeStyle = 'rgba(232,185,78,.75)';
    ctx.lineWidth = 3;
    [[FM, FM, 1, 1], [SZ - FM, FM, -1, 1], [SZ - FM, SZ - FM, -1, -1], [FM, SZ - FM, 1, -1]]
      .forEach(([cx, cy, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx + dx * CL, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * CL);
        ctx.stroke();
      });

    // ── Contenu ────────────────────────────────────────────────────────
    let y = FM + 58;

    // Bandeau d'en-tête
    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(232,185,78,.7)';
    ctx.textAlign = 'center';
    ctx.fillText('LA RÉSERVE DE VAL  ·  ATLAS DES SAVEURS', CX, y);
    y += 46;

    // Ligne de séparation haute
    ctx.strokeStyle = 'rgba(255,255,255,.07)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD + FM, y); ctx.lineTo(SZ - PAD - FM, y); ctx.stroke();
    y += 58;

    // ── Ingrédients ───────────────────────────────────────────────────
    const ings = query.map(i => ({ e: PTS[i] ? PTS[i].e : '?', fr: PTS[i] ? PTS[i].fr : '' }));

    // Emojis
    ctx.textAlign = 'center';
    ctx.font = '80px sans-serif';
    const emojiLine = ings.map(d => d.e).join('  ');
    ctx.fillText(emojiLine, CX, y);
    y += 100;

    // Noms en majuscules (Big Shoulders Display, taille adaptée)
    const nameStr = ings.map(d => d.fr.toUpperCase()).join('  ×  ');
    let nfs = 68;
    ctx.font = `900 ${nfs}px "Big Shoulders Display", Impact, sans-serif`;
    while (ctx.measureText(nameStr).width > BW - 20 && nfs > 28) {
      nfs -= 2;
      ctx.font = `900 ${nfs}px "Big Shoulders Display", Impact, sans-serif`;
    }
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(nameStr, CX, y + nfs * 0.78);
    y += nfs + 38;

    // Ligne de séparation milieu
    ctx.strokeStyle = 'rgba(232,185,78,.25)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD * 2, y); ctx.lineTo(SZ - PAD * 2, y); ctx.stroke();
    y += 46;

    // ── Score / Verdict ───────────────────────────────────────────────
    const V = EPICURE_GAME.chefVerdict(G);
    const stars = '★'.repeat(V.stars) + '☆'.repeat(3 - V.stars);

    ctx.font = '42px sans-serif';
    ctx.fillStyle = '#E8B94E';
    ctx.textAlign = 'center';
    ctx.fillText(stars, CX, y);
    y += 55;

    ctx.font = `900 40px "Big Shoulders Display", Impact, sans-serif`;
    ctx.fillStyle = '#DCDDB2';
    ctx.textAlign = 'center';
    ctx.fillText(V.title.toUpperCase(), CX, y);
    y += 52;

    // Badge Pépite
    if (G.pepite) {
      const pepText = '✨  PÉPITE';
      ctx.font = '700 18px "JetBrains Mono", monospace';
      const tw = ctx.measureText(pepText).width;
      const bx = CX - tw / 2 - 18;
      ctx.fillStyle = '#E8B94E';
      rrect(ctx, bx, y - 1, tw + 36, 30, 5); ctx.fill();
      ctx.fillStyle = '#08100F';
      ctx.textAlign = 'center';
      ctx.fillText(pepText, CX, y + 19);
      y += 50;
    }

    y += 16;

    // ── Barres de scores ──────────────────────────────────────────────
    scoreBar(ctx, 'HARMONIE', G.harmony, G.harmonyVerdict.color, BX, y, BW);
    y += 58;
    scoreBar(ctx, 'SURPRISE', G.surprise, G.surpriseVerdict.color, BX, y, BW);
    y += 58;

    // ── Pied de page ──────────────────────────────────────────────────
    const FOOTER_Y = SZ - FM - 116;

    ctx.strokeStyle = 'rgba(255,255,255,.07)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD + FM, FOOTER_Y); ctx.lineTo(SZ - PAD - FM, FOOTER_Y); ctx.stroke();

    // Logo LRV
    const logo = await loadLogo();
    const LOGO_H = 52;
    if (logo && logo.naturalWidth) {
      const lw = LOGO_H * (logo.naturalWidth / logo.naturalHeight);
      ctx.drawImage(logo, CX - lw / 2, FOOTER_Y + 14, lw, LOGO_H);
    }

    // URL
    const siteUrl = window.location.hostname || 'atlas-des-saveurs';
    ctx.font = '400 17px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(220,221,178,.4)';
    ctx.textAlign = 'center';
    ctx.fillText(siteUrl, CX, FOOTER_Y + 14 + LOGO_H + 24);

    return canvas;
  }

  // ── Partage / téléchargement ───────────────────────────────────────────
  async function generate(G, query) {
    if (!G || !query || query.length < 1) return;

    // Feedback immédiat
    if (typeof window.showToast === 'function') window.showToast('Génération de la carte…', 1800);

    const canvas = await generateCard(G, query);
    if (!canvas) return;

    canvas.toBlob(async blob => {
      if (!blob) return;
      const filename = 'atlas-decouverte.png';

      // Web Share API (mobile, si fichiers supportés)
      if (navigator.canShare) {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Atlas des Saveurs — Ma découverte',
              text: 'Découvrez cette combinaison sur l\'Atlas des Saveurs',
              url: window.location.href,
              files: [file],
            });
            return;
          } catch (e) { /* annulé ou non supporté → fallback téléchargement */ }
        }
      }

      // Téléchargement PNG
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    }, 'image/png');
  }

  window.ATLAS_SHARE = { generate };
})();
