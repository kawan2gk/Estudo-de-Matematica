
/* ==========================================
   CURSO DE MATEMÁTICA BÁSICA
   SCRIPT PRINCIPAL
   ========================================== */

const $ = id => document.getElementById(id);

const CHAVE = "cursoMatematicaProgresso";

const NOMES = {
    soma: "Soma",
    subtracao: "Subtração",
    multiplicacao: "Multiplicação",
    divisao: "Divisão"
};

const MODALIDADES = {
    soma: [
        ["sequencial", "Soma Sequencial"],
        ["diversas", "Somas Diversas"],
        ["tabuada", "Memorizar Tabuada"]
    ],
    subtracao: [
        ["sequencial", "Subtração Sequencial"],
        ["diversas", "Subtrações Diversas"],
        ["tabuada", "Memorizar Tabuada"]
    ],
    multiplicacao: [
        ["sequencial", "Multiplicação Sequencial"],
        ["diversas", "Multiplicações Diversas"],
        ["sequencia", "Estudar Sequência Numérica"],
        ["tabuada", "Memorizar Tabuada"]
    ],
    divisao: [
        ["pratica", "Prática de Divisão"],
        ["sequencia", "Sequencial dos Números"],
        ["resto", "Divisão com Resto"],
        ["tabuada", "Memorizar Tabuada"]
    ]
};

const RECOMPENSAS = {
    soma_sequencial: "＋",
    soma_diversas: "🌸",
    soma_tabuada: "🦋",
    subtracao_sequencial: "−",
    subtracao_diversas: "🍎",
    subtracao_tabuada: "🐦",
    multiplicacao_sequencial: "×",
    multiplicacao_diversas: "🍃",
    multiplicacao_sequencia: "🪺",
    multiplicacao_tabuada: "🌼",
    divisao_pratica: "÷",
    divisao_sequencia: "🦋",
    divisao_resto: "🐦",
    divisao_tabuada: "🍎"
};

let progresso = carregarProgresso();

let estado = {
    operacao: "",
    modalidade: "",
    opcoes: {},
    questoes: [],
    indice: 0,
    resultados: [],
    errou: false,
    inicio: null,
    intervalo: null,
    campoAtivo: null,
    aguardando: false
};

/* ==========================================
   FUNÇÕES BÁSICAS
   ========================================== */

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function embaralhar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = aleatorio(0, i);
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function carregarProgresso() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE)) || {};
    } catch {
        return {};
    }
}

function salvarProgresso() {
    localStorage.setItem(CHAVE, JSON.stringify(progresso));
}

function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.add("escondida");
    });

    $(id).classList.remove("escondida");
}

function voltarInicio() {
    pararCronometro();
    mostrarTela("inicio");
    atualizarDesempenho();
}

function voltar() {
    if (!$("estudo").classList.contains("escondida")) {
        if (confirm("Deseja sair desta atividade?")) {
            voltarInicio();
        }
        return;
    }

    if (!$("resultado").classList.contains("escondida")) {
        voltarInicio();
        return;
    }

    if (!$("operacao").classList.contains("escondida")) {
        voltarInicio();
        return;
    }

    voltarInicio();
}

/* ==========================================
   ABRIR OPERAÇÃO
   ========================================== */

function abrirOperacao(nome) {
    pararCronometro();

    estado.operacao = nome;
    estado.modalidade = "";

    $("tituloOperacao").textContent = NOMES[nome];

    const descricoes = {
        soma: "Pratique adições e desenvolva suas habilidades.",
        subtracao: "Pratique subtrações com e sem reserva.",
        multiplicacao: "Aprenda a multiplicar e calcular produtos parciais.",
        divisao: "Pratique divisões exatas e divisões com resto."
    };

    $("descricaoOperacao").textContent = descricoes[nome];

    $("configuracao").classList.add("escondida");

    const area = $("listaModalidades");
    area.innerHTML = "";

    MODALIDADES[nome].forEach(([id, titulo]) => {
        const botao = document.createElement("button");

        botao.className = "modalidade";
        botao.textContent = titulo;
        botao.onclick = () => selecionarModalidade(id, botao);

        area.appendChild(botao);
    });

    mostrarTela("operacao");
}

/* ==========================================
   CRIAÇÃO DAS SELEÇÕES
   ========================================== */

function casasNumericas() {
    return [
        { valor: "unidade", texto: "Unidade" },
        { valor: "dezena", texto: "Dezena" },
        { valor: "centena", texto: "Centena" }
    ];
}

function listaNumeros(inicio, fim, prefixo = "") {
    const lista = [];

    for (let n = inicio; n <= fim; n++) {
        lista.push({
            valor: n,
            texto: prefixo + n
        });
    }

    return lista;
}

function criarColuna(titulo, grupo, opcoes) {
    let html = `
        <div class="coluna-selecao">
            <div class="titulo-coluna">${titulo}</div>
    `;

    opcoes.forEach(opcao => {
        html += `
            <label class="opcao-selecao">
                <input type="checkbox"
                    name="${grupo}"
                    value="${opcao.valor}">
                <span>${opcao.texto}</span>
            </label>
        `;
    });

    return html + "</div>";
}

function criarSelecaoDupla(
    tituloA, grupoA, opcoesA,
    tituloB, grupoB, opcoesB
) {
    return `
        <div class="selecao-dupla">
            ${criarColuna(tituloA, grupoA, opcoesA)}
            ${criarColuna(tituloB, grupoB, opcoesB)}
        </div>
    `;
}

