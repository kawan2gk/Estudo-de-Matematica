
/* =====================================================
   MATEMÁTICA COM DETALHES
   MÓDULO: NÚMEROS INTEIROS
   Carregar depois de script.js
===================================================== */

(() => {
"use strict";

/* =====================================================
   CAPTURA DAS FUNÇÕES ORIGINAIS
===================================================== */

const original = {
    abrir: window.abrirOperacao,
    selecionar: window.selecionarModalidade,
    iniciar: window.iniciarAtividade,
    mostrar: window.mostrarQuestao,
    teclado: window.montarTeclado,
    confirmar: window.confirmarAtividade,
    gerar: window.gerarQuestoes,
    revisar: window.revisarAtividade,
    pular: window.pularQuestao
};

/* =====================================================
   MODALIDADES
===================================================== */

const itens = [
    ["reta", "Estudando a reta numérica"],
    ["simples", "Operações simples com inteiros"],
    ["somaSubtracao", "Soma e Subtração de Inteiros"],
    ["procedimento", "Como obter o resultado"],
    ["multiplicacao", "Multiplicação de inteiros"],
    ["divisao", "Divisão de inteiros"],
    ["sinal", "Qual é o sinal?"],
    ["entendendo", "Entendendo operações com inteiros"],
    ["comparando", "Comparando números inteiros"],
    ["distancia", "Distância entre números"],
    ["falta", "Descubra o número que falta"],
    ["corrija", "Corrija o erro"],
    ["determineSinal", "Determine o Sinal"]
];

modalidades.inteiros = itens;

Object.assign(premios, {
    inteiros_reta: "📏",
    inteiros_simples: "➕",
    inteiros_somaSubtracao: "➖",
    inteiros_procedimento: "🧠",
    inteiros_multiplicacao: "✖️",
    inteiros_divisao: "➗",
    inteiros_sinal: "🔢",
    inteiros_entendendo: "💡",
    inteiros_comparando: "⚖️",
    inteiros_distancia: "📍",
    inteiros_falta: "❓",
    inteiros_corrija: "🎯",
    inteiros_determineSinal: "📝"
});

/* =====================================================
   ESTILOS COMPLEMENTARES
===================================================== */

const estiloReta = document.createElement("style");

estiloReta.textContent = `
.reta-container {
    overflow-x: auto;
    padding: 22px 12px;
    margin: 22px 0;
    background: #f7f9fc;
    border-radius: 14px;
    -webkit-overflow-scrolling: touch;
}

.reta-numerica {
    position: relative;
    min-width: 930px;
    height: 125px;
    padding: 0;
    margin: 0;
    touch-action: pan-x;
}

.reta-linha {
    position: absolute;
    left: 0;
    right: 0;
    top: 48px;
    height: 3px;
    background: #8794a5;
}

.reta-ponto {
    position: absolute;
    top: 39px;
    z-index: 1;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    width: 30px;
    min-width: 30px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #283548;
    font-size: 12px;
    cursor: pointer;
}

.reta-ponto::before {
    content: "●";
    color: #64748b;
    font-size: 15px;
    line-height: 18px;
}

.reta-ponto.selecionado::before {
    color: #285da8;
    font-size: 20px;
}

.reta-ponto.origem::before {
    color: #198754;
}

.marcador-reta {
    position: absolute;
    z-index: 5;
    top: 0;
    transform: translateX(-50%);
    width: 48px;
    height: 48px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: #000;
    font-size: 43px;
    line-height: 48px;
    text-align: center;
    filter: grayscale(1) brightness(0.25);
    cursor: grab;
    touch-action: none;
    user-select: none;
}

.marcador-reta:active {
    cursor: grabbing;
}

.reta-legenda {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
    font-size: 13px;
    margin-top: 12px;
}

.comparacao-selecao {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin: 22px 0;
    font-size: 30px;
    font-weight: bold;
}

.comparacao-selecao select {
    width: 75px;
    height: 58px;
    border: 2px solid #285da8;
    border-radius: 10px;
    background: white;
    color: #285da8;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
}

.expressao-corrigir {
    white-space: nowrap;
    overflow-x: auto;
    font-size: clamp(20px,5vw,32px);
    text-align: center;
    font-weight: bold;
    margin: 25px 0;
    padding: 8px 0;
}
`;

document.head.appendChild(estiloReta);

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

const el = id => document.getElementById(id);

const rand = (a,b) =>
    Math.floor(Math.random() * (b-a+1)) + a;

const pick = lista =>
    lista[rand(0,lista.length-1)];

const nz = () => {
    let n = 0;

    while (n === 0) {
        n = rand(-20,20);
    }

    return n;
};

const fatorPequeno = () => rand(-10,10);
const numeroFalta = () => rand(-15,15);

const formatarNumero = n =>
    String(n).replace("-", "−");

/* =====================================================
   FORMATAÇÃO E PROCEDIMENTOS
===================================================== */

const PROCEDIMENTOS = [
    "Somar e repetir o sinal negativo.",
    "Somar e repetir o sinal positivo.",
    "Subtrair e manter o sinal do número de maior valor absoluto positivo.",
    "Subtrair e manter o sinal do número de maior valor absoluto negativo.",
    "Os números têm o mesmo valor absoluto e sinais opostos. O resultado é zero."
];

function formatar(a,op,b) {
    if (op === "+") {
        return `${formatarNumero(a)} + (${formatarNumero(b)})`;
    }

    if (op === "−" || op === "-") {
        return `${formatarNumero(a)} − (${formatarNumero(b)})`;
    }

    return `${a} ${op} ${b}`;
}

function classificar(a,b,op) {
    const segundo = op === "−" ? -b : b;

    if (a === 0 && segundo === 0) {
        return PROCEDIMENTOS[4];
    }

    if (a === 0 || segundo === 0) {
        const valor = a === 0 ? segundo : a;

        return valor < 0
            ? PROCEDIMENTOS[0]
            : PROCEDIMENTOS[1];
    }

    if (Math.sign(a) === Math.sign(segundo)) {
        return a < 0
            ? PROCEDIMENTOS[0]
            : PROCEDIMENTOS[1];
    }

    if (Math.abs(a) === Math.abs(segundo)) {
        return PROCEDIMENTOS[4];
    }

    if (Math.abs(a) > Math.abs(segundo)) {
        return a < 0
            ? PROCEDIMENTOS[3]
            : PROCEDIMENTOS[2];
    }

    return segundo < 0
        ? PROCEDIMENTOS[3]
        : PROCEDIMENTOS[2];
}

/* =====================================================
   GERAÇÃO DAS QUESTÕES
===================================================== */

function gerar(tipo, numeroQuestao = 1) {
    let a,b,op,r;

    switch(tipo) {

        case "reta": {
            a = rand(-15,15);

            const destinos = [];

            for (let n=-15; n<=15; n++) {
                if (n !== a) destinos.push(n);
            }

            const destinoFinal = pick(destinos);
            b = destinoFinal-a;

            return {
                tipo,
                a,
                b,
                resposta:destinoFinal
            };
        }

        /* OPERAÇÕES SIMPLES */

        case "simples": {
            if (numeroQuestao % 6 === 0) {
                a = rand(1,20);
                b = a;
                op = "−";
            } else {
                a = rand(1,20);
                b = rand(1,20);
                op = pick(["+","−"]);
            }

            r = op === "+" ? a+b : a-b;

            return {
                tipo,a,b,op,
                resposta:r
            };
        }

        /* SOMA E SUBTRAÇÃO */

        case "somaSubtracao":
        case "procedimento":
        case "entendendo": {
            if (numeroQuestao % 6 === 0) {
                a = rand(1,20);
                if (Math.random() < 0.5) a = -a;

                b = -a;
                op = "+";
            } else {
                a = nz();
                b = nz();
                op = pick(["+","−"]);
            }

            r = op === "+" ? a+b : a-b;

            return {
                tipo,a,b,op,
                resposta:r,
                procedimento:classificar(a,b,op)
            };
        }

        /* MULTIPLICAÇÃO */

        case "multiplicacao": {
            const valorA = rand(1,10);
            const valorB = rand(1,10);

            const sinalA = Math.random() < 0.5 ? -1 : 1;
            const sinalB = Math.random() < 0.5 ? -1 : 1;

            a = valorA * sinalA;
            b = valorB * sinalB;

            return {
                tipo,a,b,
                resposta:a*b
            };
        }

        /* DIVISÃO */

        case "divisao":
            return {
                tipo,
                ...divisaoExata()
            };

        /* QUAL É O SINAL? */

        case "sinal": {
            const quantidade = rand(2,5);

            const fatores = Array.from(
                {length:quantidade},
                () => {
                    const valor = rand(1,5);
                    return Math.random() < 0.5 ? -valor : valor;
                }
            );

            r = fatores.reduce((x,y)=>x*y,1);

            return {
                tipo,
                fatores,
                resposta:r>0?"+":"−",
                modulo:Math.abs(r)
            };
        }

        /* COMPARAÇÃO */

        case "comparando": {
            a = nz();
            b = nz();

            return {
                tipo,a,b,
                resposta:a>b?">":a<b?"<":"="
            };
        }

        /* DISTÂNCIA */

        case "distancia": {
            a = nz();
            b = nz();

            return {
                tipo,a,b,
                resposta:Math.abs(a-b)
            };
        }

        /* NÚMERO QUE FALTA */

        case "falta": {
            op = pick(["+","−","×"]);

            if (op === "+") {
                a = numeroFalta();
                b = numeroFalta();
                r = a+b;

                return {
                    tipo,a,b,op,
                    resposta:b,
                    modelo:`${a} + [ ? ] = ${r}`
                };
            }

            if (op === "−") {
                a = numeroFalta();
                b = numeroFalta();
                r = a-b;

                return {
                    tipo,a,b,op,
                    resposta:a,
                    modelo:`[ ? ] − (${b}) = ${r}`
                };
            }

            a = fatorPequeno();
            b = fatorPequeno();
            r = a*b;

            return {
                tipo,a,b,op,
                resposta:b,
                modelo:`(${a}) × [ ? ] = ${r}`
            };
        }

        /* CORRIJA O ERRO */

        case "corrija": {
            op = pick(["+","−","×"]);

            if (op === "×") {
                a = pick([-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9,10]);
                b = pick([-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9,10]);
            } else {
                a = rand(-15,15);
                b = rand(-15,15);
            }

            r = op === "+"
                ? a+b
                : op === "−"
                    ? a-b
                    : a*b;

            const correto = Math.random() < 0.5;
            let apresentado = r;

            if (!correto) {
                if (op === "×") {
                    apresentado = -r;
                }

                else if (op === "+") {
                    /*
                       Erro comum:
                       somar os módulos e ignorar
                       que os sinais são diferentes.

                       Exemplo:
                       -6 + 4 = 10
                    */

                    if (Math.sign(a) !== Math.sign(b)) {
                        apresentado = Math.abs(a) + Math.abs(b);
                    } else {
                        apresentado = -r;
                    }
                }

                else {
                    /*
                       Erro comum:
                       não trocar o sinal do segundo
                       número ao transformar subtração
                       em adição.

                       Exemplo:
                       6 - (-4) = 2
                       em vez de 10.
                    */

                    apresentado = a+b;

                    if (apresentado === r) {
                        apresentado = -r;
                    }
                }

                if (apresentado === r) {
                    apresentado = r + (r >= 0 ? 3 : -3);
                }
            }

            return {
                tipo,a,b,op,
                resposta:correto?"Correto":"Incorreto",
                classificacao:correto?"Correto":"Incorreto",
                resultado:r,
                apresentado
            };
        }

        /* DETERMINE O SINAL */

        case "determineSinal": {
            a = rand(1,20);
            b = rand(1,20);

            const sinalA = Math.random() < 0.5 ? "+" : "-";
            const sinalB = Math.random() < 0.5 ? "+" : "-";

            const valorA = sinalA === "+" ? a : -a;
            const valorB = sinalB === "+" ? b : -b;

            return {
                tipo,a,b,
                sinalA,
                sinalB,
                resposta:valorA+valorB
            };
        }
    }
}

/* =====================================================
   DIVISÃO EXATA
===================================================== */

function divisaoExata() {
    const divisorPositivo = rand(1,10);
    const quocientePositivo = rand(1,10);

    const sinalDivisor = Math.random()<0.5 ? -1 : 1;
    const sinalDividendo = Math.random()<0.5 ? -1 : 1;

    const divisor = divisorPositivo*sinalDivisor;

    const dividendo =
        divisorPositivo*quocientePositivo*sinalDividendo;

    return {
        dividendo,
        divisor,
        resposta:dividendo/divisor
    };
}

/* =====================================================
   GERAÇÃO DA LISTA
===================================================== */

function gerarLista(tipo,qtd) {
    const lista = [];

    for (let i=0; i<qtd; i++) {
        const numero = i+1;

        if (tipo === "comparando" &&
            (numero % 5 === 0 || numero % 8 === 0)) {

            const valor = numero % 8 === 0
                ? rand(1,15)
                : -rand(1,15);

            lista.push({
                tipo,
                a:valor,
                b:valor,
                resposta:"="
            });

        } else {
            lista.push(gerar(tipo,numero));
        }
    }

    return lista;
}

/* =====================================================
   ABRIR NÚMEROS INTEIROS
===================================================== */

function abrirInteiros() {
    pararCronometro();

    estado.operacao = "inteiros";
    estado.modalidade = "";

    el("tituloOperacao").textContent = "Números Inteiros";

    el("descricaoOperacao").textContent =
        "Aprenda a trabalhar com números positivos e negativos. Escolha uma modalidade para começar.";

    el("configuracao").classList.add("escondida");
    el("menuQuatroOperacoes")?.classList.add("escondida");

    el("listaModalidades").classList.remove("escondida");

    el("listaModalidades").innerHTML = itens.map(([id,nome],i)=>`
        <button class="modalidade"
            onclick="selecionarModalidade('inteiros_${id}',this)">
            ${i+1}. ${nome}
        </button>
    `).join("");

    mostrarTela("operacao");
}

/* =====================================================
   SELECIONAR MODALIDADE
===================================================== */

function selecionarInteiros(id,botao) {
    estado.modalidade = id.replace("inteiros_","");

    document.querySelectorAll(".modalidade").forEach(b=>
        b.classList.remove("selecionada")
    );

    botao?.classList.add("selecionada");

    const item = itens.find(x=>x[0]===estado.modalidade);

    if (!item) return;

    el("tituloConfiguracao").textContent = item[1];

    el("opcoesConfiguracao").innerHTML = `
        <p>Quantidade de questões</p>

        <select id="quantidade">
            ${[10,20,30,40,50].map(n=>`
                <option value="${n}" ${n===10?"selected":""}>
                    ${n} questões
                </option>
            `).join("")}
        </select>

        <p class="nota-conta">
            Os valores serão sorteados conforme a modalidade,
            respeitando os limites de cada operação.
        </p>
    `;

    el("configuracao").classList.remove("escondida");
}

/* =====================================================
   INICIAR ATIVIDADE
===================================================== */

function iniciarInteiros() {
    const quantidade = Number(el("quantidade")?.value || 10);

    estado.opcoes = {quantidade};

    estado.ultimaConfiguracao = {
        operacao:"inteiros",
        modalidade:estado.modalidade,
        opcoes:{quantidade}
    };

    estado.questoes = gerarLista(
        estado.modalidade,
        quantidade
    );

    estado.indice = 0;
    estado.resultados = [];
    estado.errou = false;
    estado.respostaConferida = false;

    mostrarTela("estudo");

    iniciarCronometro();
    mostrarInteiros();
}

/* =====================================================
   RETA NUMÉRICA
===================================================== */

let destino = null;
let arraste = false;
let etapa = "classificar";

function retaHTML(q) {
    return `
        <div class="expressao-inteiros">
            <div style="font-size:clamp(20px,5vw,27px)">
                🐇 O coelho está no número ${q.a}.
                Ele andou ${q.b>0?"+":""}${q.b}.
                Onde parou?
            </div>
        </div>

        <div class="reta-container">
            <div class="reta-numerica" id="retaNumerica">

                <div class="reta-linha"></div>

                ${Array.from({length:31},(_,i)=>i-15).map(n=>`
                    <button type="button"
                        class="reta-ponto ${n===q.a?"origem":""}"
                        data-valor="${n}"
                        style="left:${((n+15)/30)*100}%"
                        onclick="selecionarPontoReta(${n})">
                        ${n}
                    </button>
                `).join("")}

                <button type="button"
                    id="marcadorReta"
                    class="marcador-reta"
                    aria-label="Arraste o coelho"
                    onpointerdown="iniciarArrasteReta(event)">
                    🐇
                </button>
            </div>
        </div>

        <p id="destinoReta" class="nota-conta" style="text-align:center">
            Arraste o coelho ou clique no número onde ele parou.
        </p>
    `;
}

function atualizarReta(n) {
    destino = Math.max(-15,Math.min(15,n));

    document.querySelectorAll(".reta-ponto").forEach(p=>
        p.classList.toggle(
            "selecionado",
            Number(p.dataset.valor)===destino
        )
    );

    const marcador = el("marcadorReta");

    if (marcador) {
        marcador.style.left =
            `${((destino+15)/30)*100}%`;
    }

    if (el("destinoReta")) {
        el("destinoReta").textContent =
            `Posição escolhida: ${destino}`;
    }
}

function moverReta(e) {
    if (!arraste) return;

    const faixa = el("retaNumerica");
    if (!faixa) return;

    const r = faixa.getBoundingClientRect();

    const proporcao = Math.max(
        0,
        Math.min(1,(e.clientX-r.left)/r.width)
    );

    atualizarReta(Math.round(proporcao*30-15));
}

function pararArraste() {
    arraste = false;

    window.removeEventListener("pointermove",moverReta);
    window.removeEventListener("pointerup",pararArraste);
    window.removeEventListener("pointercancel",pararArraste);
}

function iniciarArrasteReta(e) {
    e.preventDefault();

    arraste = true;

    window.addEventListener("pointermove",moverReta);
    window.addEventListener("pointerup",pararArraste);
    window.addEventListener("pointercancel",pararArraste);
}

function selecionarPontoReta(n) {
    atualizarReta(n);
}

/* =====================================================
   BOTÕES DE ALTERNATIVAS
   ORDEM FIXA, SEM EMBARALHAR
===================================================== */

function opcoesHTML(opcoes) {
    return `
        <div class="opcoes-inteiros">
            ${opcoes.map(v=>`
                <button type="button"
                    class="opcao-inteiro"
                    data-opcao="${String(v).replace(/"/g,"&quot;")}"
                    onclick="responderInteiro(this.dataset.opcao)">
                    ${v}
                </button>
            `).join("")}
        </div>
    `;
}

