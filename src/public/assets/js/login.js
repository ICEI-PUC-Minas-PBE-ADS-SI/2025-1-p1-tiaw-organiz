
async function registrarUsuario(e) {
  e.preventDefault();

  const inputs = document.querySelectorAll("form input");
  const nome = inputs[0].value.trim();
  const sobrenome = inputs[1].value.trim();
  const usuario = inputs[2].value.trim();
  const email = inputs[3].value.trim();
  const senha = inputs[4].value;
  const confirmar = inputs[5].value;

  if (senha !== confirmar) {
    alert("As senhas não coincidem!");
    return;
  }

  const res = await fetch('http://localhost:3000/usuarios');
  const usuarios = await res.json();

  const existe = usuarios.some(u => u.email === email || u.usuario === usuario);
  if (existe) {
    alert("Usuário já existe com este email ou nome de usuário.");
    return;
  }

  await fetch('http://localhost:3000/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, sobrenome, usuario, email, senha })
  });

  alert("Registro realizado com sucesso!");
  window.location.href = "login.html";
}



async function logarUsuario(e) {
  e.preventDefault();

  const email = document.querySelectorAll("form input")[0].value.trim();
  const senha = document.querySelectorAll("form input")[1].value;

  const res = await fetch(`http://localhost:3000/usuarios?email=${email}&senha=${senha}`);
  const usuarios = await res.json();

  if (usuarios.length > 0) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarios[0]));
    window.location.href = "/src/public/about.html";
  } else {
    alert("Email ou senha incorretos.");
  }
}



document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-theme');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggleButton) toggleButton.textContent = '🌞';
  } else {
    if (toggleButton) toggleButton.textContent = '🌙';
  }

  toggleButton?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    toggleButton.textContent = isDark ? '🌞' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});
