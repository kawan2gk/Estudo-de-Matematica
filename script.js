
const $ = id => document.getElementById(id);
const CHAVE = "cursoMatematicaProgresso";

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

const premios = {
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

let progresso = JSON.parse(localStorage.getItem(CHAVE) || "{}");

let estado = {
    operacao: "",
    modalidade: "",
    opcoes: {},
    questoes: [],
    indice: 0,
    resultados: [],
    errou: false,
    inicio: 0,
    intervalo: null,
    campoAtivo: null,
    ultimaConfiguracao: null,
    sequenciaConferida: false
};

/* =====================================================
   FUNÇÕES GERAIS
===================================================== */

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function embaralhar(lista) {
    return [...lista].sort(() => Math.random() - 0.5);
}

function salvar() {
    localStorage.setItem(CHAVE, JSON.stringify(progresso));
}

function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(t =>
        t.classList.add("escondida")
    );

    $(id).classList.remove("escondida");
}

function voltar() {
    if (!$("estudo").classList.contains("escondida") &&
        !confirm("Deseja sair desta atividade?")) return;

    voltarInicio();
}

function voltarInicio() {
    pararCronometro();
    mostrarTela("inicio");
    atualizarDesempenho();
}

function abrirOperacao(op) {
    pararCronometro();

    estado.operacao = op;
    estado.modalidade = "";

    const nomes = {
        soma: "Soma",
        subtracao: "Subtração",
        multiplicacao: "Multiplicação",
        divisao: "Divisão"
    };

    $("tituloOperacao").textContent = nomes[op];

    $("descricaoOperacao").textContent =
        "Escolha uma modalidade para estudar.";

    $("configuracao").classList.add("escondida");

    $("listaModalidades").innerHTML = modalidades[op].map(([id, nome]) =>
        `<button class="modalidade"
            onclick="selecionarModalidade('${id}',this)">
            ${nome}
        </button>`
    ).join("");

    mostrarTela("operacao");
}

/* =====================================================
   CONFIGURAÇÕES E SELEÇÕES
===================================================== */

function casas() {
    return [
        { valor: "unidade", texto: "Unidade" },
        { valor: "dezena", texto: "Dezena" },
        { valor: "centena", texto: "Centena" }
    ];
}

function numeros(inicio, fim, prefixo = "") {
    return Array.from({ length: fim - inicio + 1 }, (_, i) => ({
        valor: inicio + i,
        texto: prefixo + (inicio + i)
    }));
}

function coluna(titulo, grupo, opcoes) {
    return `
        <div class="coluna-selecao">
            <div class="titulo-coluna">${titulo}</div>

            ${opcoes.map(o => `
                <label class="opcao-selecao">
                    <input type="checkbox"
                        name="${grupo}"
                        value="${o.valor}">
                    ${o.texto}
                </label>
            `).join("")}
        </div>
    `;
}

function dupla(t1, g1, a, t2, g2, b) {
    return `
        <div class="selecao-dupla">
            ${coluna(t1, g1, a)}
            ${coluna(t2, g2, b)}
        </div>
    `;
}

function quantidade() {
    return `
        <p>Quantidade de questões</p>

        <select id="quantidade">
            ${[10,20,30,40,50].map(n =>
                `<option value="${n}">${n} questões</option>`
            ).join("")}
        </select>
    `;
}

