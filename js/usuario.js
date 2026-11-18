// Contas e sessão do usuário, guardadas no navegador (localStorage).
// ATENÇÃO: isto é uma solução de demonstração. As contas ficam só neste navegador
// e qualquer pessoa com acesso a ele consegue vê-las. Em um site real, o cadastro
// e o login precisam de um servidor com banco de dados.
(function () {
  const CHAVE_SESSAO = "lumi-usuario"; // quem está logado agora: { nome, email }
  const CHAVE_CONTAS = "lumi-contas";  // todas as contas criadas: lista de { nome, email, sal, hash }

  // ---------- funções de apoio ----------

  function lerContas() {
    try {
      const lista = JSON.parse(localStorage.getItem(CHAVE_CONTAS));
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      return [];
    }
  }

  function salvarContas(lista) {
    try {
      localStorage.setItem(CHAVE_CONTAS, JSON.stringify(lista));
      return true;
    } catch (e) {
      return false;
    }
  }

  function normalizar(email) {
    return email.trim().toLowerCase(); // "Maria@X.com" e "maria@x.com" são a mesma conta
  }

  function paraHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(function (b) { return b.toString(16).padStart(2, "0"); })
      .join("");
  }

  // O navegador só libera o "crypto.subtle" em páginas seguras (https ou localhost).
  // Abrindo por http://192.168.x.x (teste no celular, por exemplo), ele não existe.
  function protecaoDisponivel() {
    return typeof crypto !== "undefined" && !!crypto.subtle;
  }

  const ERRO_PROTECAO = "Este navegador não permite proteger a senha nesta página. Abra o site por https ou por localhost.";

  // Nunca guardamos a senha em si: guardamos só o "hash" (uma impressão digital dela).
  async function gerarHash(senha, sal) {
    const bytes = new TextEncoder().encode(sal + senha);
    return paraHex(await crypto.subtle.digest("SHA-256", bytes));
  }

  function novoSal() {
    return paraHex(crypto.getRandomValues(new Uint8Array(16)));
  }

  // ---------- o que as outras páginas usam ----------

  Lumi.usuario = {
    atual() {
      try {
        return JSON.parse(localStorage.getItem(CHAVE_SESSAO));
      } catch (e) {
        return null;
      }
    },

    // Guarda quem está logado. Devolve true se deu certo.
    entrar(nome, email) {
      try {
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ nome: nome, email: email }));
        return true;
      } catch (e) {
        return false;
      }
    },

    sair() {
      try {
        localStorage.removeItem(CHAVE_SESSAO);
      } catch (e) {
        // sem armazenamento: nada para apagar
      }
    },

    emailValido(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // Cria a conta. Devolve { ok: true, nome, email } ou { ok: false, erro: "mensagem" }.
    async cadastrar(nome, email, senha) {
      if (!protecaoDisponivel()) return { ok: false, erro: ERRO_PROTECAO };
      email = normalizar(email);
      const contas = lerContas();
      if (contas.some(function (c) { return c.email === email; })) {
        return { ok: false, erro: "Já existe uma conta com esse e-mail. Use a aba Entrar." };
      }
      const sal = novoSal();
      let hash;
      try {
        hash = await gerarHash(senha, sal);
      } catch (e) {
        return { ok: false, erro: ERRO_PROTECAO };
      }
      contas.push({ nome: nome, email: email, sal: sal, hash: hash });
      if (!salvarContas(contas)) {
        return { ok: false, erro: "Não foi possível salvar a conta neste navegador." };
      }
      return { ok: true, nome: nome, email: email };
    },

    // Confere e-mail e senha. Devolve { ok: true, nome, email } ou { ok: false, erro }.
    async autenticar(email, senha) {
      if (!protecaoDisponivel()) return { ok: false, erro: ERRO_PROTECAO };
      email = normalizar(email);
      const conta = lerContas().find(function (c) { return c.email === email; });
      // a mesma mensagem para "não existe" e "senha errada" evita revelar quais e-mails têm conta
      const invalido = { ok: false, erro: "E-mail ou senha incorretos." };
      if (!conta) return invalido;
      let hash;
      try {
        hash = await gerarHash(senha, conta.sal);
      } catch (e) {
        return { ok: false, erro: ERRO_PROTECAO };
      }
      if (hash !== conta.hash) return invalido;
      return { ok: true, nome: conta.nome, email: conta.email };
    }
  };
})();