function quantidadeHTML() {
    return `
        <p>Quantidade de questões</p>
        <select id="quantidade">
            <option value="10">10 questões</option>
            <option value="20">20 questões</option>
            <option value="30">30 questões</option>
            <option value="40">40 questões</option>
            <option value="50">50 questões</option>
        </select>
    `;
}

function reservaHTML() {
    return `
        <p>Tipo de subtração</p>
        <div class="number-options">
            <label>
                <input type="checkbox" name="reserva" value="com">
                Com reserva
            </label>
            <label>
                <input type="checkbox" name="reserva" value="sem">
                Sem reserva
            </label>
        </div>
    `;
}

/* ==========================================
   ESCOLHER MODALIDADE
   ========================================== */

function selecionarModalidade(id, botao) {
    estado.modalidade = id;

    document.querySelectorAll(".modalidade").forEach(item => {
        item.classList.remove("selecionada");
    });

    botao.classList.add("selecionada");

    const op = estado.operacao;
    let html = "";

    if (id !== "tabuada" && id !== "sequencia") {
        html += quantidadeHTML();
    }

    if (op === "soma" && id === "sequencial") {
        html += criarSelecaoDupla(
            "Coluna esquerda",
            "casas",
            casasNumericas(),
            "Coluna direita",
            "valores",
            listaNumeros(1, 10, "Somando +")
        );
    }

    if (op === "soma" && id === "diversas") {
        html += criarSelecaoDupla(
            "Coluna esquerda",
            "primeiro",
            casasNumericas(),
            "Coluna direita",
            "segundo",
            casasNumericas()
        );
    }

    if (op === "subtracao" && id === "sequencial") {
        const casas = [
            ...casasNumericas(),
            { valor: "dez_a_dezenove", texto: "Números de 10 a 19" }
        ];

        html += criarSelecaoDupla(
            "Coluna esquerda",
            "casas",
            casas,
            "Coluna direita",
            "valores",
            listaNumeros(1, 10, "Subtraindo −")
        );

        html += reservaHTML();
    }

    if (op === "subtracao" && id === "diversas") {
        html += criarSelecaoDupla(
            "Coluna esquerda",
            "primeiro",
            casasNumericas(),
            "Coluna direita",
            "segundo",
            casasNumericas()
        );

        html += reservaHTML();
    }

    if (op === "multiplicacao" && id === "sequencial") {
        html += criarSelecaoDupla(
            "Coluna esquerda",
            "casas",
            casasNumericas(),
            "Coluna direita",
            "valores",
            listaNumeros(0, 9, "Multiplicando ×")
        );
    }

    if (op === "multiplicacao" && id === "diversas") {
        html += criarSelecaoDupla(
            "Coluna esquerda",
            "primeiro",
            [
                { valor: "unidade", texto: "Unidade" },
                { valor: "dezena", texto: "Dezena" },
                { valor: "centena", texto: "Centena" }
            ],
            "Coluna direita",
            "segundo",
            [
                { valor: "unidade", texto: "Unidade" },
                { valor: "dezena", texto: "Dezena" }
            ]
        );
    }

    if (op === "multiplicacao" && id === "sequencia") {
        html += `
            <p>Escolha a sequência:</p>
            ${criarColuna(
                "Sequências",
                "numeros",
                listaNumeros(2, 10)
            )}
        `;
    }

    if (op === "divisao" && id === "sequencia") {
        html += `
            <p>Escolha a sequência:</p>
            ${criarColuna(
                "Sequências",
                "numeros",
                listaNumeros(1, 10)
            )}
        `;
    }

    if (op === "divisao" &&
        (id === "pratica" || id === "resto")) {
        html += `
            <p>Escolha os divisores:</p>
            ${criarColuna(
                "Divisores",
                "divisores",
                listaNumeros(2, 10, "Divisão por ")
            )}
        `;

        html += `
            <p class="nota-conta">
                ${
                    id === "pratica"
                    ? "Serão apresentadas as divisões dos 11 primeiros múltiplos, começando do zero."
                    : "Os dividendos serão sorteados de zero até dez vezes o divisor escolhido."
                }
            </p>
        `;
    }

    if (id === "tabuada") {
        html += `
            <p>Escolha a unidade:</p>
            ${criarColuna(
                "Tabuadas",
                "unidades",
                listaNumeros(1, 10, "Tabuada do ")
            )}
        `;
    }

    $("tituloConfiguracao").textContent =
        MODALIDADES[op].find(item => item[0] === id)[1];

    $("opcoesConfiguracao").innerHTML = html;
    $("configuracao").classList.remove("escondida");
}

/* ==========================================
   LER E VALIDAR OPÇÕES
   ========================================== */

function selecionados(grupo) {
    return [
        ...document.querySelectorAll(
            `#opcoesConfiguracao input[name="${grupo}"]:checked`
        )
    ].map(campo => campo.value);
}

function lerOpcoes() {
    const op = estado.operacao;
    const mod = estado.modalidade;

    const o = {
        quantidade: Number($("quantidade")?.value || 10)
    };

    if (mod === "sequencial") {
        o.casas = selecionados("casas");
        o.valores = selecionados("valores").map(Number);
    }

    if (mod === "diversas") {
        o.primeiro = selecionados("primeiro");
        o.segundo = selecionados("segundo");
    }

    if (op === "subtracao" &&
        (mod === "sequencial" || mod === "diversas")) {
        o.reservas = selecionados("reserva");
    }

    if (op === "divisao" &&
        (mod === "pratica" || mod === "resto")) {
        o.divisores = selecionados("divisores").map(Number);
    }

    if (mod === "sequencia") {
        o.numeros = selecionados("numeros").map(Number);
    }

    if (mod === "tabuada") {
        o.unidades = selecionados("unidades").map(Number);
    }

    return o;
}

