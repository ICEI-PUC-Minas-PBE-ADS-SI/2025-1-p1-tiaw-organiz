let editingMetaId = null
const bootstrap = window.bootstrap

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Carregando página de metas...")

  // Aguardar a inicialização do Site
  let attempts = 0
  const maxAttempts = 50

  while (!window.organiz && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  if (window.organiz) {
    await window.organiz.waitForInit()
    console.log("OrganiZ pronto para metas")
    loadMetas()
    updateUserName()
  } else {
    console.error("OrganiZ não foi inicializado")
    // Tentar de nvo depois de um tempo
    setTimeout(async () => {
      if (window.organiz) {
        await window.organiz.waitForInit()
        loadMetas()
        updateUserName()
      }
    }, 1000)
  }
})

function loadMetas() {
  const container = document.getElementById("metas-container")
  if (!container || !window.organiz) {
    console.log("Container ou organiz não encontrado")
    return
  }

  console.log("Carregando metas...")
  const metas = window.organiz.getAllMetas()
  console.log("Metas encontradas:", metas.length)

  if (metas.length === 0) {
    container.innerHTML = `
      <div class="card-organiz card-dark p-5 text-center">
        <i class="fas fa-target fa-4x text-muted mb-3"></i>
        <h3 class="text-white mb-3">Nenhuma meta criada ainda</h3>
        <p class="text-muted mb-4">Comece definindo suas metas e objetivos para alcançar o sucesso!</p>
        <button class="btn btn-organiz" data-bs-toggle="modal" data-bs-target="#metaModal">
          <i class="fas fa-plus me-2"></i>
          Criar primeira meta
        </button>
      </div>
    `
    return
  }

  // Renderizar todas as metas
  const metasHtml = metas
    .map(
      (meta) => `
        <div class="card meta-card mb-4 ${meta.concluida ? "completed" : ""}" style="border-left-color: var(--primary-color);">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="fs-1">${meta.icone}</div>
              </div>
              <div class="col">
                <div class="d-flex align-items-center mb-2">
                  <input type="checkbox" 
                         class="form-check-input me-3" 
                         ${meta.concluida ? "checked" : ""} 
                         onchange="toggleMeta('${meta.id}')"
                         style="transform: scale(1.3);">
                  <h4 class="mb-0 meta-text ${meta.concluida ? "text-decoration-line-through text-muted" : ""}">${meta.categoria}</h4>
                </div>
                <p class="meta-text mb-2 ${meta.concluida ? "text-decoration-line-through text-muted" : ""}">${meta.descricao}</p>
                <small class="text-muted">
                  Criada em ${formatDate(meta.createdAt)}
                  ${meta.concluida ? ` • Concluída em ${formatDate(meta.updatedAt || meta.createdAt)}` : ""}
                </small>
              </div>
              <div class="col-auto">
                <div class="btn-group-vertical gap-1">
                  <button class="btn btn-sm btn-warning" onclick="editarMeta('${meta.id}')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" onclick="excluirMeta('${meta.id}', '${meta.categoria}')">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    )
    .join("")

  container.innerHTML = metasHtml
  console.log("Metas renderizadas com sucesso")
}

function salvarMeta() {
  if (!window.organiz) return

  const categoria = document.getElementById("meta-categoria").value.trim()
  const descricao = document.getElementById("meta-descricao").value.trim()
  const icone = document.getElementById("meta-icone").value

  if (!categoria || !descricao) {
    alert("Por favor, preencha todos os campos obrigatórios.")
    return
  }

  const metaData = {
    categoria,
    descricao,
    icone,
    concluida: false,
  }

  try {
    if (editingMetaId) {
      metaData.updatedAt = new Date().toISOString()
      window.organiz.updateMeta(editingMetaId, metaData)
      editingMetaId = null
    } else {
      window.organiz.createMeta(metaData)
    }

    limparFormulario()
    bootstrap.Modal.getInstance(document.getElementById("metaModal")).hide()

    // Recarregar metas
    loadMetas()
  } catch (error) {
    console.error("Erro ao salvar meta:", error)
    alert("Erro ao salvar meta. Tente novamente.")
  }
}

function editarMeta(metaId) {
  if (!window.organiz) return

  const metas = window.organiz.getAllMetas()
  const meta = metas.find((m) => m.id === metaId)

  if (!meta) {
    alert("Meta não encontrada!")
    return
  }

  document.getElementById("meta-categoria").value = meta.categoria
  document.getElementById("meta-descricao").value = meta.descricao
  document.getElementById("meta-icone").value = meta.icone

  document.getElementById("metaModalTitle").innerHTML = `
    <i class="fas fa-edit me-2"></i>
    Editar Meta
  `
  document.getElementById("btn-salvar-text").textContent = "Salvar Alterações"

  editingMetaId = metaId

  new bootstrap.Modal(document.getElementById("metaModal")).show()
}

function excluirMeta(metaId, categoria) {
  if (!window.organiz) return

  const confirmDelete = confirm(
    `Tem certeza que deseja excluir a meta "${categoria}"?\n\nEsta ação não pode ser desfeita.`,
  )

  if (confirmDelete) {
    const success = window.organiz.deleteMeta(metaId)
    if (success) {
      loadMetas()
    }
  }
}

function toggleMeta(metaId) {
  if (!window.organiz) return

  const metas = window.organiz.getAllMetas()
  const meta = metas.find((m) => m.id === metaId)

  if (meta) {
    const novoStatus = !meta.concluida
    const updateData = {
      concluida: novoStatus,
      updatedAt: new Date().toISOString(),
    }

    window.organiz.updateMeta(metaId, updateData)
    loadMetas()

    if (novoStatus) {
      setTimeout(() => {
        alert(`🎉 Parabéns! Você concluiu a meta "${meta.categoria}"!`)
      }, 100)
    }
  }
}

function limparFormulario() {
  document.getElementById("meta-categoria").value = ""
  document.getElementById("meta-descricao").value = ""
  document.getElementById("meta-icone").value = "🎯"

  document.getElementById("metaModalTitle").innerHTML = `
    <i class="fas fa-target me-2"></i>
    Nova Meta
  `
  document.getElementById("btn-salvar-text").textContent = "Salvar Meta"

  editingMetaId = null
}

document.getElementById("metaModal").addEventListener("hidden.bs.modal", () => {
  limparFormulario()
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
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
