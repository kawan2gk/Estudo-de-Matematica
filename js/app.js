
/* =====================================================
   CURSO DE MATEMÁTICA BÁSICA
   Arquivo principal: js/app.js
   ===================================================== */

// Importação dos módulos
import "./operacoes/soma.js";
import "./operacoes/subtracao.js";
import "./operacoes/multiplicacao.js";
import "./operacoes/divisao.js";

// -----------------------------------------------------
// ELEMENTOS DO HTML
// -----------------------------------------------------

const $ = id => document.getElementById(id);

const telas = {
    inicio: $("homeView"),
    operacao: $("operationView"),
    estudo: $("studyView"),
    resultado: $("resultView")
};

// -----------------------------------------------------
// CONFIGURAÇÕES
// -----------------------------------------------------

const operacoes = {
    soma: {
        nome: "Soma",
        descricao: "Pratique adições e desenvolva seu cálculo mental.",
        modulo: () => window.Soma,
        modalidades: [
            ["sequencial", "Soma Sequencial"],
            ["diversas", "Somas Diversas"],
            ["tabuada", "Memorizar Tabuada"]
        ]
    },

    subtracao: {
        nome: "Subtração",
        descricao: "Aprenda a subtrair com e sem reserva.",
        modulo: () => window.Subtracao,
        modalidades: [
            ["sequencial", "Subtração Sequencial"],
            ["diversas", "Subtrações Diversas"],
            ["tabuada", "Memorizar Tabuada"]
        ]
    },

    multiplicacao: {
        nome: "Multiplicação",
        descricao: "Pratique multiplicações e sequências numéricas.",
        modulo: () => window.Multiplicacao,
        modalidades: [
            ["sequencial", "Multiplicação Sequencial"],
            ["diversas", "Multiplicações Diversas"],
            ["sequencia", "Estudar Sequência Numérica"],
            ["tabuada", "Memorizar Tabuada"]
        ]
    },

    divisao: {
        nome: "Divisão",
        descricao: "Pratique divisões exatas e com resto.",
        modulo: () => window.Divisao,
        modalidades: [
            ["pratica", "Prática de Divisão"],
            ["sequencia", "Sequencial dos Números"],
            ["resto", "Divisão com Resto"],
            ["tabuada", "Memorizar Tabuada"]
        ]
    }
};

// -----------------------------------------------------
// ESTADO DO CURSO
// -----------------------------------------------------

const estado = {
    operacao: null,
    modalidade: null,
    quantidade: 10,
    questao: null,
    respostas: [],
    cronometro: null,
    inicio: null,
    corrigida: false
};

const CHAVE = "cursoMatematicaProgresso";

function carregarProgresso() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE)) || {};
    } catch {
        return {};
    }
}

let progresso = carregarProgresso();

function salvarProgresso() {
    localStorage.setItem(CHAVE, JSON.stringify(progresso));
}

// -----------------------------------------------------
// NAVEGAÇÃO
// -----------------------------------------------------

function mostrarTela(nome) {
    Object.entries(telas).forEach(([chave, elemento]) => {
        if (elemento) {
            elemento.style.display =
                chave === nome ? "block" : "none";
        }
    });
}

function voltarInicio() {
    pararCronometro();
    mostrarTela("inicio");
    atualizarDesempenho();
}

function abrirOperacao(nome) {
    const operacao = operacoes[nome];

    if (!operacao) return;

    estado.operacao = nome;
    estado.modalidade = null;

    $("operationTitle").textContent = operacao.nome;
    $("operationDescription").textContent = operacao.descricao;

    montarModalidades();
    mostrarTela("operacao");
}

// -----------------------------------------------------
// MODALIDADES
// -----------------------------------------------------

function montarModalidades() {
    const area = $("modeGrid");

    if (!area) return;

    area.innerHTML = "";

    const atual = operacoes[estado.operacao];

    atual.modalidades.forEach(([id, nome]) => {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "mode-card";
        botao.textContent = nome;

        botao.addEventListener("click", () => {
            selecionarModalidade(id);
        });

        area.appendChild(botao);
    });

    $("configPanel").innerHTML = "";
    $("referencePanel").innerHTML = "";
}

// -----------------------------------------------------
// CONFIGURAÇÃO DAS ATIVIDADES
// -----------------------------------------------------

function campoCheckbox(valor, texto, grupo) {
    return `
        <label class="config-option">
            <input type="checkbox" name="${grupo}" value="${valor}">
            ${texto}
        </label>
    `;
}

