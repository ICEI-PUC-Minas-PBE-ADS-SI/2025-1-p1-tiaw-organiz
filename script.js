const numeroDias = document.querySelector('.numero-dias');
const botoesMeses = document.querySelectorAll('.meses button');

// Descrição dos compromissos:
const compromissos = {
  0: {
    1: [
      { cor: 'vermelho', info: 'Reunião com equipe' },
      { cor: 'azul', info: 'Consulta médica' },
      { cor: 'verde', info: 'Pagamento de contas' }
    ],
    10: [
      { cor: 'azul', info: 'Dentista' }
    ],
    15: [
      { cor: 'azul', info: 'Trabalho de escola' },
      { cor: 'vermelho', info: 'Churrasco' }
    ]
  },
  1: {
    2: [
      { cor: 'azul', info: 'Futebol' }
    ],
    14: [
      { cor: 'verde', info: 'Compras do mês' },
      { cor: 'vermelho', info: 'Apresentação' }
    ]
  },
  2: {
    13: [
      { cor: 'vermelho', info: 'Reunião geral' }
    ],
    12:[
      { cor: 'verde', info: 'Palestra' }
    ]
  },
  4: {
    7: [
      { cor: 'azul', info: 'Treino na academia' },
      { cor: 'vermelho', info: 'Basquete' }
    ],
    30: [
      { cor: 'verde', info: 'Corrida' }
    ]
  }
};

// Função para renderizar o calendário
function renderizarCalendario(mes, ano = 2025) {
  numeroDias.innerHTML = '';

  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const primeiroDia = (new Date(ano, mes, 1).getDay() + 6) % 7;
  const dados = compromissos[mes] || {};

   // Adiciona os dias vazios antes do primeiro dia do mês
  numeroDias.innerHTML += '<span></span>'.repeat(primeiroDia);

  for (let i = 1; i <= totalDias; i++) {
    const compromissosDia = dados[i] || [];

    // Criação dos marcadores de compromissos no dia
    const marcadores = compromissosDia.map(item => {
      return `<div class="compromisso ${item.cor}" data-info="${item.info}"></div>`;
    }).join('');

    numeroDias.innerHTML += `<span>${i}${marcadores}</span>`;
  }

  document.querySelectorAll('.compromisso').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation(); 
      alert("Compromisso: " + e.target.dataset.info);
    });
  });
}

// Evento de clique nos botões dos meses para mudar o calendário
botoesMeses.forEach(btn => {
  btn.onclick = () => {
    
    botoesMeses.forEach(b => b.classList.remove('ativo'));
    
    // Adiciona destaque ao botão clicado
    btn.classList.add('ativo');

    // Mostra o calendário do mês clicado
    renderizarCalendario(parseInt(btn.dataset.mes));
  };
});
const botaoVoltar = document.getElementById('botao-voltar');
const mensagemVoltar = document.getElementById('mensagem-voltar');

botaoVoltar.addEventListener('click', () => {
  mensagemVoltar.classList.add('visivel');
  
  setTimeout(() => {
    mensagemVoltar.classList.remove('visivel');
  }, 2000); // some após 2 segundos
});

renderizarCalendario(new Date().getMonth());