function selecionarModalidade(id, botao) {
    estado.modalidade = id;

    document.querySelectorAll(".modalidade").forEach(b =>
        b.classList.remove("selecionada")
    );

    botao.classList.add("selecionada");

    const op = estado.operacao;
    let html = "";

    if (id !== "tabuada" && id !== "sequencia") {
        html += quantidade();
    }

    if (op === "soma" && id === "sequencial") {
        html += dupla(
            "Coluna esquerda", "casas", casas(),
            "Coluna direita", "valores", numeros(1,10,"Somando +")
        );
    }

    if (op === "soma" && id === "diversas") {
        html += dupla(
            "Coluna esquerda", "primeiro", casas(),
            "Coluna direita", "segundo", casas()
        );
    }

    if (op === "subtracao" && id === "sequencial") {
        html += dupla(
            "Coluna esquerda",
            "casas",
            [
                ...casas(),
                { valor: "dez_a_dezenove", texto: "Números de 10 a 19" }
            ],
            "Coluna direita",
            "valores",
            numeros(1,10,"Subtraindo −")
        );

        html += opcoesReserva();
    }

    if (op === "subtracao" && id === "diversas") {
        html += dupla(
            "Coluna esquerda", "primeiro", casas(),
            "Coluna direita", "segundo", casas()
        );

        html += opcoesReserva();
    }

    if (op === "multiplicacao" && id === "sequencial") {
        html += dupla(
            "Coluna esquerda", "casas", casas(),
            "Coluna direita", "valores", numeros(0,9,"Multiplicando ×")
        );
    }

    if (op === "multiplicacao" && id === "diversas") {
        html += dupla(
            "Coluna esquerda", "primeiro", casas(),
            "Coluna direita", "segundo", [
                { valor: "unidade", texto: "Unidade" },
                { valor: "dezena", texto: "Dezena" }
            ]
        );
    }

    if (id === "sequencia") {
        html += coluna(
            "Sequências",
            "numeros",
            numeros(op === "divisao" ? 1 : 2, 10)
        );
    }

    if (op === "divisao" && ["pratica","resto"].includes(id)) {
        html += coluna(
            "Divisores",
            "divisores",
            numeros(2,10,"Divisão por ")
        );

        html += `
            <p class="nota-conta">
                ${id === "pratica"
                    ? "Serão exibidas as divisões dos 11 primeiros múltiplos, começando do zero."
                    : "Os dividendos serão sorteados de zero até dez vezes o divisor escolhido."
                }
            </p>
        `;
    }

    if (id === "tabuada") {
        html += coluna(
            "Tabuadas",
            "unidades",
            numeros(1,10,"Tabuada do ")
        );
    }

    $("tituloConfiguracao").textContent =
        modalidades[op].find(m => m[0] === id)[1];

    $("opcoesConfiguracao").innerHTML = html;
    $("configuracao").classList.remove("escondida");
}