function campoQuantidade() {
    return `
        <label class="config-field">
            Quantidade de questões
            <select id="quantidadeQuestoes">
                <option value="10">10 questões</option>
                <option value="20">20 questões</option>
                <option value="30">30 questões</option>
                <option value="40">40 questões</option>
                <option value="50">50 questões</option>
            </select>
        </label>
    `;
}

function campoUnidades(grupo, titulo = "Casas numéricas") {
    return `
        <p>${titulo}</p>
        ${campoCheckbox("unidade", "Unidade", grupo)}
        ${campoCheckbox("dezena", "Dezena", grupo)}
        ${campoCheckbox("centena", "Centena", grupo)}
    `;
}

function campoNumeros(grupo, inicio, fim, titulo) {
    let html = `<p>${titulo}</p><div class="number-options">`;

    for (let i = inicio; i <= fim; i++) {
        html += campoCheckbox(i, String(i), grupo);
    }

    html += "</div>";

    return html;
}

function selecionarModalidade(modalidade) {
    estado.modalidade = modalidade;

    const painel = $("configPanel");
    const nomeOperacao = estado.operacao;

    let html = "";

    if (modalidade === "sequencial" && nomeOperacao === "soma") {
        html += campoQuantidade();
        html += campoUnidades("unidades");
        html += campoNumeros("somas", 1, 10, "Somar:");
    }

    else if (
        modalidade === "diversas" &&
        nomeOperacao === "soma"
    ) {
        html += campoQuantidade();
        html += campoUnidades("primeiro", "Primeiro número");
        html += campoUnidades("segundo", "Segundo número");
    }

    else if (
        modalidade === "sequencial" &&
        nomeOperacao === "subtracao"
    ) {
        html += campoQuantidade();
        html += campoUnidades("unidades");
        html += campoNumeros("subtraendos", 1, 10, "Subtrair:");
        html += "<p>Tipo de subtração:</p>";
        html += campoCheckbox("com", "Com reserva", "reserva");
        html += campoCheckbox("sem", "Sem reserva", "reserva");
    }

    else if (
        modalidade === "diversas" &&
        nomeOperacao === "subtracao"
    ) {
        html += campoQuantidade();
        html += campoUnidades("primeiro", "Primeiro número");
        html += campoUnidades("segundo", "Segundo número");
        html += "<p>Tipo de subtração:</p>";
        html += campoCheckbox("com", "Com reserva", "reserva");
        html += campoCheckbox("sem", "Sem reserva", "reserva");
    }

    else if (
        modalidade === "sequencial" &&
        nomeOperacao === "multiplicacao"
    ) {
        html += campoQuantidade();
        html += campoUnidades("unidades");
        html += campoNumeros("multiplicadores", 0, 9, "Multiplicar por:");
        html += `
            <label>
                <input type="checkbox" id="selecionarTudo">
                Selecionar todos
            </label>
        `;
    }

    else if (
        modalidade === "diversas" &&
        nomeOperacao === "multiplicacao"
    ) {
        html += campoQuantidade();
        html += "<p>Selecione as combinações:</p>";
        html += campoCheckbox(0, "Unidade × Unidade", "combinacoes");
        html += campoCheckbox(1, "Dezena × Unidade", "combinacoes");
        html += campoCheckbox(2, "Centena × Unidade", "combinacoes");
        html += campoCheckbox(3, "Dezena × Dezena", "combinacoes");
        html += campoCheckbox(4, "Centena × Dezena", "combinacoes");
    }

    else if (
        modalidade === "sequencia" &&
        nomeOperacao === "multiplicacao"
    ) {
        html += campoNumeros("numero", 2, 10, "Escolha a sequência:");
    }

    else if (
        modalidade === "sequencia" &&
        nomeOperacao === "divisao"
    ) {
        html += campoNumeros("numero", 1, 10, "Escolha a sequência:");
    }

    else if (
        modalidade === "pratica" &&
        nomeOperacao === "divisao"
    ) {
        html += campoQuantidade();
        html += campoNumeros("divisores", 1, 10, "Escolha os divisores:");
    }

    else if (
        modalidade === "resto" &&
        nomeOperacao === "divisao"
    ) {
        html += campoQuantidade();
        html += campoNumeros("divisores", 1, 10, "Escolha os divisores:");
    }

    else if (modalidade === "tabuada") {
        const titulo = nomeOperacao === "soma"
            ? "Escolha a unidade da soma:"
            : nomeOperacao === "subtracao"
                ? "Escolha a unidade da subtração:"
                : nomeOperacao === "multiplicacao"
                    ? "Escolha a tabuada:"
                    : "Escolha o divisor:";

        html += campoNumeros(
            nomeOperacao === "divisao" ? "divisor" : "unidade",
            1,
            10,
            titulo
        );
    }

    painel.innerHTML = `
        <h3>Configurar atividade</h3>
        <div class="configuration-options">${html}</div>
        <button type="button" id="iniciarAtividade">
            Iniciar estudo
        </button>
    `;

    const selecionarTudo = $("selecionarTudo");

    if (selecionarTudo) {
        selecionarTudo.addEventListener("change", event => {
            document.querySelectorAll(
                'input[name="multiplicadores"]'
            ).forEach(campo => {
                campo.checked = event.target.checked;
            });
        });
    }

    $("iniciarAtividade").addEventListener(
        "click",
        iniciarAtividade
    );
}

