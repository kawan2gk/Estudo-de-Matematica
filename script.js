
/* =====================================================
   CURSO DE MATEMÁTICA BÁSICA
   Arquivo único de funcionalidades: script.js
   ===================================================== */

const $ = id => document.getElementById(id);

const nomes = {
    soma: "Soma",
    subtracao: "Subtração",
    multiplicacao: "Multiplicação",
    divisao: "Divisão"
};

const modalidades = {
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

const recompensas = {
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
    ultimaQuantidade: 10
};

// =====================================================
// SALVAMENTO
// =====================================================

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

// =====================================================
// NAVEGAÇÃO
// =====================================================

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

function abrirOperacao(nome) {
    estado.operacao = nome;
    estado.modalidade = "";

    $("tituloOperacao").textContent = nomes[nome];

    const descricoes = {
        soma: "Pratique adições e desenvolva suas habilidades.",
        subtracao: "Aprenda a subtrair com e sem reserva.",
        multiplicacao: "Desenvolva suas habilidades de multiplicação.",
        divisao: "Pratique divisões exatas e com resto."
    };

    $("descricaoOperacao").textContent = descricoes[nome];

    montarModalidades();
    mostrarTela("operacao");
}

function montarModalidades() {
    const area = $("listaModalidades");
    area.innerHTML = "";

    modalidades[estado.operacao].forEach(([id, nome]) => {
        const botao = document.createElement("button");

        botao.className = "modalidade";
        botao.textContent = nome;

        botao.onclick = () => selecionarModalidade(id, botao);

        area.appendChild(botao);
    });

    $("configuracao").classList.add("escondida");
}

// =====================================================
// CONFIGURAÇÃO DAS ATIVIDADES
// =====================================================

function criarCheckbox(grupo, valor, texto) {
    return `
        <label>
            <input type="checkbox" name="${grupo}" value="${valor}">
            ${texto}
        </label>
    `;
}

function criarGrupoCasas(grupo, titulo) {
    return `
        <p>${titulo}</p>
        <div class="number-options">
            ${criarCheckbox(grupo, "unidade", "Unidade")}
            ${criarCheckbox(grupo, "dezena", "Dezena")}
            ${criarCheckbox(grupo, "centena", "Centena")}
        </div>
    `;
}

function criarNumeros(grupo, inicio, fim, titulo) {
    let html = `<p>${titulo}</p><div class="number-options">`;

    for (let i = inicio; i <= fim; i++) {
        html += criarCheckbox(grupo, i, i);
    }

    return html + "</div>";
}

function criarQuantidade() {
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

function selecionarModalidade(id, botao) {
    estado.modalidade = id;

    document.querySelectorAll(".modalidade").forEach(item => {
        item.classList.remove("selecionada");
    });

    botao.classList.add("selecionada");

    const op = estado.operacao;
    let html = "";

    if (id !== "sequencia" && id !== "tabuada") {
        html += criarQuantidade();
    }

    if (op === "soma" && id === "sequencial") {
        html += criarGrupoCasas("casas", "Escolha as casas:");
        html += criarNumeros("valores", 1, 10, "Somar:");
    }

    if (op === "soma" && id === "diversas") {
        html += criarGrupoCasas("primeiro", "Primeiro número:");
        html += criarGrupoCasas("segundo", "Segundo número:");
    }

    if (op === "subtracao" && id === "sequencial") {
        html += criarGrupoCasas("casas", "Escolha as casas:");
        html += criarNumeros("valores", 1, 10, "Subtrair:");
        html += "<p>Tipo de subtração:</p>";
        html += criarCheckbox("reserva", "com", "Com reserva");
        html += criarCheckbox("reserva", "sem", "Sem reserva");
    }

    if (op === "subtracao" && id === "diversas") {
        html += criarGrupoCasas("primeiro", "Primeiro número:");
        html += criarGrupoCasas("segundo", "Segundo número:");
        html += "<p>Tipo de subtração:</p>";
        html += criarCheckbox("reserva", "com", "Com reserva");
        html += criarCheckbox("reserva", "sem", "Sem reserva");
    }

    if (op === "multiplicacao" && id === "sequencial") {
        html += criarGrupoCasas("casas", "Escolha as casas:");
        html += criarNumeros("valores", 0, 9, "Multiplicar por:");
    }

    if (op === "multiplicacao" && id === "diversas") {
        html += "<p>Escolha as combinações:</p>";
        html += criarCheckbox("combinacoes", "0", "Unidade × Unidade");
        html += criarCheckbox("combinacoes", "1", "Dezena × Unidade");
        html += criarCheckbox("combinacoes", "2", "Centena × Unidade");
        html += criarCheckbox("combinacoes", "3", "Dezena × Dezena");
        html += criarCheckbox("combinacoes", "4", "Centena × Dezena");
    }

    if (op === "multiplicacao" && id === "sequencia") {
        html += criarNumeros("numero", 2, 10, "Escolha a sequência:");
    }

    if (op === "divisao" && id === "sequencia") {
        html += criarNumeros("numero", 1, 10, "Escolha a sequência:");
    }

    if (op === "divisao" && (id === "pratica" || id === "resto")) {
        html += criarNumeros("divisores", 1, 10, "Escolha os divisores:");
    }

    if (id === "tabuada") {
        const grupo = op === "divisao" ? "divisor" : "unidade";
        const titulo = op === "divisao"
            ? "Escolha o divisor:"
            : "Escolha a unidade:";

        html += criarNumeros(grupo, 1, 10, titulo);
    }

    $("opcoesConfiguracao").innerHTML = html;
    $("tituloConfiguracao").textContent =
        modalidades[op].find(item => item[0] === id)[1];

    $("configuracao").classList.remove("escondida");
}

// =====================================================
// LEITURA DAS CONFIGURAÇÕES
// =====================================================

function selecionados(grupo) {
    return [...document.querySelectorAll(
        `input[name="${grupo}"]:checked`
    )].map(campo => campo.value);
}

function lerOpcoes() {
    const op = estado.operacao;
    const mod = estado.modalidade;

    const opcoes = {
        quantidade: Number($("quantidade")?.value || 10)
    };

    if (mod === "sequencial") {
        opcoes.casas = selecionados("casas");
        opcoes.valores = selecionados("valores").map(Number);
    }

    if (mod === "diversas") {
        opcoes.primeiro = selecionados("primeiro");
        opcoes.segundo = selecionados("segundo");
        opcoes.combinacoes = selecionados("combinacoes").map(Number);
    }

    if (op === "subtracao" &&
        (mod === "sequencial" || mod === "diversas")) {
        opcoes.reservas = selecionados("reserva");
    }

    if (op === "divisao" && (mod === "pratica" || mod === "resto")) {
        opcoes.divisores = selecionados("divisores").map(Number);
    }

    if (mod === "sequencia") {
        opcoes.numero = Number(selecionados("numero")[0]);
    }

    if (mod === "tabuada") {
        const grupo = op === "divisao" ? "divisor" : "unidade";
        opcoes.unidade = Number(selecionados(grupo)[0]);
    }

    return opcoes;
}

// =====================================================
// GERAÇÃO DE QUESTÕES
// =====================================================

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function embaralhar(lista) {
    return [...lista].sort(() => Math.random() - 0.5);
}

function gerarNumero(casa) {
    if (casa === "unidade") return aleatorio(0, 9);
    if (casa === "dezena") return aleatorio(10, 99);
    if (casa === "centena") return aleatorio(100, 999);
    return aleatorio(0, 9);
}

function possuiReserva(a, b) {
    const A = String(a).split("").reverse();
    const B = String(b).split("").reverse();

    let emprestimo = 0;

    for (let i = 0; i < Math.max(A.length, B.length); i++) {
        const x = Number(A[i] || 0) - emprestimo;
        const y = Number(B[i] || 0);

        if (x < y) return true;
        emprestimo = 0;
    }

    return false;
}

function criarQuestao(a, b, operacao, tipo = "normal") {
    let resultado;

    if (operacao === "soma") resultado = a + b;
    if (operacao === "subtracao") resultado = a - b;
    if (operacao === "multiplicacao") resultado = a * b;

    return {
        primeiro: a,
        segundo: b,
        operacao,
        resultado,
        tipo
    };
}

function gerarOperacaoComCasas(opcoes, modalidade) {
    const op = estado.operacao;
    const lista = [];
    const quantidade = opcoes.quantidade;

    const combinacoes = [];

    if (modalidade === "sequencial") {
        opcoes.casas.forEach(casa => {
            opcoes.valores.forEach(valor => {
                combinacoes.push([casa, valor]);
            });
        });
    } else {
        opcoes.primeiro.forEach(a => {
            opcoes.segundo.forEach(b => {
                combinacoes.push([a, b]);
            });
        });
    }

    let tentativas = 0;

    while (lista.length < quantidade && tentativas < quantidade * 100) {
        tentativas++;

        const combinacao = combinacoes[aleatorio(0, combinacoes.length - 1)];

        let a, b;

        if (modalidade === "sequencial") {
            a = gerarNumero(combinacao[0]);
            b = combinacao[1];
        } else {
            a = gerarNumero(combinacao[0]);
            b = gerarNumero(combinacao[1]);
        }

        if (op === "subtracao") {
            if (b > a) [a, b] = [b, a];

            const temReserva = possuiReserva(a, b);
            const tipos = opcoes.reservas || [];

            if (tipos.length === 1) {
                if (tipos[0] === "com" && !temReserva) continue;
                if (tipos[0] === "sem" && temReserva) continue;
            }
        }

        lista.push(criarQuestao(a, b, op));
    }

    while (lista.length < quantidade) {
        let a = gerarNumero("unidade");
        let b = aleatorio(0, 9);

        if (op === "subtracao" && b > a) {
            [a, b] = [b, a];
        }

        lista.push(criarQuestao(a, b, op));
    }

    return embaralhar(lista);
}

function gerarMultiplicacaoDiversa(opcoes) {
    const tipos = [
        ["unidade", "unidade"],
        ["dezena", "unidade"],
        ["centena", "unidade"],
        ["dezena", "dezena"],
        ["centena", "dezena"]
    ];

    return Array.from({ length: opcoes.quantidade }, () => {
        const [a, b] = tipos[
            opcoes.combinacoes[aleatorio(0, opcoes.combinacoes.length - 1)]
        ];

        return criarQuestao(
            gerarNumero(a),
            gerarNumero(b),
            "multiplicacao"
        );
    });
}

function gerarDivisao(opcoes, comResto = false) {
    return Array.from({ length: opcoes.quantidade }, () => {
        const divisor = opcoes.divisores[
            aleatorio(0, opcoes.divisores.length - 1)
        ];

        const dividendo = comResto
            ? aleatorio(0, divisor * 10)
            : divisor * aleatorio(0, 10);

        return {
            dividendo,
            divisor,
            resultado: Math.floor(dividendo / divisor),
            resto: dividendo % divisor,
            operacao: "divisao"
        };
    });
}

function gerarTabuada(op, unidade) {
    const lista = [];

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
                operacao: op
            });
        }
    }

    return embaralhar(lista);
}