function opcoesReserva() {
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

function selecionados(nome) {
    return [...document.querySelectorAll(
        `#opcoesConfiguracao input[name="${nome}"]:checked`
    )].map(c => c.value);
}

function lerOpcoes() {
    const id = estado.modalidade;
    const op = estado.operacao;

    const o = {
        quantidade: Number($("quantidade")?.value || 10)
    };

    if (id === "sequencial") {
        o.casas = selecionados("casas");
        o.valores = selecionados("valores").map(Number);
    }

    if (id === "diversas") {
        o.primeiro = selecionados("primeiro");
        o.segundo = selecionados("segundo");
    }

    if (op === "subtracao" &&
        ["sequencial","diversas"].includes(id)) {

        o.reservas = selecionados("reserva");

        if (!o.reservas.length) {
            o.reservas = ["com","sem"];
        }
    }

    if (id === "sequencia") {
        o.numeros = selecionados("numeros").map(Number);
    }

    if (id === "tabuada") {
        o.unidades = selecionados("unidades").map(Number);
    }

    if (op === "divisao" &&
        ["pratica","resto"].includes(id)) {

        o.divisores = selecionados("divisores").map(Number);
    }

    return o;
}

function validar(o) {
    const id = estado.modalidade;
    const op = estado.operacao;

    if (id === "sequencial" &&
        (!o.casas.length || !o.valores.length)) {
        throw Error("Selecione pelo menos uma opção em cada coluna.");
    }

    if (id === "diversas" &&
        (!o.primeiro.length || !o.segundo.length)) {
        throw Error("Selecione pelo menos uma opção em cada coluna.");
    }

    if (id === "sequencia" && !o.numeros.length) {
        throw Error("Selecione uma sequência.");
    }

    if (id === "tabuada" && !o.unidades.length) {
        throw Error("Selecione uma tabuada.");
    }

    if (op === "divisao" &&
        ["pratica","resto"].includes(id) &&
        !o.divisores.length) {
        throw Error("Selecione pelo menos um divisor.");
    }
}

/* =====================================================
   GERAÇÃO DE NÚMEROS E QUESTÕES
===================================================== */

function numeroCasa(tipo) {
    if (tipo === "unidade") return aleatorio(0,9);
    if (tipo === "dezena") return aleatorio(10,99);
    if (tipo === "centena") return aleatorio(100,999);
    if (tipo === "dez_a_dezenove") return aleatorio(10,19);

    return aleatorio(0,9);
}

function temReserva(a,b) {
    const A = String(a).split("").reverse();
    const B = String(b).split("").reverse();

    return A.some((d,i) =>
        Number(d) < Number(B[i] || 0)
    );
}

function criarQuestao(a,b,op) {
    return {
        primeiro: a,
        segundo: b,
        resultado: op === "soma" ? a+b : a-b,
        operacao: op
    };
}

/* SOMA E SUBTRAÇÃO SEQUENCIAIS */

function gerarSequencial(op,o) {
    const lista = [];
    let tentativas = 0;

    while (lista.length < o.quantidade &&
        tentativas++ < o.quantidade * 500) {

        const tipo = o.casas[
            aleatorio(0,o.casas.length-1)
        ];

        const b = o.valores[
            aleatorio(0,o.valores.length-1)
        ];

        let a = numeroCasa(tipo);

        if (op === "soma") {
            const maior = Math.max(a,b);
            const menor = Math.min(a,b);

            lista.push(criarQuestao(maior,menor,op));
        } else {
            if (b > a) a = b;

            const maior = Math.max(a,b);
            const menor = Math.min(a,b);

            const reserva = temReserva(maior,menor);

            if (o.reservas.length === 1 &&
                ((o.reservas[0] === "com" && !reserva) ||
                 (o.reservas[0] === "sem" && reserva))) {
                continue;
            }

            lista.push(criarQuestao(maior,menor,op));
        }
    }

    if (lista.length < o.quantidade) {
        throw Error("Não foi possível gerar questões com essa seleção.");
    }

    return embaralhar(lista);
}

/* SOMA E SUBTRAÇÃO DIVERSAS */

function gerarDiversas(op,o) {
    const lista = [];
    let tentativas = 0;

    while (lista.length < o.quantidade &&
        tentativas++ < o.quantidade * 500) {

        const tipoA = o.primeiro[
            aleatorio(0,o.primeiro.length-1)
        ];

        const tipoB = o.segundo[
            aleatorio(0,o.segundo.length-1)
        ];

        let a = numeroCasa(tipoA);
        let b = numeroCasa(tipoB);

        // O maior número sempre fica em cima.
        if (op === "soma") {
            [a,b] = [Math.max(a,b),Math.min(a,b)];
        }

        if (op === "subtracao") {
            [a,b] = [Math.max(a,b),Math.min(a,b)];

            const reserva = temReserva(a,b);

            if (o.reservas.length === 1 &&
                ((o.reservas[0] === "com" && !reserva) ||
                 (o.reservas[0] === "sem" && reserva))) {
                continue;
            }
        }

        lista.push(criarQuestao(a,b,op));
    }

    if (lista.length < o.quantidade) {
        throw Error("Não foi possível gerar questões com essa seleção.");
    }

    return embaralhar(lista);
}

/* MULTIPLICAÇÃO */

function gerarMultiplicacao(o,sequencial) {
    const lista = [];

    const limites = {
        unidade: [0,9],
        dezena: [10,99],
        centena: [100,999]
    };

    for (let i=0; i<o.quantidade; i++) {
        let a,b,temDezena = false;

        if (sequencial) {
            a = numeroCasa(
                o.casas[aleatorio(0,o.casas.length-1)]
            );

            b = o.valores[
                aleatorio(0,o.valores.length-1)
            ];
        } else {
            const tipoA = o.primeiro[
                aleatorio(0,o.primeiro.length-1)
            ];

            const tipoB = o.segundo[
                aleatorio(0,o.segundo.length-1)
            ];

            a = aleatorio(...limites[tipoA]);
            b = aleatorio(...limites[tipoB]);

            temDezena = tipoB === "dezena";
        }

        lista.push({
            primeiro: a,
            segundo: b,
            resultado: a*b,
            operacao: "multiplicacao",
            temDezenaEmbaixo: temDezena
        });
    }

    return embaralhar(lista);
}

/* DIVISÃO */

function gerarDivisao(o,resto) {
    const lista = [];

    if (!resto) {
        o.divisores.forEach(d => {
            for (let i=0; i<=10; i++) {
                lista.push({
                    dividendo: d*i,
                    divisor: d,
                    resultado: i,
                    resto: 0,
                    operacao: "divisao"
                });
            }
        });

        return embaralhar(lista);
    }

    for (let i=0; i<o.quantidade; i++) {
        const d = o.divisores[
            aleatorio(0,o.divisores.length-1)
        ];

        const n = aleatorio(0,d*10);

        lista.push({
            dividendo: n,
            divisor: d,
            resultado: Math.floor(n/d),
            resto: n%d,
            operacao: "divisao"
        });
    }

    return embaralhar(lista);
}

/* SEQUÊNCIAS NUMÉRICAS */

function gerarSequencias(lista) {
    return embaralhar(lista.map(n => {
        const vazias = embaralhar(
            [0,1,2,3,4,5,6,7,8,9]
        ).slice(0,6);

        return {
            numero: n,
            itens: Array.from({length:10},(_,i)=>({
                posicao: i,
                valor: n*(i+1),
                preenchida: !vazias.includes(i)
            }))
        };
    }));
}

function gerarQuestoes() {
    const o = estado.opcoes;
    const op = estado.operacao;
    const id = estado.modalidade;

    if (id === "sequencia") {
        return gerarSequencias(o.numeros);
    }

    if (op === "divisao") {
        return gerarDivisao(o,id === "resto");
    }

    if (op === "multiplicacao") {
        return gerarMultiplicacao(o,id === "sequencial");
    }

    if (id === "sequencial") {
        return gerarSequencial(op,o);
    }

    if (id === "diversas") {
        return gerarDiversas(op,o);
    }

    return [];
}

/* =====================================================
   INÍCIO DA ATIVIDADE
===================================================== */

function iniciarAtividade() {
    try {
        estado.opcoes = lerOpcoes();
        validar(estado.opcoes);

        estado.ultimaConfiguracao = {
            operacao: estado.operacao,
            modalidade: estado.modalidade,
            opcoes: JSON.parse(JSON.stringify(estado.opcoes))
        };

        if (estado.modalidade === "tabuada") {
            mostrarTela("estudo");
            mostrarTabuada();
            return;
        }

        estado.questoes = gerarQuestoes();
        estado.indice = 0;
        estado.resultados = [];
        estado.errou = false;

        mostrarTela("estudo");
        iniciarCronometro();
        mostrarQuestao();

    } catch(e) {
        alert(e.message);
    }
}

/* =====================================================
   TABUADA PARA LEITURA
===================================================== */

function mostrarTabuada() {
    pararCronometro();

    $("numeroQuestao").textContent = "Momento de leitura";

    $("instrucaoQuestao").textContent =
        "Leia e estude a tabuada.";

    $("cronometro").textContent = "--:--";
    $("barraQuestao").style.width = "100%";
    $("teclado").innerHTML = "";
    $("feedback").textContent = "";

    const op = estado.operacao;
    let html = "";

    estado.opcoes.unidades.forEach(n => {
        html += `
            <h3 class="titulo-conta">Tabuada do ${n}</h3>
            <div class="tabela-tabuada">
        `;

        for (let i=0; i<=10; i++) {
            let linha = "";

            if (op === "soma") linha = `${n} + ${i} = ${n+i}`;
            if (op === "subtracao") linha = `${n+i} − ${n} = ${i}`;
            if (op === "multiplicacao") linha = `${n} × ${i} = ${n*i}`;
            if (op === "divisao") linha = `${n*i} ÷ ${n} = ${i}`;

            html += `<div class="linha-tabuada">${linha}</div>`;
        }

        html += "</div>";
    });

    $("areaQuestao").innerHTML = html;

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal" onclick="novoEstudo()">
            Voltar às modalidades
        </button>
    `;
}

/* =====================================================
   ÁREA DE RESERVAS
===================================================== */

function reservasHTML() {
    return `
        <div class="area-reservas">
            <div class="cabecalho-reservas">
                <span>Área de reservas</span>

                <button class="botao-limpar-reservas"
                    onclick="limparReservas()">
                    [C] Limpar
                </button>
            </div>

            <div class="linha-reserva">
                ${Array.from({length:4},(_,i)=>`
                    <input class="campo-reserva"
                        data-reserva="${i}"
                        maxlength="2"
                        inputmode="numeric">
                `).join("")}
            </div>
        </div>
    `;
}

function limparReservas() {
    document.querySelectorAll("[data-reserva]").forEach(c => {
        c.value = "";
    });
}

/* =====================================================
   CONTAS ARMADAS
===================================================== */

function digitos(numero) {
    return String(Math.abs(numero)).split("");
}

function linhaNumero(numero) {
    const d = digitos(numero);

    if (d.length > 4) {
        throw Error("Número maior que quatro algarismos.");
    }

    return Array(4-d.length).fill("").concat(d)
        .map(n => `<div class="celula-numero">${n}</div>`)
        .join("");
}

function linhaResposta(numero,linha) {
    const d = digitos(numero);

    if (d.length > 4) {
        throw Error("Resultado maior que quatro algarismos.");
    }

    return Array(4-d.length).fill("")
        .map(() => `
            <input class="campo-digito campo-vazio" disabled>
        `)
        .concat(d.map((n,i) => `
            <input class="campo-digito"
                data-resposta
                data-linha="${linha}"
                data-posicao="${4-d.length+i}"
                maxlength="1"
                inputmode="numeric">
        `))
        .join("");
}

function montarConta(q) {
    const sinal = q.operacao === "soma" ? "+" : "−";

    return `
        <div class="conta-armada">
            ${reservasHTML()}

            <div class="secao-parcial">
                <div class="cabecalho-casas">
                    <div>UM</div><div>C</div><div>D</div><div>U</div>
                </div>

                <div class="linha-conta">
                    ${linhaNumero(q.primeiro)}
                </div>

                <div class="sinal-conta">${sinal}</div>

                <div class="linha-conta">
                    ${linhaNumero(q.segundo)}
                </div>
            </div>

            <div class="secao-parcial">
                <p class="titulo-parcial">Resposta</p>

                <div class="linha-resposta">
                    ${linhaResposta(q.resultado,"resultado")}
                </div>
            </div>
        </div>
    `;
}

/* =====================================================
   MULTIPLICAÇÃO ARMADA
===================================================== */

function cinco(numero,linha) {
    const d = digitos(numero);

    if (d.length > 5) {
        throw Error("Número maior que cinco algarismos.");
    }

    return Array(5-d.length).fill("")
        .map(() => `
            <input class="campo-digito campo-vazio" disabled>
        `)
        .concat(d.map((n,i) => `
            <input class="campo-digito"
                data-resposta
                data-linha="${linha}"
                data-posicao="${5-d.length+i}"
                maxlength="1"
                inputmode="numeric">
        `))
        .join("");
}

function cincoNumero(numero) {
    const d = digitos(numero);

    return Array(5-d.length).fill("")
        .concat(d)
        .map(n => `<div class="celula-numero">${n}</div>`)
        .join("");
}

/*
SEGUNDO PRODUTO PARCIAL:

A primeira e a última casas ficam vazias.
O aluno não precisa digitar o zero final.
*/

function cincoParcialDezena(numero,linha) {
    const d = digitos(numero);

    if (d.length > 4) {
        throw Error("Produto parcial maior que quatro algarismos.");
    }

    const campos = Array(4-d.length).fill("")
        .map(() => `
            <input class="campo-digito campo-vazio" disabled>
        `)
        .concat(d.map((n,i) => `
            <input class="campo-digito"
                data-resposta
                data-linha="${linha}"
                data-posicao="${4-d.length+i}"
                maxlength="1"
                inputmode="numeric">
        `));

    return `
        <input class="campo-digito campo-vazio" disabled>
        ${campos.join("")}
        <input class="campo-digito campo-vazio" disabled>
    `;
}

function montarMultiplicacao(q) {
    const tem = q.temDezenaEmbaixo;

    const unidade = q.segundo % 10;
    const dezena = Math.floor(q.segundo/10);

    const p1 = q.primeiro * unidade;
    const p2 = q.primeiro * dezena;

    return `
        <div class="conta-armada">
            ${reservasHTML()}

            <div class="secao-parcial">
                <h3 class="titulo-conta">Multiplicação armada</h3>

                <div class="cabecalho-casas cinco-colunas">
                    <div>DM</div><div>UM</div><div>C</div><div>D</div><div>U</div>
                </div>

                <div class="linha-conta cinco-colunas">
                    ${cincoNumero(q.primeiro)}
                </div>

                <div class="sinal-conta">×</div>

                <div class="linha-conta cinco-colunas">
                    ${cincoNumero(q.segundo)}
                </div>
            </div>

            ${tem ? `
                <div class="secao-parcial">
                    <p class="titulo-parcial">
                        1º produto parcial: ${q.primeiro} × ${unidade}
                    </p>

                    <div class="linha-parcial cinco-colunas">
                        ${cinco(p1,"parcial1")}
                    </div>
                </div>

                <div class="secao-parcial">
                    <p class="titulo-parcial">
                        2º produto parcial: ${q.primeiro} × ${dezena}
                    </p>

                    <div class="linha-parcial cinco-colunas">
                        ${cincoParcialDezena(p2,"parcial2")}
                    </div>
                </div>

                <div class="secao-parcial">
                    <p class="titulo-parcial">
                        Soma dos produtos parciais
                    </p>

                    <div class="linha-resposta cinco-colunas">
                        ${cinco(q.resultado,"resultado")}
                    </div>
                </div>
            ` : `
                <div class="secao-parcial">
                    <p class="titulo-parcial">Resposta</p>

                    <div class="linha-resposta cinco-colunas">
                        ${cinco(q.resultado,"resultado")}
                    </div>
                </div>
            `}
        </div>
    `;
}

/* =====================================================
   DIVISÃO: QUOCIENTE E RESTO
===================================================== */

function montarDivisao(q) {
    const comResto = estado.modalidade === "resto";

    return `
        <h3 class="titulo-conta">Divisão</h3>

        <div class="conta-divisao">
            ${q.dividendo} ÷ ${q.divisor}
        </div>

        <div class="campos-divisao">
            <div class="grupo-resposta">
                <label>Quociente</label>

                <input
                    id="campoQuociente"
                    class="campo-divisao"
                    data-resposta
                    data-divisao="quociente"
                    maxlength="2"
                    inputmode="numeric">
            </div>

            ${comResto ? `
                <div class="grupo-resposta">
                    <label>Resto</label>

                    <input
                        id="campoResto"
                        class="campo-divisao"
                        data-resposta
                        data-divisao="resto"
                        maxlength="2"
                        inputmode="numeric">
                </div>
            ` : ""}
        </div>

        <p class="nota-conta">
            Primeiro informe o quociente. Depois, informe o resto.
            Se o resto for zero, pode deixar o campo vazio ou digitar 0.
        </p>
    `;
}

/* =====================================================
   SEQUÊNCIAS NUMÉRICAS
===================================================== */

function montarSequencia(q) {
    return `
        <h3 class="titulo-conta">Sequência de ${q.numero}</h3>

        <div class="sequence-grid">
            ${q.itens.map(item => `
                <div class="sequence-cell">
                    <span>${item.posicao+1}</span>

                    ${item.preenchida
                        ? `<strong>${item.valor}</strong>`
                        : `
                            <input
                                class="respostaSequencia"
                                data-resposta
                                data-posicao="${item.posicao}"
                                inputmode="numeric">
                        `
                    }
                </div>
            `).join("")}
        </div>
    `;
}

/* =====================================================
   EXIBIÇÃO DAS QUESTÕES
===================================================== */

function mostrarQuestao() {
    if (estado.indice >= estado.questoes.length) {
        finalizarAtividade();
        return;
    }

    const q = estado.questoes[estado.indice];

    estado.errou = false;
    estado.campoAtivo = null;
    estado.sequenciaConferida = false;

    $("feedback").textContent = "";

    $("numeroQuestao").textContent =
        `Questão ${estado.indice+1} de ${estado.questoes.length}`;

    $("barraQuestao").style.width =
        `${estado.indice/estado.questoes.length*100}%`;

    if (estado.modalidade === "sequencia") {
        $("instrucaoQuestao").textContent =
            "Complete os espaços da sequência.";

        $("areaQuestao").innerHTML = montarSequencia(q);
    } else {
        $("instrucaoQuestao").textContent = "Resolva a questão:";

        $("areaQuestao").innerHTML =
            q.operacao === "divisao"
                ? montarDivisao(q)
                : q.operacao === "multiplicacao"
                    ? montarMultiplicacao(q)
                    : montarConta(q);
    }

    // BOTÃO OK: aparece logo abaixo da resposta.
    // O teclado virtual continua abaixo dele.

    $("areaQuestao").insertAdjacentHTML("beforeend", `
        <div class="area-botao-ok">
            <button type="button"
                class="botao-ok-resposta"
                onclick="confirmarAtividade()">
                OK ✅
            </button>
        </div>
    `);

    // O botão de pular permanece na área de ações.
    $("acoesQuestao").innerHTML = `
        <button class="botao-secundario"
            onclick="pularQuestao()">
            Pular questão
        </button>
    `;

    prepararCampos();
    montarTeclado();
}

/*
FUNÇÃO CENTRAL DO BOTÃO OK.

Identifica se a atividade é uma sequência
ou uma operação matemática.
*/

function confirmarAtividade() {
    if (estado.modalidade === "sequencia") {
        conferirSequencia();
    } else {
        conferirResposta();
    }
}

/* =====================================================
   CAMPOS E FOCO
===================================================== */

function prepararCampos() {
    const campos = [
        ...document.querySelectorAll("#areaQuestao [data-resposta]")
    ];

    campos.forEach(c => {
        c.addEventListener("focus", () => {
            estado.campoAtivo = c;
        });

        c.addEventListener("input", () => {
            c.value = c.value.replace(/\D/g,"");

            // Respostas de um algarismo avançam da direita para a esquerda.
            if (c.maxLength === 1 && c.value.length === 1) {
                moverEsquerda(c);
            }

            // Na divisão com resto, o quociente vem primeiro.
            if (c.dataset.divisao === "quociente" &&
                c.value.length >= 1) {
                $("campoResto")?.focus();
            }
        });
    });

    // Na divisão, começa sempre pelo quociente.
    const quociente = $("campoQuociente");

    if (quociente) {
        quociente.focus();
        return;
    }

    // Nas demais atividades, começa pelo campo mais à direita.
    if (campos.length) {
        campos[campos.length-1].focus();
    }
}

function moverEsquerda(atual) {
    const linha = atual.dataset.linha;

    if (!linha) return;

    const campos = [
        ...document.querySelectorAll(
            `#areaQuestao [data-linha="${linha}"]`
        )
    ];

    const i = campos.indexOf(atual);

    if (i > 0) {
        campos[i-1].focus();
    }
}

