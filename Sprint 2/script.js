const diary = document.getElementById("diary");
const linesPerPage = 15;

function createLine(text = "", isLast = false) {
  const div = document.createElement("div");
  div.className = "line";
  div.contentEditable = "true";
  div.textContent = text;
  if (isLast) {
    div.addEventListener("input", handleLastLineInput);
  }
  return div;
}

function createPage(linesData = []) {
  const page = document.createElement("div");
  page.className = "page";

  for (let i = 0; i < linesPerPage; i++) {
    const isLast = i === linesPerPage - 1;
    const lineText = linesData[i] || "";
    page.appendChild(createLine(lineText, isLast));
  }

  diary.appendChild(page);
}

function handleLastLineInput(e) {
  const line = e.target;
  
  line.removeEventListener("input", handleLastLineInput);
  createPage();
}

function saveToJSON() {
  const pages = [];
  const allPages = document.querySelectorAll(".page");

  allPages.forEach(page => {
    const lines = [];
    page.querySelectorAll(".line").forEach(line => {
      lines.push(line.textContent);
    });
    pages.push(lines);
  });

  const data = { pages };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "diario.json";
  a.click();
  URL.revokeObjectURL(url);
}

function loadFromJSON(data) {
  diary.innerHTML = ""; 
  if (!data.pages || !Array.isArray(data.pages)) {
    alert("Formato JSON inválido");
    return;
  }
  data.pages.forEach(pageLines => {
    createPage(pageLines);
  });
}


const loadFileInput = document.getElementById("loadFile");
loadFileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = event => {
    try {
      const data = JSON.parse(event.target.result);
      loadFromJSON(data);
    } catch {
      alert("Arquivo JSON inválido ou corrompido.");
    }
  };
  reader.readAsText(file);
});


createPage();