/* =====================================================
   EXIBIÇÃO DAS QUESTÕES
===================================================== */

function expressaoCorrigir(q) {
    if (q.op === "×") {
        const a = q.a < 0 ? `(${q.a})` : q.a;
        const b = q.b < 0 ? `(${q.b})` : q.b;

        return `${a} × ${b} = ${q.apresentado}`;
    }

    return `${q.a} ${q.op} ${q.b} = ${q.apresentado}`;
}

function renderizarInteiro(q) {
    let html = "";

    destino = null;
    etapa = "classificar";

    if (q.tipo === "reta") {
        html = retaHTML(q);
    }

    else if (q.tipo === "simples") {
        html = `
            <div class="expressao-inteiros">
                ${q.a} ${q.op} ${q.b}
            </div>

            <input id="respostaInteiro"
                class="resposta-inteiros"
                inputmode="text"
                placeholder="Sua resposta">
        `;
    }

    else if (
        q.tipo === "somaSubtracao" ||
        q.tipo === "procedimento" ||
        q.tipo === "entendendo"
    ) {
        html = `
            <div class="expressao-inteiros">
                ${formatar(q.a,q.op,q.b)}
            </div>

            ${q.tipo === "somaSubtracao" ? `
                <input id="respostaInteiro"
                    class="resposta-inteiros"
                    inputmode="text"
                    placeholder="Sua resposta">
            ` : `
                <p>Qual procedimento deve ser utilizado?</p>
                ${opcoesHTML(PROCEDIMENTOS)}
            `}
        `;
    }

    else if (q.tipo === "multiplicacao") {
        const a = q.a < 0 ? `(${q.a})` : q.a;
        const b = q.b < 0 ? `(${q.b})` : q.b;

        html = `
            <div class="expressao-inteiros">
                ${a} × ${b}
            </div>

            <input id="respostaInteiro"
                class="resposta-inteiros"
                inputmode="text"
                placeholder="Sua resposta">
        `;
    }

    else if (q.tipo === "divisao") {
        html = `
            <div class="expressao-inteiros">
                (${q.dividendo}) ÷ (${q.divisor})
            </div>

            <input id="respostaInteiro"
                class="resposta-inteiros"
                inputmode="text"
                placeholder="Quociente">
        `;
    }

    else if (q.tipo === "sinal") {
        html = `
            <div class="expressao-inteiros">
                ${q.fatores.map(n=>`(${n})`).join(" × ")}
                <br>
                <small>
                    Módulo do resultado: ${q.modulo}.
                    Qual é o sinal?
                </small>
            </div>

            ${opcoesHTML(["+","−"])}
        `;
    }

    else if (q.tipo === "comparando") {
        html = `
            <div class="expressao-inteiros">
                <div class="comparacao-selecao">
                    <span>${formatarNumero(q.a)}</span>

                    <select id="sinalComparacao"
                        aria-label="Escolha o sinal de comparação">
                        <option value="">?</option>
                        <option value="<">&lt;</option>
                        <option value="=">=</option>
                        <option value=">">&gt;</option>
                    </select>

                    <span>${formatarNumero(q.b)}</span>
                </div>
            </div>

            <div class="legenda-comparacao">
                <p><strong>&lt;</strong> | É menor que</p>
                <p><strong>=</strong> | É igual a</p>
                <p><strong>&gt;</strong> | É maior que</p>
            </div>
        `;
    }

    else if (q.tipo === "distancia") {
        html = `
            <div class="expressao-inteiros">
                Qual é a distância entre ${q.a} e ${q.b}?
            </div>

            <input id="respostaInteiro"
                class="resposta-inteiros"
                inputmode="numeric"
                placeholder="Distância">
        `;
    }

    else if (q.tipo === "falta") {
        html = `
            <div class="expressao-inteiros">
                ${q.modelo}
            </div>

            <input id="respostaInteiro"
                class="resposta-inteiros"
                inputmode="text"
                placeholder="Número que falta">
        `;
    }

    else if (q.tipo === "corrija") {
        html = `
            <div class="expressao-corrigir">
                ${expressaoCorrigir(q)}
            </div>

            <p>O resultado apresentado está correto?</p>

            ${opcoesHTML(["Correto","Incorreto"])}
        `;
    }

    else if (q.tipo === "determineSinal") {
        html = `
            <div class="expressao-inteiros">
                <div style="display:flex; justify-content:center; align-items:center; gap:8px; flex-wrap:wrap">

                    <select id="sinalPrimeiro"
                        aria-label="Sinal do primeiro número"
                        style="width:65px; height:55px; font-size:25px; text-align:center; border:2px solid var(--azul); border-radius:10px; background:white">
                        <option value=""> </option>
                        <option value="+">+</option>
                        <option value="-">−</option>
                    </select>

                    <span>${q.a}</span>

                    <select id="sinalSegundo"
                        aria-label="Sinal do segundo número"
                        style="width:65px; height:55px; font-size:25px; text-align:center; border:2px solid var(--azul); border-radius:10px; background:white">
                        <option value="">?</option>
                        <option value="+">+</option>
                        <option value="-">−</option>
                    </select>

                    <span>${q.b}</span>
                    <span>= ${q.resposta}</span>
                </div>
            </div>

            <p class="nota-conta" style="text-align:center">
                Complete os sinais para que a igualdade fique correta.
                O primeiro sinal pode ficar em branco quando for positivo.
                O segundo sinal é obrigatório.
            </p>
        `;
    }

    el("areaQuestao").innerHTML = html + `
        <div class="area-botao-ok">
            <button class="botao-ok-resposta"
                onclick="confirmarAtividade()">
                OK ✅
            </button>
        </div>
    `;

    el("feedback").textContent = "";

    el("acoesQuestao").innerHTML = `
        <button class="botao-secundario"
            onclick="pularQuestao()">
            Pular questão
        </button>
    `;

    montarTecladoInteiros();

    if (el("respostaInteiro")) {
        el("respostaInteiro").focus();
    }

    if (q.tipo === "reta") {
        atualizarReta(q.a);
        destino = null;

        el("destinoReta").textContent =
            "Arraste o coelho ou clique no número onde ele parou.";
    }
}

