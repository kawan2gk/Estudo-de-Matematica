
/* =========================================================
   CURSO DE MATEMÁTICA BÁSICA
   Arquivo: script.js
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
    quantidade: 10,
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

function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.add("escondida");
    });

    $(id).classList.remove("escondida");
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

function irInicio() {
    pararCronometro();
    mostrarTela("inicio");
    atualizarDesempenho();
}

/* =========================================================
   ABRIR OPERAÇÕES
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
   CONSTRUÇÃO DAS DUAS COLUNAS DE SELEÇÃO
   ========================================================= */

function criarColuna(titulo, nomeGrupo, opcoes) {
    let html = `
        <div class="coluna-selecao">
            <div class="titulo-coluna">${titulo}</div>
    `;

    opcoes.forEach(opcao => {
        html += `
            <label class="opcao-selecao">
                <input type="checkbox"
                    name="${nomeGrupo}"
                    value="${opcao.valor}">
                <span>${opcao.texto}</span>
            </label>
        `;
    });

    html += "</div>";

    return html;
}

function criarSelecaoDupla(tituloEsquerda, grupoEsquerda, opcoesEsquerda,
                           tituloDireita, grupoDireita, opcoesDireita) {

    return `
        <div class="selecao-dupla">
            ${criarColuna(tituloEsquerda, grupoEsquerda, opcoesEsquerda)}
            ${criarColuna(tituloDireita, grupoDireita, opcoesDireita)}
        </div>
    `;
}

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

    /* SOMA */

    if (op === "soma" && id === "sequencial") {
        html += criarSelecaoDupla(
            "Coluna esquerda",
            "casas",
            casasNumericas(),
            "Coluna direita",
            "valores",
            valoresNumericos(1, 10, "Somando +")
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

    /* SUBTRAÇÃO */

    if (op === "subtracao" && id === "sequencial") {
        html += criarSelecaoDupla(
            "Coluna esquerda",
            "casas",
            casasNumericas(),
            "Coluna direita",
            "valores",
            valoresNumericos(1, 10, "Subtraindo −")
        );

        html += opcoesReservaHTML();
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

        html += opcoesReservaHTML();
    }

    /* MULTIPLICAÇÃO */

    if (op === "multiplicacao" && id === "sequencial") {
        html += criarSelecaoDupla(
            "Coluna esquerda",
            "casas",
            casasNumericas(),
            "Coluna direita",
            "valores",
            valoresNumericos(0, 9, "Multiplicando ×")
        );
    }

    if (op === "multiplicacao" && id === "diversas") {
        const combinacoes = [
            { valor: "UU", texto: "Unidade × Unidade" },
            { valor: "DU", texto: "Dezena × Unidade" },
            { valor: "CU", texto: "Centena × Unidade" },
            { valor: "DD", texto: "Dezena × Dezena" },
            { valor: "CD", texto: "Centena × Dezena" }
        ];

        html += criarSelecaoDupla(
            "Primeiro fator",
            "primeiro",
            casasNumericas(),
            "Segundo fator",
            "combinacoes",
            combinacoes
        );
    }

    /* SEQUÊNCIAS */

    if (op === "multiplicacao" && id === "sequencia") {
        html += `
            <p>Escolha a sequência que deseja estudar:</p>
            <div class="number-options">
                ${criarSelecaoSimples("numero", 2, 10)}
            </div>
        `;
    }

    if (op === "divisao" && id === "sequencia") {
        html += `
            <p>Escolha a sequência que deseja estudar:</p>
            <div class="number-options">
                ${criarSelecaoSimples("numero", 1, 10)}
            </div>
        `;
    }

    /* DIVISÃO */

    if (op === "divisao" &&
        (id === "pratica" || id === "resto")) {

        html += criarSelecaoDupla(
            "Coluna esquerda",
            "divisores",
            valoresNumericos(1, 10, "Divisor "),
            "Coluna direita",
            "multiplicadores",
            valoresNumericos(0, 10, "Múltiplo ")
        );
    }

    /* TABUADAS */

    if (id === "tabuada") {
        const titulo = op === "divisao"
            ? "Escolha o divisor"
            : "Escolha a unidade";

        html += `
            <p>${titulo}:</p>
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

function criarSelecaoSimples(grupo, inicio, fim) {
    let html = "";

    for (let n = inicio; n <= fim; n++) {
        html += `
            <label>
                <input type="checkbox"
                    name="${grupo}"
                    value="${n}">
                ${n}
            </label>
        `;
    }

    return html;
}

/* =========================================================
   LEITURA DAS ESCOLHAS
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

    if (op === "divisao" && (mod === "pratica" || mod === "resto")) {
        o.divisores = selecionados("divisores").map(Number);
        o.multiplicadores = selecionados("multiplicadores").map(Number);
    }

    if (mod === "sequencia") {
        o.numeros = selecionados("numero").map(Number);
    }

    if (mod === "tabuada") {
        o.unidades = selecionados("unidade").map(Number);
    }

    return o;
}

/* =========================================================
   VALIDAÇÃO
   ========================================================= */

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
        (!o.divisores.length || !o.multiplicadores.length)) {
        throw new Error("Selecione pelo menos uma opção em cada coluna.");
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
   GERAÇÃO DE NÚMEROS
   ========================================================= */

function gerarNumeroCasa(casa) {
    if (casa === "unidade") return aleatorio(0, 9);
    if (casa === "dezena") return aleatorio(10, 99);
    if (casa === "centena") return aleatorio(100, 999);

    return aleatorio(0, 9);
}

function temReserva(a, b) {
    const A = String(a).split("").reverse();
    const B = String(b).split("").reverse();

    let emprestimo = 0;

    for (let i = 0; i < Math.max(A.length, B.length); i++) {
        let x = Number(A[i] || 0) - emprestimo;
        const y = Number(B[i] || 0);

        if (x < y) return true;

        emprestimo = 0;
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

/* =========================================================
   GERAÇÃO DE SOMA E SUBTRAÇÃO
   ========================================================= */

function gerarSequencial(op, o) {
    const lista = [];
    const total = o.quantidade;

    for (let i = 0; i < total; i++) {
        const casa = o.casas[aleatorio(0, o.casas.length - 1)];
        const valor = o.valores[aleatorio(0, o.valores.length - 1)];

        let a = gerarNumeroCasa(casa);
        let b = valor;

        if (op === "subtracao" && b > a) {
            [a, b] = [b, a];
        }

        if (op === "subtracao" && o.reservas.length === 1) {
            const reserva = temReserva(a, b);

            if (o.reservas[0] === "com" && !reserva) {
                i--;
                continue;
            }

            if (o.reservas[0] === "sem" && reserva) {
                i--;
                continue;
            }
        }

        lista.push(criarQuestao(a, b, op));
    }

    return embaralhar(lista);
}

function gerarDiversas(op, o) {
    const lista = [];
    const total = o.quantidade;

    for (let i = 0; i < total; i++) {
        const casaA = o.primeiro[aleatorio(0, o.primeiro.length - 1)];
        const casaB = o.segundo[aleatorio(0, o.segundo.length - 1)];

        let a = gerarNumeroCasa(casaA);
        let b = gerarNumeroCasa(casaB);

        if (op === "subtracao") {
            if (b > a) [a, b] = [b, a];

            if (o.reservas.length === 1) {
                const reserva = temReserva(a, b);

                if (o.reservas[0] === "com" && !reserva) {
                    i--;
                    continue;
                }

                if (o.reservas[0] === "sem" && reserva) {
                    i--;
                    continue;
                }
            }
        }

        lista.push(criarQuestao(a, b, op));
    }

    return embaralhar(lista);
}

/* =========================================================
   MULTIPLICAÇÃO DIVERSA
   ========================================================= */

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

        const a = gerarNumeroCasa(casaA);
        const b = gerarNumeroCasa(casaB);

        lista.push(criarQuestao(a, b, "multiplicacao"));
    }

    return embaralhar(lista);
}

/* =========================================================
   DIVISÃO
   ========================================================= */

function gerarDivisao(o, comResto) {
    const lista = [];

    for (let i = 0; i < o.quantidade; i++) {
        const divisor = o.divisores[
            aleatorio(0, o.divisores.length - 1)
        ];

        const multiplicador = o.multiplicadores[
            aleatorio(0, o.multiplicadores.length - 1)
        ];

        const resto = comResto
            ? aleatorio(0, divisor - 1)
            : 0;

        const dividendo = divisor * multiplicador + resto;

        lista.push({
            dividendo,
            divisor,
            resultado: multiplicador,
            resto,
            operacao: "divisao"
        });
    }

    return embaralhar(lista);
}

/* =========================================================
   TABUADAS
   ========================================================= */

function gerarTabuada(op, unidades) {
    const lista = [];

    unidades.forEach(unidade => {
        for (let i = 0; i <= 10; i++) {
            if (op === "soma") {
                lista.push(criarQuestao(unidade, i, op));
            }

            if (op === "subtracao") {
                lista.push(criarQuestao(unidade + i, unidade, op));
            }

            if (op === "multiplicacao") {
                lista.push(criarQuestao(unidade, i, op));
            }

            if (op === "divisao") {
                lista.push({
                    dividendo: unidade * i,
                    divisor: unidade,
                    resultado: i,
                    resto: 0,
                    operacao: "divisao"
                });
            }
        }
    });

    return embaralhar(lista);
}

/* =========================================================
   SEQUÊNCIAS NUMÉRICAS
   ========================================================= */

function gerarSequencias(numeros) {
    const lista = [];

    numeros.forEach(numero => {
        const posicoes = embaralhar(
            Array.from({ length: 10 }, (_, i) => i)
        ).slice(0, 4);

        lista.push({
            numero,
            itens: Array.from({ length: 10 }, (_, i) => ({
                posicao: i,
                valor: numero * (i + 1),
                preenchida: posicoes.includes(i)
            }))
        });
    });

    return embaralhar(lista);
}

/* =========================================================
   ORGANIZAR QUESTÕES
   ========================================================= */

function gerarQuestoes() {
    const op = estado.operacao;
    const mod = estado.modalidade;
    const o = estado.opcoes;

    if (mod === "sequencia") {
        return gerarSequencias(o.numeros);
    }

    if (mod === "tabuada") {
        return gerarTabuada(op, o.unidades);
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

    return gerarDiversas(op, o);
}

/* =========================================================
   INICIAR ESTUDO
   ========================================================= */

function iniciarAtividade() {
    try {
        estado.opcoes = lerOpcoes();
        validarOpcoes(estado.opcoes);

        estado.quantidade = estado.opcoes.quantidade || 10;
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
   CAMPOS DE RESPOSTA POR ALGARISMO
   ========================================================= */

function separarDigitos(numero) {
    return String(Math.abs(numero)).split("");
}

function criarCamposDigitos(numero, classe = "campo-digito") {
    const digitos = separarDigitos(numero);

    const quantidade = Math.max(4, digitos.length);
    const preenchidos = Array(quantidade - digitos.length)
        .fill("")
        .concat(digitos);

    return preenchidos.map((valor, i) => {
        if (valor === "") {
            return `<input class="${classe} campo-vazio"
                tabindex="-1" disabled>`;
        }

        return `<input class="${classe}"
            data-resposta="true"
            data-posicao="${i}"
            maxlength="1"
            inputmode="numeric"
            autocomplete="off">`;
    }).join("");
}

function criarLinhaResposta(numero, identificador) {
    const digitos = separarDigitos(numero);
    const quantidade = Math.max(4, digitos.length);

    const vazios = quantidade - digitos.length;

    let html = "";

    for (let i = 0; i < quantidade; i++) {
        if (i < vazios) {
            html += `<input class="campo-digito campo-vazio"
                disabled tabindex="-1">`;
        } else {
            html += `
                <input class="campo-digito"
                    data-resposta="true"
                    data-linha="${identificador}"
                    data-posicao="${i}"
                    maxlength="1"
                    inputmode="numeric"
                    autocomplete="off">
            `;
        }
    }

    return html;
}

function criarLinhaNumero(numero) {
    const digitos = separarDigitos(numero);
    const casas = ["UM", "C", "D", "U"];

    const valores = Array(4 - digitos.length)
        .fill("")
        .concat(digitos);

    return valores.map(valor => `
        <div class="celula-numero">${valor}</div>
    `).join("");
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

/* =========================================================
   ÁREA DE RESERVAS
   ========================================================= */

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

            <p class="nota-conta">
                Utilize os quadrinhos para registrar as reservas.
            </p>
        </div>
    `;
}

function limparReservas() {
    document.querySelectorAll("[data-reserva]").forEach(campo => {
        campo.value = "";
    });
}

/* =========================================================
   CONTA ARMADA: SOMA E SUBTRAÇÃO
   ========================================================= */

function montarConta(q) {
    const sinal = q.operacao === "soma" ? "+" : "−";

    return `
        <div class="conta-armada">

            ${cabecalhoCasas()}

            <div class="linha-conta">
                ${criarLinhaNumero(q.primeiro)}
            </div>

            <div class="sinal-conta">${sinal}</div>

            <div class="linha-conta">
                ${criarLinhaNumero(q.segundo)}
            </div>

            <div class="linha-resposta">
                ${criarLinhaResposta(q.resultado, "resultado")}
            </div>

            ${criarReservas()}

        </div>
    `;
}

/* =========================================================
   CONTA ARMADA: MULTIPLICAÇÃO
   ========================================================= */

function montarMultiplicacao(q) {
    const algarismos = separarDigitos(q.segundo).reverse();

    const parciais = algarismos.map((algarismo, i) => ({
        valor: q.primeiro * Number(algarismo) * Math.pow(10, i),
        indice: i
    }));

    return `
        <div class="conta-armada">

            <div class="titulo-conta">
                Multiplicação armada
            </div>

            ${cabecalhoCasas()}

            <div class="linha-conta">
                ${criarLinhaNumero(q.primeiro)}
            </div>

            <div class="sinal-conta">×</div>

            <div class="linha-conta">
                ${criarLinhaNumero(q.segundo)}
            </div>

            ${parciais.map((parcial, i) => `
                <div class="secao-parcial">
                    <p class="titulo-parcial">
                        ${i + 1}º produto parcial:
                        ${q.primeiro} × ${algarismos[i]}
                        ${i > 0 ? " dezenas/centenas" : ""}
                    </p>

                    <div class="linha-parcial">
                        ${criarLinhaResposta(
                            parcial.valor,
                            "parcial-" + i
                        )}
                    </div>
                </div>
            `).join("")}

            <div class="secao-resultado">
                <p class="titulo-parcial">Resultado final</p>

                <div class="linha-resposta">
                    ${criarLinhaResposta(q.resultado, "resultado")}
                </div>
            </div>

            ${criarReservas()}

        </div>
    `;
}

/* =========================================================
   DIVISÃO
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
   SEQUÊNCIAS
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
                        data-posicao="${item.posicao}"
                        inputmode="numeric"
                        autocomplete="off">`
                }
            </div>
        `;
    });

    html += "</div>";

    return html;
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

    $("feedback").textContent = "";

    $("numeroQuestao").textContent =
        `Questão ${estado.indice + 1} de ${estado.questoes.length}`;

    $("barraQuestao").style.width =
        `${(estado.indice / estado.questoes.length) * 100}%`;

    $("areaResposta").innerHTML = "";
    $("teclado").innerHTML = "";

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal"
            onclick="conferirResposta()">
            Conferir resposta
        </button>

        <button class="botao-secundario"
            onclick="pularQuestao()">
            Pular questão
        </button>
    `;

    if (estado.modalidade === "sequencia") {
        $("instrucaoQuestao").textContent =
            "Complete os espaços da sequência.";

        $("areaQuestao").innerHTML = montarSequencia(q);
        montarTeclado();
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
   CAMPO ATIVO E TECLADO
   ========================================================= */

function prepararCampos() {
    const campos = document.querySelectorAll(
        "#areaQuestao input[data-resposta], " +
        "#areaQuestao input[data-resposta-sequencia]"
    );

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

    const primeiro = campos[0];

    if (primeiro) {
        primeiro.focus();
    }
}

function moverParaProximoCampo(campoAtual) {
    const campos = [...document.querySelectorAll(
        "#areaQuestao input[data-resposta]"
    )];

    const indice = campos.indexOf(campoAtual);

    // As colunas são preenchidas da direita para a esquerda.
    if (indice > 0) {
        campos[indice - 1].focus();
    }
}

function montarTeclado() {
    const teclado = $("teclado");
    teclado.innerHTML = "";

    const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "⌫"];

    valores.forEach(valor => {
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
    } else if (valor === "⌫") {
        campo.value = campo.value.slice(0, -1);
    } else {
        if (campo.maxLength === 1) {
            campo.value = String(valor);
            moverParaProximoCampo(campo);
            return;
        }

        campo.value += valor;
    }

    campo.dispatchEvent(new Event("input", { bubbles: true }));
}

/* =========================================================
   LEITURA DOS CAMPOS DE UMA CONTA
   ========================================================= */

function lerLinha(linha) {
    const campos = [
        ...document.querySelectorAll(
            `[data-linha="${linha}"]`
        )
    ];

    const digitos = campos.map(campo => campo.value);

    if (digitos.some(valor => valor === "")) {
        return null;
    }

    return Number(digitos.join(""));
}

function lerResultado() {
    const campos = [
        ...document.querySelectorAll(
            '[data-resposta][data-linha="resultado"]'
        )
    ];

    const valores = campos.map(campo => campo.value);

    if (valores.some(valor => valor === "")) {
        return null;
    }

    return Number(valores.join(""));
}

/* =========================================================
   CONFERIR RESPOSTA
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

        const restoInformado = campoResto
            ? (campoResto.value === "" ? 0 : Number(campoResto.value))
            : 0;

        correto =
            Number(quociente) === q.resultado &&
            restoInformado === q.resto;

    } else {
        const resposta = lerResultado();

        if (resposta === null) {
            $("feedback").textContent =
                "Preencha todos os algarismos da resposta.";
            return;
        }

        correto = resposta === q.resultado;

        if (q.operacao === "multiplicacao") {
            q.parciaisCorretas = conferirParciais(q);
            correto = correto && q.parciaisCorretas;
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
                `[data-linha="parcial-${i}"]`
            )
        ];

        const valores = campos.map(campo => campo.value);

        if (valores.some(valor => valor === "")) {
            return false;
        }

        const informado = Number(valores.join(""));
        const esperado = q.primeiro *
            Number(algarismos[i]) *
            Math.pow(10, i);

        if (informado !== esperado) {
            return false;
        }
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
        <button class="botao-principal"
            onclick="tentarNovamente()">
            Corrigir
        </button>

        <button class="botao-secundario"
            onclick="pularQuestao()">
            Pular questão
        </button>
    `;
}

function tentarNovamente() {
    $("feedback").textContent = "";

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal"
            onclick="conferirResposta()">
            Conferir resposta
        </button>

        <button class="botao-secundario"
            onclick="pularQuestao()">
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
   SEQUÊNCIAS: CORREÇÃO
   ========================================================= */

function conferirSequencia() {
    const q = estado.questoes[estado.indice];

    const campos = [
        ...document.querySelectorAll(".respostaSequencia")
    ];

    let acertos = 0;

    campos.forEach(campo => {
        const posicao = Number(campo.dataset.posicao);
        const correto = Number(campo.value) === q.itens[posicao].valor;

        if (campo.value !== "" && correto) {
            acertos++;
        }
    });

    if (campos.some(campo => campo.value === "")) {
        $("feedback").textContent =
            "Preencha todos os espaços antes de conferir.";
        return;
    }

    if (acertos === campos.length) {
        $("feedback").textContent = "Sequência correta! ✅";
    } else {
        $("feedback").textContent =
            `${acertos} de ${campos.length} respostas corretas.`;
    }

    campos.forEach(campo => campo.disabled = true);

    const percentual = Math.round(acertos / campos.length * 100);

    estado.resultados.push({
        correto: acertos === campos.length,
        percentual
    });

    if (estado.indice < estado.questoes.length - 1) {
        $("acoesQuestao").innerHTML = `
            <button class="botao-principal"
                onclick="avancarQuestao()">
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
   FINALIZAR ATIVIDADE
   ========================================================= */

function finalizarAtividade() {
    pararCronometro();

    const total = estado.questoes.length;

    const acertos = estado.resultados.filter(
        item => item.correto
    ).length;

    const corrigidas = estado.resultados.filter(
        item => item.correto && item.corrigida
    ).length;

    const erros = total - acertos;

    const percentual = Math.round(acertos / total * 100);

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

/* =========================================================
   SALVAR TENTATIVAS
   ========================================================= */

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
   PAINEL DE DESEMPENHO
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

    if (total === 14) {
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

    if (total === 14) {
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
