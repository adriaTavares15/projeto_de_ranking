// Inicializa o módulo prompt-sync para entrada de dados no terminal.
const prompt = require("prompt-sync")();

// Declaração de variáveis globais para armazenar jogadores, número de partidas e histórico de partidas.
let jogadores = {};
let partidas = 0;
let historicoPartidas = [];

/*
   Função para pausar a execução do programa.
   Permite ao usuário continuar ou sair do programa.
 */
function pausar() {
  let cmd = prompt("ENTER para continuar ou 'sair': ").trim().toLowerCase();
  if (cmd === "sair") {
    console.log("Saindo...");
    process.exit(); // utilizada para encerrar o programa.
  }
}

/* 
   Função para listar os jogadores cadastrados.
   Exibe o nome, número de partidas e vitórias de cada jogador.
 */
function listarJogadores() {
  let i = 1;
  for (let nome in jogadores) {
    console.log(
      `${i} - ${nome} | Partidas: ${jogadores[nome].partidas}, Vitórias: ${jogadores[nome].vitorias}`
    );
    i++;
  }
}

/* 
   Função para adicionar novos jogadores ao sistema.
   Solicita ao usuário o número de jogadores e seus nomes.
   Verifica se o nome já está cadastrado antes de adicionar.
 */
function adicionarJogador() {
  console.clear();
  console.log("Adicionar Jogador");
  let qtd = parseInt(prompt("Quantos jogadores? (mínimo 2): "));
  if (isNaN(qtd) || qtd < 2) {
    console.log("Número inválido!");
    pausar();
    return;
  }
  for (let i = 0; i < qtd; i++) {
    let nome = prompt(`Nome do ${i + 1}º jogador: `).trim();
    if (jogadores[nome]) {
      console.log("Já cadastrado.");
      i--; // Repete a entrada para evitar duplicação.
    } else {
      jogadores[nome] = { partidas: 0, vitorias: 0, derrotas: 0, empates: 0 };
      console.log("Cadastrado!");
    }
  }
  pausar();
}

/* 
   Função para registrar uma partida entre dois jogadores.
   Solicita os jogadores e o resultado da partida (vencedor ou empate).
   Atualiza as estatísticas dos jogadores e registra o histórico da partida.
 */
function registrarPartida() {
  console.clear();
  console.log("Registrar Partida");
  listarJogadores();
  //objetivo.keys() retorna um array com os nomes das chaves.
  let nomes = Object.keys(jogadores);
  let j1 = parseInt(prompt("Número do 1º jogador: ")) - 1;
  let j2 = parseInt(prompt("Número do 2º jogador: ")) - 1;
  // Verifica se os jogadores selecionados são válidos.
  if (
    j1 === j2 ||
    j1 < 0 ||
    j2 < 0 ||
    j1 >= nomes.length ||
    j2 >= nomes.length
  ) {
    console.log("Jogadores inválidos!");
    pausar();
    return;
  }

  let vencedor = prompt(`Quem venceu? (${nomes[j1]} | ${nomes[j2]} | empate): `)
    .trim()
    .toLowerCase();

  jogadores[nomes[j1]].partidas++;
  jogadores[nomes[j2]].partidas++;

  let resultado = "";

  // Atualiza as estatísticas dos jogadores com base no resultado da partida.
  if (vencedor === nomes[j1].toLowerCase()) {
    jogadores[nomes[j1]].vitorias++;
    jogadores[nomes[j2]].derrotas++;
    resultado = `Vitória de ${nomes[j1]}`;
  } else if (vencedor === nomes[j2].toLowerCase()) {
    jogadores[nomes[j2]].vitorias++;
    jogadores[nomes[j1]].derrotas++;
    resultado = `Vitória de ${nomes[j2]}`;
  } else if (vencedor === "empate") {
    jogadores[nomes[j1]].empates++;
    jogadores[nomes[j2]].empates++;
    resultado = "Empate";
  } else {
    console.log("Resultado inválido!");
    pausar();
    return;
  }
  // Incrementa o número de partidas e registra a partida no histórico.
  partidas++;
  historicoPartidas.push({
    id: partidas,
    jogador1: nomes[j1],
    jogador2: nomes[j2],
    resultado: resultado,
  });

  console.log("Partida registrada!");
  pausar();
}