/* =====================================================
   MOSTRAR QUESTÃO
===================================================== */

function mostrarInteiros() {
    if (estado.indice >= estado.questoes.length) {
        finalizarAtividade();
        return;
    }

    estado.errou = false;
    estado.respostaConferida = false;

    el("numeroQuestao").textContent =
        `Questão ${estado.indice+1} de ${estado.questoes.length}`;

    el("instrucaoQuestao").textContent = "Resolva a questão:";

    el("barraQuestao").style.width =
        `${estado.indice/estado.questoes.length*100}%`;

    renderizarInteiro(estado.questoes[estado.indice]);
}

/* =====================================================
   TECLADO VIRTUAL
===================================================== */

function montarTecladoInteiros() {
    el("teclado").innerHTML = "";

    ["1","2","3","4","5","6","7","8","9","+","0","−","C","⌫"].forEach(t=>{
        const b = document.createElement("button");

        b.type = "button";
        b.textContent = t;
        b.onclick = () => digitarInteiro(t);

        el("teclado").appendChild(b);
    });

    el("respostaInteiro")?.addEventListener("input",e=>{
        e.target.value = e.target.value.replace(/[^0-9+-]/g,"");
    });
}

function digitarInteiro(t) {
    const c = el("respostaInteiro");

    if (!c) return;

    if (t === "C") {
        c.value = "";
    }

    else if (t === "⌫") {
        c.value = c.value.slice(0,-1);
    }

    else if (t === "+" || t === "−") {
        if (!c.value) {
            c.value = t === "−" ? "-" : "+";
        }
    }

    else {
        c.value += t;
    }

    c.focus();
}

