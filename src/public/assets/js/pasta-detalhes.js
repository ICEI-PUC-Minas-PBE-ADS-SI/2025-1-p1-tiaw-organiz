// JavaScript específico para detalhes da pasta
let currentPasta = null
let currentPastaId = null
let editingDiarioId = null
const bootstrap = window.bootstrap

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Carregando detalhes da pasta...")

  // Obter ID da pasta da URL
  const urlParams = new URLSearchParams(window.location.search)
  currentPastaId = urlParams.get("id")

  if (!currentPastaId) {
    alert("Pasta não encontrada!")
    window.location.href = "pastas.html"
    return
  }

  console.log("ID da pasta:", currentPastaId)

  let attempts = 0
  const maxAttempts = 50

  while (!window.organiz && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  if (window.organiz) {
    await window.organiz.waitForInit()
    console.log("OrganiZ pronto, carregando detalhes...")
    loadPastaDetails()
    setupEventListeners()
  } else {
    console.error("OrganiZ não foi inicializado")
    alert("Erro ao carregar o sistema. Recarregue a página.")
  }
})

function setupEventListeners() {
  updateUserName()

  const imageInput = document.getElementById("image-input")
  imageInput.addEventListener("change", handleImageUpload)

  const today = new Date().toISOString().split("T")[0]
  document.getElementById("tarefa-data").value = today

  document.getElementById("diarioModal").addEventListener("hidden.bs.modal", limparFormularioDiario)
  document.getElementById("notaModal").addEventListener("hidden.bs.modal", () => {
    document.getElementById("nota-content").value = ""
  })
}

function loadPastaDetails() {
  if (!window.organiz || !currentPastaId) return

  currentPasta = window.organiz.getPasta(currentPastaId)

  if (!currentPasta) {
    alert("Pasta não encontrada!")
    window.location.href = "pastas.html"
    return
  }

  renderPastaDetails()
}

function renderPastaDetails() {
  const container = document.getElementById("pasta-content")

  container.innerHTML = `
        <!-- Cabeçalho da Pasta -->
        <div class="card-organiz card-dark p-4 mb-4">
            <div class="row align-items-center">
                <div class="col-auto">
                    <div class="color-preview" style="background-color: ${currentPasta.cor}; width: 60px; height: 60px;"></div>
                </div>
                <div class="col">
                    <h1 class="text-white mb-2">${currentPasta.nome}</h1>
                    <p class="text-muted mb-3">${currentPasta.descricao}</p>
                    <small class="text-muted">Criada em ${formatDate(currentPasta.createdAt)}</small>
                </div>
            </div>
            
            <!-- Botões de Ação -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="d-flex flex-wrap gap-2">
                        <button class="btn btn-organiz" data-bs-toggle="modal" data-bs-target="#diarioModal">
                            <i class="fas fa-book me-2"></i>
                            Escrever no Diário
                        </button>
                        <button class="btn btn-organiz" data-bs-toggle="modal" data-bs-target="#notaModal">
                            <i class="fas fa-sticky-note me-2"></i>
                            Nota Rápida
                        </button>
                        <button class="btn btn-organiz" onclick="document.getElementById('image-input').click()">
                            <i class="fas fa-image me-2"></i>
                            Adicionar Imagem
                        </button>
                        <button class="btn btn-organiz" data-bs-toggle="modal" data-bs-target="#tarefaModal">
                            <i class="fas fa-tasks me-2"></i>
                            Adicionar Tarefa
                        </button>
                        <a href="criar-pasta.html?id=${currentPasta.id}" class="btn btn-warning">
                            <i class="fas fa-edit me-2"></i>
                            Editar Pasta
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Conteúdo da Pasta -->
        <div class="row g-4">
            <!-- Diário -->
            <div class="col-12">
                <div class="card-organiz p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4>
                            <i class="fas fa-book me-2"></i>
                            Diário (${currentPasta.diario ? currentPasta.diario.length : 0} entradas)
                        </h4>
                        <div class="d-flex gap-2">
                            <select id="filtro-diario" class="form-select form-select-sm" style="width: auto;" onchange="filtrarDiario()">
                                <option value="">Todas as categorias</option>
                                <option value="pessoal">📝 Pessoal</option>
                                <option value="trabalho">💼 Trabalho</option>
                                <option value="estudos">📚 Estudos</option>
                                <option value="saude">🏥 Saúde</option>
                                <option value="relacionamentos">❤️ Relacionamentos</option>
                                <option value="hobbies">🎨 Hobbies</option>
                                <option value="viagem">✈️ Viagem</option>
                                <option value="reflexao">🤔 Reflexão</option>
                            </select>
                            <button class="btn btn-sm btn-organiz" data-bs-toggle="modal" data-bs-target="#diarioModal">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div id="diario-container">
                        ${renderDiario()}
                    </div>
                </div>
            </div>

            <!-- Notas Rápidas -->
            <div class="col-lg-6">
                <div class="card-organiz p-4">
                    <h4 class="mb-3">
                        <i class="fas fa-sticky-note me-2"></i>
                        Notas Rápidas (${currentPasta.notas ? currentPasta.notas.length : 0})
                    </h4>
                    <div id="notas-container">
                        ${renderNotas()}
                    </div>
                </div>
            </div>

            <!-- Imagens -->
            <div class="col-lg-6">
                <div class="card-organiz p-4">
                    <h4 class="mb-3">
                        <i class="fas fa-image me-2"></i>
                        Imagens (${currentPasta.imagens ? currentPasta.imagens.length : 0})
                    </h4>
                    <div id="imagens-container">
                        ${renderImagens()}
                    </div>
                </div>
            </div>

            <!-- Tarefas -->
            <div class="col-12">
                <div class="card-organiz p-4">
                    <h4 class="mb-3">
                        <i class="fas fa-tasks me-2"></i>
                        Tarefas (${currentPasta.tarefas ? currentPasta.tarefas.length : 0})
                    </h4>
                    <div id="tarefas-container">
                        ${renderTarefas()}
                    </div>
                </div>
            </div>
        </div>
    `
}

