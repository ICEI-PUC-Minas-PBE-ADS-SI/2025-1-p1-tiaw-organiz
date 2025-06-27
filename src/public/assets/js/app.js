class OrganiZ {
  constructor() {
    console.log("🏗️ Construindo OrganiZ...")

    this.baseURL = "http://localhost:3000/api"
    this.currentUser = null
    this.data = {
      pastas: [],
      metas: [],
      configuracoes: {
        tema: "light",
        ultimaAtualizacao: new Date().toISOString(),
      },
    }
    this.isInitialized = false

    this.init().catch((error) => {
      console.error("❌ Erro na inicialização do OrganiZ:", error)
    })
  }

  async init() {
    try {
      console.log("🚀 Iniciando OrganiZ...")
      await this.checkAuth()
      this.setupEventListeners()
      this.applyTheme()
      this.isInitialized = true
      console.log("✅ OrganiZ inicializado com sucesso!")
    } catch (error) {
      console.error("❌ Erro na inicialização:", error)
      this.isInitialized = true
    }
  }

  async checkAuth() {
    console.log("🔐 Verificando autenticação...")

    const userData = localStorage.getItem("organiz-user")
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData)
        console.log("✅ Usuário encontrado:", this.currentUser.nome)
        await this.loadUserData()
      } catch (error) {
        console.error("❌ Erro ao processar dados do usuário:", error)
        localStorage.removeItem("organiz-user")
        this.redirectToLogin()
      }
    } else {
      console.log("❌ Usuário não encontrado")
      this.redirectToLogin()
    }
  }

  redirectToLogin() {
    if (
      !window.location.pathname.includes("login") &&
      !window.location.pathname.includes("registro") &&
      !window.location.pathname.includes("debug")
    ) {
      console.log("🔄 Redirecionando para login...")
      window.location.href = "/login.html"
    }
  }

  async loadUserData() {
    if (!this.currentUser) {
      console.log("❌ Nenhum usuário para carregar dados")
      return
    }

    try {
      console.log("📡 Carregando dados do usuário:", this.currentUser.id)

      const response = await fetch(`${this.baseURL}/user/${this.currentUser.id}/data`, {
        method: "GET",
      })

      console.log("📡 Resposta do servidor:", response.status)

      if (!response.ok) {
        throw new Error(`Servidor retornou: ${response.status}`)
      }

      const result = await response.json()
      console.log("📡 Dados recebidos:", result)

      if (result.success) {
        this.data = result.data
        console.log("✅ Dados carregados com sucesso:", this.data)

        if (this.data.configuracoes && this.data.configuracoes.tema) {
          this.applyTheme()
        }
      } else {
        throw new Error(result.message || "Erro desconhecido do servidor")
      }
    } catch (error) {
      console.error("❌ Erro ao conectar com servidor:", error)

      this.data = {
        pastas: [],
        metas: [],
        configuracoes: {
          tema: "light",
          ultimaAtualizacao: new Date().toISOString(),
        },
      }

      console.log("⚠️ Usando dados padrão devido ao erro")
      this.showNotification("Usando modo offline - alguns recursos podem não funcionar", "warning")
    }
  }

  async saveData() {
    if (!this.currentUser) {
      console.log("Usuário não encontrado para salvar dados")
      return
    }

    console.log("Salvando dados no servidor...", this.data)

    try {
      localStorage.setItem(`organiz-data-${this.currentUser.id}`, JSON.stringify(this.data))
      console.log("Dados salvos localmente como backup")

      const response = await fetch(`${this.baseURL}/user/${this.currentUser.id}/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: this.data }),
      })

      console.log("Resposta do servidor:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Resultado do servidor:", result)

      if (!result.success) {
        console.error("Erro ao salvar dados:", result.message)
        this.showNotification("Erro ao salvar no servidor, dados salvos localmente", "warning")
      } else {
        console.log("Dados salvos no servidor com sucesso")
      }
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      this.showNotification("Erro ao salvar no servidor, dados salvos localmente", "warning")
    }
  }

  setupEventListeners() {
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }

    const searchInput = document.getElementById("search-input")
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value))
    }
  }

  toggleTheme() {
    const currentTheme = this.data.configuracoes.tema
    const newTheme = currentTheme === "light" ? "dark" : "light"
    this.data.configuracoes.tema = newTheme
    this.applyTheme()
    this.saveData()
  }

  applyTheme() {
    const theme = this.data.configuracoes.tema
    const themeToggle = document.getElementById("theme-toggle")

    if (theme === "dark") {
      document.body.classList.add("dark-mode")
      if (themeToggle) themeToggle.innerHTML = "☀️"
    } else {
      document.body.classList.remove("dark-mode")
      if (themeToggle) themeToggle.innerHTML = "🌙"
    }
  }

  handleSearch(term) {
    const results = this.searchPastas(term)
    this.displaySearchResults(results)
  }

  searchPastas(term) {
    if (!term.trim()) return []

    const searchTerm = term.toLowerCase()
    return this.data.pastas.filter(
      (pasta) => pasta.nome.toLowerCase().includes(searchTerm) || pasta.descricao.toLowerCase().includes(searchTerm),
    )
  }

  displaySearchResults(results) {
    const container = document.getElementById("search-results")
    if (!container) return

    if (results.length === 0 && document.getElementById("search-input").value.trim()) {
      container.innerHTML = '<p class="text-muted small mt-2">Nenhuma pasta encontrada</p>'
      return
    }

    if (results.length === 0) {
      container.innerHTML = ""
      return
    }

    container.innerHTML = `
      <div class="mt-3 p-3 rounded" style="background-color: rgba(255,255,255,0.1);">
        <small class="text-muted">Resultados (${results.length})</small>
        <div class="mt-2">
          ${results
            .map(
              (pasta) => `
            <a href="pasta-detalhes.html?id=${pasta.id}" class="d-block text-decoration-none mb-2 p-2 rounded" style="background-color: rgba(255,255,255,0.1);">
              <div class="d-flex align-items-center">
                <span class="pasta-color me-2" style="background-color: ${pasta.cor}; width: 12px; height: 12px; border-radius: 2px;"></span>
                <div>
                  <div class="text-white fw-bold small">${pasta.nome}</div>
                  <small class="text-muted">${pasta.descricao}</small>
                </div>
              </div>
            </a>
          `,
            )
            .join("")}
        </div>
      </div>
    `
  }

  createPasta(pastaData) {
    console.log("Criando pasta:", pastaData)

    const novaPasta = {
      id: Date.now().toString(),
      ...pastaData,
      notas: [],
      imagens: [],
      tarefas: [],
      createdAt: new Date().toISOString(),
    }

    console.log("Nova pasta criada:", novaPasta)

    this.data.pastas.push(novaPasta)
    console.log("Pastas após adicionar:", this.data.pastas.length)

    this.saveData()
    this.showNotification("Pasta criada com sucesso!", "success")
    return novaPasta
  }

  updatePasta(id, updates) {
    const index = this.data.pastas.findIndex((pasta) => pasta.id === id)
    if (index !== -1) {
      this.data.pastas[index] = { ...this.data.pastas[index], ...updates }
      this.saveData()
      this.showNotification("Pasta atualizada com sucesso!", "success")
      return this.data.pastas[index]
    }
    return null
  }

  deletePasta(id) {
    const index = this.data.pastas.findIndex((pasta) => pasta.id === id)
    if (index !== -1) {
      this.data.pastas.splice(index, 1)
      this.saveData()
      this.showNotification("Pasta excluída com sucesso!", "success")
      return true
    }
    return false
  }

  getPasta(id) {
    return this.data.pastas.find((pasta) => pasta.id === id)
  }

  getAllPastas() {
    return this.data.pastas
  }

  createMeta(metaData) {
    const novaMeta = {
      id: Date.now().toString(),
      ...metaData,
      createdAt: new Date().toISOString(),
    }

    this.data.metas.push(novaMeta)
    this.saveData()
    this.showNotification("Meta criada com sucesso!", "success")
    return novaMeta
  }

  updateMeta(id, updates) {
    const index = this.data.metas.findIndex((meta) => meta.id === id)
    if (index !== -1) {
      this.data.metas[index] = { ...this.data.metas[index], ...updates }
      this.saveData()
      this.showNotification("Meta atualizada com sucesso!", "success")
      return this.data.metas[index]
    }
    return null
  }

  deleteMeta(id) {
    const index = this.data.metas.findIndex((meta) => meta.id === id)
    if (index !== -1) {
      this.data.metas.splice(index, 1)
      this.saveData()
      this.showNotification("Meta excluída com sucesso!", "success")
      return true
    }
    return false
  }

  getAllMetas() {
    return this.data.metas
  }

  getAllTarefas() {
    const tarefas = []
    this.data.pastas.forEach((pasta) => {
      if (pasta.tarefas) {
        tarefas.push(...pasta.tarefas)
      }
    })
    return tarefas
  }

  getTarefasByDate(date) {
    const dateStr = date.toISOString().split("T")[0]
    return this.getAllTarefas().filter((tarefa) => {
      const tarefaDate = new Date(tarefa.data).toISOString().split("T")[0]
      return tarefaDate === dateStr
    })
  }

  logout() {
    localStorage.removeItem("organiz-user")
    localStorage.removeItem(`organiz-data-${this.currentUser?.id}`)
    this.currentUser = null
    window.location.href = "/login.html"
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification alert alert-${type === "error" ? "danger" : type} alert-dismissible fade show`
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  formatDateTime(date) {
    return new Date(date).toLocaleString("pt-BR")
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  async waitForInit() {
    while (!this.isInitialized) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return this
  }

  debug() {
    console.log("🐛 DEBUG OrganiZ:")
    console.log("- Usuário atual:", this.currentUser)
    console.log("- Dados:", this.data)
    console.log("- Inicializado:", this.isInitialized)
    console.log("- URL base:", this.baseURL)
  }
}

class Calendar {
  constructor(containerId, organiz) {
    this.container = document.getElementById(containerId)
    this.organiz = organiz
    this.currentDate = new Date()
    this.today = new Date()
    this.init()
  }

  async init() {
    if (this.container) {
      await this.organiz.waitForInit()
      this.render()
      this.setupEventListeners()
    }
  }

  setupEventListeners() {
    const prevBtn = this.container.querySelector(".calendar-prev")
    const nextBtn = this.container.querySelector(".calendar-next")

    if (prevBtn) prevBtn.addEventListener("click", () => this.previousMonth())
    if (nextBtn) nextBtn.addEventListener("click", () => this.nextMonth())
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1)
    this.render()
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1)
    this.render()
  }

  render() {
    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]

    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

    let html = `
      <div class="calendar-container">
        <div class="calendar-header">
          <button class="calendar-nav calendar-prev">‹</button>
          <h4 class="mb-0">${monthNames[month]} ${year}</h4>
          <button class="calendar-nav calendar-next">›</button>
        </div>
        <div class="calendar-grid">
    `

    dayNames.forEach((day) => {
      html += `<div class="calendar-day-header">${day}</div>`
    })

    const currentDate = new Date(startDate)
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === month
      const isToday = this.isSameDay(currentDate, this.today)
      const tarefas = this.organiz.getTarefasByDate(currentDate)

      let dayClass = "calendar-day"
      if (!isCurrentMonth) dayClass += " other-month"
      if (isToday) dayClass += " today"

      html += `
        <div class="${dayClass}" data-date="${currentDate.toISOString().split("T")[0]}">
          <div class="fw-bold">${currentDate.getDate()}</div>
      `

      const tarefasNaoConcluidas = tarefas.filter((t) => !t.concluida).sort(this.sortByPriority)
      tarefasNaoConcluidas.slice(0, 2).forEach((tarefa) => {
        const priorityClass = tarefa.prioridade ? `priority-${tarefa.prioridade}` : "priority-media"
        html += `<div class="task-indicator ${priorityClass}" title="${tarefa.titulo} (${tarefa.prioridade || "média"})">${tarefa.titulo}</div>`
      })

      if (tarefasNaoConcluidas.length > 2) {
        html += `<div class="task-indicator priority-media">+${tarefasNaoConcluidas.length - 2} mais</div>`
      }

      html += "</div>"
      currentDate.setDate(currentDate.getDate() + 1)
    }

    html += "</div></div>"
    this.container.innerHTML = html
    this.setupEventListeners()
  }

  sortByPriority(a, b) {
    const prioridadeOrder = { alta: 3, media: 2, baixa: 1 }
    const prioridadeA = prioridadeOrder[a.prioridade] || 2
    const prioridadeB = prioridadeOrder[b.prioridade] || 2
    return prioridadeB - prioridadeA
  }

  isSameDay(date1, date2) {
    return date1.toDateString() === date2.toDateString()
  }
}

console.log("📄 Script app.js carregado")

let organiz
let calendar

function createOrganiZ() {
  try {
    console.log("🏗️ Criando instância do OrganiZ...")
    organiz = new OrganiZ()

    window.organiz = organiz
    window.OrganiZ = OrganiZ
    window.Calendar = Calendar

    console.log("✅ Instância criada com sucesso!")
    return organiz
  } catch (error) {
    console.error("❌ Erro ao criar OrganiZ:", error)
    return null
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("📄 DOMContentLoaded - Inicializando OrganiZ...")

  if (!organiz) {
    organiz = createOrganiZ()
  }

  if (organiz) {
    await organiz.waitForInit()

    const calendarContainer = document.getElementById("calendar-container")
    if (calendarContainer) {
      console.log("📅 Inicializando calendário...")
      calendar = new Calendar("calendar-container", organiz)
    }

    console.log("🎉 Sistema pronto!")
  } else {
    console.error("❌ Falha ao inicializar o sistema")
  }
})

window.OrganiZ = OrganiZ
window.Calendar = Calendar

if (document.readyState === "loading") {
} else {
  setTimeout(() => {
    if (!organiz) {
      organiz = createOrganiZ()
      window.organiz = organiz
    }
  }, 100)
}