/* =====================================================
   TENTAR NOVAMENTE
===================================================== */

function tentarNovamenteInteiros() {
    el("feedback").textContent = "";

    el("acoesQuestao").innerHTML = `
        <button class="botao-secundario"
            onclick="pularQuestao()">
            Pular questão
        </button>
    `;

    if (el("respostaInteiro")) {
        el("respostaInteiro").value = "";
        el("respostaInteiro").focus();
    }

    if (el("sinalPrimeiro")) {
        el("sinalPrimeiro").value = "";
    }

    if (el("sinalSegundo")) {
        el("sinalSegundo").value = "";
    }

    if (el("sinalComparacao")) {
        el("sinalComparacao").value = "";
    }
}

function incorreta() {
    estado.errou = true;

    el("feedback").textContent =
        "Resposta incorreta. Tente novamente! ❌";

    el("acoesQuestao").innerHTML = `
        <button class="botao-principal"
            onclick="tentarNovamenteInteiros()">
            Tentar novamente
        </button>

        <button class="botao-secundario"
            onclick="pularQuestao()">
            Pular questão
        </button>
    `;
}

function correta() {
    if (estado.respostaConferida) return;

    estado.respostaConferida = true;

    const q = estado.questoes[estado.indice];

    if (q.tipo === "comparando") {
        const palavras = {
            "<":"é menor que",
            "=":"é igual a",
            ">":"é maior que"
        };

        el("feedback").textContent =
            `${formatarNumero(q.a)} ${palavras[q.resposta]} ${formatarNumero(q.b)}. ✅`;
    } else {
        el("feedback").textContent = "Resposta correta! ✅";
    }

    estado.resultados.push({
        correto:true,
        corrigida:estado.errou,
        pulada:false
    });

    document.querySelectorAll(
        "#areaQuestao input, #areaQuestao select, #areaQuestao .opcao-inteiro"
    ).forEach(x=>x.disabled=true);

    const botao = document.querySelector(".botao-ok-resposta");

    if (botao) botao.disabled = true;

    setTimeout(()=>{
        estado.indice++;
        mostrarInteiros();
    },1800);
}

