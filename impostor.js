/* Missão 2 · Quem é o Impostor?
   Em cada rodada, um componente não pertence ao grupo. Ache o intruso. */
(function () {
  "use strict";

  const raiz = document.getElementById("imp-root");
  window.GAMES.impostor = { mount: function () { telaInicial(); } };

  const TOTAL_RODADAS = 10;
  const CORES = ["#e5202f", "#2a62ff", "#2edb6a", "#ff5fc0", "#ff8a1f", "#f6d90e", "#41f0e2", "#9b5cff", "#c9d3ea"];

  /* "itens": o último de cada lista é o impostor (a ordem é embaralhada na tela). */
  const RODADAS = [
    { q: "Todos são tipos de memória, menos um.",
      itens: ["ROM", "EEPROM", "Flash", "ULA"],
      porque: "A ULA fica dentro da CPU e faz contas e operações lógicas; ela não guarda dados. ROM, EEPROM e Flash são memórias." },
    { q: "Todos fazem parte da CPU, menos um.",
      itens: ["ULA", "UC", "Registradores", "ROM"],
      porque: "ULA, UC e registradores compõem a CPU. A ROM é uma memória separada, fora do processador." },
    { q: "Todos mantêm o conteúdo sem energia (são não voláteis), menos um.",
      itens: ["ROM", "EEPROM", "Flash", "RAM"],
      porque: "A RAM é volátil: quando o computador desliga, tudo o que estava nela se perde." },
    { q: "Todos são voláteis e muito rápidos, menos um.",
      itens: ["Registradores", "Cache", "RAM", "Memória de massa"],
      porque: "A memória de massa (HD ou SSD) guarda os dados de forma permanente e é bem mais lenta que as demais." },
    { q: "Todos podem ser regravados, menos um.",
      itens: ["EEPROM", "Flash", "RAM", "ROM"],
      porque: "A ROM é gravada na fabricação e serve para leitura. EEPROM, Flash e RAM aceitam novas gravações." },
    { q: "Todos têm vários núcleos, menos um.",
      itens: ["Dual core", "Quad core", "Octa core", "Single core"],
      porque: "Um processador single core tem um único núcleo. Dual, quad e octa core têm dois, quatro e oito." },
    { q: "Todos são barramentos, menos um.",
      itens: ["Barramento de endereço", "Barramento de dados", "Barramento de controle", "Cache"],
      porque: "Barramentos são as vias que ligam CPU, memória e periféricos. A cache é uma memória." },
    { q: "Todos são memória de massa, menos um.",
      itens: ["HD", "SSD", "Pendrive", "Cache"],
      porque: "HD, SSD e pendrive guardam arquivos de forma permanente. A cache é pequena, rápida e fica perto da CPU." },
    { q: "A ULA faz tudo isto, menos uma coisa.",
      itens: ["Somar", "Subtrair", "Comparar valores", "Guardar arquivos para sempre"],
      porque: "Guardar arquivos de forma permanente é papel da memória de massa. A ULA só calcula e compara." },
    { q: "A UC faz tudo isto, menos uma coisa.",
      itens: ["Buscar a próxima instrução", "Decodificar a instrução", "Coordenar os outros componentes", "Fazer somas e subtrações"],
      porque: "Quem faz as contas é a ULA. A UC apenas comanda: busca, interpreta e coordena." },
    { q: "Um microcontrolador reúne tudo num chip só, menos uma peça.",
      itens: ["CPU", "Memória", "Portas de entrada e saída", "Placa de vídeo dedicada"],
      porque: "O microcontrolador traz processador, memória e portas de E/S no mesmo chip. Placa de vídeo dedicada é outra peça." },
    { q: "Todos ajudam a movimentar informação, menos um.",
      itens: ["DMA", "Barramento de dados", "Barramento de endereço", "ULA"],
      porque: "DMA e barramentos transportam informação entre componentes. A ULA calcula; ela não transporta." }
  ];

  let rodadas = [], idx = 0, acertos = 0, travado = false;

  function embaralhar(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; }
    return b;
  }
  const BIT = function (cor) { return '<svg class="bit" viewBox="0 0 100 112" style="--c:' + cor + '" aria-hidden="true"><use href="#bit"/></svg>'; };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function telaInicial() {
    raiz.innerHTML =
      '<div class="imp-wrap"><div class="panel imp-intro">' + BIT("#e5202f") +
      "<h2>Reunião de emergência!</h2>" +
      "<p>Um componente se infiltrou no grupo. Em cada rodada, você vê quatro suspeitos: três pertencem à mesma categoria e um é o <b>impostor</b>. Clique no intruso para ejetá-lo.</p>" +
      '<button class="btn btn-red" id="imp-start" type="button">Iniciar reunião</button></div></div>';
    document.getElementById("imp-start").addEventListener("click", iniciar);
  }

  function iniciar() {
    rodadas = embaralhar(RODADAS).slice(0, TOTAL_RODADAS);
    idx = 0; acertos = 0;
    rodada();
  }

  function rodada() {
    travado = false;
    const r = rodadas[idx];
    const impostor = r.itens[r.itens.length - 1];
    const lista = embaralhar(r.itens);
    const off = Math.floor(Math.random() * CORES.length);

    raiz.innerHTML =
      '<div class="imp-wrap">' +
      '<div class="imp-status"><span class="pill">Rodada <b>' + (idx + 1) + "</b> de " + rodadas.length + "</span>" +
      '<span class="pill">Impostores achados <b>' + acertos + "</b></span>" +
      '<div class="taskbar" aria-hidden="true"><i style="width:' + (idx / rodadas.length * 100) + '%"></i></div></div>' +
      '<div class="panel meeting"><div class="meeting-head"><span class="siren" aria-hidden="true"></span>Reunião de emergência</div>' +
      '<h2 class="meeting-q">' + esc(r.q) + "</h2>" +
      '<p class="meeting-sub">Clique no impostor.</p>' +
      '<div class="lineup" id="imp-line"></div>' +
      '<p class="eject-msg" id="imp-msg" aria-live="polite"></p>' +
      '<div id="imp-after"></div></div></div>';

    const linha = document.getElementById("imp-line");
    lista.forEach(function (nome, i) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "suspect";
      b.dataset.nome = nome;
      b.style.setProperty("--c", CORES[(i + off) % CORES.length]);
      b.innerHTML = BIT(CORES[(i + off) % CORES.length]) + '<span class="plate">' + esc(nome) + "</span>";
      b.addEventListener("click", function () { votar(b, nome, impostor, r); });
      linha.appendChild(b);
    });
  }

  function votar(botao, escolhido, impostor, r) {
    if (travado) return;
    travado = true;
    const certo = escolhido === impostor;
    if (certo) acertos++;

    const todos = Array.from(document.querySelectorAll(".suspect"));
    todos.forEach(function (b) { b.disabled = true; });
    if (!certo) {
      todos.forEach(function (b) { if (b.dataset.nome === impostor) b.classList.add("reveal-imp"); else if (b !== botao) b.classList.add("reveal-safe"); });
    }
    botao.classList.add("eject");

    const msg = document.getElementById("imp-msg");
    msg.textContent = certo ? escolhido + " era o Impostor." : escolhido + " não era o Impostor.";
    msg.className = "eject-msg " + (certo ? "right" : "wrong");

    setTimeout(function () {
      botao.classList.add("gone");
      const ultimo = idx === rodadas.length - 1;
      document.getElementById("imp-after").innerHTML =
        '<div class="why"><b>' + (certo ? "Boa, detetive!" : "O impostor era: " + esc(impostor)) + "</b>" + esc(r.porque) + "</div>" +
        '<div class="next-row"><button class="btn btn-yellow" id="imp-next" type="button">' + (ultimo ? "Ver resultado" : "Próxima rodada") + "</button></div>";
      const n = document.getElementById("imp-next");
      n.addEventListener("click", function () { idx++; if (idx >= rodadas.length) resultado(); else rodada(); });
      n.focus();
    }, 1500);
  }

  function resultado() {
    let titulo, texto, cor;
    if (acertos >= 9) { titulo = "Tripulação a salvo!"; texto = "Quase nenhum impostor escapou. Você domina os componentes do computador."; cor = "#2edb6a"; }
    else if (acertos >= 6) { titulo = "Missão quase perfeita"; texto = "Você pegou a maioria dos impostores. Revise os que passaram e jogue de novo."; cor = "#f6d90e"; }
    else { titulo = "O impostor ainda está à solta"; texto = "Sem problema: releia as explicações de cada rodada, treine a cruzadinha e tente outra vez."; cor = "#e5202f"; }

    raiz.innerHTML =
      '<div class="imp-wrap"><div class="panel result">' + BIT(cor) +
      '<div class="big"><span>' + acertos + "</span>/" + rodadas.length + "</div>" +
      "<h2>" + titulo + "</h2><p>" + texto + "</p>" +
      '<div class="row"><button class="btn btn-red" id="imp-again" type="button">Jogar de novo</button>' +
      '<a class="btn btn-ghost" href="#/">Voltar ao menu</a></div></div></div>';
    document.getElementById("imp-again").addEventListener("click", iniciar);
  }
})();
