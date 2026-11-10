/* =========================================================
   CURSO DE MATEMÁTICA BÁSICA
   SCRIPT COMPLETO
   ========================================================= */

const $ = id => document.getElementById(id);

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

const CHAVE = "cursoMatematicaProgresso";

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
    cronometro: null,
    campoAtivo: null,
    aguardandoAvanco: false
};

/* =========================================================
   FUNÇÕES BÁSICAS
   ========================================================= */

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

function irInicio() {
    pararCronometro();
    mostrarTela("inicio");
    atualizarDesempenho();
}

/* =========================================================
   OPERAÇÕES E MODALIDADES
   ========================================================= */

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

    montarModalidades();
    mostrarTela("operacao");
}

function montarModalidades() {
    const area = $("listaModalidades");
    area.innerHTML = "";

    MODALIDADES[estado.operacao].forEach(([id, nome]) => {
        const botao = document.createElement("button");

        botao.className = "modalidade";
        botao.textContent = nome;
        botao.onclick = () => selecionarModalidade(id, botao);

        area.appendChild(botao);
    });

    $("configuracao").classList.add("escondida");
}

/* =========================================================
   SELEÇÃO DAS OPÇÕES
   ========================================================= */

function casasNumericas() {
    return [
        { valor: "unidade", texto: "Unidade" },
        { valor: "dezena", texto: "Dezena" },
        { valor: "centena", texto: "Centena" }
    ];
}