/* =====================================================
   CONFERÊNCIA DAS RESPOSTAS
===================================================== */

function conferirValor(v) {
    const q = estado.questoes[estado.indice];

    /* CORRIJA O ERRO */

    if (q.tipo === "corrija") {

        if (etapa === "classificar") {
            if (String(v) !== q.classificacao) {
                incorreta();
                return;
            }

            if (q.classificacao === "Correto") {
                correta();
                return;
            }

            etapa = "resultado";

            const opcoes = [
                q.resultado,
                q.resultado+1,
                q.resultado-1,
                q.resultado+2
            ];

            el("feedback").textContent =
                "Muito bem! Agora escolha o resultado correto.";

            el("areaQuestao").innerHTML = `
                <div class="expressao-corrigir">
                    ${expressaoCorrigir(q)}
                </div>

                <p>Qual é o resultado correto?</p>

                ${opcoesHTML(opcoes)}

                <div class="area-botao-ok">
                    <button class="botao-ok-resposta"
                        onclick="confirmarAtividade()">
                        OK ✅
                    </button>
                </div>
            `;

            return;
        }

        if (etapa === "resultado") {
            Number(v) === q.resultado
                ? correta()
                : incorreta();

            return;
        }
    }

    /* PROCEDIMENTOS */

    if (
        q.tipo === "procedimento" ||
        q.tipo === "entendendo"
    ) {
        String(v) === q.procedimento
            ? correta()
            : incorreta();

        return;
    }

    /* COMPARAÇÃO */

    if (q.tipo === "comparando") {
        const sinal = el("sinalComparacao")?.value;

        if (!sinal) {
            el("feedback").textContent =
                "Selecione o sinal de comparação.";
            return;
        }

        sinal === q.resposta
            ? correta()
            : incorreta();

        return;
    }

    /* DETERMINE O SINAL */

    if (q.tipo === "determineSinal") {
        const primeiro = el("sinalPrimeiro")?.value || "";
        const segundo = el("sinalSegundo")?.value || "";

        if (segundo !== "+" && segundo !== "-") {
            el("feedback").textContent =
                "Preencha obrigatoriamente o segundo sinal.";
            return;
        }

        const valorA = primeiro === "-" ? -q.a : q.a;
        const valorB = segundo === "-" ? -q.b : q.b;

        valorA + valorB === q.resposta
            ? correta()
            : incorreta();

        return;
    }

    /* DEMAIS QUESTÕES */

    String(v) === String(q.resposta)
        ? correta()
        : incorreta();
}

