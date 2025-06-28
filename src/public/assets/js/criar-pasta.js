let isEditMode = false
let editingPastaId = null

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const pastaId = urlParams.get("id")

  if (pastaId) {
    isEditMode = true
    editingPastaId = pastaId
  }

  let attempts = 0
  const maxAttempts = 50

  while (!window.organiz && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  if (window.organiz) {
    await window.organiz.waitForInit()
    console.log("OrganiZ pronto para criar pasta")
    await setupForm()
    if (isEditMode) {
      loadPastaForEdit()
    }
  } else {
    console.error("OrganiZ não foi inicializado")
    alert("Erro ao carregar o sistema. Recarregue a página.")
  }
})

async function setupForm() {
  if (window.organiz) {
    await window.organiz.waitForInit()
  }

  updateUserName()

  const form = document.getElementById("pasta-form")
  const nomeInput = document.getElementById("pasta-nome")
  const corSelect = document.getElementById("pasta-cor")
  const previewNome = document.getElementById("preview-nome")
  const previewContainer = document.getElementById("pasta-preview")
  const colorPreview = document.getElementById("color-preview")

  nomeInput.addEventListener("input", function () {
    const nome = this.value.trim() || "Nome da Pasta"
    previewNome.textContent = nome
  })

  corSelect.addEventListener("change", function () {
    const cor = this.value
    previewContainer.style.backgroundColor = cor
    colorPreview.style.backgroundColor = cor

    const textColor = isLightColor(cor) ? "#000000" : "#ffffff"
    previewNome.style.color = textColor
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    savePasta()
  })

  if (isEditMode) {
    document.getElementById("form-title").innerHTML = `
            <i class="fas fa-edit me-2"></i>
            Editar Pasta
        `
    document.getElementById("btn-text").textContent = "Salvar Alterações"
  }
}

function loadPastaForEdit() {
  if (!window.organiz || !editingPastaId) return

  const pasta = window.organiz.getPasta(editingPastaId)
  if (!pasta) {
    alert("Pasta não encontrada!")
    window.location.href = "pastas.html"
    return
  }

  document.getElementById("pasta-nome").value = pasta.nome
  document.getElementById("pasta-cor").value = pasta.cor
  document.getElementById("pasta-descricao").value = pasta.descricao

  document.getElementById("preview-nome").textContent = pasta.nome
  document.getElementById("pasta-preview").style.backgroundColor = pasta.cor
  document.getElementById("color-preview").style.backgroundColor = pasta.cor

  const textColor = isLightColor(pasta.cor) ? "#000000" : "#ffffff"
  document.getElementById("preview-nome").style.color = textColor
}

function savePasta() {
  if (!window.organiz) return

  const nome = document.getElementById("pasta-nome").value.trim()
  const cor = document.getElementById("pasta-cor").value
  const descricao = document.getElementById("pasta-descricao").value.trim()

  if (!nome) {
    alert("Por favor, preencha o nome da pasta.")
    document.getElementById("pasta-nome").focus()
    return
  }

  const pastaData = {
    nome,
    cor,
    descricao,
  }

  try {
    if (isEditMode && editingPastaId) {
      window.organiz.updatePasta(editingPastaId, pastaData)
    } else {
      window.organiz.createPasta(pastaData)
    }

    window.location.href = "pastas.html"
  } catch (error) {
    console.error("Erro ao salvar pasta:", error)
    alert("Erro ao salvar pasta. Tente novamente.")
  }
}

function isLightColor(color) {
  const hex = color.replace("#", "")
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5
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