/* =====================================================
   TECLADO VIRTUAL
===================================================== */

function montarTeclado() {
    $("teclado").innerHTML = "";

    [1,2,3,4,5,6,7,8,9,"C",0,"⌫"].forEach(n => {
        const b = document.createElement("button");

        b.type = "button";
        b.textContent = n;
        b.onclick = () => digitar(n);

        $("teclado").appendChild(b);
    });
}

function digitar(n) {
    const c = estado.campoAtivo;

    if (!c || c.disabled) return;

    if (n === "C") {
        c.value = "";
        c.focus();
        return;
    }

    if (n === "⌫") {
        c.value = c.value.slice(0,-1);
        c.focus();
        return;
    }

    if (c.maxLength === 1) {
        c.value = String(n);
        c.dispatchEvent(new Event("input",{bubbles:true}));
        return;
    }

    c.value = (c.value + String(n)).slice(0,c.maxLength);
    c.dispatchEvent(new Event("input",{bubbles:true}));
}

/* =====================================================
   LEITURA DAS RESPOSTAS
===================================================== */

function lerLinha(linha) {
    const campos = [
        ...document.querySelectorAll(
            `#areaQuestao [data-linha="${linha}"]`
        )
    ];

    if (!campos.length || campos.some(c => c.value === "")) {
        return null;
    }

    return Number(campos.map(c => c.value).join(""));
}