function gerarSequencia(numero) {
    const preenchidas = embaralhar(
        Array.from({ length: 10 }, (_, i) => i)
    ).slice(0, 4);

    return Array.from({ length: 10 }, (_, i) => ({
        posicao: i,
        valor: numero * (i + 1),
        preenchida: preenchidas.includes(i)
    }));
}

function gerarQuestoes() {
    const op = estado.operacao;
    const mod = estado.modalidade;
    const o = estado.opcoes;

    if (mod === "sequencia") {
        return gerarSequencia(o.numero);
    }

    if (mod === "tabuada") {
        return gerarTabuada(op, o.unidade);
    }

    if (op === "divisao") {
        return gerarDivisao(o, mod === "resto");
    }

    if (op === "multiplicacao" && mod === "diversas") {
        return gerarMultiplicacaoDiversa(o);
    }

    return gerarOperacaoComCasas(o, mod);
}

// =====================================================
// VALIDAÇÃO DA CONFIGURAÇÃO
// =====================================================

function validarOpcoes(o) {
    const op = estado.operacao;
    const mod = estado.modalidade;

    if (mod === "sequencia" && (!o.numero || !Number.isInteger(o.numero))) {
        throw new Error("Escolha uma sequência numérica.");
    }

    if (mod === "tabuada" && (!o.unidade || !Number.isInteger(o.unidade))) {
        throw new Error("Escolha uma unidade para estudar.");
    }

    if (mod === "sequencial" && (!o.casas?.length || !o.valores?.length)) {
        throw new Error("Selecione as casas e os valores.");
    }

    if (mod === "diversas" && op !== "multiplicacao" &&
        (!o.primeiro?.length || !o.segundo?.length)) {
        throw new Error("Selecione as casas dos dois números.");
    }

    if (op === "multiplicacao" && mod === "diversas" &&
        !o.combinacoes?.length) {
        throw new Error("Selecione pelo menos uma combinação.");
    }

    if (op === "divisao" &&
        (mod === "pratica" || mod === "resto") &&
        !o.divisores?.length) {
        throw new Error("Selecione pelo menos um divisor.");
    }

    if (op === "subtracao" &&
        (mod === "sequencial" || mod === "diversas") &&
        o.reservas.length === 0) {
        o.reservas = ["com", "sem"];
    }
}

