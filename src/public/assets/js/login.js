// Sistema de login básico
const LOGIN_URL = "modulos/login/login.html"
let RETURN_URL = "index.html"
const API_URL = "/usuarios"

var db_usuarios = []
var usuarioCorrente = {}

function initLoginApp() {
  const pagina = window.location.pathname

  // Verificar se estamos na página de login
  if (!pagina.includes("login.html")) {
    sessionStorage.setItem("returnURL", pagina)
    RETURN_URL = pagina

    const usuarioJSON = sessionStorage.getItem("usuarioCorrente")
    if (usuarioJSON) {
      usuarioCorrente = JSON.parse(usuarioJSON)
    } else {
      window.location.href = LOGIN_URL
    }

    document.addEventListener("DOMContentLoaded", () => {
      showUserInfo("userInfo")
    })
  } else {
    const returnURL = sessionStorage.getItem("returnURL")
    RETURN_URL = returnURL || "index.html"

    carregarUsuarios(() => {
      console.log("Usuários carregados")
    })
  }
}

function carregarUsuarios(callback) {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      db_usuarios = data
      callback()
    })
    .catch((error) => {
      console.error("Erro ao carregar usuários:", error)
    })
}

function loginUser(login, senha) {
  for (var i = 0; i < db_usuarios.length; i++) {
    var usuario = db_usuarios[i]

    if (login === usuario.login && senha === usuario.senha) {
      usuarioCorrente.id = usuario.id
      usuarioCorrente.login = usuario.login
      usuarioCorrente.email = usuario.email
      usuarioCorrente.nome = usuario.nome

      sessionStorage.setItem("usuarioCorrente", JSON.stringify(usuarioCorrente))
      return true
    }
  }
  return false
}

function logoutUser() {
  sessionStorage.removeItem("usuarioCorrente")
  window.location = LOGIN_URL
}

function addUser(nome, login, senha, email) {
  const usuario = {
    login: login,
    senha: senha,
    nome: nome,
    email: email,
  }

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
    .then((response) => response.json())
    .then((data) => {
      db_usuarios.push(data)
      console.log("Usuário criado com sucesso")
    })
    .catch((error) => {
      console.error("Erro ao criar usuário:", error)
    })
}

function showUserInfo(element) {
  var elemUser = document.getElementById(element)
  if (elemUser) {
    elemUser.innerHTML =
      usuarioCorrente.nome +
      " (" +
      usuarioCorrente.login +
      ") " +
      '<a onclick="logoutUser()" style="cursor: pointer;">❌</a>'
  }
}

// Inicializar
initLoginApp()