// -----------------------------------------------------
// LER CONFIGURAÇÕES
// -----------------------------------------------------

function valoresSelecionados(grupo) {
    return [...document.querySelectorAll(
        `input[name="${grupo}"]:checked`
    )].map(campo => campo.value);
}

function lerConfiguracao() {
    const modalidade = estado.modalidade;
    const operacao = estado.operacao;

    const opcoes = {};

    const quantidade = $("quantidadeQuestoes");

    if (quantidade) {
        opcoes.quantidade = Number(quantidade.value);
    }

    if (modalidade === "sequencial") {
        if (operacao === "soma") {
            opcoes.unidades = valoresSelecionados("unidades");
            opcoes.somas = valoresSelecionados("somas").map(Number);
        }

        if (operacao === "subtracao") {
            opcoes.unidades = valoresSelecionados("unidades");
            opcoes.subtraendos = valoresSelecionados("subtraendos").map(Number);

            const reservas = valoresSelecionados("reserva");

            opcoes.comReserva = reservas.includes("com");
            opcoes.semReserva = reservas.includes("sem");
        }

        if (operacao === "multiplicacao") {
            opcoes.unidades = valoresSelecionados("unidades");
            opcoes.multiplicadores =
                valoresSelecionados("multiplicadores").map(Number);
        }
    }

    if (modalidade === "diversas") {
        if (operacao === "soma" || operacao === "subtracao") {
            opcoes.primeiro = valoresSelecionados("primeiro");
            opcoes.segundo = valoresSelecionados("segundo");
        }

        if (operacao === "subtracao") {
            const reservas = valoresSelecionados("reserva");

            opcoes.comReserva = reservas.includes("com");
            opcoes.semReserva = reservas.includes("sem");
        }

        if (operacao === "multiplicacao") {
            opcoes.combinacoes =
                valoresSelecionados("combinacoes").map(Number);
        }
    }

    if (modalidade === "pratica" || modalidade === "resto") {
        opcoes.divisores = valoresSelecionados("divisores").map(Number);
    }

    if (modalidade === "sequencia") {
        opcoes.numero = Number(
            valoresSelecionados("numero")[0]
        );
    }

    if (modalidade === "tabuada") {
        const campo = operacao === "divisao"
            ? "divisor"
            : "unidade";

        opcoes[campo] = Number(
            valoresSelecionados(campo)[0]
        );
    }

    return opcoes;
}

// -----------------------------------------------------
// INICIAR ATIVIDADE
// -----------------------------------------------------

function iniciarAtividade() {
    const opcoes = lerConfiguracao();

    try {
        validarConfiguracao(opcoes);

        estado.quantidade = opcoes.quantidade || 10;
        estado.respostas = [];
        estado.corrigida = false;

        const modulo = operacoes[estado.operacao].modulo();

        const questao = modulo.iniciar(
            estado.modalidade,
            opcoes
        );

        estado.inicio = Date.now();

        if (estado.modalidade === "sequencia") {
            mostrarSequencia(questao);
        } else {
            mostrarQuestao(questao);
        }

        mostrarTela("estudo");
        iniciarCronometro();

    } catch (erro) {
        alert(erro.message);
    }
}

