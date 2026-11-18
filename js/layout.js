// Componentes compartilhados: cabeçalho, rodapé, navegação e contato.
(function () {
  const pagina = document.body.dataset.pagina;
  const usuario = Lumi.usuario.atual();
  const linkConta = usuario ? "perfil.html" : "login.html";

  function cabecalho() {
    const busca = pagina === "inicio"
      ? '<div class="busca-wrap"><span class="busca-icone" aria-hidden="true">⌕</span><input class="search" id="busca" type="search" placeholder="Buscar produtos ou marcas" aria-label="Buscar produtos ou marcas"></div>'
      : "";
    const menu = pagina === "inicio"
      ? '<div class="menu" id="menu"><nav class="pills" id="pills" aria-label="Categorias"></nav><div class="painel" id="painel" role="region" aria-label="Detalhes da categoria" hidden></div></div>'
      : "";

    return (
      '<div class="top-inner">' +
        '<a class="logo" href="index.html" aria-label="Lumi na Web - página inicial"><strong>Lumi na Web</strong><span>beleza • cuidado • você</span></a>' +
        busca +
        '<div class="top-acoes">' +
          '<a class="link-topo" id="link-conta" href="' + linkConta + '">Conta</a>' +
          '<a class="link-topo link-sacola" href="carrinho.html">Sacola <span class="contador-sacola" id="carrinho-qtd">0</span></a>' +
        '</div>' +
      '</div>' + menu
    );
  }

  function rodape() {
    return (
      '<div class="rodape-colunas">' +
        '<div><h4>Lumi na Web</h4><p>Beleza, cuidado e autoestima em um só lugar. Encontre produtos para fazer da sua rotina um momento seu.</p></div>' +
        '<div><h4>Atendimento</h4><p>Seg. a Sáb., das 9h às 18h</p><p>(11) 93768-6392</p><p>contato@luminaweb.com.br</p></div>' +
        '<div><h4>Institucional</h4><a href="index.html">Início</a><a href="index.html#produtos">Produtos</a><a href="carrinho.html">Carrinho</a><a href="perfil.html">Minha conta</a></div>' +
        '<div><h4>Informações</h4><p>Consulte condições de envio e pagamento pelo nosso atendimento.</p><p>Atendimento via WhatsApp</p></div>' +
      '</div>' +
      '<p class="rodape-base">© 2026 Lumi na Web. Todos os direitos reservados.</p>'
    );
  }

  function abas() {
    function item(nome, destino, ativa) {
      return '<a href="' + destino + '"' + (ativa ? ' class="ativa" aria-current="page"' : "") + '>' + nome + '</a>';
    }
    return item("Início", "index.html", pagina === "inicio") +
      item("Categorias", "index.html#menu", false) +
      item("Sacola", "carrinho.html", pagina === "carrinho") +
      item("Conta", linkConta, pagina === "login" || pagina === "perfil");
  }

  document.getElementById("cabecalho").innerHTML = cabecalho();
  document.getElementById("rodape").innerHTML = rodape();
  document.getElementById("link-conta").textContent = usuario ? usuario.nome.split(" ")[0] : "Entrar";

  const wa = document.createElement("a");
  wa.className = "wa";
  wa.href = "https://api.whatsapp.com/send?phone=5511937686392";
  wa.target = "_blank";
  wa.rel = "noopener noreferrer";
  wa.textContent = "WhatsApp ↗";
  wa.setAttribute("aria-label", "Falar com a Lumi pelo WhatsApp");

  const nav = document.createElement("nav");
  nav.className = "tabs";
  nav.setAttribute("aria-label", "Navegação principal");
  nav.innerHTML = abas();

  const aviso = document.createElement("div");
  aviso.className = "aviso";
  aviso.textContent = "Beleza e cuidado para a sua rotina  •  Atendimento pelo WhatsApp";

  document.body.prepend(aviso);
  document.body.append(wa, nav);
  Lumi.carrinho.atualizarContador();
})();
