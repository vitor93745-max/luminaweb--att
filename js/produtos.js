// Produtos: monta os cards, filtros e ações do carrinho.
(function () {
  const grade = document.getElementById("grade");
  const vazio = document.getElementById("vazio");
  const filtro = document.getElementById("filtro");
  const filtroTexto = document.getElementById("filtro-texto");
  const contagem = document.getElementById("contagem");

  function classeCategoria(categoria) {
    const mapa = {
      "Facial": "cat-facial",
      "Elétricos": "cat-eletricos",
      "Maquiagem": "cat-maquiagem",
      "Higiene e cuidados": "cat-higiene",
      "Depilação e estética": "cat-depilacao",
      "Unha": "cat-unha"
    };
    return mapa[categoria] || "cat-cabelo";
  }

  function criarCard(produto) {
    const card = document.createElement("article");
    card.className = "prod";
    card.innerHTML =
      '<div class="produto-visual"><span class="tag"></span><span class="produto-embalagem" aria-hidden="true"></span></div>' +
      '<small></small><h3></h3><button class="big" type="button">Adicionar à sacola <span aria-hidden="true">＋</span></button>';

    const visual = card.querySelector(".produto-visual");
    visual.classList.add(classeCategoria(produto.categoria));

    // a embalagem mostra o nome da marca e usa a forma e a cor do produto (veja dados.js)
    const embalagem = card.querySelector(".produto-embalagem");
    embalagem.textContent = produto.marca;
    if (produto.forma) embalagem.dataset.forma = produto.forma;
    if (produto.cor) visual.style.setProperty("--cor", produto.cor);
    card.querySelector(".tag").textContent = produto.categoria;
    card.querySelector("small").textContent = produto.marca;
    card.querySelector("h3").textContent = produto.nome;

    const botao = card.querySelector("button");
    botao.addEventListener("click", function () {
      Lumi.carrinho.adicionar(produto.id);
      botao.innerHTML = 'Adicionado <span aria-hidden="true">✓</span>';
      botao.classList.add("adicionado");
      botao.setAttribute("aria-label", produto.nome + " adicionado à sacola");
      window.setTimeout(function () {
        botao.innerHTML = 'Adicionar à sacola <span aria-hidden="true">＋</span>';
        botao.classList.remove("adicionado");
        botao.setAttribute("aria-label", "Adicionar " + produto.nome + " à sacola");
      }, 1400);
    });
    botao.setAttribute("aria-label", "Adicionar " + produto.nome + " à sacola");
    return card;
  }

  document.getElementById("filtro-limpar").addEventListener("click", function () {
    Lumi.busca.limpar();
  });

  Lumi.produtosView = {
    mostrar(lista, rotulo) {
      grade.replaceChildren(...lista.map(criarCard));
      vazio.hidden = lista.length > 0;
      contagem.textContent = lista.length + (lista.length === 1 ? " produto" : " produtos");
      filtro.hidden = !rotulo;
      filtroTexto.textContent = rotulo || "";
    }
  };
})();
