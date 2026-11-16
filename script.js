// =========================================================================
// 1. BASE DE ARTIGOS (Cole aqui o código exportado quando atualizar no site)
// =========================================================================
const artigosIniciais = [
    {
        id: 1,
        titulo: "Assistência Judiciária Gratuita e o Acesso à Justiça",
        data: "15/10/2026",
        conteudo: "A concessão da justiça gratuita é garantia constitucional fundamental para assegurar que limitações financeiras não impeçam o cidadão de buscar a tutela jurisdicional. Neste artigo, analisamos os critérios objetivos e subjetivos adotados pelos tribunais brasileiros..."
    },
    {
        id: 2,
        titulo: "Fraudes Bancárias Digitais: Responsabilidade das Instituições",
        data: "02/11/2026",
        conteudo: "Com o avanço das transações eletrônicas, golpes envolvendo engenharia social e falhas de segurança tornaram-se recorrentes. Segundo a Súmula 479 do STJ, as instituições financeiras respondem objetivamente pelos danos gerados por fortuito interno..."
    },
    {
        id: 3,
        titulo: "Direitos Trabalhistas no Regime de Teletrabalho",
        data: "10/11/2026",
        conteudo: "O trabalho remoto trouxe flexibilidade, mas também dúvidas sobre controle de jornada, horas extras e ajuda de custo. Entenda o que prevê a CLT para trabalhadores que atuam à distância em todo o Brasil..."
    },
    {
        id: 4,
        titulo: "A Importância da Defesa Técnica desde o Inquérito Policial",
        data: "14/11/2026",
        conteudo: "Embora o inquérito policial seja um procedimento inquisitivo, o acompanhamento por advogado desde o primeiro ato garante a observância das garantias constitucionais e evita nulidades futuras..."
    }
];

// =========================================================================
// 2. CONFIGURAÇÃO DE SENHA DA ÁREA RESTRITA
// =========================================================================
// Altere a senha abaixo para a senha que você desejar usar:
const SENHA_ADVOGADA = "Gaspar1504!";

// Carrega artigos do navegador ou usa os iniciais
let artigos = JSON.parse(localStorage.getItem("henza_artigos")) || artigosIniciais;

// Inicializa ícones e ano atual
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    document.getElementById("ano-atual").textContent = new Date().getFullYear();
    renderizarCarrossel();
    iniciarAutoScroll();
});

// =========================================================================
// 3. CARROSSEL AUTOMÁTICO (A CADA 5 SEGUNDOS)
// =========================================================================
const track = document.getElementById("carousel-track");
let autoScrollInterval;

function renderizarCarrossel() {
    track.innerHTML = "";
    artigos.forEach(artigo => {
        const card = document.createElement("div");
        card.className = "artigo-card";
        card.innerHTML = `
            <div>
                <div class="artigo-icon-top">
                    <i data-lucide="file-text"></i>
                    <span>${artigo.data}</span>
                </div>
                <h3>${artigo.titulo}</h3>
            </div>
            <span class="ler-mais">Ler artigo completo →</span>
        `;
        card.addEventListener("click", () => abrirArtigo(artigo));
        track.appendChild(card);
    });
    lucide.createIcons();
}

function avancarCarrossel() {
    const scrollAmount = 320; // Largura do card + gap
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
}

function iniciarAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(avancarCarrossel, 5000); // 5000ms = 5 segundos
}

document.getElementById("next-artigo").addEventListener("click", () => {
    avancarCarrossel();
    iniciarAutoScroll(); // Reinicia contagem de 5s após clique manual
});

document.getElementById("prev-artigo").addEventListener("click", () => {
    track.scrollBy({ left: -320, behavior: "smooth" });
    iniciarAutoScroll();
});

// Pausa a rolagem automática quando o mouse estiver sobre os artigos
track.addEventListener("mouseenter", () => clearInterval(autoScrollInterval));
track.addEventListener("mouseleave", iniciarAutoScroll);

// =========================================================================
// 4. LEITURA DE ARTIGO (MODAL)
// =========================================================================
const modalLeitura = document.getElementById("modal-leitura");

