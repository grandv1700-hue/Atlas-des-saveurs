// atlas-intro.js — modale d'accueil + bouton "?" pour l'Atlas des Saveurs
// KLE / La Réserve de Val. AUTONOME : injecte ses styles, son bouton et sa modale.
// À charger APRÈS atlas.js. Rien d'autre à modifier dans la page.
(function () {
  const SEEN_KEY = "atlas_intro_seen_v1"; // pour ne pas re-saouler au retour
  const ALWAYS_OPEN = false;              // mets true pour rouvrir à chaque visite

  const css = `
  .ai-btn{position:fixed;top:16px;right:16px;z-index:9000;width:38px;height:38px;border-radius:50%;
    border:1px solid #2a3a37;background:rgba(13,26,24,.85);color:#DCDDB2;font:600 18px/1 -apple-system,sans-serif;
    cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);transition:transform .15s,border-color .15s}
  .ai-btn:hover{transform:scale(1.08);border-color:#37C871}
  .ai-ov{position:fixed;inset:0;z-index:9500;display:none;align-items:center;justify-content:center;
    background:rgba(4,8,7,.72);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);
    opacity:0;transition:opacity .35s ease;padding:20px}
  .ai-ov.show{opacity:1}
  .ai-card{position:relative;max-width:440px;width:100%;background:linear-gradient(160deg,#0f1c1a,#0a1311);
    border:1px solid #213029;border-radius:18px;padding:26px 26px 22px;color:#DCDDB2;
    font-family:-apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 24px 60px rgba(0,0,0,.55);
    transform:translateY(12px) scale(.98);transition:transform .35s ease}
  .ai-ov.show .ai-card{transform:none}
  .ai-card h2{font:700 22px/1.2 Impact,Haettenschweiler,sans-serif;letter-spacing:.5px;margin:0 0 4px;color:#fff}
  .ai-card .ai-sub{font-size:13px;color:#7f9a8f;margin:0 0 16px}
  .ai-card p{font-size:14px;line-height:1.55;margin:0 0 14px}
  .ai-card a{color:#E0B255;text-decoration:none;border-bottom:1px solid rgba(224,178,85,.4)}
  .ai-card a:hover{color:#f0c674}
  .ai-steps{list-style:none;padding:0;margin:0 0 16px}
  .ai-steps li{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.45;margin-bottom:10px}
  .ai-steps .n{flex:0 0 22px;height:22px;border-radius:50%;background:#37C871;color:#08100F;
    font:700 12px/22px sans-serif;text-align:center}
  .ai-contact{font-size:13.5px;line-height:1.5;color:#cfd8c9;margin:0 0 14px}
  .ai-kle{font-size:12.5px;line-height:1.5;color:#8fa89c;border-top:1px solid #1c2a25;padding-top:13px;margin:0 0 10px}
  .ai-foot{font-size:11.5px;color:#6b8278;margin-top:0}
  .ai-go{display:block;width:100%;margin-top:16px;padding:12px;border:none;border-radius:11px;
    background:#C3453C;color:#fff;font:700 15px/1 sans-serif;cursor:pointer;transition:background .15s}
  .ai-go:hover{background:#d8554b}
  .ai-x{position:absolute;top:14px;right:14px;background:none;border:none;color:#7f9a8f;font-size:20px;cursor:pointer;line-height:1}
  @media (max-height:680px),(max-width:640px){
    .ai-card{max-height:85svh;overflow-y:auto;-webkit-overflow-scrolling:touch}
  }
  `;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  const ov = document.createElement("div");
  ov.className = "ai-ov";
  ov.innerHTML = `
    <div class="ai-card" role="dialog" aria-modal="true" aria-label="À propos de l'Atlas des Saveurs">
      <button class="ai-x" aria-label="Fermer">&#x2715;</button>
      <h2>Atlas des Saveurs</h2>
      <div class="ai-sub">1790 ingrédients · proximité = parenté aromatique</div>
      <p>Le site de La Réserve de Val arrive bientôt. En attendant, je vous laisse jouer avec un outil que j'ai conçu : une carte vivante des ingrédients et de leurs accords.</p>
      <p>Les <b>1790 ingrédients</b> de la base Epicure sont placés selon leur <b>parenté de goût</b> : plus deux points sont proches, plus ils s'accordent. Sélectionne-en plusieurs et les accords se <b>trient par force de proximité</b> — les plus compatibles en tête, chacun noté d'une pastille.</p>
      <ol class="ai-steps">
        <li><span class="n">1</span><span>Clique un point (ou tape un nom) pour l'ajouter à ta recherche.</span></li>
        <li><span class="n">2</span><span>Empile plusieurs ingrédients : l'Atlas révèle leurs <b>accords communs</b>, classés et notés par force.</span></li>
        <li><span class="n">3</span><span>Filtre par catégorie via la légende. Fais pivoter, zoome, explore.</span></li>
      </ol>
      <p class="ai-contact">Une envie, un événement&nbsp;? Écrivez-moi : <a href="mailto:contact@lareservedeval.ch">contact@lareservedeval.ch</a> · <a href="https://www.instagram.com/vala.grand/" target="_blank" rel="noopener" aria-label="Instagram @vala.grand" title="@vala.grand" style="display:inline-flex;align-items:center;vertical-align:middle;color:inherit"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5.4"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg></a></p>
      <p class="ai-kle">Propulsé par KLE — Kitchen &amp; Logistics Engine, le moteur maison que je développe pour faire tourner La Réserve de Val. L'Atlas en est une pièce.</p>
      <div class="ai-foot">Données : projet Epicure (KAIKAKU-AI · MIT).</div>
      <button class="ai-go">Explorer</button>
    </div>`;
  document.body.appendChild(ov);

  const btn = document.createElement("button");
  btn.className = "ai-btn";
  btn.setAttribute("aria-label", "À propos");
  btn.textContent = "?";
  document.body.appendChild(btn);

  function open() {
    ov.style.display = "flex";
    requestAnimationFrame(() => ov.classList.add("show"));
  }
  function close() {
    ov.classList.remove("show");
    setTimeout(() => { ov.style.display = "none"; }, 350);
    try { localStorage.setItem(SEEN_KEY, "1"); } catch (e) {}
  }

  btn.onclick = open;
  ov.querySelector(".ai-x").onclick = close;
  ov.querySelector(".ai-go").onclick = close;
  ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && ov.classList.contains("show")) close();
  });

  // Ouverte à l'arrivée (sauf si déjà vue, pour ne pas re-saouler au retour).
  let seen = false;
  try { seen = localStorage.getItem(SEEN_KEY) === "1"; } catch (e) {}
  if (ALWAYS_OPEN || !seen) setTimeout(open, 400);

  // Expose pour pouvoir rouvrir depuis ailleurs si besoin.
  window.ATLAS_INTRO = { open, close };
})();
