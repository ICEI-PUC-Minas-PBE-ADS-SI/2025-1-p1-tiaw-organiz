const ctx = document.getElementById('graficoDia').getContext('2d');

let grafico = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Tarefa (Horas) ', 'Trabalho (Horas) ', 'Tempo Livre (Horas) '],
    datasets: [{
      data: [7, 8, 9],
      backgroundColor: ['#ff0055', '#1eff00', '#1100ff'],
      hoverOffset: 10
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Distribuição do Dia 1 de Janeiro'
      }
    }
  }
});

function atualizarGrafico() {
  const dia = document.getElementById('diaMes').value;
  const mes = document.getElementById('mes').value;
  const tarefa = parseFloat(document.getElementById('tarefa').value);
  const trabalho = parseFloat(document.getElementById('trabalho').value);
  const livre = parseFloat(document.getElementById('livre').value);
  const total = tarefa + trabalho + livre;

  if (total > 24) {
    alert("⚠️ A soma das horas não pode ultrapassar 24h.");
    return;
  }

  grafico.data.datasets[0].data = [tarefa, trabalho, livre];
  grafico.options.plugins.title.text = `Distribuição do Dia ${dia} de ${mes}`;
  grafico.update();

  const dados = { sono, trabalho, livre };
  localStorage.setItem(`tarefas_dia_${dia}_mes_${mes}`, JSON.stringify(dados));
}

function carregarDados() {
  const dia = document.getElementById('diaMes').value;
  const mes = document.getElementById('mes').value;
  const dadosSalvos = localStorage.getItem(`tarefas_dia_${dia}_mes_${mes}`);

  if (dadosSalvos) {
    const { tarefa, trabalho, livre } = JSON.parse(dadosSalvos);
    document.getElementById('tarefa').value = tarefa;
    document.getElementById('trabalho').value = trabalho;
    document.getElementById('livre').value = livre;

    grafico.data.datasets[0].data = [tarefa, trabalho, livre];
    grafico.options.plugins.title.text = `Distribuição do Dia ${dia} de ${mes}`;
    grafico.update();
  }
}
document.getElementById('diaMes').addEventListener('change', carregarDados);
document.getElementById('mes').addEventListener('change', carregarDados);

window.addEventListener('load', () => {
  carregarDados();
});

