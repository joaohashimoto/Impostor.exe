/* Missão 1 · Cruzadinha
   O tabuleiro é montado a partir de PALAVRAS (dados.js). */
(function () {
  "use strict";

  const raiz = document.getElementById("cruz-root");
  let montado = false;
  window.GAMES.cruzadinha = { mount: function () { if (!montado) { montar(); montado = true; } } };

  const LINHAS = Math.max.apply(null, PALAVRAS.map(function (p) { return p.r + (p.d === "V" ? p.resp.length : 1); }));
  const COLUNAS = Math.max.apply(null, PALAVRAS.map(function (p) { return p.c + (p.d === "H" ? p.resp.length : 1); }));

  const celulas = new Map();           // "r,c" -> célula
  const palavras = PALAVRAS.map(function (p, i) { return Object.assign({}, p, { i: i, cels: [], num: 0 }); });
  const conferidas = new Map();        // índice da palavra -> true/false (resultado do último Conferir)
  const cluesEl = new Map();           // índice da palavra -> botão da pista

  let dir = "H";
  let cursor = null;
  let elBarraNum, elBarraTexto, elPlacar, elBarra, elMsg, elVitoria;

  /* ---------- modelo ---------- */
  function chave(r, c) { return r + "," + c; }

  function construirModelo() {
    palavras.forEach(function (w) {
      for (let k = 0; k < w.resp.length; k++) {
        const r = w.r + (w.d === "V" ? k : 0);
        const c = w.c + (w.d === "H" ? k : 0);
        let cel = celulas.get(chave(r, c));
        if (!cel) { cel = { r: r, c: c, pal: {}, num: 0 }; celulas.set(chave(r, c), cel); }
        cel.pal[w.d] = w.i;
        w.cels.push(cel);
      }
    });
    // numeração: varre o tabuleiro em ordem de leitura
    const inicios = [];
    palavras.forEach(function (w) { inicios.push(w.cels[0]); });
    const unicos = Array.from(new Set(inicios)).sort(function (a, b) { return a.r - b.r || a.c - b.c; });
    unicos.forEach(function (cel, idx) { cel.num = idx + 1; });
    palavras.forEach(function (w) { w.num = w.cels[0].num; });
  }

  function ordenadas(d) {
    return palavras.filter(function (w) { return w.d === d; }).sort(function (a, b) { return a.num - b.num; });
  }
  function ordemTab() { return ordenadas("H").concat(ordenadas("V")); }

  /* ---------- interface ---------- */
  function montar() {
    construirModelo();
    raiz.innerHTML = "";

    const layout = el("div", "cruz-layout");

    // --- tabuleiro ---
    const painel = el("div", "panel cruz-board-panel");
    const barra = el("div", "active-clue");
    elBarraNum = el("span", "ac-num", "1");
    elBarraTexto = el("span", "ac-text", "");
    barra.append(elBarraNum, elBarraTexto);
    barra.setAttribute("aria-live", "polite");

    const rolagem = el("div", "board-scroll");
    const tab = el("div", "board");
    tab.style.setProperty("--cols", COLUNAS);
    tab.setAttribute("role", "group");
    tab.setAttribute("aria-label", "Tabuleiro da cruzadinha");

    for (let r = 0; r < LINHAS; r++) {
      for (let c = 0; c < COLUNAS; c++) {
        const cel = celulas.get(chave(r, c));
        if (!cel) { tab.appendChild(el("div", "void")); continue; }
        cel.el = el("div", "cell");
        if (cel.num) cel.el.appendChild(el("span", "num", String(cel.num)));
        const inp = document.createElement("input");
        inp.type = "text";
        inp.autocomplete = "off";
        inp.autocapitalize = "characters";
        inp.spellcheck = false;
        inp.setAttribute("inputmode", "text");
        inp.setAttribute("aria-label", "Linha " + (r + 1) + ", coluna " + (c + 1));
        cel.input = inp;
        cel.el.appendChild(inp);
        ligarEventos(cel);
        tab.appendChild(cel.el);
      }
    }
    rolagem.appendChild(tab);

    // --- controles ---
    const controles = el("div", "controls");
    const bConferir = el("button", "btn btn-green", "Conferir");
    bConferir.type = "button";
    const bReiniciar = el("button", "btn btn-red", "Reiniciar");
    bReiniciar.type = "button";
    const placar = el("div", "score");
    elPlacar = el("b", "", "");
    const tb = el("div", "taskbar");
    elBarra = document.createElement("i");
    tb.appendChild(elBarra);
    placar.append(elPlacar, tb);
    placar.setAttribute("aria-live", "polite");
    controles.append(bConferir, bReiniciar, placar);

    elMsg = el("p", "status-msg", "");
    elVitoria = el("div", "win-banner");
    elVitoria.hidden = true;
    elVitoria.innerHTML = '<svg class="bit" viewBox="0 0 100 112" style="--c:#2edb6a" aria-hidden="true"><use href="#bit"/></svg>' +
      "<div><b>Missão cumprida!</b>Todos os componentes foram identificados. Nenhum impostor escapou.</div>";

    painel.append(barra, rolagem, controles, elMsg, elVitoria);

    // --- pistas ---
    const pistas = el("div", "panel clues-panel");
    [["H", "Horizontais", "→"], ["V", "Verticais", "↓"]].forEach(function (g) {
      const h = el("h2", "", g[2] + " " + g[1]);
      const ol = document.createElement("ol");
      ordenadas(g[0]).forEach(function (w) {
        const li = document.createElement("li");
        const b = el("button", "clue");
        b.type = "button";
        b.append(el("span", "cn", String(w.num)), el("span", "ct", w.pista), el("span", "ci", ""));
        b.addEventListener("click", function () { irParaPalavra(w, true); });
        cluesEl.set(w.i, b);
        li.appendChild(b);
        ol.appendChild(li);
      });
      pistas.append(h, ol);
    });

    layout.append(painel, pistas);
    raiz.appendChild(layout);

    bConferir.addEventListener("click", conferir);
    bReiniciar.addEventListener("click", reiniciar);

    cursor = palavras[0].cels[0];
    dir = palavras[0].d;
    pintar();
    pintarMarcas();
  }

  function el(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined && txt !== "") e.textContent = txt;
    return e;
  }

  /* ---------- eventos de cada célula ---------- */
  function ligarEventos(cel) {
    const inp = cel.input;

    inp.addEventListener("pointerdown", function () {
      const temH = cel.pal.H !== undefined, temV = cel.pal.V !== undefined;
      if (cursor === cel && document.activeElement === inp && temH && temV) dir = dir === "H" ? "V" : "H";
    });

    inp.addEventListener("focus", function () {
      definirCursor(cel, false);
      inp.select();
    });

    inp.addEventListener("input", function () {
      const anterior = inp.dataset.prev || "";
      let v = inp.value.normalize("NFD").replace(/[^A-Za-z]/g, "").toUpperCase();
      let ch = v.slice(-1);
      if (v.length > 1) {
        const outro = Array.from(v).find(function (x) { return x !== anterior; });
        ch = outro || ch;
      }
      inp.value = ch;
      inp.dataset.prev = ch;
      invalidar(cel);
      if (ch) {
        const w = palavraAtiva();
        const i = w ? w.cels.indexOf(cel) : -1;
        if (w && i >= 0 && i < w.cels.length - 1) definirCursor(w.cels[i + 1], true);
      }
    });

    inp.addEventListener("keydown", function (e) {
      switch (e.key) {
        case "ArrowRight": e.preventDefault(); mover(0, 1); break;
        case "ArrowLeft":  e.preventDefault(); mover(0, -1); break;
        case "ArrowDown":  e.preventDefault(); mover(1, 0); break;
        case "ArrowUp":    e.preventDefault(); mover(-1, 0); break;
        case "Backspace":
          if (!inp.value) {
            e.preventDefault();
            const w = palavraAtiva();
            const i = w ? w.cels.indexOf(cel) : -1;
            if (i > 0) {
              const ant = w.cels[i - 1];
              ant.input.value = ""; ant.input.dataset.prev = "";
              invalidar(ant);
              definirCursor(ant, true);
            }
          }
          break;
        case "Enter": e.preventDefault(); conferir(); break;
        case "Tab": {
          const lista = ordemTab();
          const atual = palavraAtiva();
          let i = lista.indexOf(atual);
          i += e.shiftKey ? -1 : 1;
          if (i >= 0 && i < lista.length) { e.preventDefault(); irParaPalavra(lista[i], true); }
          break;
        }
        default: break;
      }
    });
  }

  function mover(dr, dc) {
    let r = cursor.r + dr, c = cursor.c + dc;
    while (r >= 0 && r < LINHAS && c >= 0 && c < COLUNAS) {
      const alvo = celulas.get(chave(r, c));
      if (alvo) { dir = dr ? "V" : "H"; definirCursor(alvo, true); return; }
      r += dr; c += dc;
    }
  }

  function palavraAtiva() {
    if (!cursor) return null;
    let i = cursor.pal[dir];
    if (i === undefined) { dir = dir === "H" ? "V" : "H"; i = cursor.pal[dir]; }
    return i === undefined ? null : palavras[i];
  }

  function definirCursor(cel, focar) {
    cursor = cel;
    pintar();
    if (focar && document.activeElement !== cel.input) cel.input.focus();
  }

  function irParaPalavra(w, focar) {
    dir = w.d;
    definirCursor(w.cels[0], focar);
  }

  /* ---------- pintura ---------- */
  function pintar() {
    celulas.forEach(function (c) { c.el.classList.remove("in-word", "cursor"); });
    cluesEl.forEach(function (b) { b.classList.remove("active"); });
    const w = palavraAtiva();
    if (!w) return;
    w.cels.forEach(function (c) { c.el.classList.add("in-word"); });
    cursor.el.classList.add("cursor");
    const b = cluesEl.get(w.i);
    b.classList.add("active");
    elBarraNum.textContent = w.num + (w.d === "H" ? " →" : " ↓");
    elBarraTexto.textContent = w.pista;
    if (document.activeElement && document.activeElement.closest && !document.activeElement.closest(".clues-panel")) {
      b.scrollIntoView({ block: "nearest" });
    }
  }

  function pintarMarcas() {
    celulas.forEach(function (c) {
      c.el.classList.remove("ok", "bad", "miss");
      const idxs = [c.pal.H, c.pal.V].filter(function (x) { return x !== undefined; });
      if (idxs.some(function (i) { return conferidas.get(i) === true; })) c.el.classList.add("ok");
      else if (idxs.some(function (i) { return conferidas.get(i) === false; })) c.el.classList.add(c.input.value ? "bad" : "miss");
    });
    cluesEl.forEach(function (b, i) {
      b.classList.remove("ok", "bad");
      const ic = b.querySelector(".ci");
      const r = conferidas.get(i);
      if (r === true) { b.classList.add("ok"); ic.textContent = "✓"; }
      else if (r === false) { b.classList.add("bad"); ic.textContent = "✗"; }
      else ic.textContent = "";
    });
    let certas = 0;
    conferidas.forEach(function (v) { if (v) certas++; });
    elPlacar.innerHTML = "";
    const s = document.createElement("span");
    s.textContent = certas;
    elPlacar.append(s, " de " + palavras.length + " palavras");
    elBarra.style.width = (certas / palavras.length * 100) + "%";
    elVitoria.hidden = certas !== palavras.length;
  }

  function invalidar(cel) {
    [cel.pal.H, cel.pal.V].forEach(function (i) { if (i !== undefined) conferidas.delete(i); });
    elMsg.textContent = ""; elMsg.className = "status-msg";
    pintarMarcas();
  }

  /* ---------- ações ---------- */
  function conferir() {
    conferidas.clear();
    let certas = 0, erradas = 0;
    palavras.forEach(function (w) {
      const digitado = w.cels.map(function (c) { return c.input.value || " "; }).join("");
      const ok = digitado === w.resp;
      conferidas.set(w.i, ok);
      if (ok) certas++; else erradas++;
    });
    pintarMarcas();
    if (erradas === 0) {
      elMsg.textContent = "Perfeito! Você acertou todas as palavras.";
      elMsg.className = "status-msg good";
    } else if (certas === 0 && !Array.from(celulas.values()).some(function (c) { return c.input.value; })) {
      elMsg.textContent = "O tabuleiro está vazio. Leia uma pista e digite a resposta antes de conferir.";
      elMsg.className = "status-msg warn";
    } else {
      elMsg.textContent = erradas + (erradas === 1 ? " palavra está errada ou incompleta" : " palavras estão erradas ou incompletas") + ". Revise as pistas marcadas em vermelho.";
      elMsg.className = "status-msg warn";
    }
  }

  function reiniciar() {
    celulas.forEach(function (c) { c.input.value = ""; c.input.dataset.prev = ""; });
    conferidas.clear();
    elMsg.textContent = ""; elMsg.className = "status-msg";
    cursor = palavras[0].cels[0];
    dir = palavras[0].d;
    pintar();
    pintarMarcas();
  }
})();