function validarConfiguracao(opcoes) {
    const modalidade = estado.modalidade;
    const operacao = estado.operacao;

    if (modalidade === "sequencial") {
        if (!opcoes.unidades?.length && operacao !== "divisao") {
            throw new Error("Selecione pelo menos uma casa numérica.");
        }

        if (operacao === "soma" && !opcoes.somas.length) {
            throw new Error("Selecione pelo menos um valor para somar.");
        }

        if (
            operacao === "subtracao" &&
            !opcoes.subtraendos.length
        ) {
            throw new Error("Selecione pelo menos um valor para subtrair.");
        }

        if (
            operacao === "multiplicacao" &&
            !opcoes.multiplicadores.length
        ) {
            throw new Error("Selecione pelo menos um multiplicador.");
        }
    }

    if (modalidade === "diversas") {
        if (operacao !== "multiplicacao" &&
            (!opcoes.primeiro.length || !opcoes.segundo.length)) {
            throw new Error("Selecione as casas dos dois números.");
        }

        if (
            operacao === "multiplicacao" &&
            !opcoes.combinacoes.length
        ) {
            throw new Error("Selecione pelo menos uma combinação.");
        }
    }

    if (
        (modalidade === "pratica" || modalidade === "resto") &&
        !opcoes.divisores.length
    ) {
        throw new Error("Selecione pelo menos um divisor.");
    }

    if (
        (modalidade === "sequencia" || modalidade === "tabuada") &&
        !opcoes.numero &&
        !opcoes.unidade &&
        !opcoes.divisor
    ) {
        throw new Error("Selecione uma opção para estudar.");
    }
}

// -----------------------------------------------------
// EXIBIÇÃO DA QUESTÃO
// -----------------------------------------------------

function mostrarQuestao(questao) {
    if (!questao) {
        finalizarAtividade();
        return;
    }

    estado.questao = questao;
    estado.corrigida = false;

    $("questionCounter").textContent =
        `Questão ${questao.numero} de ${questao.total}`;

    $("questionLabel").textContent = "Resolva a questão:";

    $("studyProgress").style.width =
        `${((questao.numero - 1) / questao.total) * 100}%`;

    const area = $("questionArea");

    if (estado.operacao === "divisao") {
        area.innerHTML = `
            <div class="math-question">
                <strong>${questao.dividendo} ÷ ${questao.divisor} = ?</strong>
            </div>
        `;

        if (estado.modalidade === "resto") {
            $("answerArea").innerHTML = `
                <label>Quociente
                    <input id="respostaQuociente" inputmode="numeric">
                </label>
                <label>Resto
                    <input id="respostaResto" inputmode="numeric">
                </label>
            `;
        } else {
            $("answerArea").innerHTML = `
                <input id="resposta" inputmode="numeric"
                    placeholder="Sua resposta">
            `;
        }

    } else {
        const sinal = estado.operacao === "soma"
            ? "+"
            : estado.operacao === "subtracao"
                ? "−"
                : "×";

        area.innerHTML = `
            <div class="math-question">
                <div>${questao.primeiro}</div>
                <div>${sinal} ${questao.segundo}</div>
                <div class="math-line"></div>
            </div>
        `;

        $("answerArea").innerHTML = `
            <input id="resposta" inputmode="numeric"
                placeholder="Sua resposta">
        `;
    }

    $("feedback").textContent = "";

    $("actionArea").innerHTML = `
        <button type="button" id="corrigirResposta">
            Conferir resposta
        </button>
        <button type="button" id="pularQuestao">
            Pular questão
        </button>
    `;

    $("corrigirResposta").addEventListener(
        "click",
        conferirResposta
    );

    $("pularQuestao").addEventListener(
        "click",
        pularQuestao
    );

    montarTeclado();
}

// -----------------------------------------------------
// CONFERIR RESPOSTA
// -----------------------------------------------------

function conferirResposta() {
    const modulo = operacoes[estado.operacao].modulo();

    let resultado;

    if (estado.operacao === "divisao" &&
        estado.modalidade === "resto") {

        resultado = modulo.corrigir(
            $("respostaQuociente").value,
            $("respostaResto").value
        );

    } else {
        const resposta = $("resposta")?.value;

        resultado = modulo.corrigir(resposta);
    }

    $("feedback").textContent = resultado.mensagem;

    if (resultado.correto) {
        estado.respostas.push("acerto");
        estado.corrigida = false;

        bloquearResposta();

        setTimeout(() => {
            avancarQuestao();
        }, 1500);

    } else {
        estado.corrigida = true;

        $("actionArea").innerHTML = `
            <button type="button" id="corrigirNovamente">
                Corrigir
            </button>
            <button type="button" id="pularQuestao">
                Pular questão
            </button>
        `;

        $("corrigirNovamente").addEventListener("click", () => {
            $("feedback").textContent = "";
            $("actionArea").innerHTML = `
                <button type="button" id="corrigirResposta">
                    Conferir resposta
                </button>
                <button type="button" id="pularQuestao">
                    Pular questão
                </button>
            `;

            $("corrigirResposta").addEventListener(
                "click",
                conferirResposta
            );

            $("pularQuestao").addEventListener(
                "click",
                pularQuestao
            );
        });

        $("pularQuestao").addEventListener(
            "click",
            pularQuestao
        );
    }
}

