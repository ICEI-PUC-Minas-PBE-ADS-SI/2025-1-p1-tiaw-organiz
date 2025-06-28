document.addEventListener("DOMContentLoaded", async () => {
  console.log("Carregando página de pastas...")

  let attempts = 0
  const maxAttempts = 50

  while (!window.organiz && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  if (window.organiz) {
    await window.organiz.waitForInit()
    console.log("OrganiZ pronto, carregando pastas...")
    loadPastas()
    updateUserName()
  } else {
    console.error("OrganiZ não foi inicializado")
    alert("Erro ao carregar o sistema. Recarregue a página.")
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

function loadPastas() {
  const container = document.getElementById("pastas-container")
  if (!container || !window.organiz) return

  const pastas = window.organiz.getAllPastas()

  if (pastas.length === 0) {
    container.innerHTML = `
            <div class="card-organiz card-dark p-5 text-center">
                <i class="fas fa-folder-open fa-4x text-muted mb-3"></i>
                <h3 class="text-white mb-3">Nenhuma pasta criada ainda</h3>
                <p class="text-muted mb-4">Comece criando sua primeira pasta para organizar suas tarefas!</p>
                <a href="criar-pasta.html" class="btn btn-organiz">
                    <i class="fas fa-plus me-2"></i>
                    Criar primeira pasta
                </a>
            </div>
        `
    return
  }

  container.innerHTML = pastas
    .map(
      (pasta) => `
        <div class="card-organiz card-dark pasta-card mb-4" style="border-left-color: ${pasta.cor}">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <div class="d-flex align-items-center mb-2">
                            <span class="pasta-color" style="background-color: ${pasta.cor}"></span>
                            <h4 class="text-white mb-0">${pasta.nome}</h4>
                        </div>
                        <p class="text-muted mb-3">${pasta.descricao}</p>
                        <div class="d-flex gap-3 text-sm">
                            <span class="text-muted">
                                <i class="fas fa-sticky-note me-1"></i>
                                ${pasta.notas ? pasta.notas.length : 0} notas
                            </span>
                            <span class="text-muted">
                                <i class="fas fa-image me-1"></i>
                                ${pasta.imagens ? pasta.imagens.length : 0} imagens
                            </span>
                            <span class="text-muted">
                                <i class="fas fa-tasks me-1"></i>
                                ${pasta.tarefas ? pasta.tarefas.length : 0} tarefas
                            </span>
                        </div>
                        <small class="text-muted">
                            Criada em ${formatDate(pasta.createdAt)}
                        </small>
                    </div>
                    <div class="col-md-4 text-end">
                        <div class="btn-group-vertical gap-2">
                            <a href="pasta-detalhes.html?id=${pasta.id}" class="btn btn-primary btn-sm">
                                <i class="fas fa-eye me-1"></i>
                                Acessar
                            </a>
                            <a href="criar-pasta.html?id=${pasta.id}" class="btn btn-warning btn-sm">
                                <i class="fas fa-edit me-1"></i>
                                Editar
                            </a>
                            <button onclick="deletePasta('${pasta.id}', '${pasta.nome}')" class="btn btn-danger btn-sm">
                                <i class="fas fa-trash me-1"></i>
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function deletePasta(id, nome) {
  if (!window.organiz) return

  const confirmDelete = confirm(`Tem certeza que deseja excluir a pasta "${nome}"?\n\nEsta ação não pode ser desfeita.`)

  if (confirmDelete) {
    const success = window.organiz.deletePasta(id)
    if (success) {
      loadPastas()
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}

