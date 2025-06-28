function buscar() {
  const valor = document.getElementById("searchInput").value.toLowerCase();
  if (valor === "teste 1") {
    window.location.href = "teste1.html";
  } else if (valor === "teste 2") {
    window.location.href = "teste2.html";
  } else {
    document.getElementById("mensagem").textContent = "Página não encontrada.";
  }
}
