document.addEventListener("DOMContentLoaded", async () => {
  console.log("Carregando página inicial...")

  // Aguardar a inicialização do OrganiZ
  let attempts = 0
  const maxAttempts = 50

  while (!window.organiz && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  if (window.organiz) {
    await window.organiz.waitForInit()
    console.log("OrganiZ pronto, carregando dados...")

    loadTaskList()
    setupSearchFunctionality()
    updateUserName()
    updateTaskCounters()
  } else {
    console.error("OrganiZ não foi inicializado")
    // Tentar novamente após um tempo
    setTimeout(async () => {
      if (window.organiz) {
        await window.organiz.waitForInit()
        loadTaskList()
        setupSearchFunctionality()
        updateUserName()
        updateTaskCounters()
      }
    }, 1000)
  }
})

function updateUserName() {
  const userData = localStorage.getItem("organiz-user")
  if (userData) {
    const user = JSON.parse(userData)
    const userNameElement = document.getElementById("user-name")
    if (userNameElement) {
      userNameElement.textContent = user.nome || user.email
    }
  }
}

function loadTaskList() {
  const taskListContainer = document.getElementById("task-list")
  if (!taskListContainer || !window.organiz) {
    console.log("Container ou organiz não encontrado")
    return
  }

  console.log("Carregando lista de tarefas...")
  const tarefas = window.organiz.getAllTarefas()
  console.log("Tarefas encontradas:", tarefas.length)

  if (tarefas.length === 0) {
    taskListContainer.innerHTML = `
      <div class="text-center py-4">
        <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">Nenhuma tarefa encontrada</h5>
        <p class="text-muted mb-3">Comece criando sua primeira tarefa!</p>
        <a href="criar-tarefa.html" class="btn btn-organiz">
          <i class="fas fa-plus me-2"></i>
          Criar Primeira Tarefa
        </a>
      </div>
    `
    updateTaskCounters()
    return
  }

  const tarefasPendentes = tarefas.filter((t) => !t.concluida).sort(sortByPriority)
  const tarefasConcluidas = tarefas.filter((t) => t.concluida)

  let html = ""

  if (tarefasPendentes.length > 0) {
    html += '<h6 class="text-muted mb-3">Pendentes</h6>'
    html += tarefasPendentes.map((tarefa) => renderTarefa(tarefa)).join("")
  }

  if (tarefasConcluidas.length > 0) {
    html += '<h6 class="text-muted mb-3 mt-4">Concluídas</h6>'
    html += tarefasConcluidas.map((tarefa) => renderTarefa(tarefa)).join("")
  }

  taskListContainer.innerHTML = html
  console.log("Lista de tarefas renderizada com sucesso")

  updateTaskCounters()
}

function sortByPriority(a, b) {
  const prioridadeOrder = { alta: 3, media: 2, baixa: 1 }
  const prioridadeA = prioridadeOrder[a.prioridade] || 2
  const prioridadeB = prioridadeOrder[b.prioridade] || 2
  return prioridadeB - prioridadeA
}

function renderTarefa(tarefa) {
  const pasta = window.organiz.getPasta(tarefa.pastaId)
  const pastaNome = pasta ? pasta.nome : "Sem pasta"
  const pastaColor = pasta ? pasta.cor : "#6c757d"

  const prioridadeConfig = {
    baixa: { emoji: "🟢", text: "Baixa", class: "bg-success" },
    media: { emoji: "🟡", text: "Média", class: "bg-warning" },
    alta: { emoji: "🔴", text: "Alta", class: "bg-danger" },
  }

  const prioridade = prioridadeConfig[tarefa.prioridade] || prioridadeConfig.media
  const priorityClass = tarefa.prioridade ? `priority-${tarefa.prioridade}` : "priority-media"

  return `
    <div class="task-item ${tarefa.concluida ? "completed" : ""} ${priorityClass} mb-3">
      <div class="d-flex align-items-center">
        <input type="checkbox" 
               class="form-check-input me-3" 
               ${tarefa.concluida ? "checked" : ""} 
               onchange="toggleTask('${tarefa.id}', '${tarefa.pastaId}')"
               style="transform: scale(1.2);">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center mb-1">
            <span class="task-text ${tarefa.concluida ? "text-decoration-line-through text-muted" : ""} fw-bold">${tarefa.titulo}</span>
            <span class="badge ms-2 ${prioridade.class}" style="font-size: 0.7rem;">${prioridade.emoji} ${prioridade.text}</span>
            <span class="badge ms-1" style="background-color: ${pastaColor}; font-size: 0.7rem;">${pastaNome}</span>
          </div>
          ${tarefa.descricao ? `<p class="mb-1 small ${tarefa.concluida ? "text-muted" : ""}">${tarefa.descricao}</p>` : ""}
          <small class="text-muted">
            <i class="fas fa-calendar me-1"></i>
            ${formatDate(tarefa.data)}
          </small>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteTarefa('${tarefa.id}', '${tarefa.pastaId}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `
}

function toggleTask(taskId, pastaId) {
  if (!window.organiz) return

  const pasta = window.organiz.getPasta(pastaId)
  if (pasta && pasta.tarefas) {
    const tarefaIndex = pasta.tarefas.findIndex((t) => t.id === taskId)
    if (tarefaIndex !== -1) {
      pasta.tarefas[tarefaIndex].concluida = !pasta.tarefas[tarefaIndex].concluida
      window.organiz.updatePasta(pastaId, { tarefas: pasta.tarefas })

      loadTaskList()
      if (window.calendar) {
        window.calendar.render()
      }
    }
  }
}

function deleteTarefa(taskId, pastaId) {
  if (!window.organiz) return

  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return

  const pasta = window.organiz.getPasta(pastaId)
  if (pasta && pasta.tarefas) {
    pasta.tarefas = pasta.tarefas.filter((t) => t.id !== taskId)
    window.organiz.updatePasta(pastaId, { tarefas: pasta.tarefas })

    loadTaskList()
    if (window.calendar) {
      window.calendar.render()
    }

    window.organiz.showNotification("Tarefa excluída com sucesso!", "success")
  }
}

function setupSearchFunctionality() {
  const searchInput = document.getElementById("search-input")
  const searchResults = document.getElementById("search-results")

  if (!searchInput || !searchResults || !window.organiz) return

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.trim()

    if (term.length === 0) {
      searchResults.innerHTML = ""
      return
    }

    const results = window.organiz.searchPastas(term)

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="text-muted small mt-2">Nenhuma pasta encontrada</p>'
      return
    }

    searchResults.innerHTML = `
      <div class="mt-3 p-3 rounded" style="background-color: rgba(255,255,255,0.1);">
        <small class="text-muted">Resultados (${results.length})</small>
        <div class="mt-2">
          ${results
            .map(
              (pasta) => `
            <a href="pasta-detalhes.html?id=${pasta.id}" class="d-block text-decoration-none mb-2 p-2 rounded" style="background-color: rgba(255,255,255,0.1);">
              <div class="d-flex align-items-center">
                <span class="pasta-color me-2" style="background-color: ${pasta.cor}; width: 12px; height: 12px; border-radius: 2px;"></span>
                <div>
                  <div class="text-white fw-bold small">${pasta.nome}</div>
                  <small class="text-muted">${pasta.descricao}</small>
                </div>
              </div>
            </a>
          `,
            )
            .join("")}
        </div>
      </div>
    `
  })
}