function responderInteiro(v) {
    if (!estado.respostaConferida) {
        conferirValor(v);
    }
}

/* =====================================================
   CONFIRMAR RESPOSTA
===================================================== */

function confirmarInteiros() {
    if (estado.respostaConferida) return;

    const q = estado.questoes[estado.indice];

    if (
        ["sinal","procedimento","entendendo"].includes(q.tipo) ||
        q.tipo === "corrija"
    ) {
        el("feedback").textContent = "Escolha uma das opções.";
        return;
    }

    if (q.tipo === "comparando") {
        const sinal = el("sinalComparacao")?.value;

        if (!sinal) {
            el("feedback").textContent =
                "Selecione o sinal de comparação.";
            return;
        }

        conferirValor(null);
        return;
    }

    if (q.tipo === "reta") {
        if (destino === null) {
            el("feedback").textContent =
                "Escolha uma posição na reta.";

            return;
        }

        responderInteiro(destino);
        return;
    }

    if (q.tipo === "determineSinal") {
        conferirValor(null);
        return;
    }

    const c = el("respostaInteiro");

    if (!c || !c.value.trim()) {
        el("feedback").textContent = "Digite sua resposta.";
        return;
    }

    if (!/^[+-]?\d+$/.test(c.value.trim())) {
        el("feedback").textContent =
            "Digite um número inteiro válido.";

        return;
    }

    responderInteiro(Number(c.value));
}