function validarOpcoes(o) {
    const op = estado.operacao;
    const mod = estado.modalidade;

    if (mod === "sequencial" &&
        (!o.casas.length || !o.valores.length)) {
        throw new Error("Selecione pelo menos uma opção em cada coluna.");
    }

    if (mod === "diversas" &&
        (!o.primeiro.length || !o.segundo.length)) {
        throw new Error("Selecione pelo menos uma opção em cada coluna.");
    }

    if (op === "divisao" &&
        (mod === "pratica" || mod === "resto") &&
        !o.divisores.length) {
        throw new Error("Escolha pelo menos um divisor.");
    }

    if (mod === "sequencia" && !o.numeros.length) {
        throw new Error("Escolha pelo menos uma sequência.");
    }

    if (mod === "tabuada" && !o.unidades.length) {
        throw new Error("Escolha pelo menos uma tabuada.");
    }

    if (op === "subtracao" &&
        (mod === "sequencial" || mod === "diversas") &&
        o.reservas.length === 0) {
        o.reservas = ["com", "sem"];
    }
}

/* ==========================================
   GERAR NÚMEROS
   ========================================== */

function gerarNumeroCasa(casa) {
    if (casa === "unidade") return aleatorio(0, 9);
    if (casa === "dezena") return aleatorio(10, 99);
    if (casa === "centena") return aleatorio(100, 999);
    if (casa === "dez_a_dezenove") return aleatorio(10, 19);
    return aleatorio(0, 9);
}

function temReserva(a, b) {
    const A = String(a).split("").reverse();
    const B = String(b).split("").reverse();

    for (let i = 0; i < Math.max(A.length, B.length); i++) {
        if (Number(A[i] || 0) < Number(B[i] || 0)) {
            return true;
        }
    }

    return false;
}

function criarQuestao(a, b, op) {
    let resultado = 0;

    if (op === "soma") resultado = a + b;
    if (op === "subtracao") resultado = a - b;
    if (op === "multiplicacao") resultado = a * b;

    return {
        primeiro: a,
        segundo: b,
        resultado,
        operacao: op
    };
}

/* ==========================================
   SOMA E SUBTRAÇÃO SEQUENCIAIS
   ========================================== */

function gerarSequencial(op, o) {
    const lista = [];
    let tentativas = 0;

    while (lista.length < o.quantidade &&
           tentativas < o.quantidade * 300) {
        tentativas++;

        const casa = o.casas[aleatorio(0, o.casas.length - 1)];
        const valor = o.valores[aleatorio(0, o.valores.length - 1)];

        let a = gerarNumeroCasa(casa);
        let b = valor;

        if (op === "subtracao" && b > a) {
            [a, b] = [b, a];
        }

        if (op === "subtracao" && o.reservas.length === 1) {
            const reserva = temReserva(a, b);

            if (o.reservas[0] === "com" && !reserva) continue;
            if (o.reservas[0] === "sem" && reserva) continue;
        }

        lista.push(criarQuestao(a, b, op));
    }

    if (lista.length < o.quantidade) {
        throw new Error("Não foi possível gerar todas as questões. Tente outra seleção.");
    }

    return embaralhar(lista);
}

/* ==========================================
   SOMA E SUBTRAÇÃO DIVERSAS
   ========================================== */

function gerarDiversas(op, o) {
    const lista = [];
    let tentativas = 0;

    while (lista.length < o.quantidade &&
           tentativas < o.quantidade * 300) {
        tentativas++;

        const casaA = o.primeiro[aleatorio(0, o.primeiro.length - 1)];
        const casaB = o.segundo[aleatorio(0, o.segundo.length - 1)];

        let a = gerarNumeroCasa(casaA);
        let b = gerarNumeroCasa(casaB);

        if (op === "subtracao") {
            if (b > a) [a, b] = [b, a];

            if (o.reservas.length === 1) {
                const reserva = temReserva(a, b);

                if (o.reservas[0] === "com" && !reserva) continue;
                if (o.reservas[0] === "sem" && reserva) continue;
            }
        }

        lista.push(criarQuestao(a, b, op));
    }

    if (lista.length < o.quantidade) {
        throw new Error("Não foi possível gerar todas as questões. Tente outra seleção.");
    }

    return embaralhar(lista);
}

/* ==========================================
   MULTIPLICAÇÃO
   ========================================== */

const LIMITES_MULTIPLICACAO = {
    unidade: [0, 9],
    dezena: [10, 99],
    centena: [100, 999]
};

function gerarNumeroMultiplicacao(tipo) {
    const [min, max] = LIMITES_MULTIPLICACAO[tipo];
    return aleatorio(min, max);
}

function gerarMultiplicacaoSequencial(o) {
    const lista = [];

    for (let i = 0; i < o.quantidade; i++) {
        const casa = o.casas[aleatorio(0, o.casas.length - 1)];
        const multiplicador = o.valores[aleatorio(0, o.valores.length - 1)];
        const primeiro = gerarNumeroCasa(casa);

        lista.push({
            primeiro,
            segundo: multiplicador,
            resultado: primeiro * multiplicador,
            operacao: "multiplicacao",
            temDezenaEmbaixo: false
        });
    }

    return embaralhar(lista);
}

