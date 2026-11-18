// Página de login: alterna entre "Entrar" e "Criar conta", valida os campos e usa Lumi.usuario.
// Demonstração: as contas ficam só neste navegador (veja js/usuario.js).
(function () {
  const abaEntrar = document.getElementById("aba-entrar");
  const abaCriar = document.getElementById("aba-criar");
  const formEntrar = document.getElementById("form-entrar");
  const formCriar = document.getElementById("form-criar");

  // se já está logado, vai direto para o início
  if (Lumi.usuario.atual()) {
    window.location.replace("index.html");
    return;
  }

  function mostrarAba(entrar) {
    formEntrar.hidden = !entrar;
    formCriar.hidden = entrar;
    abaEntrar.setAttribute("aria-selected", String(entrar));
    abaCriar.setAttribute("aria-selected", String(!entrar));
  }

  // Trava o botão enquanto a tarefa espera (evita cliques duplos criando duas contas)
  // e destrava no fim, mesmo que dê erro (o "finally" sempre roda).
  async function comBotaoTravado(form, tarefa) {
    const botao = form.querySelector('button[type="submit"]');
    if (botao.disabled) return;
    botao.disabled = true;
    try {
      await tarefa();
    } finally {
      botao.disabled = false;
    }
  }

  // Depois de cadastrar ou autenticar: salva a sessão e vai para o início.
  function concluir(resultado, campoErro) {
    if (!resultado.ok) {
      campoErro.textContent = resultado.erro;
    } else if (Lumi.usuario.entrar(resultado.nome, resultado.email)) {
      window.location.href = "index.html";
    } else {
      campoErro.textContent = "Não foi possível salvar o login neste navegador.";
    }
  }

  formEntrar.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    const erro = document.getElementById("erro-entrar");
    const email = formEntrar.email.value.trim();
    erro.textContent = "";

    if (!Lumi.usuario.emailValido(email)) {
      erro.textContent = "Digite um e-mail válido.";
    } else if (formEntrar.senha.value === "") {
      erro.textContent = "Digite sua senha.";
    } else {
      await comBotaoTravado(formEntrar, async function () {
        concluir(await Lumi.usuario.autenticar(email, formEntrar.senha.value), erro);
      });
    }
  });

  formCriar.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    const erro = document.getElementById("erro-criar");
    const nome = formCriar.nome.value.trim();
    const email = formCriar.email.value.trim();
    erro.textContent = "";

    if (nome === "") {
      erro.textContent = "Digite seu nome.";
    } else if (!Lumi.usuario.emailValido(email)) {
      erro.textContent = "Digite um e-mail válido.";
    } else if (formCriar.senha.value.length < 8) {
      erro.textContent = "A senha precisa ter pelo menos 8 caracteres.";
    } else {
      await comBotaoTravado(formCriar, async function () {
        concluir(await Lumi.usuario.cadastrar(nome, email, formCriar.senha.value), erro);
      });
    }
  });

  abaEntrar.addEventListener("click", function () {
    mostrarAba(true);
  });
  abaCriar.addEventListener("click", function () {
    mostrarAba(false);
  });
})();