function abrirArtigo(artigo) {
    document.getElementById("leitura-data").textContent = `Publicado em ${artigo.data} • Dra. Henza Bergami (OAB/ES 40.980)`;
    document.getElementById("leitura-titulo").textContent = artigo.titulo;
    document.getElementById("leitura-corpo").textContent = artigo.conteudo;
    modalLeitura.style.display = "block";
}

document.getElementById("close-leitura").onclick = () => modalLeitura.style.display = "none";

// =========================================================================
// 5. ÁREA PRIVADA PARA PUBLICAÇÃO
// =========================================================================
const modalAdmin = document.getElementById("modal-admin");
const btnAreaRestrita = document.getElementById("btn-area-restrita");
const closeAdmin = document.getElementById("close-admin");

btnAreaRestrita.onclick = () => {
    modalAdmin.style.display = "block";
    verificarSessao();
};

closeAdmin.onclick = () => modalAdmin.style.display = "none";

window.onclick = (event) => {
    if (event.target === modalLeitura) modalLeitura.style.display = "none";
    if (event.target === modalAdmin) modalAdmin.style.display = "none";
};

function verificarSessao() {
    const logado = sessionStorage.getItem("henza_logado") === "true";
    document.getElementById("admin-login-box").style.display = logado ? "none" : "block";
    document.getElementById("admin-panel-box").style.display = logado ? "block" : "none";
    if (logado) renderizarListaAdmin();
}

document.getElementById("btn-login").onclick = () => {
    const senhaDigitada = document.getElementById("admin-senha").value;
    if (senhaDigitada === SENHA_ADVOGADA) {
        sessionStorage.setItem("henza_logado", "true");
        document.getElementById("login-erro").textContent = "";
        document.getElementById("admin-senha").value = "";
        verificarSessao();
    } else {
        document.getElementById("login-erro").textContent = "Senha incorreta.";
    }
};

document.getElementById("btn-logout").onclick = () => {
    sessionStorage.removeItem("henza_logado");
    verificarSessao();
};

document.getElementById("btn-publicar").onclick = () => {
    const titulo = document.getElementById("novo-titulo").value.trim();
    const conteudo = document.getElementById("novo-conteudo").value.trim();

    if (!titulo || !conteudo) {
        alert("Preencha o título e o conteúdo do artigo.");
        return;
    }

    const hoje = new Date().toLocaleDateString("pt-BR");
    const novoArtigo = {
        id: Date.now(),
        titulo: titulo,
        data: hoje,
        conteudo: conteudo
    };

    artigos.unshift(novoArtigo);
    localStorage.setItem("henza_artigos", JSON.stringify(artigos));

    document.getElementById("novo-titulo").value = "";
    document.getElementById("novo-conteudo").value = "";

    renderizarCarrossel();
    renderizarListaAdmin();
    alert("Artigo publicado com sucesso!");
};

function renderizarListaAdmin() {
    const lista = document.getElementById("lista-admin-artigos");
    lista.innerHTML = "";
    artigos.forEach(artigo => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${artigo.titulo} (${artigo.data})</span>
            <button class="btn-excluir" onclick="excluirArtigo(${artigo.id})">Excluir</button>
        `;
        lista.appendChild(li);
    });
}

window.excluirArtigo = (id) => {
    if (confirm("Deseja realmente excluir este artigo?")) {
        artigos = artigos.filter(a => a.id !== id);
        localStorage.setItem("henza_artigos", JSON.stringify(artigos));
        renderizarCarrossel();
        renderizarListaAdmin();
    }
};

// Exporta o JSON formatado para você atualizar no GitHub
document.getElementById("btn-exportar").onclick = () => {
    const codigoFormatado = `const artigosIniciais = ${JSON.stringify(artigos, null, 4)};`;
    navigator.clipboard.writeText(codigoFormatado).then(() => {
        alert("Código copiado! Abra o arquivo script.js no seu GitHub e substitua o bloco 'const artigosIniciais = [...]' por este conteúdo para que todos os visitantes vejam seus novos artigos.");
    });
};
