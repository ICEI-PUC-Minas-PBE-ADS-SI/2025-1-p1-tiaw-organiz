localStorage.setItem('pasta', JSON.stringify({
    nome: nome,
    cor: cor,
    descricao: descricao
}));

//edição de pasta:
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

if (id !== null) {
    const pastas = JSON.parse(localStorage.getItem('pastas')) || [];
    const pasta = pastas[id];

    if (pasta) {
        document.getElementById('input-nome').value = pasta.nome;
        document.querySelector('.cor').value = pasta.cor;
        document.querySelector('.inputdes').value = pasta.descricao;

        // Atualizar visual
        document.getElementById('quadrado').style.backgroundColor = pasta.cor;
        document.getElementById('cor-preview').style.backgroundColor = pasta.cor;
        document.getElementById('titulo-nome').textContent = pasta.nome;
    }
}

//salvar ou sobreescrever se for editar:
botaoSalvar.addEventListener('click', function () {
    const nome = document.getElementById('input-nome').value.trim();
    const cor = document.querySelector('.cor').value;
    const descricao = document.querySelector('.inputdes').value.trim();

    if (!nome) {
        alert('Por favor, preencha o nome antes de salvar.');
        return;
    }

    let pastas = JSON.parse(localStorage.getItem('pastas')) || [];

    const novaPasta = { nome, cor, descricao };

    if (id !== null) {
        // Edição: sobrescreve a pasta existente
        pastas[id] = novaPasta;
    } else {
        // Nova criação: adiciona no fim
        pastas.push(novaPasta);
    }

    localStorage.setItem('pastas', JSON.stringify(pastas));
    window.location.href = 'pastas.html';
});

