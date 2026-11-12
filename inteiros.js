/* =====================================================
   MATEMÁTICA COM DETALHES
   MÓDULO COMPLEMENTAR: NÚMEROS INTEIROS
===================================================== */

const totalModalidades = 25;

const modalidadesInteiros = [
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

modalidades.inteiros = modalidadesInteiros;

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

const abrirOperacaoOriginal = abrirOperacao;
const selecionarModalidadeOriginal = selecionarModalidade;
const iniciarAtividadeOriginal = iniciarAtividade;
const mostrarQuestaoOriginal = mostrarQuestao;
const montarTecladoOriginal = montarTeclado;
const conferirRespostaOriginal = conferirResposta;
const atualizarDesempenhoOriginal = atualizarDesempenho;
const atualizarArvoreOriginal = atualizarArvore;

let respostaInteiro = "";
let destinoSelecionado = null;
let questaoInteiroAtual = null;

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function inteiroAleatorio() {
    let n = 0;

    while (n === 0) {
        n = aleatorio(-20, 20);
    }

    return n;
}

function sinal(n) {
    return n >= 0 ? "+" : "−";
}

function numeroBonito(n) {
    return n > 0 ? `+${n}` : String(n);
}

function formatarOperacao(a, op, b) {
    return `${numeroBonito(a)} ${op} (${numeroBonito(b)})`;
}

function escolhaAleatoria(lista) {
    return lista[aleatorio(0, lista.length - 1)];
}

function embaralharOpcoes(lista) {
    return embaralhar(lista);
}

function criarDistratores(resposta) {
    const opcoes = new Set([resposta]);

    while (opcoes.size < 4) {
        let n = resposta + aleatorio(-8, 8);

        if (n !== resposta) {
            opcoes.add(n);
        }
    }

    return embaralharOpcoes([...opcoes]);
}

/* =====================================================
   ABRIR A ÁREA
===================================================== */

function abrirOperacao(op) {
    if (op !== "inteiros") {
        abrirOperacaoOriginal(op);
        return;
    }

    pararCronometro();

    estado.operacao = "inteiros";
    estado.modalidade = "";

    $("tituloOperacao").textContent = "Números Inteiros";

    $("descricaoOperacao").textContent =
        "Aprenda a trabalhar com números positivos e negativos. Escolha uma modalidade para começar.";

    $("configuracao").classList.add("escondida");

    $("listaModalidades").innerHTML =
        modalidadesInteiros.map(([id, nome], i) => `
            <button class="modalidade"
                onclick="selecionarModalidade('inteiros_${id}',this)">
                ${i + 1}. ${nome}
            </button>
        `).join("");

    mostrarTela("operacao");
}

/* =====================================================
   SELEÇÃO DAS MODALIDADES
===================================================== */

function selecionarModalidade(id, botao) {
    if (!id.startsWith("inteiros_")) {
        selecionarModalidadeOriginal(id, botao);
        return;
    }

    estado.modalidade = id.replace("inteiros_", "");

    document.querySelectorAll(".modalidade").forEach(b =>
        b.classList.remove("selecionada")
    );

    botao.classList.add("selecionada");

    const nome = modalidadesInteiros.find(
        m => m[0] === estado.modalidade
    )[1];

    $("tituloConfiguracao").textContent = nome;

    $("opcoesConfiguracao").innerHTML = `
        <p>Quantidade de questões</p>

        <select id="quantidade">
            ${[10,20,30,40,50].map(n => `
                <option value="${n}" ${n === 10 ? "selected" : ""}>
                    ${n} questões
                </option>
            `).join("")}
        </select>

        <p class="nota-conta">
            Os números utilizados variam entre −20 e +20.
            O zero não será utilizado como operando ou fator.
        </p>
    `;

    $("configuracao").classList.remove("escondida");
}

/* =====================================================
   CLASSIFICAÇÃO DO PROCEDIMENTO
===================================================== */

function classificarProcedimento(a, b, op) {
    const segundoEfetivo = op === "−" ? -b : b;

    if (Math.sign(a) === Math.sign(segundoEfetivo)) {
        return a < 0
            ? "Somar e repetir o sinal negativo."
            : "Somar e repetir o sinal positivo.";
    }

    if (Math.abs(a) > Math.abs(segundoEfetivo)) {
        return a < 0
            ? "Subtrair e manter o sinal do número de maior valor absoluto negativo."
            : "Subtrair e manter o sinal do número de maior valor absoluto positivo.";
    }

    return segundoEfetivo < 0
        ? "Subtrair e manter o sinal do número de maior valor absoluto negativo."
        : "Subtrair e manter o sinal do número de maior valor absoluto positivo.";
}

/* =====================================================
   GERAÇÃO DAS QUESTÕES
===================================================== */

function gerarInteiros(tipo, quantidade) {
    const lista = [];

    for (let i = 0; i < quantidade; i++) {
        let a, b, c, op, resultado, procedimento;

        switch (tipo) {

            case "reta": {
                a = inteiroAleatorio();
                b = inteiroAleatorio();

                while (a + b < -20 || a + b > 20) {
                    a = inteiroAleatorio();
                    b = inteiroAleatorio();
                }

                lista.push({
                    tipo,
                    a,
                    b,
                    resposta: a + b
                });
                break;
            }

            case "simples": {
                op = escolhaAleatoria(["+", "−"]);
                a = inteiroAleatorio();
                b = inteiroAleatorio();

                resultado = op === "+" ? a + b : a - b;

                lista.push({
                    tipo,
                    a,
                    b,
                    op,
                    resposta: resultado
                });
                break;
            }

            case "procedimento":
            case "entendendo": {
                op = escolhaAleatoria(["+", "−"]);
                a = inteiroAleatorio();
                b = inteiroAleatorio();

                const segundo = op === "−" ? -b : b;

                if (
                    Math.sign(a) !== Math.sign(segundo) &&
                    Math.abs(a) === Math.abs(segundo)
                ) {
                    b = b === 1 ? 2 : b - 1;
                }

                procedimento = classificarProcedimento(a, b, op);

                lista.push({
                    tipo,
                    a,
                    b,
                    op,
                    resposta: procedimento,
                    opcoes: [
                        "Somar e repetir o sinal negativo.",
                        "Somar e repetir o sinal positivo.",
                        "Subtrair e manter o sinal do número de maior valor absoluto positivo.",
                        "Subtrair e manter o sinal do número de maior valor absoluto negativo."
                    ]
                });
                break;
            }

            case "multiplicacao": {
                a = inteiroAleatorio();
                b = inteiroAleatorio();

                lista.push({
                    tipo,
                    a,
                    b,
                    resposta: a * b
                });
                break;
            }

            case "divisao": {
                b = inteiroAleatorio();
                c = inteiroAleatorio();

                resultado = b;
                a = b * c;

                lista.push({
                    tipo,
                    a,
                    b: c,
                    resposta: resultado
                });
                break;
            }

            case "sinal": {
                const qtd = Math.random() < 0.5 ? 2 : 3;
                const fatores = [];

                for (let j = 0; j < qtd; j++) {
                    fatores.push(inteiroAleatorio());
                }

                resultado = fatores.reduce((x, y) => x * y, 1);

                lista.push({
                    tipo,
                    fatores,
                    resposta: resultado > 0 ? "+" : "−",
                    modulo: Math.abs(resultado)
                });
                break;
            }

            case "comparando": {
                a = inteiroAleatorio();
                b = inteiroAleatorio();

                lista.push({
                    tipo,
                    a,
                    b,
                    resposta: a > b ? ">" : a < b ? "<" : "="
                });
                break;
            }

            case "distancia": {
                a = inteiroAleatorio();
                b = inteiroAleatorio();

                lista.push({
                    tipo,
                    a,
                    b,
                    resposta: Math.abs(a - b)
                });
                break;
            }

            case "falta": {
                op = escolhaAleatoria(["+", "−", "×"]);
                a = inteiroAleatorio();
                b = inteiroAleatorio();

                if (op === "+") {
                    resultado = a + b;
                    lista.push({
                        tipo,
                        texto: `${numeroBonito(a)} + [ ? ] = ${numeroBonito(resultado)}`,
                        resposta: b
                    });
                }

                if (op === "−") {
                    resultado = a - b;
                    lista.push({
                        tipo,
                        texto: `[ ? ] − (${numeroBonito(b)}) = ${numeroBonito(resultado)}`,
                        resposta: a
                    });
                }

                if (op === "×") {
                    resultado = a * b;
                    lista.push({
                        tipo,
                        texto: `${numeroBonito(a)} × [ ? ] = ${numeroBonito(resultado)}`,
                        resposta: b
                    });
                }
                break;
            }

            case "corrija": {
                op = escolhaAleatoria(["+", "−", "×"]);
                a = inteiroAleatorio();
                b = inteiroAleatorio();

                resultado =
                    op === "+" ? a + b :
                    op === "−" ? a - b :
                    a * b;

                const correto = Math.random() < 0.5;
                let apresentado = resultado;

                if (!correto) {
                    apresentado = resultado + escolhaAleatoria([-3,-2,-1,1,2,3]);
                }

                lista.push({
                    tipo,
                    a,
                    b,
                    op,
                    apresentado,
                    resposta: correto ? "Correto" : "Incorreto",
                    resultado
                });
                break;
            }
        }
    }

    return embaralhar(lista);
}

/* =====================================================
   INICIAR ESTUDO
===================================================== */

function iniciarAtividade() {
    if (estado.operacao !== "inteiros") {
        iniciarAtividadeOriginal();
        return;
    }

    const quantidade = Number($("quantidade").value);

    estado.opcoes = { quantidade };

    estado.ultimaConfiguracao = {
        operacao: "inteiros",
        modalidade: estado.modalidade,
        opcoes: { quantidade }
    };

    estado.questoes = gerarInteiros(
        estado.modalidade,
        quantidade
    );

    estado.indice = 0;
    estado.resultados = [];
    estado.errou = false;
    estado.respostaConferida = false;

    mostrarTela("estudo");
    iniciarCronometro();
    mostrarQuestao();
}

/* =====================================================
   MONTAGEM DA RETA NUMÉRICA
===================================================== */

function montarReta(q) {
    destinoSelecionado = null;

    const pontos = [];

    for (let n = -20; n <= 20; n++) {
        pontos.push(`
            <button class="reta-ponto"
                data-valor="${n}"
                onclick="selecionarPontoReta(${n})">
                ${n}
            </button>
        `);
    }

    return `
        <div class="expressao-inteiros">
            Comece no ${numeroBonito(q.a)}.
            <br>
            ${q.b > 0 ? "Avance" : "Volte"} ${Math.abs(q.b)} unidades.
        </div>

        <div class="reta-container">
            <div class="reta-numerica">
                <div class="reta-linha"></div>
                ${pontos.join("")}
            </div>

            <div class="reta-legenda">
                <span>🟢 Posição inicial: ${q.a}</span>
                <span>🔴 Escolha a posição final</span>
            </div>
        </div>

        <p id="destinoReta" class="nota-conta">
            Clique no número em que você acredita que deve chegar.
        </p>
    `;
}

function selecionarPontoReta(valor) {
    destinoSelecionado = valor;

    document.querySelectorAll(".reta-ponto").forEach(p => {
        p.classList.toggle(
            "selecionado",
            Number(p.dataset.valor) === valor
        );
    });

    $("destinoReta").textContent =
        `Você escolheu ${numeroBonito(valor)}.`;
}

/* =====================================================
   RENDERIZAÇÃO
===================================================== */

function mostrarQuestao() {
    if (estado.operacao !== "inteiros") {
        mostrarQuestaoOriginal();
        return;
    }

    if (estado.indice >= estado.questoes.length) {
        finalizarAtividade();
        return;
    }

    const q = estado.questoes[estado.indice];

    questaoInteiroAtual = q;
    estado.errou = false;
    estado.respostaConferida = false;
    respostaInteiro = "";
    destinoSelecionado = null;

    $("feedback").textContent = "";

    $("numeroQuestao").textContent =
        `Questão ${estado.indice + 1} de ${estado.questoes.length}`;

    $("barraQuestao").style.width =
        `${estado.indice / estado.questoes.length * 100}%`;

    $("instrucaoQuestao").textContent =
        "Resolva a questão:";

    let html = "";

    if (q.tipo === "reta") {
        html = montarReta(q);
    }

    if (q.tipo === "simples") {
        html = `
            <div class="expressao-inteiros">
                ${formatarOperacao(q.a, q.op, q.b)}
            </div>
            <input id="respostaInteiro"
                class="resposta-inteiros"
                placeholder="Sua resposta"
                inputmode="text">
        `;
    }

    if (q.tipo === "multiplicacao") {
        html = `
            <div class="expressao-inteiros">
                (${numeroBonito(q.a)}) × (${numeroBonito(q.b)})
            </div>
            <input id="respostaInteiro"
                class="resposta-inteiros"
                placeholder="Sua resposta"
                inputmode="text">
        `;
    }

    if (q.tipo === "divisao") {
        html = `
            <div class="expressao-inteiros">
                (${numeroBonito(q.a)}) ÷ (${numeroBonito(q.b)})
            </div>
            <input id="respostaInteiro"
                class="resposta-inteiros"
                placeholder="Sua resposta"
                inputmode="text">
        `;
    }

    if (q.tipo === "sinal") {
        html = `
            <div class="expressao-inteiros">
                ${q.fatores.map(n => `(${numeroBonito(n)})`).join(" × ")}
                <br>
                <span style="font-size:22px">
                    O resultado tem módulo ${q.modulo}.
                </span>
            </div>

            <div class="opcoes-inteiros">
                <button class="opcao-inteiro" onclick="responderInteiro('+')">
                    + Positivo
                </button>
                <button class="opcao-inteiro" onclick="responderInteiro('−')">
                    − Negativo
                </button>
            </div>
        `;
    }

    if (q.tipo === "procedimento" || q.tipo === "entendendo") {
        html = `
            <div class="expressao-inteiros">
                ${formatarOperacao(q.a, q.op, q.b)}
            </div>

            <p>Qual procedimento deve ser utilizado?</p>

            <div class="opcoes-inteiros">
                ${q.opcoes.map(o => `
                    <button class="opcao-inteiro"
                        onclick="responderInteiro('${o.replace(/'/g, "\\'")}')">
                        ${o}
                    </button>
                `).join("")}
            </div>
        `;
    }

    if (q.tipo === "comparando") {
        html = `
            <div class="expressao-inteiros">
                ${numeroBonito(q.a)} ___ ${numeroBonito(q.b)}
            </div>

            <div class="opcoes-inteiros">
                ${["<", ">", "="].map(o => `
                    <button class="opcao-inteiro"
                        onclick="responderInteiro('${o}')">
                        ${o}
                    </button>
                `).join("")}
            </div>
        `;
    }

    if (q.tipo === "distancia") {
        html = `
            <div class="expressao-inteiros">
                Qual é a distância entre
                ${numeroBonito(q.a)} e ${numeroBonito(q.b)}?
            </div>

            <input id="respostaInteiro"
                class="resposta-inteiros"
                placeholder="Sua resposta"
                inputmode="text">
        `;
    }

    if (q.tipo === "falta") {
        html = `
            <div class="expressao-inteiros">
                ${q.texto}
            </div>

            <input id="respostaInteiro"
                class="resposta-inteiros"
                placeholder="Número que falta"
                inputmode="text">
        `;
    }

    if (q.tipo === "corrija") {
        html = `
            <div class="expressao-inteiros">
                ${formatarOperacao(q.a, q.op, q.b)}
                <br>
                = ${numeroBonito(q.apresentado)}
            </div>

            <div class="opcoes-inteiros">
                <button class="opcao-inteiro"
                    onclick="responderInteiro('Correto')">
                    Está correto
                </button>

                <button class="opcao-inteiro"
                    onclick="responderInteiro('Incorreto')">
                    Está incorreto
                </button>
            </div>
        `;
    }

    $("areaQuestao").innerHTML = html;

    $("areaQuestao").insertAdjacentHTML(
        "beforeend",
        `<div class="area-botao-ok">
            <button class="botao-ok-resposta"
                onclick="confirmarAtividade()">
                OK ✅
            </button>
        </div>`
    );

    $("acoesQuestao").innerHTML = `
        <button class="botao-secundario"
            onclick="pularQuestao()">
            Pular questão
        </button>
    `;

    montarTeclado();
}

