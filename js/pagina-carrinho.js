// Página do carrinho: lista os itens, altera quantidades e monta o pedido para o WhatsApp.
(function () {
  const lista = document.getElementById("lista");
  const resumo = document.getElementById("resumo");
  const totalItens = document.getElementById("total-itens");
  const finalizar = document.getElementById("finalizar");
  const TELEFONE = "5511937686392";

  function buscarProduto(id) {
    return Lumi.produtos.find(function (produto) {
      return produto.id === id;
    });
  }

  function criarLinha(item, produto) {
    const linha = document.createElement("div");
    linha.className = "item-carrinho";
    linha.innerHTML =
      '<div class="ph produto-visual"><span class="produto-embalagem" aria-hidden="true"></span></div>' +
      '<div class="item-info"><small></small><strong></strong></div>' +
      '<div class="quantidade">' +
        '<button type="button" aria-label="Diminuir quantidade">−</button>' +
        "<span></span>" +
        '<button type="button" aria-label="Aumentar quantidade">+</button>' +
      "</div>";

    const miniatura = linha.querySelector(".produto-visual");
    const classeVisual = { "Facial": "cat-facial", "Elétricos": "cat-eletricos", "Maquiagem": "cat-maquiagem", "Higiene e cuidados": "cat-higiene", "Depilação e estética": "cat-depilacao", "Unha": "cat-unha" }[produto.categoria] || "cat-cabelo";
    miniatura.classList.add(classeVisual);
    const embalagem = linha.querySelector(".produto-embalagem");
    embalagem.textContent = produto.marca;
    if (produto.forma) embalagem.dataset.forma = produto.forma;
    if (produto.cor) miniatura.style.setProperty("--cor", produto.cor);
    linha.querySelector("small").textContent = produto.marca;
    linha.querySelector("strong").textContent = produto.nome;
    linha.querySelector(".quantidade span").textContent = item.qtd;

    const botoes = linha.querySelectorAll(".quantidade button");
    botoes[0].addEventListener("click", function () {
      Lumi.carrinho.alterar(item.id, -1);
      desenhar();
    });
    botoes[1].addEventListener("click", function () {
      Lumi.carrinho.alterar(item.id, 1);
      desenhar();
    });

    return linha;
  }

  function montarMensagem(itens) {
    const linhas = itens.map(function (item) {
      const produto = buscarProduto(item.id);
      return "- " + item.qtd + "x " + produto.marca + " " + produto.nome;
    });
    return "Olá! Quero finalizar este pedido:\n" + linhas.join("\n");
  }

  function desenhar() {
    // ignora itens de produtos que não existem mais na loja
    const itens = Lumi.carrinho.itens().filter(function (item) {
      return buscarProduto(item.id);
    });

    lista.replaceChildren();

    if (itens.length === 0) {
      lista.innerHTML = '<p class="vazio">Seu carrinho está vazio. <a href="index.html#produtos"><strong>Ver produtos</strong></a></p>';
      resumo.hidden = true;
      return;
    }

    itens.forEach(function (item) {
      lista.append(criarLinha(item, buscarProduto(item.id)));
    });

    totalItens.textContent = Lumi.carrinho.total();
    finalizar.href = "https://api.whatsapp.com/send?phone=" + TELEFONE + "&text=" + encodeURIComponent(montarMensagem(itens));
    resumo.hidden = false;
  }

  document.getElementById("limpar").addEventListener("click", function () {
    Lumi.carrinho.limpar();
    desenhar();
  });

  desenhar();
})();