/* =====================================================
   PULAR QUESTÃO
===================================================== */

function pularInteiros() {
    if (estado.respostaConferida) return;

    estado.resultados.push({
        correto:false,
        corrigida:false,
        pulada:true
    });

    estado.indice++;
    mostrarInteiros();
}

/* =====================================================
   REVISÃO
===================================================== */

function revisarInteiros() {
    const cfg = estado.ultimaConfiguracao;

    estado.operacao = "inteiros";
    estado.modalidade = cfg.modalidade;
    estado.opcoes = {...cfg.opcoes};

    estado.questoes = gerarLista(
        estado.modalidade,
        estado.opcoes.quantidade
    );

    estado.indice = 0;
    estado.resultados = [];
    estado.errou = false;
    estado.respostaConferida = false;

    mostrarTela("estudo");

    iniciarCronometro();
    mostrarInteiros();
}

/* =====================================================
   DESEMPENHO E ÁRVORE
===================================================== */

function atualizarDesempenhoCompleto() {
    if (typeof window.atualizarDesempenho === "function") {
        window.atualizarDesempenho();
    }
}

/* =====================================================
   INTEGRAÇÃO COM SCRIPT.JS
===================================================== */

window.abrirOperacao = op =>
    op === "inteiros"
        ? abrirInteiros()
        : original.abrir(op);