/* 
   Função para exibir o ranking dos jogadores.
   Ordena os jogadores pelo número de vitórias e exibe o ranking.
 */
function verRanking() {
  console.clear();
  let ranking = [];
  for (let nome in jogadores) {
    ranking.push({ nome: nome, vitorias: jogadores[nome].vitorias });
  }
  /* Ordena o ranking em ordem decrescente de vitórias. */
  for (let i = 0; i < ranking.length; i++) {
    for (let j = i + 1; j < ranking.length; j++) {
      if (ranking[i].vitorias < ranking[j].vitorias) {
        [ranking[i], ranking[j]] = [ranking[j], ranking[i]]; // Troca os elementos
      }
    }
  }
  //também poderia ser usado ranking.sort((a, b) => b.vitorias - a.vitorias);
  // Exibe o ranking dos jogadores.

  console.log("Ranking:");
  for (let i = 0; i < ranking.length; i++) {
    console.log(
      `${i + 1}º - ${ranking[i].nome} | Vitórias: ${ranking[i].vitorias}`
    );
  }
  pausar();
}

/* 
   Função para exibir os percentuais de vitórias, derrotas e empates de cada jogador.
   Calcula os percentuais com base no número total de partidas jogadas.
 */
function verPercentuais() {
  console.clear();
  for (let nome in jogadores) {
    let stats = jogadores[nome];
    let total = stats.partidas;
    if (total === 0) {
      console.log(`${nome} ainda não jogou.`);
    } else {
      let v = ((stats.vitorias / total) * 100).toFixed(1);
      let d = ((stats.derrotas / total) * 100).toFixed(1);
      let e = ((stats.empates / total) * 100).toFixed(1);
      console.log(
        `${nome} | Vitórias: ${v}% | Derrotas: ${d}% | Empates: ${e}%`
      );
    }
  }
  pausar();
}

/* 
   Função para remover um jogador do sistema.
   Solicita o número do jogador e o remove da lista.
 */
function removerJogador() {
  console.clear();
  console.log("Remover Jogador:");
  listarJogadores();

  let nomes = Object.keys(jogadores);
  let num = parseInt(prompt("Digite o número do jogador para remover: ")) - 1;

  if (num < 0 || num >= nomes.length) {
    console.log("Número inválido.");
  } else {
    let nome = nomes[num];
    delete jogadores[nome];
    console.log("Jogador removido.");
  }
  pausar();
}

/* 
   Função para exibir o histórico de partidas registradas.
   Mostra os detalhes de cada partida registrada.
 */
function verHistorico() {
  console.clear();
  if (historicoPartidas.length === 0) {
    console.log("Nenhuma partida registrada.");
  } else {
    for (let p of historicoPartidas) {
      console.log(`#${p.id}: ${p.jogador1} vs ${p.jogador2} → ${p.resultado}`);
    }
  }
  pausar();
}

/* 
   Função principal do jogo.
   Exibe o menu de opções e executa as funcionalidades escolhidas pelo usuário.
 */
function jogo() {
  while (true) {
    console.clear();
    console.log("Bem-vindo ao Jogo da velha com Ranking!");
    console.log(`
1 - Adicionar jogador
2 - Registrar partida
3 - Ver ranking
4 - Ver percentuais
5 - Remover jogador
6 - Ver histórico de partidas
7 - Sair
        `);

    let opcao = prompt("Escolha: ").trim();

    if (opcao === "1") {
      adicionarJogador();
    } else if (opcao === "2") {
      if (Object.keys(jogadores).length < 2) {
        console.log("Cadastre pelo menos 2 jogadores!");
        pausar();
        continue;
      }
      registrarPartida();
    } else if (opcao === "3") {
      verRanking();
    } else if (opcao === "4") {
      verPercentuais();
    } else if (opcao === "5") {
      removerJogador();
    } else if (opcao === "6") {
      verHistorico();
    } else if (opcao === "7") {
      console.log("Saindo...");
      break;
    } else {
      console.log("Opção inválida!");
      pausar();
    }
  }
}

// Inicia o programa.
jogo();