function bloquearResposta() {
    document.querySelectorAll("#answerArea input").forEach(
        campo => campo.disabled = true
    );
}

// -----------------------------------------------------
// AVANÇAR E PULAR
// -----------------------------------------------------

function avancarQuestao() {
    const modulo = operacoes[estado.operacao].modulo();

    const resultado = modulo.avancar();

    if (resultado.finalizado) {
        finalizarAtividade(resultado.relatorio);
    } else {
        mostrarQuestao(resultado.questao);
    }
}

function pularQuestao() {
    const modulo = operacoes[estado.operacao].modulo();

    estado.respostas.push("erro");

    const resultado = modulo.pular();

    if (resultado.finalizado) {
        finalizarAtividade(resultado.relatorio);
    } else {
        mostrarQuestao(resultado.questao);
    }
}

// -----------------------------------------------------
// SEQUÊNCIAS NUMÉRICAS
// -----------------------------------------------------

function mostrarSequencia(sequencia) {
    estado.questao = sequencia;

    $("questionCounter").textContent = "Sequência numérica";
    $("questionLabel").textContent =
        `Complete a sequência do ${sequencia.numero}.`;

    $("studyProgress").style.width = "0%";

    let html = `<div class="sequence-grid">`;

    sequencia.posicoes.forEach(posicao => {
        html += `
            <div class="sequence-cell">
                <span>${posicao.posicao}</span>
                ${
                    posicao.preenchida
                        ? `<strong>${posicao.valor}</strong>`
                        : `<input class="sequenciaResposta"
                            data-posicao="${posicao.posicao - 1}"
                            inputmode="numeric">`
                }
            </div>
        `;
    });

    html += "</div>";

    $("questionArea").innerHTML = html;
    $("answerArea").innerHTML = "";
    $("feedback").textContent = "";

    $("actionArea").innerHTML = `
        <button type="button" id="conferirSequencia">
            Conferir sequência
        </button>
    `;

    $("conferirSequencia").addEventListener(
        "click",
        conferirSequencia
    );

    $("keypad").innerHTML = "";
}

function conferirSequencia() {
    const respostas = Array(10).fill(null);

    document.querySelectorAll(".sequenciaResposta").forEach(
        campo => {
            respostas[Number(campo.dataset.posicao)] = campo.value;
        }
    );

    const modulo = operacoes[estado.operacao].modulo();

    const resultado = modulo.corrigirSequencia(respostas);

    $("feedback").textContent =
        `${resultado.acertos} de 10 posições corretas.`;

    $("actionArea").innerHTML = `
        <button type="button" id="revisarSequencia">
            Revisar Novamente
        </button>
        <button type="button" id="novoEstudoSequencia">
            Novo Estudo
        </button>
    `;

    $("revisarSequencia").addEventListener("click", () => {
        iniciarAtividade();
    });

    $("novoEstudoSequencia").addEventListener("click", () => {
        pararCronometro();
        mostrarTela("operacao");
    });
}

// -----------------------------------------------------
// TECLADO VIRTUAL
// -----------------------------------------------------

function montarTeclado() {
    const teclado = $("keypad");

    if (!teclado) return;

    teclado.innerHTML = "";

    for (let i = 1; i <= 9; i++) {
        criarTecla(i);
    }

    criarTecla("C");
    criarTecla(0);
    criarTecla("⌫");
}

function criarTecla(valor) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = valor;

    botao.addEventListener("click", () => {
        const campo = document.querySelector(
            "#answerArea input:not(:disabled)"
        );

        if (!campo) return;

        if (valor === "C") {
            campo.value = "";
        } else if (valor === "⌫") {
            campo.value = campo.value.slice(0, -1);
        } else {
            campo.value += String(valor);
        }

        campo.dispatchEvent(new Event("input"));
    });

    $("keypad").appendChild(botao);
}

