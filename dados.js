/* Dados da cruzadinha: palavras, pistas e posição de cada uma no tabuleiro.
   r = linha inicial, c = coluna inicial, d = direção (H horizontal, V vertical). */
window.GAMES = window.GAMES || {};

const PALAVRAS = [
  { n: 1,  termo: "CPU",                                   resp: "CPU",              r: 2,  c: 0,  d: "H",
    pista: "Chip principal que busca e executa as instruções dos programas; o cérebro do computador." },
  { n: 2,  termo: "ULA",                                   resp: "ULA",              r: 10, c: 3,  d: "V",
    pista: "Dentro da CPU, faz as somas, subtrações e comparações lógicas." },
  { n: 3,  termo: "UC (Unidade de Controle)",              resp: "UC",               r: 11, c: 13, d: "H",
    pista: "Maestro da CPU: interpreta as instruções e coordena o trabalho das outras peças." },
  { n: 4,  termo: "registradores",                         resp: "REGISTRADORES",    r: 0,  c: 8,  d: "V",
    pista: "Minúsculos espaços dentro da CPU que guardam os valores da operação do momento." },
  { n: 5,  termo: "RAM",                                   resp: "RAM",              r: 0,  c: 8,  d: "H",
    pista: "Memória principal e volátil, onde ficam os programas em uso; apaga ao desligar." },
  { n: 6,  termo: "ROM",                                   resp: "ROM",              r: 4,  c: 4,  d: "V",
    pista: "Gravada na fábrica, guarda instruções básicas de inicialização e não perde nada sem energia." },
  { n: 7,  termo: "EEPROM",                                resp: "EEPROM",           r: 1,  c: 6,  d: "V",
    pista: "Guarda pequenas configurações sem energia e permite alterar um único byte por vez." },
  { n: 8,  termo: "Flash",                                 resp: "FLASH",            r: 3,  c: 11, d: "H",
    pista: "Regravável por blocos e muito usada em pendrives, cartões SD e SSDs." },
  { n: 9,  termo: "cache",                                 resp: "CACHE",            r: 7,  c: 11, d: "V",
    pista: "Pequena e rapidíssima, guarda cópias do que a CPU mais usa, evitando idas à RAM." },
  { n: 10, termo: "memória de massa (armazenamento)",      resp: "MEMORIADEMASSA",   r: 8,  c: 1,  d: "H",
    pista: "Onde ficam arquivos e programas de forma permanente; grande, barata e lenta, como o HD." },
  { n: 11, termo: "DMA",                                   resp: "DMA",              r: 4,  c: 0,  d: "V",
    pista: "Controlador que faz sozinho transferências entre periféricos e a RAM, deixando a CPU livre." },
  { n: 12, termo: "address bus (barramento de endereço)",  resp: "ADDRESSBUS",       r: 3,  c: 13, d: "V",
    pista: "Via de mão única em que a CPU informa qual posição da RAM quer acessar." },
  { n: 13, termo: "data bus (barramento de dados)",        resp: "DATABUS",          r: 12, c: 2,  d: "H",
    pista: "Via de mão dupla que leva o conteúdo lido ou escrito entre CPU e RAM." },
  { n: 14, termo: "microcontrolador",                      resp: "MICROCONTROLADOR", r: 5,  c: 0,  d: "H",
    pista: "Chip único com processador, memória e portas de entrada e saída, comum em eletrodomésticos." },
  { n: 15, termo: "dual core",                             resp: "DUALCORE",         r: 10, c: 2,  d: "H",
    pista: "Processador que traz um par de núcleos no mesmo chip." },
  { n: 16, termo: "quad core",                             resp: "QUADCORE",         r: 1,  c: 2,  d: "V",
    pista: "Processador com o dobro de núcleos de um par, tudo no mesmo chip." }
];