function valoresNumericos(inicio, fim, prefixo = "") {
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

function criarSelecaoSimples(grupo, inicio, fim) {
    let html = "";

    for (let n = inicio; n <= fim; n++) {
        html += `
            <label class="opcao-selecao">
                <input type="checkbox" name="${grupo}" value="${n}">
                <span>${n}</span>
            </label>
        `;
    }

    return html;
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

function opcoesReservaHTML() {
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

/* =========================================================
   CONFIGURAÇÃO DE CADA MODALIDADE
   ========================================================= */

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

    // SOMA SEQUENCIAL
    if (op === "soma" && id === "sequencial") {
        html += criarSelecaoDupla(
            "Coluna esquerda", "casas", casasNumericas(),
            "Coluna direita", "valores",
            valoresNumericos(1, 10, "Somando +")
        );
    }

    // SOMAS DIVERSAS
    if (op === "soma" && id === "diversas") {
        html += criarSelecaoDupla(
            "Coluna esquerda", "primeiro", casasNumericas(),
            "Coluna direita", "segundo", casasNumericas()
        );
    }

    // SUBTRAÇÃO SEQUENCIAL
    if (op === "subtracao" && id === "sequencial") {
        const casas = [
            ...casasNumericas(),
            { valor: "dez_a_dezenove", texto: "Números de 10 a 19" }
        ];

        html += criarSelecaoDupla(
            "Coluna esquerda", "casas", casas,
            "Coluna direita", "valores",
            valoresNumericos(1, 10, "Subtraindo −")
        );

        html += opcoesReservaHTML();
    }

    // SUBTRAÇÕES DIVERSAS
    if (op === "subtracao" && id === "diversas") {
        html += criarSelecaoDupla(
            "Coluna esquerda", "primeiro", casasNumericas(),
            "Coluna direita", "segundo", casasNumericas()
        );

        html += opcoesReservaHTML();
    }

    // MULTIPLICAÇÃO SEQUENCIAL
    if (op === "multiplicacao" && id === "sequencial") {
        html += criarSelecaoDupla(
            "Coluna esquerda", "casas", casasNumericas(),
            "Coluna direita", "valores",
            valoresNumericos(0, 9, "Multiplicando ×")
        );
    }

    // MULTIPLICAÇÕES DIVERSAS
    if (op === "multiplicacao" && id === "diversas") {
        const combinacoes = [
            { valor: "UU", texto: "Unidade × Unidade" },
            { valor: "DU", texto: "Dezena × Unidade" },
            { valor: "CU", texto: "Centena × Unidade" },
            { valor: "DD", texto: "Dezena × Dezena" },
            { valor: "CD", texto: "Centena × Dezena" }
        ];

        html += criarSelecaoDupla(
            "Primeiro fator", "primeiro", casasNumericas(),
            "Segundo fator", "combinacoes", combinacoes
        );
    }

    // SEQUÊNCIA DA MULTIPLICAÇÃO
    if (op === "multiplicacao" && id === "sequencia") {
        html += `
            <p>Escolha a sequência:</p>
            <div class="number-options">
                ${criarSelecaoSimples("numero", 2, 10)}
            </div>
        `;
    }

    // SEQUÊNCIA DA DIVISÃO
    if (op === "divisao" && id === "sequencia") {
        html += `
            <p>Escolha a sequência:</p>
            <div class="number-options">
                ${criarSelecaoSimples("numero", 1, 10)}
            </div>
        `;
    }

    // PRÁTICA DE DIVISÃO
    if (op === "divisao" && id === "pratica") {
        html += `
            <p>Escolha os divisores:</p>
            ${criarColuna(
                "Divisores",
                "divisores",
                valoresNumericos(2, 10, "Divisão por ")
            )}
            <p class="nota-conta">
                Serão apresentadas 11 divisões exatas para cada divisor,
                começando pelo zero.
            </p>
        `;
    }

    // DIVISÃO COM RESTO
    if (op === "divisao" && id === "resto") {
        html += `
            <p>Escolha os divisores:</p>
            ${criarColuna(
                "Divisores",
                "divisores",
                valoresNumericos(2, 10, "Divisão por ")
            )}
            <p class="nota-conta">
                Os dividendos serão sorteados entre zero e dez vezes
                o divisor escolhido.
            </p>
        `;
    }

    // TABUADAS
    if (id === "tabuada") {
        html += `
            <p>Escolha a unidade:</p>
            <div class="number-options">
                ${criarSelecaoSimples("unidade", 1, 10)}
            </div>
        `;
    }

    $("opcoesConfiguracao").innerHTML = html;

    $("tituloConfiguracao").textContent =
        MODALIDADES[op].find(item => item[0] === id)[1];

    $("configuracao").classList.remove("escondida");
}

/* =========================================================
   LEITURA E VALIDAÇÃO DAS ESCOLHAS
   ========================================================= */

function selecionados(grupo) {
    return [...document.querySelectorAll(
        `#opcoesConfiguracao input[name="${grupo}"]:checked`
    )].map(campo => campo.value);
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
        o.combinacoes = selecionados("combinacoes");
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
        o.numeros = selecionados("numero").map(Number);
    }

    if (mod === "tabuada") {
        o.unidades = selecionados("unidade").map(Number);
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

    if (mod === "diversas" && op !== "multiplicacao" &&
        (!o.primeiro.length || !o.segundo.length)) {
        throw new Error("Selecione pelo menos uma opção em cada coluna.");
    }

    if (op === "multiplicacao" && mod === "diversas" &&
        (!o.primeiro.length || !o.combinacoes.length)) {
        throw new Error("Selecione pelo menos uma opção em cada coluna.");
    }

    if (op === "divisao" &&
        (mod === "pratica" || mod === "resto") &&
        !o.divisores.length) {
        throw new Error("Escolha pelo menos um divisor.");
    }

    if (mod === "tabuada" && !o.unidades.length) {
        throw new Error("Escolha pelo menos uma unidade.");
    }

    if (mod === "sequencia" && !o.numeros.length) {
        throw new Error("Escolha pelo menos uma sequência.");
    }

    if (op === "subtracao" &&
        (mod === "sequencial" || mod === "diversas") &&
        o.reservas.length === 0) {
        o.reservas = ["com", "sem"];
    }
}

/* =========================================================
   GERAÇÃO DE QUESTÕES
   ========================================================= */

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

function criarQuestao(a, b, operacao) {
    let resultado;

    if (operacao === "soma") resultado = a + b;
    if (operacao === "subtracao") resultado = a - b;
    if (operacao === "multiplicacao") resultado = a * b;

    return {
        primeiro: a,
        segundo: b,
        operacao,
        resultado
    };
}

function gerarSequencial(op, o) {
    const lista = [];
    let tentativas = 0;

    while (lista.length < o.quantidade && tentativas < o.quantidade * 100) {
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
        throw new Error(
            "Não foi possível gerar questões com essa combinação. " +
            "Escolha também a outra opção de reserva."
        );
    }

    return embaralhar(lista);
}

function gerarDiversas(op, o) {
    const lista = [];
    let tentativas = 0;

    while (lista.length < o.quantidade && tentativas < o.quantidade * 100) {
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
        throw new Error(
            "Não foi possível gerar todas as questões. " +
            "Tente selecionar com e sem reserva."
        );
    }

    return embaralhar(lista);
}

const TIPOS_MULTIPLICACAO = {
    UU: ["unidade", "unidade"],
    DU: ["dezena", "unidade"],
    CU: ["centena", "unidade"],
    DD: ["dezena", "dezena"],
    CD: ["centena", "dezena"]
};

function gerarMultiplicacaoDiversa(o) {
    const lista = [];

    for (let i = 0; i < o.quantidade; i++) {
        const combinacao = o.combinacoes[
            aleatorio(0, o.combinacoes.length - 1)
        ];

        const [casaA, casaB] = TIPOS_MULTIPLICACAO[combinacao];

        let a = gerarNumeroCasa(casaA);
        let b = gerarNumeroCasa(casaB);

        // Mantém a conta dentro de quatro algarismos.
        // Se ultrapassar, sorteia novamente.
        let tentativas = 0;

        while (a * b > 9999 && tentativas < 100) {
            a = gerarNumeroCasa(casaA);
            b = gerarNumeroCasa(casaB);
            tentativas++;
        }

        if (a * b > 9999) {
            a = 100;
            b = 10;
        }

        lista.push(criarQuestao(a, b, "multiplicacao"));
    }

    return embaralhar(lista);
}

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

function gerarSequencias(numeros) {
    return embaralhar(numeros.map(numero => {
        const vazias = embaralhar(
            Array.from({ length: 10 }, (_, i) => i)
        ).slice(0, 6);

        return {
            numero,
            itens: Array.from({ length: 10 }, (_, i) => ({
                posicao: i,
                valor: numero * (i + 1),
                preenchida: !vazias.includes(i)
            }))
        };
    }));
}

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

    if (mod === "sequencial") {
        return gerarSequencial(op, o);
    }

    if (mod === "diversas") {
        return gerarDiversas(op, o);
    }

    return [];
}

function gerarTabuada(op, unidades) {
    const lista = [];

    unidades.forEach(unidade => {
        for (let i = 0; i <= 10; i++) {
            if (op === "soma") {
                lista.push(`${unidade} + ${i} = ${unidade + i}`);
            }

            if (op === "subtracao") {
                lista.push(`${unidade + i} − ${unidade} = ${i}`);
            }

            if (op === "multiplicacao") {
                lista.push(`${unidade} × ${i} = ${unidade * i}`);
            }

            if (op === "divisao") {
                lista.push(`${unidade * i} ÷ ${unidade} = ${i}`);
            }
        }
    });

    return lista;
}

/* =========================================================
   INICIAR ATIVIDADE
   ========================================================= */

function iniciarAtividade() {
    try {
        estado.opcoes = lerOpcoes();
        validarOpcoes(estado.opcoes);

        if (estado.modalidade === "tabuada") {
            mostrarTela("estudo");
            mostrarTabuadaLeitura();
            return;
        }

        estado.questoes = gerarQuestoes();
        estado.indice = 0;
        estado.resultados = [];
        estado.errou = false;
        estado.aguardandoAvanco = false;

        mostrarTela("estudo");
        iniciarCronometro();
        mostrarQuestao();

    } catch (erro) {
        alert(erro.message);
    }
}

/* =========================================================
   TABUADA PARA LEITURA
   ========================================================= */

function mostrarTabuadaLeitura() {
    pararCronometro();

    $("numeroQuestao").textContent = "Momento de leitura";
    $("cronometro").textContent = "--:--";
    $("barraQuestao").style.width = "100%";

    $("instrucaoQuestao").textContent =
        "Leia e estude a tabuada com atenção.";

    $("areaResposta").innerHTML = "";
    $("teclado").innerHTML = "";
    $("feedback").textContent = "";

    let html = "";

    estado.opcoes.unidades.forEach(unidade => {
        html += `
            <div class="area-questao">
                <h3 class="titulo-conta">Tabuada do ${unidade}</h3>
                <div class="tabela-tabuada">
        `;

        const linhas = gerarTabuada(estado.operacao, [unidade]);

        linhas.forEach(linha => {
            html += `<div class="linha-tabuada">${linha}</div>`;
        });

        html += `
                </div>
            </div>
        `;
    });

    $("areaQuestao").innerHTML = html;

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal" onclick="novoEstudo()">
            Voltar às modalidades
        </button>
    `;
}

/* =========================================================
   CONTA ARMADA E CAMPOS
   ========================================================= */

function separarDigitos(numero) {
    return String(Math.abs(numero)).split("");
}

function cabecalhoCasas() {
    return `
        <div class="cabecalho-casas">
            <div>UM</div>
            <div>C</div>
            <div>D</div>
            <div>U</div>
        </div>
    `;
}

function criarLinhaNumero(numero) {
    const digitos = separarDigitos(numero);
    const valores = Array(Math.max(0, 4 - digitos.length))
        .fill("")
        .concat(digitos);

    return valores.map(valor => `
        <div class="celula-numero">${valor}</div>
    `).join("");
}

function criarLinhaResposta(numero, linha) {
    const digitos = separarDigitos(numero);

    if (digitos.length > 4) {
        throw new Error("O resultado ultrapassou quatro algarismos.");
    }

    const vazios = 4 - digitos.length;
    let html = "";

    for (let i = 0; i < 4; i++) {
        if (i < vazios) {
            html += `
                <input class="campo-digito campo-vazio"
                    disabled tabindex="-1">
            `;
        } else {
            html += `
                <input class="campo-digito"
                    data-resposta="true"
                    data-linha="${linha}"
                    data-posicao="${i}"
                    maxlength="1"
                    inputmode="numeric"
                    autocomplete="off">
            `;
        }
    }

    return html;
}

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

function montarConta(q) {
    const sinal = q.operacao === "soma" ? "+" : "−";

    return `
        <div class="conta-armada">

            <p class="titulo-parcial">Resposta direta</p>

            <div class="linha-resposta">
                ${criarLinhaResposta(q.resultado, "resultado")}
            </div>

            ${criarReservas()}

            <div class="secao-parcial">
                ${cabecalhoCasas()}

                <div class="linha-conta">
                    ${criarLinhaNumero(q.primeiro)}
                </div>

                <div class="sinal-conta">${sinal}</div>

                <div class="linha-conta">
                    ${criarLinhaNumero(q.segundo)}
                </div>
            </div>

        </div>
    `;
}

function montarMultiplicacao(q) {
    const algarismos = separarDigitos(q.segundo).reverse();

    return `
        <div class="conta-armada">

            <p class="titulo-parcial">Resposta direta</p>

            <div class="linha-resposta">
                ${criarLinhaResposta(q.resultado, "resultado")}
            </div>

            ${criarReservas()}

            <div class="secao-parcial">
                <div class="titulo-conta">Multiplicação armada</div>

                ${cabecalhoCasas()}

                <div class="linha-conta">
                    ${criarLinhaNumero(q.primeiro)}
                </div>

                <div class="sinal-conta">×</div>

                <div class="linha-conta">
                    ${criarLinhaNumero(q.segundo)}
                </div>
            </div>

            ${algarismos.map((algarismo, i) => {
                const parcial =
                    q.primeiro * Number(algarismo) * Math.pow(10, i);

                return `
                    <div class="secao-parcial">
                        <p class="titulo-parcial">
                            ${i + 1}º produto parcial:
                            ${q.primeiro} × ${algarismo}
                            ${i > 0 ? " (posição das dezenas)" : ""}
                        </p>

                        <div class="linha-parcial">
                            ${criarLinhaResposta(parcial, "parcial-" + i)}
                        </div>
                    </div>
                `;
            }).join("")}

        </div>
    `;
}

/* =========================================================
   DIVISÃO E DIVISÃO COM RESTO
   ========================================================= */

function montarDivisao(q) {
    const comResto = estado.modalidade === "resto";

    return `
        <div class="divisao-resultado">
            <div class="titulo-conta">
                ${q.dividendo} ÷ ${q.divisor}
            </div>

            <div class="campos-divisao">
                <div class="grupo-resposta">
                    <label for="campoQuociente">Quociente</label>
                    <input id="campoQuociente"
                        class="campo-divisao"
                        data-resposta="true"
                        data-campo="quociente"
                        inputmode="numeric"
                        autocomplete="off">
                </div>

                ${comResto ? `
                    <div class="grupo-resposta">
                        <label for="campoResto">Resto</label>
                        <input id="campoResto"
                            class="campo-divisao"
                            data-resposta="true"
                            data-campo="resto"
                            inputmode="numeric"
                            autocomplete="off">
                    </div>
                ` : ""}
            </div>

            <p class="nota-conta">
                ${comResto
                    ? "Preencha o quociente e o resto."
                    : "Digite o resultado da divisão."}
            </p>
        </div>
    `;
}

/* =========================================================
   SEQUÊNCIAS NUMÉRICAS
   ========================================================= */

function montarSequencia(q) {
    let html = `
        <div class="titulo-conta">
            Sequência de ${q.numero}
        </div>
        <div class="sequence-grid">
    `;

    q.itens.forEach(item => {
        html += `
            <div class="sequence-cell">
                <span>${item.posicao + 1}</span>
                ${
                    item.preenchida
                    ? `<strong>${item.valor}</strong>`
                    : `<input class="respostaSequencia"
                        data-resposta="true"
                        data-linha="sequencia"
                        data-posicao="${item.posicao}"
                        inputmode="numeric"
                        autocomplete="off">`
                }
            </div>
        `;
    });

    return html + "</div>";
}

/* =========================================================
   MOSTRAR QUESTÃO
   ========================================================= */

function mostrarQuestao() {
    const q = estado.questoes[estado.indice];

    if (!q) {
        finalizarAtividade();
        return;
    }

    estado.errou = false;
    estado.campoAtivo = null;
    estado.aguardandoAvanco = false;

    $("feedback").textContent = "";

    $("numeroQuestao").textContent =
        `Questão ${estado.indice + 1} de ${estado.questoes.length}`;

    $("barraQuestao").style.width =
        `${(estado.indice / estado.questoes.length) * 100}%`;

    $("areaResposta").innerHTML = "";
    $("teclado").innerHTML = "";

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal" onclick="conferirResposta()">
            Conferir resposta
        </button>
        <button class="botao-secundario" onclick="pularQuestao()">
            Pular questão
        </button>
    `;

    if (estado.modalidade === "sequencia") {
        $("instrucaoQuestao").textContent =
            "Complete os espaços da sequência.";

        $("areaQuestao").innerHTML = montarSequencia(q);

        prepararCampos();
        montarTeclado();

        $("acoesQuestao").innerHTML = `
            <button class="botao-principal"
                onclick="conferirSequencia()">
                Conferir sequência
            </button>
        `;

        return;
    }

    $("instrucaoQuestao").textContent = "Resolva a questão:";

    if (q.operacao === "divisao") {
        $("areaQuestao").innerHTML = montarDivisao(q);
    } else if (q.operacao === "multiplicacao") {
        $("areaQuestao").innerHTML = montarMultiplicacao(q);
    } else {
        $("areaQuestao").innerHTML = montarConta(q);
    }

    prepararCampos();
    montarTeclado();
}

/* =========================================================
   CAMPOS ATIVOS E TECLADO VIRTUAL
   ========================================================= */

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

        campo.addEventListener("click", () => {
            estado.campoAtivo = campo;
        });

        campo.addEventListener("input", () => {
            campo.value = campo.value.replace(/\D/g, "");

            if (campo.maxLength === 1 && campo.value.length === 1) {
                moverParaProximoCampo(campo);
            }
        });
    });

    if (campos.length) {
        // Para contas armadas, começar pela casa das unidades.
        const primeiraLinha = campos.filter(
            campo => campo.dataset.linha === "resultado"
        );

        const alvo = primeiraLinha.length
            ? primeiraLinha[primeiraLinha.length - 1]
            : campos[0];

        alvo.focus();
    }
}

