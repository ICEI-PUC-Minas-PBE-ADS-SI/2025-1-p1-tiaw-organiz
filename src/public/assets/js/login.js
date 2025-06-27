const API_BASE_URL = "http://localhost:3000/api"

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("organiz-theme") || "light"
  applyTheme(savedTheme)

  const themeToggle = document.getElementById("toggle-theme")
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }
})

async function logarUsuario(event) {
  event.preventDefault()

  const form = event.target
  const email = form.querySelector('input[type="email"]').value
  const senha = form.querySelector('input[type="password"]').value
  let originalText = ""

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos!")
    return
  }

  try {
    const submitBtn = form.querySelector('button[type="submit"]')
    originalText = submitBtn.textContent
    submitBtn.textContent = "Entrando..."
    submitBtn.disabled = true

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    })

    const result = await response.json()

    if (result.success) {
      localStorage.setItem("organiz-user", JSON.stringify(result.usuario))

      window.location.href = "/index.html"
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    alert("Erro ao conectar com o servidor. Tente novamente.")
  } finally {
    const submitBtn = form.querySelector('button[type="submit"]')
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }
}

async function registrarUsuario(event) {
  event.preventDefault()

  const form = event.target
  const inputs = form.querySelectorAll("input")
  const [nome, sobrenome, username, email, senha, confirmarSenha] = Array.from(inputs).map((input) => input.value)
  let originalText = ""

  if (!nome || !sobrenome || !username || !email || !senha || !confirmarSenha) {
    alert("Por favor, preencha todos os campos!")
    return
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!")
    return
  }

  if (senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres!")
    return
  }

  if (!isValidEmail(email)) {
    alert("Por favor, insira um email válido!")
    return
  }

  try {
    const submitBtn = form.querySelector('button[type="submit"]')
    originalText = submitBtn.textContent
    submitBtn.textContent = "Registrando..."
    submitBtn.disabled = true

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        sobrenome,
        username,
        email,
        senha,
      }),
    })

    const result = await response.json()

    if (result.success) {
      alert("Usuário registrado com sucesso! Faça login para continuar.")
      window.location.href = "/login.html"
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    alert("Erro ao conectar com o servidor. Tente novamente.")
  } finally {
    const submitBtn = form.querySelector('button[type="submit"]')
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light"
  const newTheme = currentTheme === "light" ? "dark" : "light"

  applyTheme(newTheme)
  localStorage.setItem("organiz-theme", newTheme)
}

function applyTheme(theme) {
  const themeToggle = document.getElementById("toggle-theme")

  if (theme === "dark") {
    document.body.classList.add("dark-mode")
    if (themeToggle) themeToggle.textContent = "☀️"
  } else {
    document.body.classList.remove("dark-mode")
    if (themeToggle) themeToggle.textContent = "🌙"
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function checkIfLoggedIn() {
  const userData = localStorage.getItem("organiz-user")
  if (userData && (window.location.pathname.includes("login") || window.location.pathname.includes("registro"))) {
    window.location.href = "/index.html"
  }
}

checkIfLoggedIn()
