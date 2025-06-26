// Calendário básico
const API_EVENTOS = "/eventos"

function getUsuarioCorrente() {
  const usuarioJSON = sessionStorage.getItem("usuarioCorrente")
  return usuarioJSON ? JSON.parse(usuarioJSON) : null
}

function getEventosSalvos() {
  const usuario = getUsuarioCorrente()
  if (!usuario) {
    return Promise.resolve([])
  }

  return fetch(API_EVENTOS + "?usuarioId=" + usuario.id)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erro ao carregar eventos:", error)
      return []
    })
}

function renderCalendar(year, month) {
  const calendar = document.getElementById("calendar")
  const monthYear = document.getElementById("month-year")

  const date = new Date(year, month)
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

  monthYear.textContent = monthNames[month] + " " + year
  calendar.innerHTML = ""

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  getEventosSalvos().then((eventos) => {
    // Dias vazios no início
    for (var i = 0; i < firstDay; i++) {
      const empty = document.createElement("div")
      empty.classList.add("day")
      calendar.appendChild(empty)
    }

    // Dias do mês
    for (var day = 1; day <= daysInMonth; day++) {
      const monthStr = (month + 1).toString().padStart(2, "0")
      const dayStr = day.toString().padStart(2, "0")
      const fullDate = year + "-" + monthStr + "-" + dayStr

      const dayEl = document.createElement("div")
      dayEl.classList.add("day")
      dayEl.innerHTML = "<span>" + day + "</span>"

      // Verificar se há evento neste dia
      for (var j = 0; j < eventos.length; j++) {
        if (eventos[j].data === fullDate) {
          dayEl.classList.add("com-evento")

          const dot = document.createElement("div")
          dot.classList.add("event-dot")

          if (eventos[j].prioridade === "alta") {
            dot.classList.add("dot-alta")
          } else if (eventos[j].prioridade === "media") {
            dot.classList.add("dot-media")
          } else if (eventos[j].prioridade === "baixa") {
            dot.classList.add("dot-baixa")
          }

          dayEl.title = eventos[j].titulo + " (" + eventos[j].prioridade + ")"
          dayEl.appendChild(dot)
          break
        }
      }

      calendar.appendChild(dayEl)
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date()
  renderCalendar(today.getFullYear(), today.getMonth())
})
