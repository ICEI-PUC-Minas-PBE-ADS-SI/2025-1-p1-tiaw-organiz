let currentUser = null

function getBaseURL() {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:3000/api"
  } else {
    return "https://two025-1-p1-tiaw-organiz.onrender.com/api"
  }
}

const API_BASE_URL = getBaseURL()

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Carregando página de perfil...")
  console.log("🌐 URL da API:", API_BASE_URL)

  let attempts = 0
  const maxAttempts = 50

  while (!window.organiz && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  if (window.organiz) {
    await window.organiz.waitForInit()
    console.log("OrganiZ pronto para perfil")
    await loadUserProfile()
    setupForm()
    updateUserName()
  } else {
    console.error("OrganiZ não foi inicializado")
    alert("Erro ao carregar o sistema. Recarregue a página.")
  }
})

async function loadUserProfile() {
  const userData = localStorage.getItem("organiz-user")
  if (!userData) {
    window.location.href = "/login.html"
    return
  }

  currentUser = JSON.parse(userData)

  try {
    const response = await fetch(`${API_BASE_URL}/user/${currentUser.id}/profile`)
    const result = await response.json()

    if (result.success) {
      currentUser = result.usuario
      localStorage.setItem("organiz-user", JSON.stringify(currentUser))
      displayUserProfile()
    } else {
      console.error("Erro ao carregar perfil:", result.message)
      displayUserProfile()
    }
  } catch (error) {
    console.error("Erro ao conectar com servidor:", error)
    displayUserProfile()
  }
}

function displayUserProfile() {
  document.getElementById("perfil-nome").textContent = currentUser.nome
  document.getElementById("perfil-email").textContent = currentUser.email

  if (currentUser.createdAt) {
    const dataCriacao = new Date(currentUser.createdAt).getFullYear()
    document.getElementById("perfil-data-criacao").textContent = dataCriacao
  }

  if (currentUser.fotoPerfil) {
    const fotoImg = document.getElementById("foto-perfil-img")
    const fotoPlaceholder = document.getElementById("foto-placeholder")
    fotoImg.src = currentUser.fotoPerfil
    fotoImg.style.display = "block"
    fotoPlaceholder.style.display = "none"
  }

  document.getElementById("perfil-nome-input").value = currentUser.nome || ""
  document.getElementById("perfil-email-input").value = currentUser.email || ""
  document.getElementById("perfil-telefone").value = currentUser.telefone || ""
  document.getElementById("perfil-nascimento").value = currentUser.dataNascimento || ""
}

function setupForm() {
  const form = document.getElementById("perfil-form")
  const fotoInput = document.getElementById("foto-input")

  fotoInput.addEventListener("change", handleFotoUpload)

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    salvarPerfil()
  })

  const telefoneInput = document.getElementById("perfil-telefone")
  telefoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    } else if (value.length >= 7) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
    }
    e.target.value = value
  })
}

function handleFotoUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith("image/")) {
    alert("Por favor, selecione apenas arquivos de imagem.")
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("A imagem deve ter no máximo 2MB.")
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const fotoImg = document.getElementById("foto-perfil-img")
    const fotoPlaceholder = document.getElementById("foto-placeholder")

    fotoImg.src = e.target.result
    fotoImg.style.display = "block"
    fotoPlaceholder.style.display = "none"

    currentUser.fotoPerfil = e.target.result
  }

  reader.readAsDataURL(file)
}

async function salvarPerfil() {
  const nome = document.getElementById("perfil-nome-input").value.trim()
  const email = document.getElementById("perfil-email-input").value.trim()
  const telefone = document.getElementById("perfil-telefone").value.trim()
  const dataNascimento = document.getElementById("perfil-nascimento").value
  const senhaAtual = document.getElementById("senha-atual").value
  const novaSenha = document.getElementById("nova-senha").value

  if (!nome || !email) {
    alert("Por favor, preencha nome e email.")
    return
  }

  if (novaSenha && !senhaAtual) {
    alert("Para alterar a senha, digite a senha atual.")
    return
  }

  if (novaSenha && novaSenha.length < 6) {
    alert("A nova senha deve ter pelo menos 6 caracteres.")
    return
  }

  const dadosAtualizacao = {
    nome,
    email,
    telefone,
    dataNascimento,
    fotoPerfil: currentUser.fotoPerfil || "",
  }

  if (novaSenha) {
    dadosAtualizacao.senhaAtual = senhaAtual
    dadosAtualizacao.novaSenha = novaSenha
  }

  try {
    const submitBtn = document.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Salvando...'
    submitBtn.disabled = true

    const response = await fetch(`${API_BASE_URL}/user/${currentUser.id}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosAtualizacao),
    })

    const result = await response.json()

    if (result.success) {
      currentUser = result.usuario
      localStorage.setItem("organiz-user", JSON.stringify(currentUser))

      document.getElementById("senha-atual").value = ""
      document.getElementById("nova-senha").value = ""

      window.organiz.showNotification("Perfil atualizado com sucesso!", "success")

      displayUserProfile()
      updateUserName()
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error("Erro ao salvar perfil:", error)
    alert("Erro ao conectar com o servidor. Tente novamente.")
  } finally {
    const submitBtn = document.querySelector('button[type="submit"]')
    submitBtn.innerHTML = '<i class="fas fa-save me-2"></i>Salvar Alterações'
    submitBtn.disabled = false
  }
}

function updateUserName() {
  const userNameElement = document.getElementById("user-name")
  if (userNameElement && currentUser) {
    userNameElement.textContent = currentUser.nome || currentUser.email
  }
}