/* =====================================================
   CORREÇÃO DOS PRODUTOS PARCIAIS
===================================================== */

function conferirParciais(q) {
    if (!q.temDezenaEmbaixo) return true;

    const esperado1 = q.primeiro * (q.segundo % 10);
    const esperado2 = q.primeiro * Math.floor(q.segundo/10);

    const parcial1 = lerLinha("parcial1");
    const parcial2 = lerLinha("parcial2");

    return parcial1 === esperado1 && parcial2 === esperado2;
}

/* =====================================================
   CONFERIR RESPOSTAS
===================================================== */

function conferirResposta() {
    const q = estado.questoes[estado.indice];
    let correto = false;

    if (q.operacao === "divisao") {
        const quociente = $("campoQuociente").value;
        const resto = $("campoResto")?.value || "0";

        correto =
            quociente !== "" &&
            Number(quociente) === q.resultado &&
            Number(resto) === q.resto;

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
    $("feedback").textContent = "Resposta Correta! ✅";

    estado.resultados.push({
        correto: true,
        corrigida: estado.errou
    });

    document.querySelectorAll("#areaQuestao input").forEach(c => {
        c.disabled = true;
    });

    const botaoOK = document.querySelector(".botao-ok-resposta");

    if (botaoOK) {
        botaoOK.disabled = true;
    }

    setTimeout(() => {
        estado.indice++;
        mostrarQuestao();
    },1500);
}

function respostaIncorreta() {
    estado.errou = true;

    $("feedback").textContent = "Resposta Incorreta! ❌";

    // O botão OK continua disponível para nova tentativa.
    $("acoesQuestao").innerHTML = `
        <button class="botao-secundario"
            onclick="pularQuestao()">
            Pular questão
        </button>
    `;
}

function tentarNovamente() {
    $("feedback").textContent = "";

    const botaoOK = document.querySelector(".botao-ok-resposta");

    if (botaoOK) {
        botaoOK.disabled = false;
    }

    $("acoesQuestao").innerHTML = `
        <button class="botao-secundario"
            onclick="pularQuestao()">
            Pular questão
        </button>
    `;
}

function pularQuestao() {
    estado.resultados.push({
        correto: false,
        pulada: true
    });

    estado.indice++;
    mostrarQuestao();
}

/* =====================================================
   CORREÇÃO DAS SEQUÊNCIAS
===================================================== */

function conferirSequencia() {
    if (estado.sequenciaConferida) return;

    const q = estado.questoes[estado.indice];

    const campos = [
        ...document.querySelectorAll(".respostaSequencia")
    ];

    if (campos.some(c => c.value.trim() === "")) {
        $("feedback").textContent = "Preencha todos os espaços.";
        return;
    }

    let acertos = 0;

    campos.forEach(c => {
        const pos = Number(c.dataset.posicao);

        if (Number(c.value) === q.itens[pos].valor) {
            acertos++;
        }

        c.disabled = true;
    });

    estado.sequenciaConferida = true;

    estado.resultados.push({
        correto: acertos === 6,
        percentual: Math.round(acertos/6*100)
    });

    $("feedback").textContent =
        `${acertos} de 6 espaços corretos.`;

    const botaoOK = document.querySelector(".botao-ok-resposta");

    if (botaoOK) {
        botaoOK.disabled = true;
    }

    $("acoesQuestao").innerHTML = `
        <button class="botao-principal"
            onclick="proximaSequencia()">
            Próxima sequência
        </button>
    `;
}

function proximaSequencia() {
    estado.indice++;
    mostrarQuestao();
}

/* =====================================================
   CRONÔMETRO
===================================================== */

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
    }

    estado.intervalo = null;
}

