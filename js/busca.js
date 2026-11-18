// Busca e filtros: combina texto digitado, categoria e marca.
(function () {
  const estado = { texto: "", categoria: null, marca: null };

  function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function filtrar() {
    const texto = normalizar(estado.texto);

    return Lumi.produtos.filter(function (produto) {
      if (estado.categoria && produto.categoria !== estado.categoria) return false;
      if (estado.marca && produto.marcaId !== Lumi.idMarca(estado.marca)) return false;
      if (texto && !normalizar(produto.marca + " " + produto.nome).includes(texto)) return false;
      return true;
    });
  }

  function rotulo() {
    const partes = [estado.categoria, estado.marca, estado.texto && '"' + estado.texto + '"'].filter(Boolean);
    return partes.length ? "Filtrando por: " + partes.join(" + ") : "";
  }

  function atualizar() {
    Lumi.produtosView.mostrar(filtrar(), rotulo());
  }

  Lumi.busca = {
    texto(valor) {
      estado.texto = valor;
      atualizar();
    },

    categoria(valor) {
      estado.categoria = valor;
      estado.marca = null;
      atualizar();
    },

    marca(valor) {
      estado.marca = valor;
      estado.categoria = null;
      atualizar();
    },

    limpar() {
      estado.texto = "";
      estado.categoria = null;
      estado.marca = null;
      document.getElementById("busca").value = "";
      atualizar();
    }
  };
})();
