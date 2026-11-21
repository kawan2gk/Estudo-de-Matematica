
/* MÓDULO DE CONQUISTAS — carregar após script.js e inteiros.js */
(() => {
"use strict";

const LIMIAR = 80;

const lista = [
["soma","operacoes","Somavingador","Você consegue somar até os recursos mais improváveis! Tony Stark ficaria impressionado com seus cálculos.","Soma","Alcance 80% de acertos diretos em Soma.","＋","ouro"],

["subtracao","operacoes","Formiga Menos","Você diminui qualquer número, até deixar tudo pequenininho. Subtrair também é uma grande habilidade!","Subtração","Alcance 80% de acertos diretos em Subtração.","−","azul"],

["multiplicacao","operacoes","Multiplicaulk","HULK MULTIPLICA! Seus resultados ficaram gigantescos. Nenhuma tabuada consegue escapar de você!","Multiplicação","Alcance 80% de acertos diretos em Multiplicação.","×","verde"],

["divisao","operacoes","Divisão Quântica","Você está apto a fazer divisões em nível quântico! Sua capacidade de calcular ultrapassou os limites da matemática comum.","Divisão","Alcance 80% de acertos diretos em Divisão.","÷","roxo"],

["inteiros_reta","inteiros","Doutor Estranho na Reta","Você enxerga posições matemáticas em outras dimensões!","Estudando a reta numérica","Alcance 80% na atividade da reta numérica.","↔","roxo"],

["inteiros_somaSubtracao","inteiros","Feiticeiro dos Sinais","Você manipula os sinais positivos e negativos como quem manipula a própria realidade!","Soma e Subtração de Inteiros","Alcance 80% em Soma e Subtração de Inteiros.","±","azul"],

["inteiros_multiplicacao","inteiros","Thor das Multiplicações","Seus cálculos têm a força de um trovão!","Multiplicação de inteiros","Alcance 80% em Multiplicação de Inteiros.","✕","ouro"],

["inteiros_divisao","inteiros","Divisão Quântica","Você divide números inteiros com precisão de uma inteligência artificial avançada!","Divisão de inteiros","Alcance 80% em Divisão de Inteiros.","÷","roxo"],

["inteiros_corrija","inteiros","Homem-Aranha Detetive","Seu sentido-aranha detectou um erro! Você encontrou a falha e salvou a resolução.","Corrija o erro","Alcance 80% na atividade Corrija o Erro.","⌕","vermelho"],

["secreta_3dias","secretas","Vingador Incansável","Três dias seguidos aprendendo. Sua dedicação está construindo algo grandioso!","Sequência de estudos","Estude em três dias consecutivos.","3","ouro"],

["secreta_7dias","secretas","Lenda de Wakanda","Sete dias consecutivos de estudo! Sua disciplina é digna de uma lenda.","Sequência de estudos","Estude em sete dias consecutivos.","7","verde"],

["secreta_quatro","secretas","O Escolhido dos Vingadores","Soma, subtração, multiplicação e divisão: você dominou as quatro operações!","Quatro operações","Desbloqueie as quatro conquistas das operações básicas.","★","ouro"],

["secreta_perfeita","secretas","Tony Stark da Matemática","Uma atividade com 100% de acertos diretos. Uma resolução impecável!","Atividade perfeita","Conclua uma atividade com 100% de acertos diretos.","100","azul"],

["secreta_multiverso","secretas","Multiverso do Conhecimento","Você conquistou conhecimentos em diferentes áreas da matemática!","Duas categorias","Desbloqueie uma conquista das operações e uma de Números Inteiros.","∞","roxo"]

].map(([id,grupo,nome,descricao,atividade,condicao,simbolo,cor])=>({
    id,grupo,nome,descricao,atividade,condicao,simbolo,cor
}));

/* =====================================================
   DATA E ARMAZENAMENTO
===================================================== */

const hoje = () => {
    const d = new Date();

    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

const seguro = s => String(s).replace(/[&<>"']/g,c=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
}[c]));

function prepararDados() {
    if (!progresso.conquistas || typeof progresso.conquistas !== "object") {
        progresso.conquistas = {};
    }

    if (!Array.isArray(progresso.diasEstudo)) {
        progresso.diasEstudo = [];
    }
}

function desbloquear(id, novas) {
    prepararDados();

    if (progresso.conquistas[id]) return;

    progresso.conquistas[id] = new Date().toISOString();

    const item = lista.find(c => c.id === id);

    if (item) novas.push(item);
}

/* =====================================================
   SEQUÊNCIA DE DIAS DE ESTUDO
===================================================== */

function registrarDia(novas) {
    prepararDados();

    const dia = hoje();

    if (!progresso.diasEstudo.includes(dia)) {
        progresso.diasEstudo.push(dia);
    }

    progresso.diasEstudo.sort();
    progresso.diasEstudo = progresso.diasEstudo.slice(-30);

    let sequencia = 1;

    for (let i = progresso.diasEstudo.length - 1; i > 0; i--) {
        const a = new Date(progresso.diasEstudo[i] + "T12:00:00");
        const b = new Date(progresso.diasEstudo[i-1] + "T12:00:00");

        const dias = Math.round((a-b)/86400000);

        if (dias === 1) {
            sequencia++;
        } else if (dias > 1) {
            break;
        }
    }

    if (sequencia >= 3) {
        desbloquear("secreta_3dias", novas);
    }

    if (sequencia >= 7) {
        desbloquear("secreta_7dias", novas);
    }
}

/* =====================================================
   CÁLCULO DOS ACERTOS DIRETOS
===================================================== */

function percentualDireto() {
    const total = estado.questoes?.length || 0;

    if (!total) return 0;

    const rs = estado.resultados || [];

    if (estado.modalidade === "sequencia") {
        const pontos = rs.reduce((s,r) =>
            s + (
                r.corrigida || r.pulada
                    ? 0
                    : Number(r.percentual) || (r.correto ? 100 : 0)
            ), 0
        );

        return Math.round(pontos / total);
    }

    const acertos = rs.filter(r =>
        r.correto === true &&
        !r.corrigida &&
        !r.pulada
    ).length;

    return Math.round(acertos / total * 100);
}

/* =====================================================
   IDENTIFICAR A ATIVIDADE
===================================================== */

function idDaAtividade() {
    if (estado.operacao === "inteiros") {
        return ({
            reta: "inteiros_reta",
            somaSubtracao: "inteiros_somaSubtracao",
            multiplicacao: "inteiros_multiplicacao",
            divisao: "inteiros_divisao",
            corrija: "inteiros_corrija"
        })[estado.modalidade] || null;
    }

    return [
        "soma",
        "subtracao",
        "multiplicacao",
        "divisao"
    ].includes(estado.operacao)
        ? estado.operacao
        : null;
}

/* =====================================================
   CONQUISTAS SECRETAS
===================================================== */

function verificarSecretas(novas,p) {

    // Atividade perfeita
    if (p === 100) {
        desbloquear("secreta_perfeita", novas);
    }

    // Domínio das quatro operações
    if (
        ["soma","subtracao","multiplicacao","divisao"]
        .every(id => progresso.conquistas[id])
    ) {
        desbloquear("secreta_quatro", novas);
    }

    // Domínio de duas categorias
    const op = [
        "soma",
        "subtracao",
        "multiplicacao",
        "divisao"
    ].some(id => progresso.conquistas[id]);

    const inteiros = lista
        .filter(c => c.grupo === "inteiros")
        .some(c => progresso.conquistas[c.id]);

    if (op && inteiros) {
        desbloquear("secreta_multiverso", novas);
    }
}

/* =====================================================
   SELOS DAS CONQUISTAS
===================================================== */

function selo(c) {
    return `
        <span class="selo-conquista selo-${c.cor}">
            ${seguro(c.simbolo)}
        </span>
    `;
}

/* =====================================================
   AVISO DE NOVA CONQUISTA
===================================================== */

function aviso(novas) {
    if (!novas.length) return;

    document.getElementById("avisoConquista")?.remove();

    const c = novas[0];
    const el = document.createElement("div");

    el.id = "avisoConquista";
    el.className = "aviso-conquista";
    el.setAttribute("role","status");

    el.innerHTML = `
        <div>${selo(c)}</div>

        <div>
            <strong>Nova conquista desbloqueada!</strong>

            <div>${seguro(c.nome)}</div>

            <small>
                ${
                    novas.length > 1
                    ? `+ ${novas.length - 1} conquista(s) também desbloqueada(s)`
                    : seguro(c.atividade)
                }
            </small>
        </div>

        <button type="button" aria-label="Fechar">×</button>
    `;

    el.querySelector("button").onclick = () => el.remove();

    document.body.appendChild(el);

    setTimeout(() => el.remove(),6500);
}

/* =====================================================
   ÁRVORE DO CONHECIMENTO
===================================================== */

function arvore() {
    prepararDados();

    const obtidas = lista.filter(c =>
        c.grupo !== "secretas" &&
        progresso.conquistas[c.id]
    ).length;

    const fase =
        obtidas >= 9 ? 4 :
        obtidas >= 7 ? 3 :
        obtidas >= 4 ? 2 :
        obtidas >= 1 ? 1 : 0;

    const frases = [
        "Sua árvore está começando a criar raízes. Complete atividades para fazê-la crescer.",
        "Um novo broto apareceu! Continue estudando para fortalecer sua árvore.",
        "Sua árvore ganhou novos galhos. Cada conquista representa um aprendizado!",
        "A copa está ficando cheia e forte. Você está avançando muito!",
        "Uma árvore extraordinária! Seu conhecimento floresceu."
    ];

    const alvo = $("arvoreVisual");

    if (alvo) {
        alvo.innerHTML = `
            <svg class="arvore-svg"
                viewBox="0 0 220 190"
                role="img"
                aria-label="Árvore do Conhecimento, estágio ${fase+1}">

                <ellipse cx="110" cy="174" rx="72" ry="9"
                    fill="#b7c8b7" opacity=".45"/>

                <path d="M101 168 C104 143 99 124 108 105 C114 91 109 75 116 62 L130 62 C123 84 132 100 123 119 C117 136 124 151 126 168Z"
                    fill="#805638"/>

                <path d="M112 118 C92 99 77 91 61 79 M119 107 C139 91 151 79 163 62 M111 91 C96 74 91 58 87 45"
                    fill="none"
                    stroke="#805638"
                    stroke-width="9"
                    stroke-linecap="round"/>

                <g class="folhas">
                    <circle cx="57" cy="71" r="24" fill="#70b77a"/>
                    <circle cx="83" cy="48" r="28" fill="#58a96b"/>
                    <circle cx="111" cy="39" r="31" fill="#72bd78"/>
                    <circle cx="145" cy="48" r="29" fill="#4d9f61"/>
                    <circle cx="169" cy="72" r="23" fill="#70b77a"/>
                    <circle cx="85" cy="82" r="28" fill="#4f9e60"/>
                    <circle cx="137" cy="83" r="31" fill="#5cad68"/>
                </g>

                ${
                    fase >= 1
                    ? '<circle cx="43" cy="98" r="17" fill="#83c77d"/><circle cx="177" cy="100" r="18" fill="#83c77d"/>'
                    : ""
                }

                ${
                    fase >= 2
                    ? '<path d="M110 10l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" fill="#f2c14e"/>'
                    : ""
                }

                ${
                    fase >= 3
                    ? '<g fill="#f4d16c"><circle cx="49" cy="53" r="4"/><circle cx="173" cy="52" r="4"/><circle cx="111" cy="72" r="4"/></g>'
                    : ""
                }

                ${
                    fase >= 4
                    ? '<g fill="#fff1a8"><path d="M26 35l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path d="M192 34l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></g>'
                    : ""
                }

                <path d="M69 169Q110 161 151 169"
                    fill="none"
                    stroke="#6f9e61"
                    stroke-width="4"
                    stroke-linecap="round"/>
            </svg>
        `;

        alvo.setAttribute("role","button");
        alvo.setAttribute("tabindex","0");
        alvo.setAttribute("aria-label","Abrir galeria de conquistas");
        alvo.title = "Clique para ver suas conquistas";
    }

    if ($("mensagemArvore")) {
        $("mensagemArvore").textContent = frases[fase];
    }

    if ($("recompensas")) {
        $("recompensas").innerHTML = `
            <span class="contador-conquistas">
                ${lista.filter(c => progresso.conquistas[c.id]).length}
                de ${lista.length} conquistas
            </span>

            <span class="texto-arvore-extra">
                Toque na árvore para abrir a galeria
            </span>
        `;
    }
}

/* =====================================================
   GALERIA DE CONQUISTAS
===================================================== */

function dataBR(valor) {
    if (!valor) return "";

    const d = new Date(valor);

    return Number.isNaN(d.getTime())
        ? ""
        : d.toLocaleDateString("pt-BR");
}

function cartao(c,ganhou,oculta=false) {
    const nome = oculta ? "Conquista secreta" : c.nome;

    const descricao = oculta
        ? "Continue estudando. Esta conquista ainda guarda um mistério."
        : c.descricao;

    const detalhe = oculta
        ? "Condição oculta"
        : ganhou
            ? `Desbloqueada em ${dataBR(progresso.conquistas[c.id])}`
            : c.condicao;

    return `
        <article class="cartao-conquista ${ganhou ? "desbloqueada" : "bloqueada"}">

            <div class="cartao-selo">
                ${
                    ganhou
                    ? selo(c)
                    : '<span class="selo-bloqueado">?</span>'
                }
            </div>

            <div class="cartao-corpo">

                <span class="status-conquista">
                    ${ganhou ? "DESBLOQUEADA" : "BLOQUEADA"}
                </span>

                <h3>${seguro(nome)}</h3>

                <p>${seguro(descricao)}</p>

                <small>${seguro(detalhe)}</small>

                ${
                    !oculta
                    ? `<span class="atividade-conquista">${seguro(c.atividade)}</span>`
                    : ""
                }

            </div>
        </article>
    `;
}

function renderizar(aba="minhas") {
    prepararDados();

    const area = $("conteudoConquistas");

    if (!area) return;

    const n = lista.filter(c => progresso.conquistas[c.id]).length;

    $("resumoGaleria").textContent =
        `${n} de ${lista.length} conquistas desbloqueadas`;

    if (aba === "minhas") {
        const itens = lista.filter(c => progresso.conquistas[c.id]);

        area.innerHTML = itens.length
            ? itens.map(c => cartao(c,true)).join("")
            : `
                <div class="galeria-vazia">
                    <span>✧</span>
                    <strong>Sua jornada está começando!</strong>
                    <p>Conclua atividades para desbloquear suas primeiras conquistas.</p>
                </div>
            `;

    } else if (aba === "busca") {
        const itens = lista.filter(c =>
            c.grupo !== "secretas" &&
            !progresso.conquistas[c.id]
        );

        area.innerHTML = itens.length
            ? itens.map(c => cartao(c,false)).join("")
            : `
                <div class="galeria-vazia">
                    <span>★</span>
                    <strong>Você conquistou todas!</strong>
                    <p>Agora descubra os desafios secretos.</p>
                </div>
            `;

    } else {
        area.innerHTML = lista
            .filter(c => c.grupo === "secretas")
            .map(c => cartao(
                c,
                !!progresso.conquistas[c.id],
                !progresso.conquistas[c.id]
            ))
            .join("");
    }
}

/* =====================================================
   ABRIR E FECHAR GALERIA
===================================================== */

function abrir(aba="minhas") {

    if (!$("galeriaConquistas")) {

        const m = document.createElement("div");

        m.id = "galeriaConquistas";
        m.className = "galeria-overlay escondida";

        m.innerHTML = `
            <section class="galeria-painel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="tituloGaleria">

                <header class="galeria-cabecalho">

                    <div>
                        <span class="galeria-sobretitulo">
                            ÁRVORE DO CONHECIMENTO
                        </span>

                        <h2 id="tituloGaleria">
                            Galeria de conquistas
                        </h2>

                        <p id="resumoGaleria"></p>
                    </div>

                    <button type="button"
                        class="fechar-galeria"
                        aria-label="Fechar galeria">
                        ×
                    </button>

                </header>

                <nav class="abas-conquistas">

                    <button data-aba="minhas"
                        class="aba-conquista">
                        Minhas conquistas
                    </button>

                    <button data-aba="busca"
                        class="aba-conquista">
                        Em busca
                    </button>

                    <button data-aba="secretas"
                        class="aba-conquista">
                        Secretas
                    </button>

                </nav>

                <div id="conteudoConquistas"
                    class="grade-conquistas">
                </div>

            </section>
        `;

        document.body.appendChild(m);

        m.querySelector(".fechar-galeria").onclick = fechar;

        m.addEventListener("click",e => {
            if (e.target === m) fechar();
        });

        m.querySelectorAll("[data-aba]").forEach(b => {
            b.onclick = () => {
                m.querySelectorAll("[data-aba]").forEach(x =>
                    x.classList.toggle("ativa",x === b)
                );

                renderizar(b.dataset.aba);
            };
        });

        document.addEventListener("keydown",e => {
            if (e.key === "Escape") fechar();
        });
    }

    const m = $("galeriaConquistas");

    m.classList.remove("escondida");

    m.querySelectorAll("[data-aba]").forEach(b =>
        b.classList.toggle("ativa",b.dataset.aba === aba)
    );

    renderizar(aba);

    m.querySelector(".fechar-galeria").focus();
}

function fechar() {
    $("galeriaConquistas")?.classList.add("escondida");
}

/* =====================================================
   CLIQUE NA ÁRVORE
===================================================== */

function ligarArvore() {
    const a = $("arvoreVisual");

    if (!a || a.dataset.galeriaAtiva === "1") return;

    a.dataset.galeriaAtiva = "1";

    a.addEventListener("click",() => abrir("minhas"));

    a.addEventListener("keydown",e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            abrir("minhas");
        }
    });
}

/* =====================================================
   INTEGRAÇÃO COM A FINALIZAÇÃO DAS ATIVIDADES
===================================================== */

// Intercepta apenas a finalização.
// Não altera o percentual apresentado nem o painel Meu desempenho.

const finalizarOriginal = finalizarAtividade;

window.finalizarAtividade = function() {

    const p = percentualDireto();
    const novas = [];

    finalizarOriginal();

    const id = idDaAtividade();

    if (id && p >= LIMIAR) {
        desbloquear(id,novas);
    }

    if (estado.questoes?.length) {
        registrarDia(novas);
    }

    verificarSecretas(novas,p);

    salvar();

    arvore();

    if (novas.length) {
        aviso(novas);
    }
};

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

window.atualizarArvore = arvore;
window.abrirGaleriaConquistas = abrir;

prepararDados();
ligarArvore();
arvore();

})();