function gerarMultiplicacaoDiversa(o) {
    const lista = [];

    for (let i = 0; i < o.quantidade; i++) {
        const tipoA = o.primeiro[aleatorio(0, o.primeiro.length - 1)];
        const tipoB = o.segundo[aleatorio(0, o.segundo.length - 1)];

        const primeiro = gerarNumeroMultiplicacao(tipoA);
        const segundo = gerarNumeroMultiplicacao(tipoB);

        lista.push({
            primeiro,
            segundo,
            resultado: primeiro * segundo,
            operacao: "multiplicacao",
            temDezenaEmbaixo: tipoB === "dezena"
        });
    }

    return embaralhar(lista);
}

/* ==========================================
   DIVISÃO
   ========================================== */

function gerarDivisao(o, comResto) {
    const lista = [];

    if (!comResto) {
        o.divisores.forEach(divisor => {
            for (let i = 0; i <= 10; i++) {
                lista.push({
                    dividendo: divisor * i,
                    divisor,
                    resultado: i,
                    resto: 0,
                    operacao: "divisao"
                });
            }
        });

        return embaralhar(lista);
    }

    for (let i = 0; i < o.quantidade; i++) {
        const divisor = o.divisores[
            aleatorio(0, o.divisores.length - 1)
        ];

        const dividendo = aleatorio(0, divisor * 10);

        lista.push({
            dividendo,
            divisor,
            resultado: Math.floor(dividendo / divisor),
            resto: dividendo % divisor,
            operacao: "divisao"
        });
    }

    return embaralhar(lista);
}

/* ==========================================
   SEQUÊNCIAS NUMÉRICAS
   ========================================== */

function gerarSequencias(numeros) {
    const lista = [];

    numeros.forEach(numero => {
        const vazias = embaralhar(
            Array.from({ length: 10 }, (_, i) => i)
        ).slice(0, 6);

        lista.push({
            numero,
            itens: Array.from({ length: 10 }, (_, i) => ({
                posicao: i,
                valor: numero * (i + 1),
                preenchida: !vazias.includes(i)
            }))
        });
    });

    return embaralhar(lista);
}

/* ==========================================
   GERADOR GERAL
   ========================================== */

function gerarQuestoes() {
    const op = estado.operacao;
    const mod = estado.modalidade;
    const o = estado.opcoes;

    if (mod === "sequencia") {
        return gerarSequencias(o.numeros);
    }

    if (op === "divisao") {
        return gerarDivisao(o, mod === "resto");
    }

    if (op === "multiplicacao" && mod === "diversas") {
        return gerarMultiplicacaoDiversa(o);
    }

    if (op === "multiplicacao" && mod === "sequencial") {
        return gerarMultiplicacaoSequencial(o);
    }

    if (mod === "sequencial") {
        return gerarSequencial(op, o);
    }

    if (mod === "diversas") {
        return gerarDiversas(op, o);
    }

    return [];
}

/* ==========================================
   TABUADA PARA LEITURA
   ========================================== */

function gerarTabuada(op, unidade) {
    const linhas = [];

    for (let i = 0; i <= 10; i++) {
        if (op === "soma") {
            linhas.push(`${unidade} + ${i} = ${unidade + i}`);
        }

        if (op === "subtracao") {
            linhas.push(`${unidade + i} − ${unidade} = ${i}`);
        }

        if (op === "multiplicacao") {
            linhas.push(`${unidade} × ${i} = ${unidade * i}`);
        }

        if (op === "divisao") {
            linhas.push(`${unidade * i} ÷ ${unidade} = ${i}`);
        }
    }

    return linhas;
}

