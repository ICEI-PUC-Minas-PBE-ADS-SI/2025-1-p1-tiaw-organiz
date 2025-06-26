// Perfil básico
const API_PERFIS = "/perfis"

function getUsuarioCorrente() {
  const usuarioJSON = sessionStorage.getItem("usuarioCorrente")
  return usuarioJSON ? JSON.parse(usuarioJSON) : null
}

function carregarPerfil() {
  const usuario = getUsuarioCorrente()
  if (!usuario) {
    alert("Usuário não logado")
    window.location.href = "modulos/login/login.html"
    return
  }

  fetch(API_PERFIS + "?usuarioId=" + usuario.id)
    .then((response) => response.json())
    .then((perfis) => {
      var perfil
      if (perfis.length > 0) {
        perfil = perfis[0]
      } else {
        perfil = {
          usuarioId: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          dataNascimento: "2000-01-01",
        }

        fetch(API_PERFIS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(perfil),
        })
          .then((response) => response.json())
          .then((novoPerfil) => {
            perfil = novoPerfil
            preencherCampos(perfil)
          })
        return
      }

      preencherCampos(perfil)
    })
    .catch((error) => {
      console.error("Erro ao carregar perfil:", error)
      alert("Erro ao carregar perfil")
    })
}

function preencherCampos(perfil) {
  document.getElementById("nome").value = perfil.nome || ""
  document.getElementById("email").value = perfil.email || ""
  document.getElementById("dataNascimento").value = perfil.dataNascimento || ""
  window.perfilId = perfil.id
}

function habilitarCampo(id) {
  const campo = document.getElementById(id)
  campo.disabled = false
  campo.focus()
}

function salvarPerfil() {
  const usuario = getUsuarioCorrente()
  if (!usuario) {
    alert("Usuário não logado")
    return
  }

  const dados = {
    usuarioId: usuario.id,
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    dataNascimento: document.getElementById("dataNascimento").value,
  }

  fetch(API_PERFIS + "/" + window.perfilId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then((response) => {
      if (response.ok) {
        alert("Perfil salvo com sucesso!")
        document.getElementById("nome").disabled = true
        document.getElementById("email").disabled = true
        document.getElementById("dataNascimento").disabled = true
      } else {
        throw new Error("Erro ao salvar")
      }
    })
    .catch((error) => {
      console.error("Erro ao salvar perfil:", error)
      alert("Erro ao salvar perfil")
    })
}

window.onload = () => {
  carregarPerfil()
}
