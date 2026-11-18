// Carrinho: lista de { id, qtd } guardada no navegador.
(function () {
  const CHAVE = "lumi-carrinho";
  let itens = carregar();

  function carregar() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE));
      if (!Array.isArray(salvo)) return [];
      return salvo.filter(function (i) {
        return i && i.id && i.qtd > 0;
      });
    } catch (e) {
      return [];
    }
  }

  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch (e) {
      // sem armazenamento: o carrinho segue só na memória
    }
    atualizarContador();
  }

  function atualizarContador() {
    const contador = document.getElementById("carrinho-qtd");
    if (contador) contador.textContent = Lumi.carrinho.total();
  }

  Lumi.carrinho = {
    itens() {
      return itens.slice();
    },

    total() {
      return itens.reduce(function (soma, i) {
        return soma + i.qtd;
      }, 0);
    },

    adicionar(id) {
      const item = itens.find(function (i) { return i.id === id; });
      if (item) {
        item.qtd += 1;
      } else {
        itens.push({ id: id, qtd: 1 });
      }
      salvar();
    },

    alterar(id, diferenca) {
      const item = itens.find(function (i) { return i.id === id; });
      if (!item) return;
      item.qtd += diferenca;
      itens = itens.filter(function (i) { return i.qtd > 0; });
      salvar();
    },

    limpar() {
      itens = [];
      salvar();
    },

    atualizarContador: atualizarContador
  };
})();