/* =====================================================
   RESPOSTAS E TECLADO
===================================================== */

function montarTeclado() {
    if (estado.operacao !== "inteiros") {
        montarTecladoOriginal();
        return;
    }

    $("teclado").innerHTML = "";

    const teclas = [
        "1","2","3",
        "4","5","6",
        "7","8","9",
        "+","0","−",
        "C","⌫"
    ];

    teclas.forEach(n => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = n;
        b.onclick = () => digitarInteiro(n);
        $("teclado").appendChild(b);
    });

    $("respostaInteiro")?.addEventListener("input", e => {
        e.target.value = e.target.value.replace(/[^0-9+\-]/g, "");
    });
}

function digitarInteiro(n) {
    const campo = $("respostaInteiro");

    if (!campo) return;

    if (n === "C") {
        campo.value = "";
        return;
    }

    if (n === "⌫") {
        campo.value = campo.value.slice(0, -1);
        return;
    }

    if (n === "+" || n === "−") {
        if (campo.value.length === 0) {
            campo.value = n === "−" ? "-" : "+";
        }
        return;
    }

    campo.value += n;
}

/* =====================================================
   CONFERÊNCIA
===================================================== */

function responderInteiro(valor) {
    if (estado.respostaConferida) return;

    const q = estado.questoes[estado.indice];

    const correto = String(valor) === String(q.resposta);

    if (correto) {
        respostaCorreta();
    } else {
        respostaIncorreta();
    }
}

