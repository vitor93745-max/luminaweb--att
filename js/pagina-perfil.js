// Página do perfil: mostra e edita nome e e-mail, e permite sair da conta.
(function () {
  const usuario = Lumi.usuario.atual();

  // sem login, volta para a tela de entrar
  if (!usuario) {
    window.location.replace("login.html");
    return;
  }

  const form = document.getElementById("form-perfil");
  const erro = document.getElementById("erro-perfil");
  const ok = document.getElementById("ok-perfil");

  form.nome.value = usuario.nome;
  form.email.value = usuario.email;

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    ok.textContent = "";

    if (nome === "") {
      erro.textContent = "Digite seu nome.";
    } else if (!Lumi.usuario.emailValido(email)) {
      erro.textContent = "Digite um e-mail válido.";
    } else if (Lumi.usuario.entrar(nome, email)) {
      erro.textContent = "";
      ok.textContent = "Dados salvos.";
      document.getElementById("link-conta").textContent = "Olá, " + nome.split(" ")[0];
    } else {
      erro.textContent = "Não foi possível salvar neste navegador.";
    }
  });

  document.getElementById("sair").addEventListener("click", function () {
    Lumi.usuario.sair();
    window.location.href = "index.html";
  });
})();