function tempoDecorrido() {
    return Math.floor((Date.now()-estado.inicio)/1000);
}

function atualizarCronometro() {
    const s = tempoDecorrido();

    $("cronometro").textContent =
        `${String(Math.floor(s/60)).padStart(2,"0")}:` +
        `${String(s%60).padStart(2,"0")}`;
}

/* =====================================================
   RESULTADO E DESEMPENHO
===================================================== */

function finalizarAtividade() {
    pararCronometro();

    const total = estado.questoes.length;

    const sequencia = estado.modalidade === "sequencia";

    const acertos = estado.resultados.filter(
        r => r.correto
    ).length;

    const corrigidas = estado.resultados.filter(
        r => r.correto && r.corrigida
    ).length;

    const percentual = sequencia
        ? Math.round(
            estado.resultados.reduce(
                (s,r) => s+(r.percentual || 0),0
            ) / total
        )
        : Math.round(acertos/total*100);

    const chave =
        `${estado.operacao}_${estado.modalidade}`;

    if (!progresso[chave]) {
        progresso[chave] = {
            tentativas: [],
            verdeConquistado: false
        };
    }

    progresso[chave].tentativas.push({
        percentual,
        data: new Date().toISOString()
    });

    if (percentual === 100) {
        progresso[chave].verdeConquistado = true;
    }

    salvar();

    const tempo = tempoDecorrido();

    $("resultadoPercentual").textContent =
        `${percentual}%`;

    $("detalhesResultado").innerHTML = `
        <p>Questões: <strong>${total}</strong></p>

        <p>Acertos diretos:
            <strong>${Math.max(0,acertos-corrigidas)}</strong>
        </p>

        <p>Corrigidas: <strong>${corrigidas}</strong></p>

        <p>Erros ou puladas:
            <strong>${total-acertos}</strong>
        </p>

        <p>Tempo:
            <strong>${Math.floor(tempo/60)} min ${tempo%60} s</strong>
        </p>
    `;

    mostrarTela("resultado");
    atualizarDesempenho();
}