// Renderizar diário
function renderDiario() {
  if (!currentPasta.diario || currentPasta.diario.length === 0) {
    return `
            <div class="text-center py-5">
                <i class="fas fa-book fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Seu diário está vazio</h5>
                <p class="text-muted mb-3">Comece escrevendo sua primeira entrada!</p>
                <button class="btn btn-organiz" data-bs-toggle="modal" data-bs-target="#diarioModal">
                    <i class="fas fa-pen me-2"></i>
                    Primeira Entrada
                </button>
            </div>
        `
  }

  const entradasOrdenadas = [...currentPasta.diario].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return entradasOrdenadas
    .map(
      (entrada) => `
        <div class="card mb-3 entrada-diario" data-categoria="${entrada.categoria || ""}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="flex-grow-1">
                        <h6 class="card-title mb-1">
                            ${entrada.titulo}
                            ${entrada.humor ? getHumorEmoji(entrada.humor) : ""}
                        </h6>
                        <div class="d-flex gap-2 mb-2">
                            <small class="badge bg-secondary">${getCategoriaIcon(entrada.categoria)} ${getCategoriaName(entrada.categoria)}</small>
                            <small class="text-muted">${formatDateTime(entrada.createdAt)}</small>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="editarEntradaDiario('${entrada.id}')">
                                <i class="fas fa-edit me-2"></i>Editar
                            </a></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="removerEntradaDiario('${entrada.id}')">
                                <i class="fas fa-trash me-2"></i>Excluir
                            </a></li>
                        </ul>
                    </div>
                </div>
                <div class="card-text">
                    ${entrada.conteudo.replace(/\n/g, "<br>")}
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Renderizar notas rápidas
function renderNotas() {
  if (!currentPasta.notas || currentPasta.notas.length === 0) {
    return '<p class="text-muted">Nenhuma nota adicionada ainda.</p>'
  }

  return currentPasta.notas
    .map(
      (nota) => `
        <div class="card mb-3" style="background-color: #f8f9fa;">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <p class="mb-2">${nota.conteudo}</p>
                        <small class="text-muted">${formatDateTime(nota.createdAt)}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="removerNota('${nota.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Renderizar imagens
function renderImagens() {
  if (!currentPasta.imagens || currentPasta.imagens.length === 0) {
    return '<p class="text-muted">Nenhuma imagem adicionada ainda.</p>'
  }

  return currentPasta.imagens
    .map(
      (imagem) => `
        <div class="position-relative mb-3">
            <img src="${imagem.base64}" alt="${imagem.nome}" class="img-fluid rounded" style="max-height: 200px; width: 100%; object-fit: cover;">
            <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2" onclick="removerImagem('${imagem.id}')">
                <i class="fas fa-trash"></i>
            </button>
            <div class="mt-2">
                <small class="text-muted">${imagem.nome}</small><br>
                <small class="text-muted">${formatDateTime(imagem.createdAt)}</small>
            </div>
        </div>
    `,
    )
    .join("")
}

// Renderizar tarefas
function renderTarefas() {
  if (!currentPasta.tarefas || currentPasta.tarefas.length === 0) {
    return '<p class="text-muted">Nenhuma tarefa adicionada ainda.</p>'
  }

  return currentPasta.tarefas
    .map(
      (tarefa) => `
        <div class="task-item ${tarefa.concluida ? "completed" : ""} mb-3">
            <div class="d-flex align-items-start">
                <input type="checkbox" 
                       class="form-check-input me-3 mt-1" 
                       ${tarefa.concluida ? "checked" : ""} 
                       onchange="toggleTarefa('${tarefa.id}')"
                       style="transform: scale(1.2);">
                <div class="flex-grow-1">
                    <h6 class="task-text ${tarefa.concluida ? "text-decoration-line-through text-muted" : ""}">${tarefa.titulo}</h6>
                    ${tarefa.descricao ? `<p class="mb-1 ${tarefa.concluida ? "text-muted" : ""}">${tarefa.descricao}</p>` : ""}
                    <small class="text-muted">
                        <i class="fas fa-calendar me-1"></i>
                        ${formatDate(tarefa.data)}
                        ${tarefa.prioridade ? `<span class="badge bg-${getPrioridadeColor(tarefa.prioridade)} ms-2">${getPrioridadeText(tarefa.prioridade)}</span>` : ""}
                    </small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removerTarefa('${tarefa.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Salvar entrada do diário
function salvarEntradaDiario() {
  const titulo = document.getElementById("diario-titulo").value.trim()
  const conteudo = document.getElementById("diario-conteudo").value.trim()
  const humor = document.getElementById("diario-humor").value
  const categoria = document.getElementById("diario-categoria").value

  if (!titulo || !conteudo) {
    alert("Por favor, preencha o título e o conteúdo da entrada.")
    return
  }

  const entradaData = {
    id: editingDiarioId || Date.now().toString(),
    titulo,
    conteudo,
    humor,
    categoria,
    createdAt: editingDiarioId
      ? currentPasta.diario.find((e) => e.id === editingDiarioId).createdAt
      : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!currentPasta.diario) {
    currentPasta.diario = []
  }

  if (editingDiarioId) {
    // Editar entrada existente
    const index = currentPasta.diario.findIndex((e) => e.id === editingDiarioId)
    if (index !== -1) {
      currentPasta.diario[index] = entradaData
    }
    editingDiarioId = null
  } else {
    // Nova entrada
    currentPasta.diario.push(entradaData)
  }

  window.organiz.updatePasta(currentPastaId, { diario: currentPasta.diario })

  // Limpar modal e fechar
  limparFormularioDiario()
  bootstrap.Modal.getInstance(document.getElementById("diarioModal")).hide()

  // Recarregar detalhes
  loadPastaDetails()
  window.organiz.showNotification("Entrada do diário salva com sucesso!", "success")
}

// Editar entrada do diário
function editarEntradaDiario(entradaId) {
  const entrada = currentPasta.diario.find((e) => e.id === entradaId)
  if (!entrada) return

  // Preencher formulário
  document.getElementById("diario-titulo").value = entrada.titulo
  document.getElementById("diario-conteudo").value = entrada.conteudo
  document.getElementById("diario-humor").value = entrada.humor || ""
  document.getElementById("diario-categoria").value = entrada.categoria || "pessoal"

  // Configurar modal para edição
  document.getElementById("diario-modal-title").textContent = "Editar Entrada do Diário"
  document.getElementById("btn-salvar-diario").textContent = "Salvar Alterações"

  editingDiarioId = entradaId

  // Abrir modal
  new bootstrap.Modal(document.getElementById("diarioModal")).show()
}

// Remover entrada do diário
function removerEntradaDiario(entradaId) {
  if (!confirm("Tem certeza que deseja remover esta entrada do diário?")) return

  currentPasta.diario = currentPasta.diario.filter((entrada) => entrada.id !== entradaId)
  window.organiz.updatePasta(currentPastaId, { diario: currentPasta.diario })
  loadPastaDetails()
  window.organiz.showNotification("Entrada do diário removida!", "success")
}

// Filtrar diário por categoria
function filtrarDiario() {
  const filtro = document.getElementById("filtro-diario").value
  const entradas = document.querySelectorAll(".entrada-diario")

  entradas.forEach((entrada) => {
    const categoria = entrada.dataset.categoria
    if (!filtro || categoria === filtro) {
      entrada.style.display = "block"
    } else {
      entrada.style.display = "none"
    }
  })
}

// Limpar formulário do diário
function limparFormularioDiario() {
  document.getElementById("diario-titulo").value = ""
  document.getElementById("diario-conteudo").value = ""
  document.getElementById("diario-humor").value = ""
  document.getElementById("diario-categoria").value = "pessoal"

  // Resetar modal para modo de criação
  document.getElementById("diario-modal-title").textContent = "Nova Entrada no Diário"
  document.getElementById("btn-salvar-diario").textContent = "Salvar Entrada"

  editingDiarioId = null
}

// Salvar nota rápida
function salvarNota() {
  const conteudo = document.getElementById("nota-content").value.trim()

  if (!conteudo) {
    alert("Por favor, digite o conteúdo da nota.")
    return
  }

  const novaNota = {
    id: Date.now().toString(),
    conteudo: conteudo,
    createdAt: new Date().toISOString(),
  }

  if (!currentPasta.notas) {
    currentPasta.notas = []
  }

  currentPasta.notas.push(novaNota)
  window.organiz.updatePasta(currentPastaId, { notas: currentPasta.notas })

  // Limpar modal e fechar
  document.getElementById("nota-content").value = ""
  bootstrap.Modal.getInstance(document.getElementById("notaModal")).hide()

  // Recarregar detalhes
  loadPastaDetails()
}

// Salvar tarefa
function salvarTarefa() {
  const titulo = document.getElementById("tarefa-titulo").value.trim()
  const descricao = document.getElementById("tarefa-descricao").value.trim()
  const data = document.getElementById("tarefa-data").value
  const prioridade = document.getElementById("tarefa-prioridade").value

  if (!titulo || !data) {
    alert("Por favor, preencha o título e a data da tarefa.")
    return
  }

  const novaTarefa = {
    id: Date.now().toString(),
    titulo: titulo,
    descricao: descricao,
    data: data,
    prioridade: prioridade,
    concluida: false,
    pastaId: currentPastaId,
    createdAt: new Date().toISOString(),
  }

  if (!currentPasta.tarefas) {
    currentPasta.tarefas = []
  }

  currentPasta.tarefas.push(novaTarefa)
  window.organiz.updatePasta(currentPastaId, { tarefas: currentPasta.tarefas })

  // Limpar modal e fechar
  document.getElementById("tarefa-titulo").value = ""
  document.getElementById("tarefa-descricao").value = ""
  document.getElementById("tarefa-data").value = new Date().toISOString().split("T")[0]
  document.getElementById("tarefa-prioridade").value = "media"
  bootstrap.Modal.getInstance(document.getElementById("tarefaModal")).hide()

  // Recarregar detalhes
  loadPastaDetails()
}

// Upload de imagem
function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // Verificar se é uma imagem
  if (!file.type.startsWith("image/")) {
    alert("Por favor, selecione apenas arquivos de imagem.")
    return
  }

  // Verificar tamanho (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("A imagem deve ter no máximo 5MB.")
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const novaImagem = {
      id: Date.now().toString(),
      base64: e.target.result,
      nome: file.name,
      createdAt: new Date().toISOString(),
    }

    if (!currentPasta.imagens) {
      currentPasta.imagens = []
    }

    currentPasta.imagens.push(novaImagem)
    window.organiz.updatePasta(currentPastaId, { imagens: currentPasta.imagens })

    // Recarregar detalhes
    loadPastaDetails()
  }

  reader.readAsDataURL(file)
}

// Remover nota
function removerNota(notaId) {
  if (!confirm("Tem certeza que deseja remover esta nota?")) return

  currentPasta.notas = currentPasta.notas.filter((nota) => nota.id !== notaId)
  window.organiz.updatePasta(currentPastaId, { notas: currentPasta.notas })
  loadPastaDetails()
}

// Remover imagem
function removerImagem(imagemId) {
  if (!confirm("Tem certeza que deseja remover esta imagem?")) return

  currentPasta.imagens = currentPasta.imagens.filter((imagem) => imagem.id !== imagemId)
  window.organiz.updatePasta(currentPastaId, { imagens: currentPasta.imagens })
  loadPastaDetails()
}

// Remover tarefa
function removerTarefa(tarefaId) {
  if (!confirm("Tem certeza que deseja remover esta tarefa?")) return

  currentPasta.tarefas = currentPasta.tarefas.filter((tarefa) => tarefa.id !== tarefaId)
  window.organiz.updatePasta(currentPastaId, { tarefas: currentPasta.tarefas })
  loadPastaDetails()
}

// Toggle tarefa
function toggleTarefa(tarefaId) {
  const tarefa = currentPasta.tarefas.find((t) => t.id === tarefaId)
  if (tarefa) {
    tarefa.concluida = !tarefa.concluida
    window.organiz.updatePasta(currentPastaId, { tarefas: currentPasta.tarefas })
    loadPastaDetails()
  }
}

// Funções auxiliares
function getHumorEmoji(humor) {
  const humores = {
    "muito-feliz": "😄",
    feliz: "😊",
    neutro: "😐",
    triste: "😔",
    "muito-triste": "😢",
    ansioso: "😰",
    motivado: "💪",
    cansado: "😴",
  }
  return humores[humor] || ""
}

function getCategoriaIcon(categoria) {
  const categorias = {
    pessoal: "📝",
    trabalho: "💼",
    estudos: "📚",
    saude: "🏥",
    relacionamentos: "❤️",
    hobbies: "🎨",
    viagem: "✈️",
    reflexao: "🤔",
  }
  return categorias[categoria] || "📝"
}

function getCategoriaName(categoria) {
  const nomes = {
    pessoal: "Pessoal",
    trabalho: "Trabalho",
    estudos: "Estudos",
    saude: "Saúde",
    relacionamentos: "Relacionamentos",
    hobbies: "Hobbies",
    viagem: "Viagem",
    reflexao: "Reflexão",
  }
  return nomes[categoria] || "Pessoal"
}

function getPrioridadeColor(prioridade) {
  const cores = {
    baixa: "success",
    media: "warning",
    alta: "danger",
  }
  return cores[prioridade] || "secondary"
}

function getPrioridadeText(prioridade) {
  const textos = {
    baixa: "🟢 Baixa",
    media: "🟡 Média",
    alta: "🔴 Alta",
  }
  return textos[prioridade] || "Média"
}

// Utilitários
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("pt-BR")
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString("pt-BR")
}

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
