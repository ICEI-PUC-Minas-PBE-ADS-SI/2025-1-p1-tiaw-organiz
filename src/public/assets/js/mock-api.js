// Simulador de API para desenvolvimento sem JSON Server
class MockAPI {
  constructor() {
    this.initializeData()
  }

  initializeData() {
    // Inicializar dados se não existirem
    if (!localStorage.getItem("mock_usuarios")) {
      const usuarios = [
        { id: 1, login: "admin", senha: "123", nome: "Administrador do Sistema", email: "admin@abc.com" },
        { id: 2, login: "user", senha: "123", nome: "Usuario Comum", email: "user@abc.com" },
        { id: 3, login: "rommel", senha: "123", nome: "Rommel", email: "rommel@gmail.com" },
      ]
      localStorage.setItem("mock_usuarios", JSON.stringify(usuarios))
    }

    if (!localStorage.getItem("mock_perfis")) {
      const perfis = [
        { id: 1, usuarioId: 1, nome: "Administrador do Sistema", email: "admin@abc.com", dataNascimento: "1990-01-01" },
        { id: 2, usuarioId: 2, nome: "Usuario Comum", email: "user@abc.com", dataNascimento: "1995-05-15" },
        { id: 3, usuarioId: 3, nome: "Rommel", email: "rommel@gmail.com", dataNascimento: "2005-05-10" },
      ]
      localStorage.setItem("mock_perfis", JSON.stringify(perfis))
    }

    if (!localStorage.getItem("mock_eventos")) {
      const eventos = [
        { id: 1, usuarioId: 1, titulo: "Reunião de equipe", data: "2025-01-15", prioridade: "alta" },
        { id: 2, usuarioId: 2, titulo: "Consulta médica", data: "2025-01-20", prioridade: "media" },
      ]
      localStorage.setItem("mock_eventos", JSON.stringify(eventos))
    }
  }

  // Simular requisições HTTP
  async fetch(url, options = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const method = options.method || "GET"
        const [, endpoint, id] = url.match(/\/(\w+)(?:\/(\d+))?/) || []

        let result

        switch (method) {
          case "GET":
            result = this.handleGet(endpoint, id, url)
            break
          case "POST":
            result = this.handlePost(endpoint, JSON.parse(options.body))
            break
          case "PUT":
            result = this.handlePut(endpoint, id, JSON.parse(options.body))
            break
          case "DELETE":
            result = this.handleDelete(endpoint, id)
            break
        }

        resolve({
          ok: true,
          json: () => Promise.resolve(result),
        })
      }, 100) // Simular delay de rede
    })
  }

  handleGet(endpoint, id, fullUrl) {
    const data = JSON.parse(localStorage.getItem(`mock_${endpoint}`) || "[]")

    if (id) {
      return data.find((item) => item.id == id)
    }

    // Verificar se há query parameters
    if (fullUrl.includes("?")) {
      const params = new URLSearchParams(fullUrl.split("?")[1])
      const usuarioId = params.get("usuarioId")

      if (usuarioId) {
        return data.filter((item) => item.usuarioId == usuarioId)
      }
    }

    return data
  }

  handlePost(endpoint, newItem) {
    const data = JSON.parse(localStorage.getItem(`mock_${endpoint}`) || "[]")
    const newId = Math.max(...data.map((item) => item.id || 0), 0) + 1
    const itemWithId = { ...newItem, id: newId }

    data.push(itemWithId)
    localStorage.setItem(`mock_${endpoint}`, JSON.stringify(data))

    return itemWithId
  }

  handlePut(endpoint, id, updatedItem) {
    const data = JSON.parse(localStorage.getItem(`mock_${endpoint}`) || "[]")
    const index = data.findIndex((item) => item.id == id)

    if (index !== -1) {
      data[index] = { ...updatedItem, id: Number.parseInt(id) }
      localStorage.setItem(`mock_${endpoint}`, JSON.stringify(data))
      return data[index]
    }

    return null
  }

  handleDelete(endpoint, id) {
    const data = JSON.parse(localStorage.getItem(`mock_${endpoint}`) || "[]")
    const filteredData = data.filter((item) => item.id != id)

    localStorage.setItem(`mock_${endpoint}`, JSON.stringify(filteredData))

    return { success: true }
  }
}

// Substituir fetch global
const mockAPI = new MockAPI()
const originalFetch = window.fetch

window.fetch = function (url, options) {
  // Se a URL começar com / e for para nossa API mock
  if (
    typeof url === "string" &&
    url.startsWith("/") &&
    (url.includes("/usuarios") || url.includes("/perfis") || url.includes("/eventos"))
  ) {
    return mockAPI.fetch(url, options)
  }

  // Para outras URLs, usar fetch original
  return originalFetch.apply(this, arguments)
}
