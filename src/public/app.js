const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const botaoSalvar = document.getElementById('salvar');

if (id !== null) {
  fetch(`http://localhost:3000/pastas/${id}`)
    .then(res => res.json())
    .then(pasta => {
      if (pasta) {
        document.getElementById('input-nome').value = pasta.nome;
        document.querySelector('.cor').value = pasta.cor;
        document.querySelector('.inputdes').value = pasta.descricao;

        document.getElementById('quadrado').style.backgroundColor = pasta.cor;
        document.getElementById('cor-preview').style.backgroundColor = pasta.cor;
        document.getElementById('titulo-nome').textContent = pasta.nome;
      }
    });
}

botaoSalvar.addEventListener('click', async function () {
  const nome = document.getElementById('input-nome').value.trim();
  const cor = document.querySelector('.cor').value;
  const descricao = document.querySelector('.inputdes').value.trim();

  if (!nome) {
    alert('Por favor, preencha o nome antes de salvar.');
    return;
  }

  const novaPasta = {
    nome,
    cor,
    descricao,
    notas: [],
    imagens: []
  };

  if (id !== null) {
    await fetch(`http://localhost:3000/pastas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaPasta)
    });
  } else {
    await fetch('http://localhost:3000/pastas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaPasta)
    });
  }

  window.location.href = 'pastas.html';
});
