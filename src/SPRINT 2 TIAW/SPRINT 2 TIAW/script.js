
function gerarDataAleatoria() {
  const dias = Math.floor(Math.random() * 21) - 10;
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toISOString().split('T')[0];
}


function gerarTarefas(qtd = 10) {
  const tarefas = [];

  for (let i = 1; i <= qtd; i++) {
    tarefas.push({
      nome: `Tarefa ${i}`,
      data: gerarDataAleatoria(),
      concluida: Math.random() < 0.5
    });
  }

  return tarefas;
}


function atualizarTela(tarefas) {
  const agora = new Date();
  let pendentes = 0, concluidas = 0, atrasadas = 0;

  const listaEl = document.getElementById('taskList');
  listaEl.innerHTML = "";

  tarefas.forEach(tarefa => {
    const dataTarefa = new Date(tarefa.data);
    const item = document.createElement("div");
    item.classList.add("task-item");

    if (tarefa.concluida) {
      concluidas++;
      item.classList.add("done");
      item.innerHTML = `<strong>${tarefa.nome}</strong>Status: Concluída<br>Data: ${tarefa.data}`;
    } else if (dataTarefa < agora) {
      atrasadas++;
      item.classList.add("late");
      item.innerHTML = `<strong>${tarefa.nome}</strong>Status: Atrasada<br>Data: ${tarefa.data}`;
    } else {
      pendentes++;
      item.classList.add("pending");
      item.innerHTML = `<strong>${tarefa.nome}</strong>Status: Pendente<br>Data: ${tarefa.data}`;
    }

    listaEl.appendChild(item);
  });

  document.getElementById('pendingCount').textContent = pendentes;
  document.getElementById('completedCount').textContent = concluidas;
  document.getElementById('lateCount').textContent = atrasadas;
}


const tarefas = gerarTarefas(15);
atualizarTela(tarefas);
// NAO ERA MINHA FUNÇÃO FAZER AS TAREFAS POR TANTO, GEREI ALEATORIAMENTE