function mostrarTabuada() {
    pararCronometro();

    $("numeroQuestao").textContent = "Momento de leitura";
    $("cronometro").textContent = "--:--";
    $("barraQuestao").style.width = "100%";
    $("instrucaoQuestao").textContent = "Leia e estude a tabuada com atenção.";
    $("feedback").textContent = "";
    $("teclado").innerHTML = "";

    let html = "";

    estado.opcoes.unidades.forEach(unidade => {
        html += `
            <div class="area-questao">
                <h3 class="titulo-conta">Tabuada do ${unidade}</h3>
                <div class="tabela-tabuada">
        `;

        gerarTabuada(estado.operacao, unidade).forEach(linha => {
            html += `<div class="linha-tabuada">${linha}</div>`;
        });

        html += "</div></div>";
    });

    $("areaQuestao").innerHTML = html;

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal" onclick="novoEstudo()">
            Voltar às modalidades
        </button>
    `;
}

/* ==========================================
   INICIAR ATIVIDADE
   ========================================== */

function iniciarAtividade() {
    try {
        estado.opcoes = lerOpcoes();
        validarOpcoes(estado.opcoes);

        if (estado.modalidade === "tabuada") {
            mostrarTela("estudo");
            mostrarTabuada();
            return;
        }

        estado.questoes = gerarQuestoes();
        estado.indice = 0;
        estado.resultados = [];
        estado.errou = false;
        estado.aguardando = false;

        if (!estado.questoes.length) {
            throw new Error("Não foi possível criar as questões.");
        }

        mostrarTela("estudo");
        iniciarCronometro();
        mostrarQuestao();

    } catch (erro) {
        alert(erro.message);
    }
}

/* ==========================================
   RESERVAS
   ========================================== */

function criarReservas() {
    return `
        <div class="area-reservas">
            <div class="cabecalho-reservas">
                <span>Área de reservas</span>
                <button type="button"
                    class="botao-limpar-reservas"
                    onclick="limparReservas()">
                    [C] Limpar
                </button>
            </div>

            <div class="linha-reserva">
                ${Array.from({ length: 4 }, (_, i) => `
                    <input class="campo-reserva"
                        data-reserva="${i}"
                        maxlength="2"
                        inputmode="numeric"
                        autocomplete="off">
                `).join("")}
            </div>
        </div>
    `;
}

function limparReservas() {
    document.querySelectorAll("[data-reserva]").forEach(campo => {
        campo.value = "";
    });
}

/* ==========================================
   SOMA E SUBTRAÇÃO ARMADAS
   ========================================== */

function separarDigitos(numero) {
    return String(Math.abs(numero)).split("");
}

function criarLinhaNumero(numero) {
    const digitos = separarDigitos(numero);

    if (digitos.length > 4) {
        throw new Error("Número maior que quatro algarismos.");
    }

    return Array(4 - digitos.length)
        .fill("")
        .concat(digitos)
        .map(valor => `<div class="celula-numero">${valor}</div>`)
        .join("");
}

function criarLinhaResposta(numero, linha) {
    const digitos = separarDigitos(numero);

    if (digitos.length > 4) {
        throw new Error("Resultado maior que quatro algarismos.");
    }

    return Array(4 - digitos.length)
        .fill("")
        .map(() => `<input class="campo-digito campo-vazio" disabled>`)
        .concat(digitos.map((valor, i) => `
            <input class="campo-digito"
                data-resposta="true"
                data-linha="${linha}"
                data-posicao="${4 - digitos.length + i}"
                maxlength="1"
                inputmode="numeric"
                autocomplete="off">
        `))
        .join("");
}

function montarConta(q) {
    const sinal = q.operacao === "soma" ? "+" : "−";

    return `
        <div class="conta-armada">
            ${criarReservas()}

            <div class="secao-parcial">
                <div class="cabecalho-casas">
                    <div>UM</div><div>C</div><div>D</div><div>U</div>
                </div>

                <div class="linha-conta">
                    ${criarLinhaNumero(q.primeiro)}
                </div>

                <div class="sinal-conta">${sinal}</div>

                <div class="linha-conta">
                    ${criarLinhaNumero(q.segundo)}
                </div>
            </div>

            <div class="secao-parcial">
                <p class="titulo-parcial">Resposta</p>
                <div class="linha-resposta">
                    ${criarLinhaResposta(q.resultado, "resultado")}
                </div>
            </div>
        </div>
    `;
}

/* ==========================================
   MULTIPLICAÇÃO ARMADA
   ========================================== */

function colunasMultiplicacao(numero) {
    const digitos = String(Math.abs(numero)).split("");

    if (digitos.length > 5) {
        throw new Error("Número maior que cinco algarismos.");
    }

    return Array(5 - digitos.length).fill("").concat(digitos);
}

function linhaNumeroMultiplicacao(numero) {
    return colunasMultiplicacao(numero)
        .map(valor => `<div class="celula-numero">${valor}</div>`)
        .join("");
}

function camposMultiplicacao(numero, linha) {
    return colunasMultiplicacao(numero).map((valor, i) => {
        if (valor === "") {
            return `<input class="campo-digito campo-vazio" disabled>`;
        }

        return `
            <input class="campo-digito"
                data-resposta="true"
                data-linha="${linha}"
                data-posicao="${i}"
                maxlength="1"
                inputmode="numeric"
                autocomplete="off">
        `;
    }).join("");
}

function montarMultiplicacao(q) {
    const temDezena = q.temDezenaEmbaixo;

    const unidade = q.segundo % 10;
    const dezena = Math.floor(q.segundo / 10);

    const parcial1 = q.primeiro * unidade;
    const parcial2 = q.primeiro * dezena * 10;

    return `
        <div class="conta-armada">
            ${criarReservas()}

            <div class="secao-parcial">
                <h3 class="titulo-conta">Multiplicação armada</h3>

                <div class="cabecalho-casas cinco-colunas">
                    <div>DM</div><div>UM</div><div>C</div><div>D</div><div>U</div>
                </div>

                <div class="linha-conta cinco-colunas">
                    ${linhaNumeroMultiplicacao(q.primeiro)}
                </div>

                <div class="sinal-conta">×</div>

                <div class="linha-conta cinco-colunas">
                    ${linhaNumeroMultiplicacao(q.segundo)}
                </div>
            </div>

            ${
                temDezena
                ? `
                    <div class="secao-parcial">
                        <p class="titulo-parcial">
                            1º produto parcial: ${q.primeiro} × ${unidade}
                        </p>
                        <div class="linha-parcial cinco-colunas">
                            ${camposMultiplicacao(parcial1, "parcial-0")}
                        </div>
                    </div>

                    <div class="secao-parcial">
                        <p class="titulo-parcial">
                            2º produto parcial: ${q.primeiro} × ${dezena} dezenas
                        </p>
                        <div class="linha-parcial cinco-colunas">
                            ${camposMultiplicacao(parcial2, "parcial-1")}
                        </div>
                    </div>

                    <div class="secao-parcial">
                        <p class="titulo-parcial">Soma dos produtos parciais</p>
                        <div class="linha-resposta cinco-colunas">
                            ${camposMultiplicacao(q.resultado, "resultado")}
                        </div>
                    </div>
                `
                : `
                    <div class="secao-parcial">
                        <p class="titulo-parcial">Resposta</p>
                        <div class="linha-resposta cinco-colunas">
                            ${camposMultiplicacao(q.resultado, "resultado")}
                        </div>
                    </div>
                `
            }
        </div>
    `;
}

/* ==========================================
   DIVISÃO
   ========================================== */

function montarDivisao(q) {
    const comResto = estado.modalidade === "resto";

    return `
        <div class="divisao-resultado">
            <h3 class="titulo-conta">Divisão</h3>

            <div class="conta-divisao">
                ${q.dividendo} ÷ ${q.divisor}
            </div>

            <div class="campos-divisao">
                <div class="grupo-resposta">
                    <label for="campoQuociente">Quociente</label>
                    <input id="campoQuociente"
                        class="campo-divisao"
                        data-resposta="true"
                        inputmode="numeric"
                        autocomplete="off">
                </div>

                ${
                    comResto
                    ? `
                        <div class="grupo-resposta">
                            <label for="campoResto">Resto</label>
                            <input id="campoResto"
                                class="campo-divisao"
                                data-resposta="true"
                                inputmode="numeric"
                                autocomplete="off">
                        </div>
                    `
                    : ""
                }
            </div>

            <p class="nota-conta">
                ${
                    comResto
                    ? "Preencha o quociente e o resto. Quando o resto for zero, você pode deixar o campo vazio ou digitar 0."
                    : "Digite o resultado da divisão."
                }
            </p>
        </div>
    `;
}

/* ==========================================
   SEQUÊNCIAS
   ========================================== */

function montarSequencia(q) {
    let html = `
        <h3 class="titulo-conta">Sequência de ${q.numero}</h3>
        <div class="sequence-grid">
    `;

    q.itens.forEach(item => {
        html += `
            <div class="sequence-cell">
                <span>${item.posicao + 1}</span>

                ${
                    item.preenchida
                    ? `<strong>${item.valor}</strong>`
                    : `
                        <input class="respostaSequencia"
                            data-resposta="true"
                            data-posicao="${item.posicao}"
                            inputmode="numeric"
                            autocomplete="off">
                    `
                }
            </div>
        `;
    });

    return html + "</div>";
}

/* ==========================================
   MOSTRAR QUESTÃO
   ========================================== */

function mostrarQuestao() {
    const q = estado.questoes[estado.indice];

    if (!q) {
        finalizarAtividade();
        return;
    }

    estado.errou = false;
    estado.aguardando = false;
    estado.campoAtivo = null;

    $("feedback").textContent = "";
    $("numeroQuestao").textContent =
        `Questão ${estado.indice + 1} de ${estado.questoes.length}`;

    $("barraQuestao").style.width =
        `${estado.indice / estado.questoes.length * 100}%`;

    $("instrucaoQuestao").textContent =
        estado.modalidade === "sequencia"
        ? "Complete os espaços da sequência."
        : "Resolva a questão:";

    if (estado.modalidade === "sequencia") {
        $("areaQuestao").innerHTML = montarSequencia(q);

        $("acoesQuestao").innerHTML = `
            <button class="botao-principal" onclick="conferirSequencia()">
                Conferir sequência
            </button>
            <button class="botao-secundario" onclick="pularQuestao()">
                Pular questão
            </button>
        `;
    } else {
        if (q.operacao === "divisao") {
            $("areaQuestao").innerHTML = montarDivisao(q);
        } else if (q.operacao === "multiplicacao") {
            $("areaQuestao").innerHTML = montarMultiplicacao(q);
        } else {
            $("areaQuestao").innerHTML = montarConta(q);
        }

        $("acoesQuestao").innerHTML = `
            <button class="botao-principal" onclick="conferirResposta()">
                Conferir resposta
            </button>
            <button class="botao-secundario" onclick="pularQuestao()">
                Pular questão
            </button>
        `;
    }

    prepararCampos();
    montarTeclado();
}

/* ==========================================
   CAMPOS E TECLADO VIRTUAL
   ========================================== */

function prepararCampos() {
    const campos = [
        ...document.querySelectorAll(
            '#areaQuestao input[data-resposta]'
        )
    ];

    campos.forEach(campo => {
        campo.addEventListener("focus", () => {
            estado.campoAtivo = campo;
        });

        campo.addEventListener("input", () => {
            campo.value = campo.value.replace(/\D/g, "");

            if (campo.maxLength === 1 && campo.value.length === 1) {
                moverParaEsquerda(campo);
            }
        });
    });

    if (campos.length) {
        const ultimo = campos[campos.length - 1];
        ultimo.focus();
    }
}

function moverParaEsquerda(atual) {
    const linha = atual.dataset.linha;

    if (!linha) return;

    const campos = [
        ...document.querySelectorAll(
            `#areaQuestao input[data-linha="${linha}"]`
        )
    ];

    const indice = campos.indexOf(atual);

    if (indice > 0) {
        campos[indice - 1].focus();
    }
}

