/* Missão 3 · Tarefas da Nave
   Quatro minitarefas sobre o conteúdo da disciplina. */
(function () {
  "use strict";

  const raiz = document.getElementById("task-root");
  let montado = false;
  window.GAMES.tarefas = { mount: function () { if (!montado) { montar(); montado = true; } } };

  const TAREFAS = [
    { id: "fios",  titulo: "Ligar os fios",           desc: "Conecte cada componente à função certa.",                 abrir: tarefaFios },
    { id: "calib", titulo: "Calibrar as memórias",    desc: "Separe as memórias voláteis das não voláteis.",           abrir: tarefaCalibrar },
    { id: "hier",  titulo: "Hierarquia de velocidade", desc: "Ordene as memórias da mais rápida para a mais lenta.",   abrir: tarefaHierarquia },
    { id: "bus",   titulo: "Rotear os sinais",        desc: "Decida se cada sinal viaja pelo barramento de endereço ou de dados.", abrir: tarefaBarramentos }
  ];
  const feitas = new Set();
  let elTiles = {}, elContagem, elBarra, elVitoria;
  let modal = null, onResize = null;

  function embaralhar(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; }
    return b;
  }
  function el(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
  function tremer(e) { e.classList.remove("shake"); void e.offsetWidth; e.classList.add("shake"); }

  /* ---------- painel principal ---------- */
  function montar() {
    raiz.innerHTML = "";
    const wrap = el("div", "task-wrap");

    const topo = el("div", "panel task-top");
    const linha = el("div", "row");
    linha.append(el("b", "", "Tarefas concluídas"));
    elContagem = el("span", "tcount", "");
    linha.appendChild(elContagem);
    const tb = el("div", "taskbar");
    elBarra = document.createElement("i");
    tb.appendChild(elBarra);
    topo.append(linha, tb);

    const tiles = el("div", "tiles");
    TAREFAS.forEach(function (t, i) {
      const b = el("button", "tile");
      b.type = "button";
      b.append(el("span", "tn", "Tarefa " + (i + 1)), el("span", "tt", t.titulo), el("span", "td", t.desc), el("span", "ts", "Pendente"));
      b.addEventListener("click", function () { abrir(t); });
      elTiles[t.id] = b;
      tiles.appendChild(b);
    });

    elVitoria = el("div", "panel task-win");
    elVitoria.hidden = true;
    elVitoria.innerHTML = '<svg class="bit" viewBox="0 0 100 112" style="--c:#2edb6a" aria-hidden="true"><use href="#bit"/></svg>' +
      "<h2>Nave 100% operacional!</h2><p>Todas as tarefas foram concluídas. A tripulação venceu e o computador está funcionando.</p>";

    const reset = el("div", "task-reset");
    const br = el("button", "btn btn-ghost", "Reiniciar tarefas");
    br.type = "button";
    br.addEventListener("click", function () { feitas.clear(); atualizar(); });
    reset.appendChild(br);

    wrap.append(topo, tiles, elVitoria, reset);
    raiz.appendChild(wrap);
    atualizar();
  }

  function atualizar() {
    TAREFAS.forEach(function (t) {
      const feita = feitas.has(t.id);
      elTiles[t.id].classList.toggle("done", feita);
      elTiles[t.id].querySelector(".ts").textContent = feita ? "Concluída" : "Pendente";
    });
    elContagem.innerHTML = "";
    const s = document.createElement("span");
    s.textContent = feitas.size;
    elContagem.append(s, " de " + TAREFAS.length);
    elBarra.style.width = (feitas.size / TAREFAS.length * 100) + "%";
    elVitoria.hidden = feitas.size !== TAREFAS.length;
  }

  /* ---------- janela da tarefa ---------- */
  function abrir(t) {
    fechar();
    const idx = TAREFAS.indexOf(t);
    modal = el("div", "modal");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", t.titulo);

    const painel = el("div", "panel task-panel");
    const cab = el("div", "tp-head");
    const tit = el("div");
    tit.innerHTML = "<small>Tarefa " + (idx + 1) + "</small>";
    tit.appendChild(el("h2", "", t.titulo));
    const x = el("button", "tp-close", "✕");
    x.type = "button";
    x.setAttribute("aria-label", "Fechar tarefa");
    x.addEventListener("click", fechar);
    cab.append(tit, x);

    const corpo = el("div", "tp-body");
    const rodape = el("div", "tp-foot");
    painel.append(cab, corpo, rodape);
    modal.appendChild(painel);
    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    modal.addEventListener("mousedown", function (e) { if (e.target === modal) fechar(); });
    document.addEventListener("keydown", teclaEsc);

    const ctx = {
      corpo: corpo,
      rodape: rodape,
      erros: 0,
      mostrarErros: function () {
        let p = rodape.querySelector(".errs");
        if (!p) { p = el("span", "errs"); rodape.appendChild(p); }
        p.textContent = "Erros: " + ctx.erros;
        p.classList.toggle("zero", ctx.erros === 0);
      },
      errar: function () { ctx.erros++; ctx.mostrarErros(); },
      concluir: function (texto) {
        feitas.add(t.id);
        atualizar();
        const d = el("div", "tp-done");
        d.append(el("b", "", "Tarefa concluída!"), document.createTextNode(texto));
        const b = el("button", "btn btn-green", "Voltar à nave");
        b.type = "button";
        b.addEventListener("click", fechar);
        d.appendChild(b);
        painel.appendChild(d);
        b.focus();
      }
    };
    ctx.mostrarErros();
    t.abrir(ctx);
    x.focus();
  }

  function teclaEsc(e) { if (e.key === "Escape") fechar(); }
  function fechar() {
    if (modal) { modal.remove(); modal = null; }
    document.body.style.overflow = "";
    document.removeEventListener("keydown", teclaEsc);
    if (onResize) { window.removeEventListener("resize", onResize); onResize = null; }
  }

  /* ============================================================
     Tarefa 1 · Ligar os fios
     ============================================================ */
  function tarefaFios(ctx) {
    const PARES = [
      { termo: "CPU",           fn: "Busca e executa as instruções dos programas" },
      { termo: "ULA",           fn: "Faz as contas e as operações lógicas" },
      { termo: "UC",            fn: "Coordena e comanda os outros componentes" },
      { termo: "Registradores", fn: "Guardam os valores da operação atual, dentro da CPU" },
      { termo: "Cache",         fn: "Guarda cópias do que a CPU mais usa, bem perto dela" },
      { termo: "DMA",           fn: "Transfere informação sem ocupar a CPU" }
    ];
    const FIOS = ["#e5202f", "#2a62ff", "#f6d90e", "#ff5fc0", "#2edb6a", "#41f0e2"];

    ctx.corpo.appendChild(el("p", "tp-help", "Clique em um componente e depois na função que combina com ele."));
    const caixa = el("div", "wires");
    const colE = el("div", "wires-col");
    const colD = el("div", "wires-col");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "lines");
    caixa.append(svg, colE, colD);
    ctx.corpo.appendChild(caixa);

    const plugs = [], socks = [];
    const ligados = new Map();           // índice esquerdo -> índice direito (na ordem original)
    const ordemDireita = embaralhar(PARES.map(function (_, i) { return i; }));
    let sel = null;

    PARES.forEach(function (p, i) {
      const b = el("button", "plug", p.termo);
      b.type = "button";
      b.style.setProperty("--w", FIOS[i]);
      b.addEventListener("click", function () {
        if (ligados.has(i)) return;
        plugs.forEach(function (x) { x.classList.remove("sel"); });
        sel = i; b.classList.add("sel");
      });
      plugs[i] = b;
      colE.appendChild(b);
    });
    ordemDireita.forEach(function (orig) {
      const b = el("button", "sock", PARES[orig].fn);
      b.type = "button";
      b.addEventListener("click", function () {
        if (sel === null || b.classList.contains("done")) return;
        if (sel === orig) {
          ligados.set(sel, orig);
          plugs[sel].classList.remove("sel"); plugs[sel].classList.add("done");
          b.classList.add("done"); b.style.setProperty("--w", FIOS[sel]);
          sel = null;
          desenhar();
          if (ligados.size === PARES.length) ctx.concluir("Todos os fios estão ligados. Cada componente tem uma função bem definida dentro do computador.");
        } else {
          ctx.errar(); tremer(b); tremer(plugs[sel]);
        }
      });
      socks[orig] = b;
      colD.appendChild(b);
    });

    function desenhar() {
      svg.innerHTML = "";
      const box = caixa.getBoundingClientRect();
      ligados.forEach(function (dir, esq) {
        const a = plugs[esq].getBoundingClientRect();
        const c = socks[dir].getBoundingClientRect();
        const x1 = a.right - box.left + 2, y1 = a.top + a.height / 2 - box.top;
        const x2 = c.left - box.left - 2,  y2 = c.top + c.height / 2 - box.top;
        const d = "M" + x1 + " " + y1 + " C" + (x1 + 70) + " " + y1 + " " + (x2 - 70) + " " + y2 + " " + x2 + " " + y2;
        [["#0a0e1f", 14], [FIOS[esq], 8]].forEach(function (cfg) {
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.setAttribute("d", d); p.setAttribute("fill", "none");
          p.setAttribute("stroke", cfg[0]); p.setAttribute("stroke-width", cfg[1]); p.setAttribute("stroke-linecap", "round");
          svg.appendChild(p);
        });
      });
    }
    onResize = desenhar;
    window.addEventListener("resize", onResize);
  }

  /* ============================================================
     Tarefa 2 · Calibrar as memórias (volátil x não volátil)
     ============================================================ */
  function tarefaCalibrar(ctx) {
    const ITENS = [
      { n: "RAM", v: true }, { n: "Cache", v: true }, { n: "Registradores", v: true },
      { n: "ROM", v: false }, { n: "EEPROM", v: false }, { n: "Flash", v: false }, { n: "Memória de massa", v: false }
    ];
    ctx.corpo.appendChild(el("p", "tp-help", "Arraste cada memória até a caixa certa. No celular, toque na memória e depois na caixa."));
    const bandeja = el("div", "tray");
    const caixas = el("div", "bins");
    const bins = {};
    [[true, "vol", "Volátil", "Perde tudo ao desligar"], [false, "nvol", "Não volátil", "Mantém os dados sem energia"]].forEach(function (cfg) {
      const b = el("button", "bin " + cfg[1]);
      b.type = "button";
      b.append(el("h3", "", cfg[2]), el("small", "", cfg[3]));
      const slot = el("div", "slot");
      b.appendChild(slot);
      b.addEventListener("click", function () { if (sel) colocar(sel, cfg[0], b, slot); });
      b.addEventListener("dragover", function (e) { e.preventDefault(); b.classList.add("over"); });
      b.addEventListener("dragleave", function () { b.classList.remove("over"); });
      b.addEventListener("drop", function (e) {
        e.preventDefault(); b.classList.remove("over");
        const nome = e.dataTransfer.getData("text/plain");
        const chip = Array.from(bandeja.children).find(function (c) { return c.dataset.nome === nome; });
        if (chip) colocar(chip, cfg[0], b, slot);
      });
      bins[cfg[1]] = b;
      caixas.appendChild(b);
    });
    ctx.corpo.append(bandeja, caixas);

    let sel = null;
    embaralhar(ITENS).forEach(function (it) {
      const c = el("button", "chip", it.n);
      c.type = "button";
      c.draggable = true;
      c.dataset.nome = it.n;
      c.dataset.v = it.v ? "1" : "0";
      c.addEventListener("click", function (e) {
        e.stopPropagation();
        Array.from(bandeja.children).forEach(function (x) { x.classList.remove("sel"); });
        sel = c; c.classList.add("sel");
      });
      c.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", it.n); c.classList.add("dragging"); });
      c.addEventListener("dragend", function () { c.classList.remove("dragging"); });
      bandeja.appendChild(c);
    });

    function colocar(chip, volatil, bin, slot) {
      const certo = (chip.dataset.v === "1") === volatil;
      if (!certo) { ctx.errar(); tremer(chip); tremer(bin); return; }
      chip.classList.remove("sel", "dragging");
      chip.draggable = false;
      chip.disabled = true;
      slot.appendChild(chip);
      sel = null;
      if (!bandeja.children.length) ctx.concluir("Voláteis (RAM, cache e registradores) perdem tudo sem energia. Não voláteis (ROM, EEPROM, Flash e memória de massa) guardam os dados.");
    }
  }

  /* ============================================================
     Tarefa 3 · Hierarquia de velocidade
     ============================================================ */
  function tarefaHierarquia(ctx) {
    const ORDEM = ["Registradores", "Cache", "RAM", "Memória de massa"];
    ctx.corpo.appendChild(el("p", "tp-help", "Toque nas memórias na ordem certa: da mais rápida para a mais lenta."));
    const slots = el("div", "hier-slots");
    const marcas = [];
    ORDEM.forEach(function (_, i) {
      const s = el("div", "hs");
      s.innerHTML = "<span><small>" + (i + 1) + "º</small>?</span>";
      marcas.push(s);
      slots.appendChild(s);
    });
    const eixo = el("div", "hier-axis");
    eixo.append(el("span", "", "← mais rápida"), el("span", "", "mais lenta →"));
    const opts = el("div", "hier-opts");
    let prox = 0;
    embaralhar(ORDEM).forEach(function (nome) {
      const b = el("button", "opt", nome);
      b.type = "button";
      b.addEventListener("click", function () {
        if (nome === ORDEM[prox]) {
          marcas[prox].className = "hs filled";
          marcas[prox].innerHTML = "<span><small>" + (prox + 1) + "º</small>" + nome + "</span>";
          b.disabled = true;
          prox++;
          if (prox === ORDEM.length) ctx.concluir("Quanto mais perto da CPU, mais rápida (e menor) é a memória: registradores, cache, RAM e, por último, a memória de massa.");
        } else { ctx.errar(); tremer(b); tremer(marcas[prox]); }
      });
      opts.appendChild(b);
    });
    ctx.corpo.append(slots, eixo, opts);
  }

  /* ============================================================
     Tarefa 4 · Rotear os sinais (barramentos)
     ============================================================ */
  function tarefaBarramentos(ctx) {
    const FRASES = [
      { t: "Leva a posição da RAM que a CPU quer acessar.", a: true },
      { t: "Carrega o valor que está sendo lido ou gravado.", a: false },
      { t: "Via de mão única: só a CPU envia sinais por ele.", a: true },
      { t: "Via de mão dupla: a informação vai e volta entre CPU e memória.", a: false },
      { t: "Sua largura define quanta memória a CPU consegue enxergar.", a: true },
      { t: "Sua largura define quantos bits trafegam de uma só vez.", a: false }
    ];
    const lista = embaralhar(FRASES);
    ctx.corpo.appendChild(el("p", "tp-help", "Esse sinal viaja pelo barramento de endereço ou pelo de dados?"));
    const pontos = el("div", "bus-dots");
    lista.forEach(function () { pontos.appendChild(document.createElement("i")); });
    const cartao = el("div", "bus-card");
    const btns = el("div", "bus-btns");
    const bA = el("button", "bus-btn a", "Barramento de endereço");
    const bD = el("button", "bus-btn d", "Barramento de dados");
    bA.type = bD.type = "button";
    btns.append(bA, bD);
    ctx.corpo.append(pontos, cartao, btns);

    let i = 0, trava = false;
    function mostrar() {
      cartao.className = "bus-card";
      cartao.textContent = lista[i].t;
      Array.from(pontos.children).forEach(function (p, k) { p.className = k < i ? "ok" : (k === i ? "now" : ""); });
    }
    function responder(ehEndereco) {
      if (trava) return;
      if (lista[i].a === ehEndereco) {
        trava = true;
        cartao.classList.add("flash-ok");
        pontos.children[i].className = "ok";
        setTimeout(function () {
          i++; trava = false;
          if (i >= lista.length) {
            cartao.className = "bus-card"; cartao.textContent = "Sinais roteados!";
            btns.hidden = true;
            ctx.concluir("O barramento de endereço é de mão única e diz onde acessar; o de dados é de mão dupla e leva o conteúdo.");
          } else mostrar();
        }, 650);
      } else {
        ctx.errar(); cartao.classList.add("flash-bad"); tremer(cartao);
        setTimeout(function () { cartao.classList.remove("flash-bad"); }, 450);
      }
    }
    bA.addEventListener("click", function () { responder(true); });
    bD.addEventListener("click", function () { responder(false); });
    mostrar();
  }
})();
