# 🛸 Impostor.exe

**Aprenda Arquitetura Computacional jogando**

Uma cruzadinha, um jogo de descobrir o intruso e uma série de tarefas de nave espacial, com tema de impostor, feitos para treinar os termos da aula de Tópicos de Arquitetura Computacional.

### 🎮 [Jogar agora](https://SEU-USUARIO.github.io/arqcomp-cruzadinha/)

---

## 📑 Sumário

- [O que é o Impostor.exe](#-o-que-é-o-impostorexe)
- [Como jogar](#️-como-jogar)
- [Palavras e pistas](#-palavras-e-pistas)
- [Tecnologias e estrutura](#️-tecnologias-e-estrutura)
- [Rodar no seu computador](#-rodar-no-seu-computador)
- [Créditos](#-créditos)

---

## 🧱 O que é o Impostor.exe

O Impostor.exe junta três jogos para fixar os conceitos vistos em aula (CPU, ULA, UC, memórias, barramentos, DMA e microcontrolador):

| Missão | Ideia |
|--------|-------|
| 📝 **Cruzadinha** | Leia as pistas e escreva os termos direto no tabuleiro. |
| 🕵️ **Quem é o Impostor?** | Em cada rodada, um componente não pertence ao grupo. Ache o intruso e ejete. |
| 🔧 **Tarefas da Nave** | Quatro minitarefas para deixar a nave 100% operacional. |

Tudo roda no navegador, sem instalar nada.

---

## 🕹️ Como jogar

### Na tela inicial
Escolha uma das três missões. O botão **← Menu**, no topo, volta para a tela inicial.

### 📝 Cruzadinha
1. Clique numa casa do tabuleiro, ou numa pista da lista, e digite as letras.
2. Clique de novo numa casa de cruzamento para alternar entre horizontal (→) e vertical (↓).
3. O botão **Conferir** mostra quais palavras estão certas (🟩 verde) e quais estão erradas (🟥 vermelho). O contador mostra seus acertos (ex.: "8 de 16 palavras").
4. **Reiniciar** limpa o tabuleiro.

> 💡 **Dica:** use as setas do teclado para andar pelas casas, `Backspace` para voltar e `Tab` para pular para a próxima palavra.

### 🕵️ Quem é o Impostor?
1. Leia a frase da reunião de emergência, por exemplo "Todos são tipos de memória, menos um."
2. Clique no componente que **não pertence** ao grupo: ele é o impostor.
3. O escolhido é ejetado e aparece uma explicação curta do conceito.
4. São 10 rodadas sorteadas entre 12. No fim você vê sua pontuação.

### 🔧 Tarefas da Nave

| Tarefa | Objetivo |
|--------|----------|
| 🔌 **Ligar os fios** | Conecte cada componente à função certa. |
| 🧪 **Calibrar as memórias** | Separe as memórias voláteis das não voláteis (arraste ou toque). |
| ⏱️ **Hierarquia de velocidade** | Ordene as memórias da mais rápida para a mais lenta. |
| 🛰️ **Rotear os sinais** | Decida se cada sinal viaja pelo barramento de endereço ou pelo de dados. |

Conclua as quatro para ver a mensagem de nave 100% operacional.

---

## 📚 Palavras e pistas

São **16 palavras**, todas cruzadas no tabuleiro.

| | Termo | Nº | Letras | Direção | Pista |
|---|-------|----|--------|---------|-------|
| 🧠 | CPU | 4 | 3 | → | Chip principal que busca e executa as instruções dos programas; o cérebro do computador. |
| 🧮 | ULA | 13 | 3 | ↓ | Dentro da CPU, faz as somas, subtrações e comparações lógicas. |
| 🎛️ | UC | 14 | 2 | → | Maestro da CPU: interpreta as instruções e coordena o trabalho das outras peças. |
| 📦 | registradores | 1 | 13 | ↓ | Minúsculos espaços dentro da CPU que guardam os valores da operação do momento. |
| ⚡ | RAM | 1 | 3 | → | Memória principal e volátil, onde ficam os programas em uso; apaga ao desligar. |
| 📜 | ROM | 8 | 3 | ↓ | Gravada na fábrica, guarda instruções básicas de inicialização e não perde nada sem energia. |
| 💾 | EEPROM | 3 | 6 | ↓ | Guarda pequenas configurações sem energia e permite alterar um único byte por vez. |
| 🔌 | Flash | 5 | 5 | → | Regravável por blocos e muito usada em pendrives, cartões SD e SSDs. |
| 🚀 | cache | 10 | 5 | ↓ | Pequena e rapidíssima, guarda cópias do que a CPU mais usa, evitando idas à RAM. |
| 💽 | memória de massa | 11 | 14 | → | Onde ficam arquivos e programas de forma permanente; grande, barata e lenta, como o HD. |
| 🚚 | DMA | 7 | 3 | ↓ | Controlador que faz sozinho transferências entre periféricos e a RAM, deixando a CPU livre. |
| 📍 | address bus | 6 | 10 | ↓ | Via de mão única em que a CPU informa qual posição da RAM quer acessar. |
| 🚌 | data bus | 15 | 7 | → | Via de mão dupla que leva o conteúdo lido ou escrito entre CPU e RAM. |
| 🔲 | microcontrolador | 9 | 16 | → | Chip único com processador, memória e portas de entrada e saída, comum em eletrodomésticos. |
| 2️⃣ | dual core | 12 | 8 | → | Processador que traz um par de núcleos no mesmo chip. |
| 4️⃣ | quad core | 2 | 8 | ↓ | Processador com o dobro de núcleos de um par, tudo no mesmo chip. |

---

## 🛠️ Tecnologias e estrutura

HTML, CSS e JavaScript puros, sem bibliotecas nem frameworks.

```
arqcomp-cruzadinha/
├── index.html      # estrutura das telas (menu + 3 jogos)
├── style.css       # visual de nave espacial
├── dados.js        # palavras, pistas e posições da cruzadinha
├── cruzadinha.js   # lógica da cruzadinha
├── impostor.js     # jogo Quem é o Impostor?
├── tarefas.js      # jogo Tarefas da Nave
├── script.js       # navegação entre telas e fundo de estrelas
└── README.md
```

---

## 💻 Rodar no seu computador

```bash
git clone https://github.com/SEU-USUARIO/arqcomp-cruzadinha.git
cd arqcomp-cruzadinha
```

Depois abra o `index.html` no navegador. Não precisa de servidor.

---

## 🙌 Créditos

- Conteúdo baseado na disciplina Tópicos de Arquitetura Computacional (São Paulo Tech School).
- O mascote **Bit** (um chip astronauta) e todos os visuais foram desenhados do zero em SVG e CSS, sem imagens externas.
- Projeto acadêmico e não oficial, inspirado no clima de nave espacial e impostores. Não é afiliado à Innersloth nem ao jogo original.