// =====================================================
// INICIAR ATIVIDADE
// =====================================================

function iniciarAtividade() {
    try {
        estado.opcoes = lerOpcoes();
        validarOpcoes(estado.opcoes);

        estado.ultimaQuantidade = estado.opcoes.quantidade || 10;
        estado.questoes = gerarQuestoes();
        estado.indice = 0;
        estado.resultados = [];
        estado.errou = false;

        mostrarTela("estudo");
        iniciarCronometro();

        mostrarQuestao();

    } catch (erro) {
        alert(erro.message);
    }
}

// =====================================================
// EXIBIR QUESTÃO
// =====================================================

function mostrarQuestao() {
    const q = estado.questoes[estado.indice];

    if (!q) {
        finalizarAtividade();
        return;
    }

    $("feedback").textContent = "";
    $("numeroQuestao").textContent =
        `Questão ${estado.indice + 1} de ${estado.questoes.length}`;

    $("barraQuestao").style.width =
        `${(estado.indice / estado.questoes.length) * 100}%`;

    $("areaResposta").innerHTML = "";
    $("teclado").innerHTML = "";

    if (estado.modalidade === "sequencia") {
        mostrarSequencia();
        return;
    }

    $("instrucaoQuestao").textContent = "Resolva a questão:";

    if (q.operacao === "divisao") {
        $("areaQuestao").innerHTML = `
            <div class="math-question">
                ${q.dividendo} ÷ ${q.divisor}
                <div class="math-line"></div>
            </div>
        `;

        $("areaResposta").innerHTML = `
            <label>Quociente
                <input id="resposta" type="number" inputmode="numeric">
            </label>
            ${estado.modalidade === "resto" ? `
                <label>Resto
                    <input id="respostaResto" type="number" inputmode="numeric">
                </label>
            ` : ""}
        `;

    } else {
        const sinal = {
            soma: "+",
            subtracao: "−",
            multiplicacao: "×"
        }[q.operacao];

        $("areaQuestao").innerHTML = `
            <div class="math-question">
                <div>${q.primeiro}</div>
                <div>${sinal} ${q.segundo}</div>
                <div class="math-line"></div>
            </div>
        `;

        $("areaResposta").innerHTML = `
            <input id="resposta" type="number" inputmode="numeric"
                placeholder="Sua resposta">
        `;
    }

    montarTeclado();

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal" onclick="conferirResposta()">
            Conferir resposta
        </button>
        <button class="botao-secundario" onclick="pularQuestao()">
            Pular questão
        </button>
    `;
}

// =====================================================
// SEQUÊNCIAS
// =====================================================

function mostrarSequencia() {
    const lista = estado.questoes;

    $("instrucaoQuestao").textContent =
        "Complete os espaços da sequência numérica.";

    let html = '<div class="sequence-grid">';

    lista.forEach(item => {
        html += `
            <div class="sequence-cell">
                <span>${item.posicao + 1}</span>
                ${
                    item.preenchida
                        ? `<strong>${item.valor}</strong>`
                        : `<input class="respostaSequencia"
                            data-posicao="${item.posicao}"
                            type="number" inputmode="numeric">`
                }
            </div>
        `;
    });

    html += "</div>";

    $("areaQuestao").innerHTML = html;
    $("areaResposta").innerHTML = "";
    $("teclado").innerHTML = "";

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal" onclick="conferirSequencia()">
            Conferir sequência
        </button>
    `;
}