function montarTeclado() {
    const teclado = $("teclado");
    teclado.innerHTML = "";

    [1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "⌫"].forEach(valor => {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.textContent = valor;
        botao.onclick = () => digitarTeclado(valor);

        teclado.appendChild(botao);
    });
}

function digitarTeclado(valor) {
    const campo = estado.campoAtivo;

    if (!campo || campo.disabled) return;

    if (valor === "C") {
        campo.value = "";
        campo.focus();
        return;
    }

    if (valor === "⌫") {
        campo.value = campo.value.slice(0, -1);
        campo.focus();
        return;
    }

    if (campo.maxLength === 1) {
        campo.value = String(valor);
        campo.dispatchEvent(new Event("input", { bubbles: true }));
        return;
    }

    campo.value += String(valor);
    campo.focus();
}

/* ==========================================
   LEITURA E CONFERÊNCIA
   ========================================== */

function lerLinha(linha) {
    const campos = [
        ...document.querySelectorAll(
            `#areaQuestao input[data-linha="${linha}"]`
        )
    ];

    if (!campos.length || campos.some(c => c.value === "")) {
        return null;
    }

    return Number(campos.map(c => c.value).join(""));
}

function conferirParciais(q) {
    if (!q.temDezenaEmbaixo) return true;

    const unidade = q.segundo % 10;
    const dezena = Math.floor(q.segundo / 10);

    const esperados = [
        q.primeiro * unidade,
        q.primeiro * dezena * 10
    ];

    for (let i = 0; i < 2; i++) {
        const campos = [
            ...document.querySelectorAll(
                `#areaQuestao input[data-linha="parcial-${i}"]`
            )
        ];

        if (!campos.length || campos.some(c => c.value === "")) {
            return false;
        }

        const informado = Number(
            campos.map(c => c.value).join("")
        );

        if (informado !== esperados[i]) return false;
    }

    return true;
}