function moverParaProximoCampo(atual) {
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

    [1,2,3,4,5,6,7,8,9,"C",0,"⌫"].forEach(valor => {
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
        return;
    }

    if (valor === "⌫") {
        campo.value = campo.value.slice(0, -1);
        return;
    }

    if (campo.maxLength === 1) {
        campo.value = String(valor);
        campo.dispatchEvent(new Event("input", { bubbles: true }));
        return;
    }

    campo.value += String(valor);
}

/* =========================================================
   LER RESPOSTAS
   ========================================================= */

function lerLinha(linha) {
    const campos = [
        ...document.querySelectorAll(
            `#areaQuestao input[data-linha="${linha}"]`
        )
    ];

    if (!campos.length || campos.some(campo => campo.value === "")) {
        return null;
    }

    return Number(campos.map(campo => campo.value).join(""));
}

function lerResultado() {
    return lerLinha("resultado");
}

/* =========================================================
   CONFERIR RESPOSTAS
   ========================================================= */

function conferirResposta() {
    if (estado.aguardandoAvanco) return;

    const q = estado.questoes[estado.indice];
    let correto = false;

    if (q.operacao === "divisao") {
        const quociente = $("campoQuociente").value;
        const campoResto = $("campoResto");

        if (quociente === "") {
            $("feedback").textContent = "Digite o quociente.";
            return;
        }

        const resto = campoResto
            ? (campoResto.value === "" ? 0 : Number(campoResto.value))
            : 0;

        correto =
            Number(quociente) === q.resultado &&
            resto === q.resto;

    } else {
        const resposta = lerResultado();

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

function conferirParciais(q) {
    const algarismos = separarDigitos(q.segundo).reverse();

    for (let i = 0; i < algarismos.length; i++) {
        const campos = [
            ...document.querySelectorAll(
                `#areaQuestao input[data-linha="parcial-${i}"]`
            )
        ];

        if (!campos.length || campos.some(campo => campo.value === "")) {
            return false;
        }

        const informado = Number(
            campos.map(campo => campo.value).join("")
        );

        const esperado =
            q.primeiro * Number(algarismos[i]) * Math.pow(10, i);

        if (informado !== esperado) return false;
    }

    return true;
}

function respostaCorreta() {
    estado.aguardandoAvanco = true;

    $("feedback").textContent = "Resposta Correta! ✅";

    estado.resultados.push({
        correto: true,
        corrigida: estado.errou
    });

    document.querySelectorAll(
        "#areaQuestao input, #teclado button"
    ).forEach(campo => {
        campo.disabled = true;
    });

    setTimeout(() => {
        estado.aguardandoAvanco = false;
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
    if (estado.aguardandoAvanco) return;

    estado.resultados.push({
        correto: false,
        corrigida: false,
        pulada: true
    });

    avancarQuestao();
}

/* =========================================================
   CORREÇÃO DAS SEQUÊNCIAS
   ========================================================= */

function conferirSequencia() {
    const q = estado.questoes[estado.indice];

    const campos = [
        ...document.querySelectorAll(".respostaSequencia")
    ];

    if (campos.some(campo => campo.value === "")) {
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

/* =========================================================
   CRONÔMETRO
   ========================================================= */

function iniciarCronometro() {
    pararCronometro();

    estado.inicio = Date.now();
    atualizarCronometro();

    estado.cronometro = setInterval(
        atualizarCronometro,
        1000
    );
}

function pararCronometro() {
    if (estado.cronometro) {
        clearInterval(estado.cronometro);
        estado.cronometro = null;
    }
}

function tempoDecorrido() {
    if (!estado.inicio) return 0;

    return Math.floor((Date.now() - estado.inicio) / 1000);
}

function atualizarCronometro() {
    const segundos = tempoDecorrido();
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;

    $("cronometro").textContent =
        `${String(minutos).padStart(2, "0")}:` +
        `${String(resto).padStart(2, "0")}`;
}

/* =========================================================
   FINALIZAR ATIVIDADE E SALVAR
   ========================================================= */

function finalizarAtividade() {
    pararCronometro();

    const total = estado.questoes.length;

    let acertos;
    let corrigidas = 0;
    let percentual;

    if (estado.modalidade === "sequencia") {
        acertos = estado.resultados.reduce(
            (soma, item) => soma + (item.percentual || 0),
            0
        );

        percentual = Math.round(
            acertos / estado.resultados.length
        );

        // Para sequências, cada sequência vale 100 pontos.
        const totalPontos = estado.resultados.length * 100;
        const pontos = estado.resultados.reduce(
            (soma, item) => soma + (item.percentual || 0),
            0
        );

        percentual = totalPontos
            ? Math.round(pontos / estado.resultados.length)
            : 0;

        acertos = estado.resultados.filter(
            item => item.correto
        ).length;

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

    const chave =
        `${estado.operacao}_${estado.modalidade}`;

    salvarTentativa(chave, resultado);

    $("resultadoPercentual").textContent = `${percentual}%`;

    $("detalhesResultado").innerHTML = `
        <p>Questões: <strong>${total}</strong></p>
        <p>Acertos diretos: <strong>${acertos - corrigidas}</strong></p>
        <p>Corrigidas: <strong>${corrigidas}</strong></p>
        <p>Erros ou puladas: <strong>${erros}</strong></p>
        <p>Tempo: <strong>
            ${Math.floor(resultado.tempo / 60)} min
            ${resultado.tempo % 60} s
        </strong></p>
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

/* =========================================================
   DESEMPENHO
   ========================================================= */

function atualizarDesempenho() {
    const totalModalidades = 14;
    const itens = Object.entries(progresso);

    const verdes = itens.filter(
        ([, item]) => item.verdeConquistado
    ).length;

    const amarelas = itens.filter(([, item]) => {
        const ultima = item.tentativas.at(-1);

        return !item.verdeConquistado &&
            ultima && ultima.percentual > 50;
    }).length;

    const vermelhas = itens.filter(([, item]) => {
        const ultima = item.tentativas.at(-1);

        return !item.verdeConquistado &&
            ultima && ultima.percentual <= 50;
    }).length;

    const naoIniciadas = Math.max(
        0,
        totalModalidades - itens.length
    );

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

/* =========================================================
   ÁRVORE DO CONHECIMENTO
   ========================================================= */

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
            elemento.title = chave;
            area.appendChild(elemento);
        }
    });

    if (total >= 14) {
        area.innerHTML += " ⭐⭐⭐";
    }
}

/* =========================================================
   BOTÕES FINAIS
   ========================================================= */

function revisarAtividade() {
    iniciarAtividade();
}

function novoEstudo() {
    pararCronometro();
    abrirOperacao(estado.operacao);
}

function confirmarSaida() {
    if (confirm(
        "Deseja sair desta atividade? " +
        "O resultado desta tentativa não será registrado."
    )) {
        irInicio();
    }
}

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

atualizarDesempenho();
mostrarTela("inicio");