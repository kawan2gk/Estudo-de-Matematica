
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

const TOTAL = 25;

const itens = [
    ["reta", "Estudando a reta numérica"],
    ["simples", "Operações simples com inteiros"],
    ["procedimento", "Como obter o resultado"],
    ["multiplicacao", "Multiplicação de inteiros"],
    ["divisao", "Divisão de inteiros"],
    ["sinal", "Qual o sinal?"],
    ["entendendo", "Entendendo operações com inteiros"],
    ["comparando", "Comparando números inteiros"],
    ["distancia", "Distância entre números"],
    ["falta", "Descubra o número que falta"],
    ["corrija", "Corrija o erro"]
];

modalidades.inteiros = itens;

Object.assign(premios, {
    inteiros_reta: "📏",
    inteiros_simples: "➕",
    inteiros_procedimento: "🧠",
    inteiros_multiplicacao: "✖️",
    inteiros_divisao: "➗",
    inteiros_sinal: "🔢",
    inteiros_entendendo: "💡",
    inteiros_comparando: "⚖️",
    inteiros_distancia: "📍",
    inteiros_falta: "❓",
    inteiros_corrija: "🎯"
});

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

const el = id => document.getElementById(id);

const rand = (a,b) =>
    Math.floor(Math.random() * (b-a+1)) + a;

const pick = lista =>
    lista[rand(0,lista.length-1)];

const shuffle = lista => {
    const copia = [...lista];

    for (let i=copia.length-1; i>0; i--) {
        const j = rand(0,i);
        [copia[i],copia[j]] = [copia[j],copia[i]];
    }

    return copia;
};

// Número inteiro entre os limites, incluindo zero.
const inteiro = (min,max) => rand(min,max);

// Número entre -20 e 20, sem zero.
const nz = () => {
    let n = 0;

    while (n === 0) {
        n = rand(-20,20);
    }

    return n;
};

// Número entre -10 e 10, incluindo zero.
const fatorPequeno = () => rand(-10,10);

// Número entre -15 e 15, incluindo zero.
const numeroFalta = () => rand(-15,15);

/* =====================================================
   PROCEDIMENTOS DAS OPERAÇÕES
===================================================== */

const PROCEDIMENTOS = [
    "Somar e repetir o sinal negativo.",
    "Somar e repetir o sinal positivo.",
    "Subtrair e manter o sinal do número de maior valor absoluto positivo.",
    "Subtrair e manter o sinal do número de maior valor absoluto negativo."
];

// Exibe os números negativos entre parênteses.
function formatar(a,op,b) {
    if (op === "+") {
        return `${a} + (${b})`;
    }

    if (op === "−" || op === "-") {
        return `${a} − (${b})`;
    }

    return `${a} ${op} ${b}`;
}