function conferirResposta() {
    if (estado.aguardando) return;

    const q = estado.questoes[estado.indice];
    let correto = false;

    if (q.operacao === "divisao") {
        const quociente = $("campoQuociente");
        const campoResto = $("campoResto");

        if (!quociente.value.trim()) {
            $("feedback").textContent = "Digite o quociente.";
            return;
        }

        const resto = campoResto && campoResto.value.trim() !== ""
            ? Number(campoResto.value)
            : 0;

        correto =
            Number(quociente.value) === q.resultado &&
            resto === q.resto;

    } else {
        const resposta = lerLinha("resultado");

        if (resposta === null) {
            $("feedback").textContent =
                "Preencha todos os algarismos da resposta.";
            return;
        }

        correto = resposta === q.resultado;

        if (q.operacao === "multiplicacao") {
            correto = correto && conferirParciais(q);
        }
    }

    if (correto) {
        respostaCorreta();
    } else {
        respostaIncorreta();
    }
}

function respostaCorreta() {
    estado.aguardando = true;

    $("feedback").textContent = "Resposta Correta! ✅";

    estado.resultados.push({
        correto: true,
        corrigida: estado.errou
    });

    document.querySelectorAll("#areaQuestao input").forEach(campo => {
        campo.disabled = true;
    });

    setTimeout(() => {
        estado.aguardando = false;
        avancarQuestao();
    }, 1500);
}

function respostaIncorreta() {
    $("feedback").textContent = "Resposta Incorreta! ❌";
    estado.errou = true;

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal" onclick="tentarNovamente()">
            Corrigir
        </button>
        <button class="botao-secundario" onclick="pularQuestao()">
            Pular questão
        </button>
    `;
}

function tentarNovamente() {
    $("feedback").textContent = "";

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal" onclick="conferirResposta()">
            Conferir resposta
        </button>
        <button class="botao-secundario" onclick="pularQuestao()">
            Pular questão
        </button>
    `;
}

function avancarQuestao() {
    estado.indice++;
    estado.errou = false;
    estado.campoAtivo = null;
    mostrarQuestao();
}

function pularQuestao() {
    if (estado.aguardando) return;

    estado.resultados.push({
        correto: false,
        corrigida: false,
        pulada: true
    });

    avancarQuestao();
}

/* ==========================================
   CONFERIR SEQUÊNCIA
   ========================================== */

function conferirSequencia() {
    const q = estado.questoes[estado.indice];

    const campos = [
        ...document.querySelectorAll(".respostaSequencia")
    ];

    if (campos.some(c => c.value.trim() === "")) {
        $("feedback").textContent =
            "Preencha todos os espaços antes de conferir.";
        return;
    }

    let acertos = 0;

    campos.forEach(campo => {
        const posicao = Number(campo.dataset.posicao);

        if (Number(campo.value) === q.itens[posicao].valor) {
            acertos++;
        }
    });

    const percentual = Math.round(acertos / 6 * 100);

    estado.resultados.push({
        correto: acertos === 6,
        percentual
    });

    campos.forEach(campo => campo.disabled = true);

    $("feedback").textContent =
        `${acertos} de 6 espaços corretos.`;

    if (estado.indice < estado.questoes.length - 1) {
        $("acoesQuestao").innerHTML = `
            <button class="botao-principal" onclick="avancarQuestao()">
                Próxima sequência
            </button>
        `;
    } else {
        finalizarAtividade();
    }
}

/* ==========================================
   CRONÔMETRO
   ========================================== */

function iniciarCronometro() {
    pararCronometro();

    estado.inicio = Date.now();
    atualizarCronometro();

    estado.intervalo = setInterval(
        atualizarCronometro,
        1000
    );
}

function pararCronometro() {
    if (estado.intervalo) {
        clearInterval(estado.intervalo);
        estado.intervalo = null;
    }
}

function tempoDecorrido() {
    return estado.inicio
        ? Math.floor((Date.now() - estado.inicio) / 1000)
        : 0;
}