function atualizarDesempenho() {
    const itens = Object.entries(progresso);

    const verdes = itens.filter(
        ([,v]) => v.verdeConquistado
    ).length;

    const amarelas = itens.filter(([,v]) => {
        const ultima = v.tentativas.at(-1);

        return !v.verdeConquistado &&
            ultima && ultima.percentual > 50;
    }).length;

    const vermelhas = itens.filter(([,v]) => {
        const ultima = v.tentativas.at(-1);

        return !v.verdeConquistado &&
            ultima && ultima.percentual <= 50;
    }).length;

    const naoIniciadas = Math.max(0,14-itens.length);
    const percentual = Math.round(verdes/14*100);

    $("percentualGeral").textContent = `${percentual}%`;

    $("textoProgresso").textContent =
        `${verdes} de 14 modalidades dominadas`;

    $("barraProgresso").style.width =
        `${percentual}%`;

    $("qtdVerdes").textContent = verdes;
    $("qtdAmarelas").textContent = amarelas;
    $("qtdVermelhas").textContent = vermelhas;
    $("qtdNaoIniciadas").textContent = naoIniciadas;

    $("faltam").textContent =
        `Faltam ${14-verdes} modalidades para dominar tudo.`;

    atualizarArvore();
}

function atualizarArvore() {
    const total = Object.values(progresso).filter(
        v => v.verdeConquistado
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

    $("recompensas").innerHTML =
        Object.entries(premios)
            .filter(([chave]) =>
                progresso[chave]?.verdeConquistado
            )
            .map(([,simbolo]) => `<span>${simbolo}</span>`)
            .join("");
}

/* =====================================================
   REVISAR E COMEÇAR NOVO ESTUDO
===================================================== */

function revisarAtividade() {
    if (!estado.ultimaConfiguracao) {
        return novoEstudo();
    }

    estado.operacao = estado.ultimaConfiguracao.operacao;
    estado.modalidade = estado.ultimaConfiguracao.modalidade;

    estado.opcoes = JSON.parse(
        JSON.stringify(estado.ultimaConfiguracao.opcoes)
    );

    estado.questoes = gerarQuestoes();
    estado.indice = 0;
    estado.resultados = [];
    estado.errou = false;
    estado.sequenciaConferida = false;

    mostrarTela("estudo");
    iniciarCronometro();
    mostrarQuestao();
}

function novoEstudo() {
    pararCronometro();
    abrirOperacao(estado.operacao);
}

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

atualizarDesempenho();
mostrarTela("inicio");
