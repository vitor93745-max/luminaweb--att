// Página inicial: cards de destaque do celular, busca e lista de produtos.
(function () {
  const destaques = document.getElementById("destaques");

  Lumi.destaques.forEach(function (destaque) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.innerHTML = "<span></span><em></em>";
    botao.querySelector("span").textContent = destaque.categoria;
    botao.querySelector("em").textContent = destaque.texto;
    botao.querySelector("em").style.fontStyle = "normal";

    botao.addEventListener("click", function () {
      Lumi.busca.categoria(destaque.categoria);
      document.getElementById("produtos").scrollIntoView();
    });

    destaques.append(botao);
  });

  const marcas = document.getElementById("marcas-destaque");

  Lumi.marcasDestaque.forEach(function (marca) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = marca.split("/")[0];

    botao.addEventListener("click", function () {
      Lumi.busca.marca(marca);
      document.getElementById("produtos").scrollIntoView();
    });

    marcas.append(botao);
  });

  document.getElementById("busca").addEventListener("input", function (evento) {
    Lumi.busca.texto(evento.target.value);
  });

  Lumi.produtosView.mostrar(Lumi.produtos, "");
})();