function atualizarCronometro() {
    const segundos = tempoDecorrido();
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;

    $("cronometro").textContent =
        `${String(minutos).padStart(2, "0")}:` +
        `${String(resto).padStart(2, "0")}`;
}

/* ==========================================
   RESULTADO FINAL
   ========================================== */

function finalizarAtividade() {
    pararCronometro();

    const total = estado.questoes.length;

    let percentual;
    let acertos;
    let corrigidas = 0;

    if (estado.modalidade === "sequencia") {
        acertos = estado.resultados.filter(
            item => item.correto
        ).length;

        percentual = Math.round(
            estado.resultados.reduce(
                (soma, item) => soma + item.percentual,
                0
            ) / estado.resultados.length
        );
    } else {
        acertos = estado.resultados.filter(
            item => item.correto
        ).length;

        corrigidas = estado.resultados.filter(
            item => item.correto && item.corrigida
        ).length;

        percentual = Math.round(acertos / total * 100);
    }

    const erros = total - acertos;

    const resultado = {
        total,
        acertos,
        corrigidas,
        erros,
        percentual,
        tempo: tempoDecorrido()
    };

    const chave = `${estado.operacao}_${estado.modalidade}`;

    salvarTentativa(chave, resultado);

    $("resultadoPercentual").textContent = `${percentual}%`;

    $("detalhesResultado").innerHTML = `
        <p>Questões: <strong>${total}</strong></p>
        <p>Acertos diretos: <strong>${acertos - corrigidas}</strong></p>
        <p>Corrigidas: <strong>${corrigidas}</strong></p>
        <p>Erros ou puladas: <strong>${erros}</strong></p>
        <p>Tempo:
            <strong>
                ${Math.floor(resultado.tempo / 60)} min
                ${resultado.tempo % 60} s
            </strong>
        </p>
    `;

    mostrarTela("resultado");
    atualizarDesempenho();
}

function salvarTentativa(chave, resultado) {
    if (!progresso[chave]) {
        progresso[chave] = {
            tentativas: [],
            verdeConquistado: false
        };
    }

    const item = progresso[chave];

    item.tentativas.push({
        ...resultado,
        data: new Date().toISOString()
    });

    if (resultado.percentual === 100) {
        item.verdeConquistado = true;
    }

    salvarProgresso();
}

/* ==========================================
   DESEMPENHO
   ========================================== */

function atualizarDesempenho() {
    const totalModalidades = 14;
    const itens = Object.entries(progresso);

    const verdes = itens.filter(
        ([, item]) => item.verdeConquistado
    ).length;

    const amarelas = itens.filter(([, item]) => {
        const ultima = item.tentativas[item.tentativas.length - 1];

        return !item.verdeConquistado &&
            ultima &&
            ultima.percentual > 50;
    }).length;

    const vermelhas = itens.filter(([, item]) => {
        const ultima = item.tentativas[item.tentativas.length - 1];

        return !item.verdeConquistado &&
            ultima &&
            ultima.percentual <= 50;
    }).length;

    const iniciadas = itens.length;
    const naoIniciadas = Math.max(0, totalModalidades - iniciadas);

    const percentual = Math.round(
        verdes / totalModalidades * 100
    );

    $("percentualGeral").textContent = `${percentual}%`;
    $("textoProgresso").textContent =
        `${verdes} de ${totalModalidades} modalidades dominadas`;

    $("barraProgresso").style.width = `${percentual}%`;

    $("qtdVerdes").textContent = verdes;
    $("qtdAmarelas").textContent = amarelas;
    $("qtdVermelhas").textContent = vermelhas;
    $("qtdNaoIniciadas").textContent = naoIniciadas;

    $("faltam").textContent =
        `Faltam ${totalModalidades - verdes} modalidades para dominar tudo.`;

    atualizarArvore();
}

/* ==========================================
   ÁRVORE DO CONHECIMENTO
   ========================================== */

function atualizarArvore() {
    const total = Object.values(progresso).filter(
        item => item.verdeConquistado
    ).length;

    let arvore = "🌱";
    let mensagem = "Sua árvore está começando a crescer.";

    if (total >= 3) {
        arvore = "🌿";
        mensagem = "Sua árvore está criando novos ramos!";
    }

    if (total >= 6) {
        arvore = "🌳";
        mensagem = "Sua árvore está ficando forte!";
    }

    if (total >= 10) {
        arvore = "🌳✨";
        mensagem = "Sua árvore está cheia de conhecimento!";
    }

    if (total >= 14) {
        arvore = "🌟🌳🌟";
        mensagem = "Você dominou as quatro operações!";
    }

    $("arvoreVisual").textContent = arvore;
    $("mensagemArvore").textContent = mensagem;

    const area = $("recompensas");
    area.innerHTML = "";

    Object.entries(RECOMPENSAS).forEach(([chave, simbolo]) => {
        if (progresso[chave]?.verdeConquistado) {
            const elemento = document.createElement("span");
            elemento.textContent = simbolo;
            area.appendChild(elemento);
        }
    });

    if (total >= 14) {
        area.innerHTML += " ⭐⭐⭐";
    }
}

/* ==========================================
   REVISAR E NOVO ESTUDO
   ========================================== */

function revisarAtividade() {
    iniciarAtividade();
}

function novoEstudo() {
    pararCronometro();
    abrirOperacao(estado.operacao);
}

/* ==========================================
   INICIALIZAÇÃO
   ========================================== */

atualizarDesempenho();
mostrarTela("inicio");