// Na subtração, considera-se a soma do oposto.
function classificar(a,b,op) {
    const segundo = op === "−" ? -b : b;

    if (a === 0 || segundo === 0) {
        if (a === 0 && segundo === 0) {
            return PROCEDIMENTOS[1];
        }

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

    if (Math.abs(a) > Math.abs(segundo)) {
        return a < 0
            ? PROCEDIMENTOS[3]
            : PROCEDIMENTOS[2];
    }

    if (Math.abs(segundo) > Math.abs(a)) {
        return segundo < 0
            ? PROCEDIMENTOS[3]
            : PROCEDIMENTOS[2];
    }

    return "Os números têm o mesmo valor absoluto e sinais opostos. O resultado é zero.";
}

/* =====================================================
   GERAÇÃO DAS QUESTÕES
===================================================== */

function gerar(tipo) {
    let a,b,op,r;

    switch(tipo) {

        case "reta": {
            a = nz();

            const passos = [];

            for (let n=-20; n<=20; n++) {
                if (n !== 0 && a+n >= -20 && a+n <= 20) {
                    passos.push(n);
                }
            }

            b = pick(passos);

            return {
                tipo,a,b,
                resposta:a+b
            };
        }

        case "simples":
        case "procedimento":
        case "entendendo": {
            op = pick(["+","−"]);
            a = nz();
            b = nz();

            r = op === "+" ? a+b : a-b;

            return {
                tipo,
                a,b,op,
                resposta:r,
                procedimento:classificar(a,b,op)
            };
        }

        case "multiplicacao": {
            a = fatorPequeno();
            b = fatorPequeno();

            return {
                tipo,
                a,b,
                resposta:a*b
            };
        }

        case "divisao":
            return {
                tipo,
                ...divisaoExata()
            };

        case "sinal": {
            const fatores = Array.from(
                {length:Math.random()<0.5?2:3},
                nz
            );

            r = fatores.reduce((x,y)=>x*y,1);

            return {
                tipo,
                fatores,
                resposta:r>0?"+":"−",
                modulo:Math.abs(r)
            };
        }

        case "comparando": {
            a = nz();
            b = nz();

            return {
                tipo,
                a,b,
                resposta:a>b?">":a<b?"<":"="
            };
        }

        case "distancia": {
            a = nz();
            b = nz();

            return {
                tipo,
                a,b,
                resposta:Math.abs(a-b)
            };
        }

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

        case "corrija": {
            op = pick(["+","−","×"]);

            if (op === "×") {
                a = fatorPequeno();
                b = fatorPequeno();
            } else {
                a = numeroFalta();
                b = numeroFalta();
            }

            r = op === "+"
                ? a+b
                : op === "−"
                    ? a-b
                    : a*b;

            const correto = Math.random() < 0.5;

            let apresentado = r;

            if (!correto) {
                let diferenca = pick([-4,-3,-2,-1,1,2,3,4]);

                apresentado = r+diferenca;
            }

            return {
                tipo,a,b,op,
                resposta:correto?"Correto":"Incorreto",
                classificacao:correto?"Correto":"Incorreto",
                resultado:r,
                apresentado
            };
        }
    }
}

/* =====================================================
   DIVISÃO EXATA DA TABUADA DE 0 A 10
===================================================== */

function divisaoExata() {
    const divisorPositivo = rand(1,10);
    const quocientePositivo = rand(0,10);

    const sinalDivisor = Math.random()<0.5 ? -1 : 1;
    const sinalDividendo = Math.random()<0.5 ? -1 : 1;

    const divisor = divisorPositivo*sinalDivisor;

    const dividendo =
        divisorPositivo*quocientePositivo*sinalDividendo;

    const resposta =
        dividendo/divisor;

    return {
        dividendo,
        divisor,
        resposta
    };
}

/* =====================================================
   GERAÇÃO DA LISTA
   A CADA CINCO QUESTÕES ALEATÓRIAS,
   A SEXTA SERÁ UMA COMPARAÇÃO IGUAL.
===================================================== */

function gerarLista(tipo,qtd) {
    const lista = [];

    for (let i=0; i<qtd; i++) {

        if (tipo === "comparando" && (i+1)%6 === 0) {
            const valor = nz();

            lista.push({
                tipo,
                a:valor,
                b:valor,
                resposta:"="
            });

        } else {
            lista.push(gerar(tipo));
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
            Comece no ${q.a}.
            ${q.b>0?"Avance":"Volte"} ${Math.abs(q.b)} unidades.
        </div>

        <div class="reta-container">
            <div class="reta-numerica" id="retaNumerica">

                <div class="reta-linha"></div>

                ${Array.from({length:41},(_,i)=>i-20).map(n=>`
                    <button type="button"
                        class="reta-ponto ${n===q.a?"ponto-inicial":""}"
                        data-valor="${n}"
                        onclick="selecionarPontoReta(${n})">
                        ${n}
                    </button>
                `).join("")}

                <button type="button"
                    id="marcadorReta"
                    class="marcador-reta"
                    aria-label="Arraste o marcador"
                    onpointerdown="iniciarArrasteReta(event)">
                    ●
                </button>

            </div>
        </div>

        <p id="destinoReta" class="nota-conta">
            Escolha a posição final na reta numérica.
        </p>
    `;
}

function atualizarReta(n) {
    destino = Math.max(-20,Math.min(20,n));

    document.querySelectorAll(".reta-ponto").forEach(p=>
        p.classList.toggle(
            "selecionado",
            Number(p.dataset.valor)===destino
        )
    );

    const marcador = el("marcadorReta");
    const faixa = el("retaNumerica");

    if (marcador && faixa) {
        marcador.style.left = `${((destino+20)/40)*100}%`;
    }

    if (el("destinoReta")) {
        el("destinoReta").textContent =
            `Destino escolhido: ${destino}`;
    }
}

function moverReta(e) {
    if (!arraste) return;

    const r = el("retaNumerica").getBoundingClientRect();

    atualizarReta(
        Math.round(
            Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*40-20
        )
    );
}

function pararArraste() {
    arraste = false;

    window.removeEventListener("pointermove",moverReta);
    window.removeEventListener("pointerup",pararArraste);
}

function iniciarArrasteReta(e) {
    e.preventDefault();

    arraste = true;

    window.addEventListener("pointermove",moverReta);
    window.addEventListener("pointerup",pararArraste);
}

function selecionarPontoReta(n) {
    atualizarReta(n);
}

/* =====================================================
   BOTÕES DE ALTERNATIVAS
===================================================== */

function opcoesHTML(opcoes) {
    return `
        <div class="opcoes-inteiros">
            ${shuffle(opcoes).map(v=>`
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
                ${formatar(q.a,q.op,q.b)}
            </div>

            <input id="respostaInteiro"
                class="resposta-inteiros"
                inputmode="text"
                placeholder="Sua resposta">
        `;
    }

    else if (q.tipo === "multiplicacao") {
        html = `
            <div class="expressao-inteiros">
                (${q.a}) × (${q.b})
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
                <small>Módulo do resultado: ${q.modulo}. Qual é o sinal?</small>
            </div>

            ${opcoesHTML(["+","−"])}
        `;
    }

    else if (q.tipo === "procedimento" || q.tipo === "entendendo") {
        html = `
            <div class="expressao-inteiros">
                ${formatar(q.a,q.op,q.b)}
            </div>

            <p>Qual procedimento deve ser utilizado?</p>

            ${opcoesHTML(PROCEDIMENTOS)}
        `;
    }

    else if (q.tipo === "comparando") {
        html = `
            <div class="expressao-inteiros">
                ${q.a} ___ ${q.b}
            </div>

            <div class="legenda-comparacao">
                <p><strong>&lt;</strong> | É menor que</p>
                <p><strong>=</strong> | É igual a</p>
                <p><strong>&gt;</strong> | É maior que</p>
            </div>

            ${opcoesHTML(["<",">","="])}
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
            <div class="expressao-inteiros">
                ${q.op==="×"
                    ? `(${q.a}) × (${q.b})`
                    : formatar(q.a,q.op,q.b)}
                <br>
                = ${q.apresentado}
            </div>

            <p>O resultado apresentado está correto?</p>

            ${opcoesHTML(["Correto","Incorreto"])}
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
            "Escolha a posição final na reta numérica.";
    }
}

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
   TECLADO VIRTUAL COM SINAIS
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

    el("feedback").textContent = "Resposta correta! ✅";

    estado.resultados.push({
        correto:true,
        corrigida:estado.errou,
        pulada:false
    });

    document.querySelectorAll(
        "#areaQuestao input, #areaQuestao .opcao-inteiro"
    ).forEach(x=>x.disabled=true);

    const botao = document.querySelector(".botao-ok-resposta");

    if (botao) botao.disabled = true;

    setTimeout(()=>{
        estado.indice++;
        mostrarInteiros();
    },900);
}

/* =====================================================
   CONFERÊNCIA DAS RESPOSTAS
===================================================== */

function conferirValor(v) {
    const q = estado.questoes[estado.indice];

    // CORRIJA O ERRO
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
                <div class="expressao-inteiros">
                    ${q.op==="×"
                        ? `(${q.a}) × (${q.b})`
                        : formatar(q.a,q.op,q.b)}
                    <br>
                    = ${q.apresentado}
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

    // CORREÇÃO DA VALIDAÇÃO DE PROCEDIMENTOS
    if (
        q.tipo === "procedimento" ||
        q.tipo === "entendendo"
    ) {
        String(v) === q.procedimento
            ? correta()
            : incorreta();

        return;
    }

    // DEMAIS QUESTÕES
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
        ["sinal","procedimento","entendendo","comparando"].includes(q.tipo) ||
        (q.tipo === "corrija" && etapa === "classificar") ||
        (q.tipo === "corrija" && etapa === "resultado")
    ) {
        el("feedback").textContent = "Escolha uma das opções.";
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
    // O script.js já calcula o desempenho usando
    // todas as modalidades cadastradas.
    // Como "inteiros" foi acrescentado ao objeto modalidades,
    // o total passa automaticamente a ser 25.

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

// Atualiza o painel depois de cadastrar as 11 modalidades.
atualizarDesempenhoCompleto();

})();