function confirmarAtividade() {
    if (estado.operacao !== "inteiros") {
        if (typeof confirmarAtividadeOriginal === "function") {
            if (estado.modalidade === "sequencia") {
                conferirSequencia();
            } else {
                conferirRespostaOriginal();
            }
        }
        return;
    }

    if (estado.respostaConferida) return;

    const q = estado.questoes[estado.indice];

    if (q.tipo === "reta") {
        if (destinoSelecionado === null) {
            $("feedback").textContent =
                "Escolha um número na reta.";
            return;
        }

        responderInteiro(destinoSelecionado);
        return;
    }

    if (
        ["sinal","procedimento","entendendo","comparando","corrija"]
        .includes(q.tipo)
    ) {
        $("feedback").textContent =
            "Escolha uma das opções.";
        return;
    }

    const campo = $("respostaInteiro");

    if (!campo || campo.value.trim() === "") {
        $("feedback").textContent =
            "Digite sua resposta.";
        return;
    }

    const resposta = campo.value.replace(",", ".");

    if (!/^[+-]?\d+$/.test(resposta)) {
        $("feedback").textContent =
            "Digite um número inteiro válido.";
        return;
    }

    responderInteiro(Number(resposta));
}

/* =====================================================
   DESEMPENHO: 25 MODALIDADES
===================================================== */

