let metas = JSON.parse(localStorage.getItem('metas')) || [];

const lista = document.getElementById('listaMetas');
const form = document.getElementById('formulario');
let editandoIndex = null;

// Seleção de ícones
const iconeInput = document.getElementById('icone');

function salvarNoLocalStorage() {
  localStorage.setItem('metas', JSON.stringify(metas));
}

// Função que renderiza (exibe) todas as metas na tela
function renderizarMetas() {
  lista.innerHTML = '';
  metas.forEach((meta, index) => {
    const div = document.createElement('div');
    div.className = 'meta';

    div.innerHTML = `
      <div class="meta-info">
        <strong>${meta.icone} Meta ${meta.categoria}</strong>
        ${meta.descricao}
      </div>
      <div class="botoes-acao">
        <button class="editar" onclick="iniciarEdicao(${index})">✏️</button>
        <button onclick="removerMeta(${index})">🗑️</button>
      </div>
    `;

    lista.appendChild(div);
  });
}

// Função para salvar uma nova meta ou atualizar uma existente
function salvarMeta() {
  const categoria = document.getElementById('categoria').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const icone = iconeInput.value || '🎯';

  if (categoria && descricao) {
    if (editandoIndex !== null) {
      metas[editandoIndex] = { categoria, descricao, icone };
      editandoIndex = null;
    } else {
      metas.push({ categoria, descricao, icone });
    }

    salvarNoLocalStorage();
    limparFormulario();
    renderizarMetas();
  } else {
    alert("Preencha todos os campos!");
  }
}

// Função para iniciar a edição de uma meta
function iniciarEdicao(index) {
  const meta = metas[index];
  document.getElementById('categoria').value = meta.categoria;
  document.getElementById('descricao').value = meta.descricao;
  document.getElementById('icone').value = meta.icone;
  document.getElementById('formulario').style.display = 'block';
  document.getElementById('tituloFormulario').innerText = 'Editar Meta';
  editandoIndex = index;
}

// Função para remover uma meta
function removerMeta(index) {
  if (confirm("Deseja realmente remover essa meta?")) {
    metas.splice(index, 1);
    salvarNoLocalStorage();
    renderizarMetas();
  }
}

function limparFormulario() {
  document.getElementById('categoria').value = '';
  document.getElementById('descricao').value = '';
  iconeInput.value = '';
  form.style.display = 'none';
}

document.getElementById('adicionar').onclick = () => {
  limparFormulario();
  form.style.display = 'block';
  document.getElementById('tituloFormulario').innerText = 'Nova Meta';
};

document.getElementById('voltar').onclick = () => {
  alert("Parte de outro integrante...");
};

// Inicializa
renderizarMetas();