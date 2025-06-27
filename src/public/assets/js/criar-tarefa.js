// JavaScript específico para criar tarefa
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Carregando página de criar tarefa...")

  // Aguardar a inicialização do OrganiZ com timeout maior
  let attempts = 0
  const maxAttempts = 50

  while (!window.organiz && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  if (window.organiz) {
    await window.organiz.waitForInit()
    console.log("OrganiZ pronto para criar tarefa")
    setupForm()
    loadPastasSelect()
    updateUserName()
  } else {
    console.error("OrganiZ não foi inicializado")
    alert("Erro ao carregar o sistema. Recarregue a página.")
  }
})

// Configurar formulário
function setupForm() {
  const form = document.getElementById("tarefa-form")
  const tituloInput = document.getElementById("tarefa-titulo")
  const descricaoInput = document.getElementById("tarefa-descricao")
  const dataInput = document.getElementById("tarefa-data")
  const prioridadeSelect = document.getElementById("tarefa-prioridade")
  const pastaSelect = document.getElementById("tarefa-pasta")

  // Definir data padrão como hoje
  const today = new Date().toISOString().split("T")[0]
  dataInput.value = today
  updatePreview()

  // Atualizar preview em tempo real
  tituloInput.addEventListener("input", updatePreview)
  descricaoInput.addEventListener("input", updatePreview)
  dataInput.addEventListener("change", updatePreview)
  prioridadeSelect.addEventListener("change", updatePreview)
  pastaSelect.addEventListener("change", updatePreview)

  // Submissão do formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    criarTarefa()
  })
}

// Carregar pastas no select
function loadPastasSelect() {
  if (!window.organiz) return

  const select = document.getElementById("tarefa-pasta")
  const pastas = window.organiz.getAllPastas()

  // Limpar opções existentes (exceto a primeira)
  while (select.children.length > 1) {
    select.removeChild(select.lastChild)
  }

  // Adicionar pastas
  pastas.forEach((pasta) => {
    const option = document.createElement("option")
    option.value = pasta.id
    option.textContent = pasta.nome
    select.appendChild(option)
  })
}

// Atualizar preview da tarefa
function updatePreview() {
  const titulo = document.getElementById("tarefa-titulo").value.trim() || "Título da tarefa aparecerá aqui"
  const descricao = document.getElementById("tarefa-descricao").value.trim()
  const data = document.getElementById("tarefa-data").value
  const prioridade = document.getElementById("tarefa-prioridade").value
  const pastaId = document.getElementById("tarefa-pasta").value

  // Atualizar título
  document.getElementById("preview-titulo").textContent = titulo

  // Atualizar prioridade
  const previewPrioridade = document.getElementById("preview-prioridade")
  const prioridadeConfig = {
    baixa: { emoji: "🟢", text: "Baixa", class: "bg-success" },
    media: { emoji: "🟡", text: "Média", class: "bg-warning" },
    alta: { emoji: "🔴", text: "Alta", class: "bg-danger" },
  }

  const config = prioridadeConfig[prioridade]
  previewPrioridade.textContent = `${config.emoji} ${config.text}`
  previewPrioridade.className = `badge ms-2 ${config.class}`

  // Atualizar descrição
  const previewDescricao = document.getElementById("preview-descricao")
  if (descricao) {
    previewDescricao.textContent = descricao
    previewDescricao.style.display = "block"
  } else {
    previewDescricao.style.display = "none"
  }

  // Atualizar data
  const previewData = document.getElementById("preview-data")
  if (data) {
    const dataFormatada = new Date(data).toLocaleDateString("pt-BR")
    previewData.textContent = dataFormatada
  } else {
    previewData.textContent = "Selecione uma data"
  }

  // Atualizar pasta
  const previewPasta = document.getElementById("preview-pasta")
  if (pastaId && window.organiz) {
    const pasta = window.organiz.getPasta(pastaId)
    if (pasta) {
      previewPasta.querySelector("span").textContent = pasta.nome
      previewPasta.style.display = "inline"
    } else {
      previewPasta.style.display = "none"
    }
  } else {
    previewPasta.style.display = "none"
  }
}

// Criar tarefa
function criarTarefa() {
  if (!window.organiz) return

  const titulo = document.getElementById("tarefa-titulo").value.trim()
  const descricao = document.getElementById("tarefa-descricao").value.trim()
  const data = document.getElementById("tarefa-data").value
  const prioridade = document.getElementById("tarefa-prioridade").value
  const pastaId = document.getElementById("tarefa-pasta").value

  // Validação
  if (!titulo) {
    alert("Por favor, preencha o título da tarefa.")
    document.getElementById("tarefa-titulo").focus()
    return
  }

  if (!data) {
    alert("Por favor, selecione uma data para a tarefa.")
    document.getElementById("tarefa-data").focus()
    return
  }

  const novaTarefa = {
    id: Date.now().toString(),
    titulo,
    descricao,
    data,
    prioridade,
    concluida: false,
    pastaId: pastaId || "independente",
    createdAt: new Date().toISOString(),
  }

  try {
    if (pastaId) {
      // Adicionar à pasta específica
      const pasta = window.organiz.getPasta(pastaId)
      if (pasta) {
        if (!pasta.tarefas) pasta.tarefas = []
        pasta.tarefas.push(novaTarefa)
        window.organiz.updatePasta(pastaId, { tarefas: pasta.tarefas })
      }
    } else {
      // Criar pasta especial para tarefas independentes
      let pastaIndependente = window.organiz.getAllPastas().find((p) => p.id === "independente")

      if (!pastaIndependente) {
        pastaIndependente = window.organiz.createPasta({
          id: "independente",
          nome: "Tarefas Independentes",
          cor: "#6c757d",
          descricao: "Tarefas criadas sem pasta específica",
        })
      }

      if (!pastaIndependente.tarefas) pastaIndependente.tarefas = []
      pastaIndependente.tarefas.push(novaTarefa)
      window.organiz.updatePasta("independente", { tarefas: pastaIndependente.tarefas })
    }

    window.organiz.showNotification("Tarefa criada com sucesso!", "success")

    // Redirecionar para a página principal
    setTimeout(() => {
      window.location.href = "index.html"
    }, 1000)
  } catch (error) {
    console.error("Erro ao criar tarefa:", error)
    alert("Erro ao criar tarefa. Tente novamente.")
  }
}

// Atualizar nome do usuário
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