function conferirSequencia() {
    const lista = estado.questoes;

    const campos = document.querySelectorAll(".respostaSequencia");

    let acertos = 0;

    campos.forEach(campo => {
        const indice = Number(campo.dataset.posicao);
        const correto = Number(campo.value) === lista[indice].valor;

        if (campo.value !== "" && correto) {
            acertos++;
        }
    });

    estado.resultados = lista.map(item => ({
        correto: item.preenchida ||
            Number(document.querySelector(
                `[data-posicao="${item.posicao}"]`
            )?.value) === item.valor
    }));

    const total = 6;
    const percentual = Math.round(acertos / total * 100);

    const chave = `${estado.operacao}_${estado.modalidade}`;

    salvarTentativa(chave, {
        total,
        acertos,
        erros: total - acertos,
        percentual,
        tempo: tempoDecorrido()
    });

    pararCronometro();

    $("feedback").textContent =
        `${acertos} de 6 espaços corretos.`;

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal" onclick="revisarAtividade()">
            Revisar novamente
        </button>
        <button class="botao-secundario" onclick="novoEstudo()">
            Novo estudo
        </button>
    `;

    atualizarDesempenho();
}

// =====================================================
// CORREÇÃO
// =====================================================

function conferirResposta() {
    const q = estado.questoes[estado.indice];

    const campo = $("resposta");

    if (!campo || campo.value === "") {
        $("feedback").textContent = "Digite uma resposta.";
        return;
    }

    let correto;

    if (q.operacao === "divisao") {
        correto = Number(campo.value) === q.resultado;

        if (estado.modalidade === "resto") {
            const resto = $("respostaResto").value;
            correto = correto &&
                Number(resto === "" ? 0 : resto) === q.resto;
        }
    } else {
        correto = Number(campo.value) === q.resultado;
    }

    if (correto) {
        $("feedback").textContent = "Resposta Correta! ✅";

        estado.resultados.push({
            correto: true,
            corrigida: estado.errou
        });

        document.querySelectorAll("#areaResposta input").forEach(input => {
            input.disabled = true;
        });

        document.querySelectorAll("#teclado button").forEach(button => {
            button.disabled = true;
        });

        setTimeout(() => {
            avancarQuestao();
        }, 1500);

    } else {
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
    mostrarQuestao();
}

function pularQuestao() {
    estado.resultados.push({
        correto: false,
        corrigida: false,
        pulada: true
    });

    avancarQuestao();
}

// =====================================================
// TECLADO VIRTUAL
// =====================================================

function montarTeclado() {
    const teclado = $("teclado");

    for (let i = 1; i <= 9; i++) {
        criarTecla(i);
    }

    criarTecla("C");
    criarTecla(0);
    criarTecla("⌫");
}

function criarTecla(valor) {
    const botao = document.createElement("button");

    botao.textContent = valor;
    botao.type = "button";

    botao.onclick = () => {
        const campo = $("resposta");

        if (!campo || campo.disabled) return;

        if (valor === "C") {
            campo.value = "";
        } else if (valor === "⌫") {
            campo.value = campo.value.slice(0, -1);
        } else {
            campo.value += valor;
        }
    };

    $("teclado").appendChild(botao);
}

// =====================================================
// CRONÔMETRO
// =====================================================

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

// =====================================================
// RESULTADO FINAL
// =====================================================

function finalizarAtividade() {
    pararCronometro();

    const total = estado.questoes.length;
    const acertos = estado.resultados.filter(r => r.correto).length;
    const corrigidas = estado.resultados.filter(
        r => r.correto && r.corrigida
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

    const chave = `${estado.operacao}_${estado.modalidade}`;

    salvarTentativa(chave, resultado);

    $("resultadoPercentual").textContent = `${percentual}%`;

    $("detalhesResultado").innerHTML = `
        <p>Questões: <strong>${total}</strong></p>
        <p>Acertos diretos: <strong>${acertos - corrigidas}</strong></p>
        <p>Corrigidas: <strong>${corrigidas}</strong></p>
        <p>Erros ou puladas: <strong>${erros}</strong></p>
        <p>Tempo: <strong>${Math.floor(resultado.tempo / 60)} min ${resultado.tempo % 60} s</strong></p>
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

// =====================================================
// DESEMPENHO
// =====================================================

function atualizarDesempenho() {
    const itens = Object.entries(progresso);
    const totalModalidades = 14;

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

// =====================================================
// ÁRVORE DO CONHECIMENTO
// =====================================================

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

    Object.entries(recompensas).forEach(([chave, simbolo]) => {
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

// =====================================================
// BOTÕES FINAIS
// =====================================================

function revisarAtividade() {
    iniciarAtividade();
}

function novoEstudo() {
    pararCronometro();
    abrirOperacao(estado.operacao);
}

function confirmarSaida() {
    if (confirm("Deseja sair desta atividade? O progresso desta tentativa não será registrado.")) {
        irInicio();
    }
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================

atualizarDesempenho();
mostrarTela("inicio");
