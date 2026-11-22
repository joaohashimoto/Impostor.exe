/* Navegação entre a tela inicial e os três jogos + fundo de estrelas. */
(function () {
  "use strict";

  const TITULOS = {
    home: "Impostor.exe · Arquitetura Computacional",
    cruzadinha: "Cruzadinha · Impostor.exe",
    impostor: "Quem é o Impostor? · Impostor.exe",
    tarefas: "Tarefas da Nave · Impostor.exe"
  };
  const views = {};
  document.querySelectorAll(".view").forEach(function (v) {
    views[v.id.replace("view-", "")] = v;
  });
  const btnMenu = document.getElementById("btn-menu");

  function rota() {
    let nome = location.hash.replace(/^#\/?/, "") || "home";
    if (!views[nome]) nome = "home";

    Object.keys(views).forEach(function (k) { views[k].hidden = k !== nome; });
    btnMenu.hidden = nome === "home";
    document.body.dataset.view = nome;
    document.title = TITULOS[nome];

    const jogo = window.GAMES && window.GAMES[nome];
    if (jogo && jogo.mount) jogo.mount();

    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", rota);
  rota();

  /* ---------- estrelas ---------- */
  const cv = document.getElementById("stars");
  const ctx = cv.getContext("2d");
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, estrelas = [];

  function medir() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(60, Math.round((W * H) / 9000));
    estrelas = Array.from({ length: n }, function () {
      return { x: Math.random() * W, y: Math.random() * H, z: Math.random() * 0.8 + 0.2, t: Math.random() * 6.28 };
    });
    desenhar(0);
  }

  function desenhar(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < estrelas.length; i++) {
      const s = estrelas[i];
      if (!reduz) { s.x -= s.z * 0.22; if (s.x < -3) s.x = W + 3; }
      ctx.globalAlpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 800 + s.t));
      const tam = s.z * 2.2;
      ctx.fillRect(s.x, s.y, tam, tam);
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) { desenhar(t); requestAnimationFrame(loop); }
  window.addEventListener("resize", medir);
  medir();
  if (!reduz) requestAnimationFrame(loop);
})();