function atualizarDesempenho() {
    const chaves = [
        ...Object.keys(modalidades).flatMap(op =>
            modalidades[op].map(([id]) => `${op}_${id}`)
        )
    ];

    const itens = chaves
        .filter(k => progresso[k])
        .map(k => progresso[k]);

    const verdes = itens.filter(v =>
        v.verdeConquistado
    ).length;

    const amarelas = itens.filter(v => {
        const ultima = v.tentativas?.at(-1);

        return !v.verdeConquistado &&
            ultima &&
            ultima.percentual > 50;
    }).length;

    const vermelhas = itens.filter(v => {
        const ultima = v.tentativas?.at(-1);

        return !v.verdeConquistado &&
            ultima &&
            ultima.percentual <= 50;
    }).length;

    const naoIniciadas = Math.max(
        0,
        totalModalidades - itens.length
    );

    const percentual = Math.round(
        verdes / totalModalidades * 100
    );

    $("percentualGeral").textContent =
        `${percentual}%`;

    $("textoProgresso").textContent =
        `${verdes} de ${totalModalidades} modalidades dominadas`;

    $("barraProgresso").style.width =
        `${percentual}%`;

    $("qtdVerdes").textContent = verdes;
    $("qtdAmarelas").textContent = amarelas;
    $("qtdVermelhas").textContent = vermelhas;
    $("qtdNaoIniciadas").textContent = naoIniciadas;

    $("faltam").textContent =
        `Faltam ${totalModalidades - verdes} modalidades para dominar tudo.`;

    atualizarArvore();
}

/* =====================================================
   ÁRVORE DO CONHECIMENTO
===================================================== */

function atualizarArvore() {
    const total = Object.values(progresso).filter(
        v => v.verdeConquistado
    ).length;

    let arvore = "🌱";
    let mensagem = "Sua árvore está começando a crescer.";

    if (total >= 5) {
        arvore = "🌿";
        mensagem = "Sua árvore está criando novos ramos!";
    }

    if (total >= 10) {
        arvore = "🌳";
        mensagem = "Sua árvore está ficando forte!";
    }

    if (total >= 18) {
        arvore = "🌳✨";
        mensagem = "Sua árvore está cheia de conhecimento!";
    }

    if (total >= totalModalidades) {
        arvore = "🌟🌳🌟";
        mensagem = "Você dominou as quatro operações e os números inteiros!";
    }

    $("arvoreVisual").textContent = arvore;
    $("mensagemArvore").textContent = mensagem;

    $("recompensas").innerHTML =
        Object.entries(premios)
            .filter(([chave]) =>
                progresso[chave]?.verdeConquistado
            )
            .map(([, simbolo]) =>
                `<span>${simbolo}</span>`
            )
            .join("");
}

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

atualizarDesempenho();
