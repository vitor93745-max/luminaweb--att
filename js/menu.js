// Menu: abas que expandem para baixo, mostrando tipos e marcas de cada categoria.
(function () {
  const menu = document.getElementById("menu");
  const nav = document.getElementById("pills");
  const painel = document.getElementById("painel");
  const LARGURA_PAINEL = 290;
  let abaAberta = null;

  function fechar() {
    if (!abaAberta) return;
    abaAberta.classList.remove("aberta");
    abaAberta.setAttribute("aria-expanded", "false");
    painel.hidden = true;
    abaAberta = null;
  }

  function criarBotao(texto, aoClicar) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;
    botao.addEventListener("click", aoClicar);
    return botao;
  }

  function adicionarSecao(titulo, classe, botoes) {
    const cabecalho = document.createElement("h4");
    cabecalho.textContent = titulo;

    const caixa = document.createElement("div");
    caixa.className = classe;
    caixa.append(...botoes);

    painel.append(cabecalho, caixa);
  }

  // roda a ação do filtro, fecha o painel e leva a pessoa até os produtos
  function aplicar(acao) {
    acao();
    fechar();
    document.getElementById("produtos").scrollIntoView();
  }

  function montarPainel(item) {
    painel.replaceChildren();

    const titulo = document.createElement("h3");
    titulo.textContent = item.nome;
    painel.append(titulo);

    if (item.categoria) {
      const tudo = criarBotao("Ver tudo de " + item.nome, function () {
        aplicar(function () {
          Lumi.busca.categoria(item.categoria);
        });
      });
      const caixa = document.createElement("div");
      caixa.className = "lista";
      caixa.append(tudo);
      painel.append(caixa);
    }

    if (item.tipos.length) {
      adicionarSecao("Tipos", "lista", item.tipos.map(function (tipo) {
        return criarBotao(tipo, function () {
          aplicar(function () {
            Lumi.busca.limpar();
            Lumi.busca.texto(tipo);
            document.getElementById("busca").value = tipo;
          });
        });
      }));
    }

    if (item.marcas.length) {
      adicionarSecao("Marcas", "chips", item.marcas.map(function (marca) {
        return criarBotao(marca, function () {
          aplicar(function () {
            Lumi.busca.marca(marca);
          });
        });
      }));
    }
  }

  function abrir(botao, item) {
    fechar();
    montarPainel(item);
    painel.hidden = false;
    botao.classList.add("aberta");
    botao.setAttribute("aria-expanded", "true");
    abaAberta = botao;

    // no computador o painel fica embaixo da própria aba; no celular ocupa a largura toda
    if (window.innerWidth > 820) {
      const limite = menu.clientWidth - LARGURA_PAINEL;
      painel.style.left = Math.max(0, Math.min(botao.offsetLeft, limite)) + "px";
    } else {
      painel.style.left = "";
    }
  }

  Lumi.menu.forEach(function (item) {
    const aba = criarBotao(item.nome, function () {
      if (abaAberta === aba) {
        fechar();
      } else {
        abrir(aba, item);
      }
    });
    aba.setAttribute("aria-expanded", "false");
    aba.setAttribute("aria-controls", "painel");
    nav.append(aba);
  });

  document.addEventListener("click", function (evento) {
    if (!menu.contains(evento.target)) fechar();
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") fechar();
  });
})();