// -----------------------------------------------------
// CRONÔMETRO
// -----------------------------------------------------

function iniciarCronometro() {
    pararCronometro();

    estado.inicio = Date.now();

    atualizarCronometro();

    estado.cronometro = setInterval(
        atualizarCronometro,
        1000
    );
}

function atualizarCronometro() {
    if (!estado.inicio) return;

    const segundos = Math.floor(
        (Date.now() - estado.inicio) / 1000
    );

    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;

    $("timer").textContent =
        `${String(minutos).padStart(2, "0")}:` +
        `${String(resto).padStart(2, "0")}`;
}

function pararCronometro() {
    if (estado.cronometro) {
        clearInterval(estado.cronometro);
        estado.cronometro = null;
    }
}

// -----------------------------------------------------
// FINALIZAR ATIVIDADE
// -----------------------------------------------------

function finalizarAtividade(relatorio) {
    pararCronometro();

    if (!relatorio) {
        const modulo = operacoes[estado.operacao].modulo();
        relatorio = modulo.gerarRelatorio();
    }

    const chave = `${estado.operacao}_${estado.modalidade}`;

    if (!progresso[chave]) {
        progresso[chave] = {
            tentativas: [],
            verdeConquistado: false
        };
    }

    progresso[chave].tentativas.push({
        ...relatorio,
        data: new Date().toISOString()
    });

    if (relatorio.percentual === 100) {
        progresso[chave].verdeConquistado = true;
    }

    salvarProgresso();

    $("resultSubtitle").textContent =
        "Confira seu desempenho nesta atividade.";

    $("resultScore").textContent =
        `${relatorio.percentual}%`;

    $("resultStats").innerHTML = `
        <p>Total de questões: ${relatorio.total}</p>
        <p>Acertos diretos: ${relatorio.acertos}</p>
        <p>Erros ou questões puladas: ${relatorio.erros}</p>
    `;

    mostrarTela("resultado");
    atualizarDesempenho();
}

// -----------------------------------------------------
// DESEMPENHO
// -----------------------------------------------------

function atualizarDesempenho() {
    const atividades = Object.values(progresso);

    const verdes = atividades.filter(
        item => item.verdeConquistado
    ).length;

    const amarelas = atividades.filter(item => {
        const ultima = item.tentativas.at(-1);
        return !item.verdeConquistado &&
            ultima &&
            ultima.percentual > 50;
    }).length;

    const vermelhas = atividades.filter(item => {
        const ultima = item.tentativas.at(-1);
        return !item.verdeConquistado &&
            ultima &&
            ultima.percentual <= 50;
    }).length;

    const totalModalidades = 14;
    const naoIniciadas = Math.max(
        0,
        totalModalidades - atividades.length
    );

    const percentual = Math.round(
        verdes / totalModalidades * 100
    );

    if ($("overallPercent")) {
        $("overallPercent").textContent = `${percentual}%`;
    }

    if ($("overallProgress")) {
        $("overallProgress").style.width = `${percentual}%`;
    }

    if ($("overallText")) {
        $("overallText").textContent =
            `${verdes} de ${totalModalidades} modalidades dominadas`;
    }

    if ($("performanceGrid")) {
        $("performanceGrid").innerHTML = `
            <div>🟢 Verdes: ${verdes}</div>
            <div>🟡 Amarelas: ${amarelas}</div>
            <div>🔴 Vermelhas: ${vermelhas}</div>
            <div>⚪ Não iniciadas: ${naoIniciadas}</div>
            <div>Faltam ${totalModalidades - verdes} para dominar tudo.</div>
        `;
    }
}

// -----------------------------------------------------
// BOTÕES GERAIS
// -----------------------------------------------------

$("homeLink")?.addEventListener("click", voltarInicio);
$("backHome")?.addEventListener("click", voltarInicio);
$("quitStudy")?.addEventListener("click", voltarInicio);

$("retryStudy")?.addEventListener("click", () => {
    selecionarModalidade(estado.modalidade);
});

$("newStudy")?.addEventListener("click", () => {
    pararCronometro();
    mostrarTela("operacao");
});

// Botões das operações
document.querySelectorAll("[data-operacao]").forEach(botao => {
    botao.addEventListener("click", () => {
        abrirOperacao(botao.dataset.operacao);
    });
});

// -----------------------------------------------------
// INICIALIZAÇÃO
// -----------------------------------------------------

mostrarTela("inicio");
atualizarDesempenho();