window.selecionarModalidade = (id,b) =>
    String(id).startsWith("inteiros_")
        ? selecionarInteiros(id,b)
        : original.selecionar(id,b);

window.iniciarAtividade = () =>
    estado.operacao === "inteiros"
        ? iniciarInteiros()
        : original.iniciar();

window.gerarQuestoes = () =>
    estado.operacao === "inteiros"
        ? gerarLista(estado.modalidade,estado.opcoes.quantidade)
        : original.gerar();

window.mostrarQuestao = () =>
    estado.operacao === "inteiros"
        ? mostrarInteiros()
        : original.mostrar();

window.montarTeclado = () =>
    estado.operacao === "inteiros"
        ? montarTecladoInteiros()
        : original.teclado();

window.confirmarAtividade = () =>
    estado.operacao === "inteiros"
        ? confirmarInteiros()
        : original.confirmar();

window.pularQuestao = () =>
    estado.operacao === "inteiros"
        ? pularInteiros()
        : original.pular();

window.revisarAtividade = () =>
    estado.ultimaConfiguracao?.operacao === "inteiros"
        ? revisarInteiros()
        : original.revisar();

window.responderInteiro = responderInteiro;
window.selecionarPontoReta = selecionarPontoReta;
window.iniciarArrasteReta = iniciarArrasteReta;
window.tentarNovamenteInteiros = tentarNovamenteInteiros;

atualizarDesempenhoCompleto();

})();