function showTaskHelp() {
  alert(
    "Aqui você pode visualizar todas as suas tarefas organizadas por status e prioridade. As tarefas de alta prioridade aparecem primeiro!",
  )
}

function calculateTaskStats() {
  if (!window.organiz) return { concluidas: 0, pendentes: 0, atrasadas: 0 }

  const tarefas = window.organiz.getAllTarefas()
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  let concluidas = 0
  let pendentes = 0
  let atrasadas = 0

  tarefas.forEach((tarefa) => {
    const dataTarefa = new Date(tarefa.data)
    dataTarefa.setHours(0, 0, 0, 0)

    if (tarefa.concluida) {
      concluidas++
    } else if (dataTarefa < hoje) {
      atrasadas++
    } else {
      pendentes++
    }
  })

  return { concluidas, pendentes, atrasadas }
}

function updateTaskCounters() {
  const stats = calculateTaskStats()

  const concluidasElement = document.getElementById("tarefas-concluidas")
  const pendentesElement = document.getElementById("tarefas-pendentes")
  const atrasadasElement = document.getElementById("tarefas-atrasadas")

  if (concluidasElement) concluidasElement.textContent = stats.concluidas
  if (pendentesElement) pendentesElement.textContent = stats.pendentes
  if (atrasadasElement) atrasadasElement.textContent = stats.atrasadas

  console.log("Contadores atualizados:", stats)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}
