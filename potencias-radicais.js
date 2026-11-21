
/* =========================================================
   MATEMÁTICA COM DETALHES — POTENCIAÇÃO E RADICAIS
   Arquivo: potencias-radicais.js
   Carregado depois de script.js e inteiros.js.
========================================================= */

(() => {
    "use strict";

    const MODOS_POTENCIAS = [
        ["conceito", "1. Conceito de potenciação"],
        ["naturais", "2. Potências com números naturais"],
        ["sinais", "3. Praticando o sinal com números inteiros"],
        ["pratica-sinais", "4. Prática de potenciação com inteiros"],
        ["expoentes-negativos", "5. Expoentes negativos"],
        ["bases-iguais", "6. Propriedades: bases iguais"],
        ["expoentes-inteiros", "7. Propriedades com expoentes inteiros"],
        ["base-dez", "8. Potências de base 10"],
        ["comparacao", "9. Comparação de potências"],
        ["area-volume", "10. Potenciação na geometria"]
    ];

    const abrirOperacaoOriginal = window.abrirOperacao;
    const selecionarModalidadeOriginal = window.selecionarModalidade;
    const iniciarAtividadeOriginal = window.iniciarAtividade;
    const mostrarQuestaoOriginal = window.mostrarQuestao;
    const confirmarAtividadeOriginal = window.confirmarAtividade;
    const revisarAtividadeOriginal = window.revisarAtividade;
    const novoEstudoOriginal = window.novoEstudo;

    const elementoConfiguracaoPot = $("configuracao");
    const paiConfiguracaoPot = elementoConfiguracaoPot?.parentElement;
    const proximoConfiguracaoPot = elementoConfiguracaoPot?.nextElementSibling;

    let temporizadorSolucaoPot = null;
    let temporizadorAvancoPot = null;

    modalidades.potencias = MODOS_POTENCIAS;

    premios.potencias_conceito = "⚡";
    premios.potencias_naturais = "🔢";
    premios.potencias_sinais = "➕";
    premios.potencias_pratica_sinais = "🎯";
    premios.potencias_expoentes_negativos = "➖";
    premios.potencias_bases_iguais = "🧩";
    premios.potencias_expoentes_inteiros = "🧠";
    premios.potencias_base_dez = "🔟";
    premios.potencias_comparacao = "🏆";
    premios.potencias_area_volume = "📐";

    // =====================================================
    // EXPLICAÇÕES
    // =====================================================

    const explicacoes = {
        conceito: `
            <div class="pot-aula">
                <h3>Conceito de potenciação</h3>
                <p>Identifique a base, o expoente e aprenda a escrever uma potência como multiplicação de fatores iguais.</p>
                <div class="pot-exemplo">Exemplo: a⁵ = a × a × a × a × a</div>
                <p>A base aparece repetida cinco vezes porque o expoente é 5.</p>
            </div>`,

        naturais: `
            <div class="pot-aula">
                <h3>Potências com números naturais</h3>
                <p>Para calcular uma potência, repetimos a base como fator tantas vezes quanto indica o expoente.</p>
                <div class="pot-exemplo">2⁴ = 2 × 2 × 2 × 2 = 16</div>
                <p>Todo número diferente de zero elevado a zero é igual a 1.</p>
                <div class="pot-exemplo">7⁰ = 1</div>
                <p>Quando a base é 1, qualquer expoente natural produz resultado 1.</p>
                <div class="pot-exemplo">1⁵ = 1</div>
            </div>`,

        sinais: `
            <div class="pot-aula">
                <h3>Praticando o sinal com números inteiros</h3>
                <p><strong>Expoente par:</strong></p>
                <div class="pot-exemplo">+(−3)² = +9</div>
                <div class="pot-exemplo">−(−4)² = −16</div>
                <p><strong>Expoente ímpar:</strong></p>
                <div class="pot-exemplo">+(−2)³ = −8</div>
                <div class="pot-exemplo">−(−2)³ = +8</div>
                <p><strong>Potência sem parênteses:</strong> calculamos a potência primeiro e depois aplicamos o sinal.</p>
                <div class="pot-exemplo">−5² = −(5 × 5) = −25</div>
                <div class="pot-exemplo">+5² = +(5 × 5) = +25</div>
            </div>`,

        "expoentes-negativos": `
            <div class="pot-aula">
                <h3>Expoente negativo</h3>
                <p>Uma potência com expoente negativo corresponde ao inverso da potência com expoente positivo, desde que a base seja diferente de zero.</p>
                <div class="pot-exemplo">2⁻³ = 1 ÷ 2³ = 1/8</div>
                <p>Para base fracionária, invertemos a fração:</p>
                <div class="pot-exemplo">(2/3)⁻² = (3/2)² = 9/4</div>
            </div>`,

        "bases-iguais": `
            <div class="pot-aula">
                <h3>Multiplicação e divisão de potências de mesma base</h3>
                <p><strong>Multiplicação:</strong> conservamos a base e somamos os expoentes.</p>
                <div class="pot-exemplo">aᵐ × aⁿ = aᵐ⁺ⁿ</div>
                <p><strong>Divisão:</strong> conservamos a base e subtraímos os expoentes, com base diferente de zero.</p>
                <div class="pot-exemplo">aᵐ ÷ aⁿ = aᵐ⁻ⁿ</div>
            </div>`,

        "expoentes-inteiros": `
            <div class="pot-aula">
                <h3>Potência de potência</h3>
                <p>Conservamos a base e multiplicamos os expoentes.</p>
                <div class="pot-exemplo">(2³)² = 2⁶ = 64</div>
            </div>`,

        "base-dez": `
            <div class="pot-aula">
                <h3>Potências de base 10</h3>
                <div class="pot-exemplo">10¹ = 10</div>
                <div class="pot-exemplo">10² = 100</div>
                <div class="pot-exemplo">10³ = 1 000</div>
                <p>Para expoentes naturais, 10 elevado a n é 1 seguido de n zeros.</p>
            </div>`,

        comparacao: `
            <div class="pot-aula">
                <h3>Comparação de potências</h3>
                <p>Para comparar potências, podemos calcular seus valores.</p>
                <div class="pot-exemplo">2³ = 8 e 3² = 9</div>
                <p>Logo, 2³ &lt; 3².</p>
            </div>`,

        "area-volume": `
            <div class="pot-aula">
                <h3>Potenciação na geometria</h3>
                <p>A área de um quadrado de lado l é l².</p>
                <div class="pot-exemplo">A = l × l = l²</div>
                <p>O volume de um cubo de aresta a é a³.</p>
                <div class="pot-exemplo">V = a × a × a = a³</div>
            </div>`
    };

    // =====================================================
    // FUNÇÕES AUXILIARES
    // =====================================================

    function aleatorioPot(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function embaralharPot(lista) {
        return [...lista].sort(() => Math.random() - 0.5);
    }

    function formatarBasePot(base) {
        return base < 0
            ? `(−${Math.abs(base)})`
            : `(+${base})`;
    }

    function marcadosPot(nome) {
        return [
            ...document.querySelectorAll(
                `#opcoesConfiguracao input[name="${nome}"]:checked`
            )
        ].map(c => c.value);
    }

    function restaurarConfiguracaoPotencias() {
        if (!elementoConfiguracaoPot || !paiConfiguracaoPot) return;

        if (elementoConfiguracaoPot.parentElement !== paiConfiguracaoPot) {
            if (
                proximoConfiguracaoPot &&
                proximoConfiguracaoPot.parentElement === paiConfiguracaoPot
            ) {
                paiConfiguracaoPot.insertBefore(
                    elementoConfiguracaoPot,
                    proximoConfiguracaoPot
                );
            } else {
                paiConfiguracaoPot.appendChild(elementoConfiguracaoPot);
            }
        }
    }

    function obterLimiteBase(bases, expo) {
        let limite = expo === 2 ? 12 : 10;

        if (bases.includes(5)) limite = Math.min(limite, 5);
        if (bases.includes(10)) limite = Math.min(limite, 10);

        return limite;
    }

    function formatosPadrao() {
        return [
            "mais-parenteses",
            "menos-parenteses",
            "sem-sinal"
        ];
    }

    // =====================================================
    // GERAÇÃO DAS QUESTÕES
    // =====================================================

    function gerarQuestoesPotencias(modo, quantidade, opcoes = {}) {
        const qs = [];

        const adicionar = (enunciado, resposta, explicacao, extra = {}) => {
            qs.push({
                tipo: "potencia",
                enunciado,
                resposta: String(resposta),
                explicacao,
                ...extra
            });
        };

        if (modo === "conceito") {
            for (let i = 0; i < quantidade; i++) {
                const base = aleatorioPot(2, 9);
                const expo = aleatorioPot(2, 5);
                const tipo = i % 3;

                if (tipo === 0) {
                    adicionar(
                        `Na potência ${base}<sup>${expo}</sup>, qual é a base?`,
                        base,
                        `A base é ${base}: é o número que será repetido como fator.`
                    );
                } else if (tipo === 1) {
                    adicionar(
                        `Na potência ${base}<sup>${expo}</sup>, qual é o expoente?`,
                        expo,
                        `O expoente é ${expo}: ele indica quantas vezes a base aparece como fator.`
                    );
                } else {
                    const multiplicacao = Array(expo).fill(base).join(" × ");

                    adicionar(
                        `Escreva como multiplicação: ${base}<sup>${expo}</sup>.`,
                        Array(expo).fill(base).join("x"),
                        `A base ${base} aparece ${expo} vezes: ${multiplicacao}.`,
                        {
                            respostaTexto: true,
                            exemplo: `${base}<sup>${expo}</sup> = ${multiplicacao}`
                        }
                    );
                }
            }
        }

        else if (modo === "naturais") {
            const expoentes = opcoes.expoentes?.length
                ? opcoes.expoentes
                : [0, 1, 2];

            const bases = opcoes.bases?.length
                ? opcoes.bases
                : [10];

            for (let i = 0; i < quantidade; i++) {
                const expo = Number(
                    expoentes[aleatorioPot(0, expoentes.length - 1)]
                );

                const limite = obterLimiteBase(bases, expo);
                let base = aleatorioPot(0, limite);

                if (expo === 0 && base === 0) base = 1;

                const resultado = base ** expo;

                let explicacao;

                if (expo === 0) {
                    explicacao = `${base}⁰ = 1. Todo número diferente de zero elevado a zero é igual a 1.`;
                } else if (expo === 1) {
                    explicacao = `${base}¹ = ${base}. Todo número elevado a 1 é igual a ele mesmo.`;
                } else {
                    explicacao = `${base}⁽${expo}⁾ = ${Array(expo).fill(base).join(" × ")} = ${resultado}.`;
                }

                adicionar(
                    `Calcule: ${base}<sup>${expo}</sup>.`,
                    resultado,
                    explicacao
                );
            }
        }

        else if (modo === "sinais" || modo === "pratica-sinais") {
            const expoentes = opcoes.expoentes?.length
                ? opcoes.expoentes
                : [0, 1, 2];

            const bases = opcoes.bases?.length
                ? opcoes.bases
                : [10];

            const formatos = opcoes.formatos?.length
                ? opcoes.formatos
                : formatosPadrao();

            for (let i = 0; i < quantidade; i++) {
                const expo = Number(
                    expoentes[aleatorioPot(0, expoentes.length - 1)]
                );

                const limite = obterLimiteBase(bases, expo);
                let base = aleatorioPot(-limite, limite);

                if (expo === 0 && base === 0) base = 1;

                const formato = formatos[
                    aleatorioPot(0, formatos.length - 1)
                ];

                let expressao;
                let valor;

                if (formato === "mais-parenteses") {
                    expressao = `+${formatarBasePot(base)}<sup>${expo}</sup>`;
                    valor = base ** expo;
                }

                else if (formato === "menos-parenteses") {
                    expressao = `−${formatarBasePot(base)}<sup>${expo}</sup>`;
                    valor = -(base ** expo);
                }

                else {
                    expressao = `${base < 0 ? "−" : "+"}${Math.abs(base)}<sup>${expo}</sup>`;

                    valor = base < 0
                        ? -(Math.abs(base) ** expo)
                        : Math.abs(base) ** expo;
                }

                if (modo === "sinais") {
                    const sinal = valor < 0 ? "negativo" : "positivo";

                    adicionar(
                        `Observe a expressão:<div class="pot-expressao">${expressao} = [ &nbsp; ] ${Math.abs(valor)}</div><p class="pot-pergunta-sinal">Qual sinal deve ocupar o espaço vazio?</p>`,
                        sinal,
                        `O resultado da expressão é ${valor}. Portanto, o sinal correto é ${sinal}.`,
                        {
                            escolhaSinal: true,
                            valorAbsoluto: Math.abs(valor)
                        }
                    );
                } else {
                    adicionar(
                        `Calcule o valor da expressão:<div class="pot-expressao">${expressao}</div>`,
                        valor,
                        `O resultado da expressão é ${valor}.`
                    );
                }
            }
        }

        else {
            for (let i = 0; i < quantidade; i++) {
                const base = aleatorioPot(2, 6);
                const expo = aleatorioPot(2, 4);

                if (modo === "expoentes-negativos") {
                    const e = aleatorioPot(1, 3);

                    adicionar(
                        `Escreva ${base}<sup>−${e}</sup> como fração.`,
                        `1/${base ** e}`,
                        `${base}<sup>−${e}</sup> = 1/${base}<sup>${e}</sup> = 1/${base ** e}.`
                    );
                }

                else if (modo === "bases-iguais") {
                    const e1 = aleatorioPot(1, 4);
                    const e2 = aleatorioPot(1, 4);

                    adicionar(
                        `Simplifique: ${base}<sup>${e1}</sup> × ${base}<sup>${e2}</sup>.`,
                        `${base}<sup>${e1 + e2}</sup>`,
                        `Na multiplicação de potências de mesma base, somamos os expoentes: ${e1} + ${e2} = ${e1 + e2}.`
                    );
                }

                else if (modo === "expoentes-inteiros") {
                    const e1 = aleatorioPot(2, 3);
                    const e2 = aleatorioPot(2, 3);

                    adicionar(
                        `Simplifique: (${base}<sup>${e1}</sup>)<sup>${e2}</sup>.`,
                        `${base}<sup>${e1 * e2}</sup>`,
                        `Na potência de potência, multiplicamos os expoentes: ${e1} × ${e2} = ${e1 * e2}.`
                    );
                }

                else if (modo === "base-dez") {
                    const e = aleatorioPot(1, 5);

                    adicionar(
                        `Calcule: 10<sup>${e}</sup>.`,
                        `1${"0".repeat(e)}`,
                        `10 elevado a ${e} é 1 seguido de ${e} zeros.`
                    );
                }

                else if (modo === "comparacao") {
                    const a = aleatorioPot(2, 5);
                    const b = aleatorioPot(2, 5);
                    const x = a ** expo;
                    const y = b ** expo;
                    const sinal = x > y ? ">" : x < y ? "<" : "=";

                    adicionar(
                        `Complete com &gt;, &lt; ou =: ${a}<sup>${expo}</sup> ___ ${b}<sup>${expo}</sup>.`,
                        sinal,
                        `${a}<sup>${expo}</sup> = ${x} e ${b}<sup>${expo}</sup> = ${y}. Portanto, ${x} ${sinal} ${y}.`
                    );
                }

                else if (modo === "area-volume") {
                    const medida = aleatorioPot(2, 10);

                    if (i % 2 === 0) {
                        adicionar(
                            `Um quadrado tem lado de ${medida} cm. Qual é sua área?`,
                            medida ** 2,
                            `A área do quadrado é lado × lado: ${medida} × ${medida} = ${medida ** 2} cm².`
                        );
                    } else {
                        adicionar(
                            `Um cubo tem aresta de ${medida} cm. Qual é seu volume?`,
                            medida ** 3,
                            `O volume do cubo é aresta × aresta × aresta: ${medida} × ${medida} × ${medida} = ${medida ** 3} cm³.`
                        );
                    }
                }
            }
        }

        return embaralharPot(qs).slice(0, quantidade);
    }

    // =====================================================
    // CONFIGURAÇÕES
    // =====================================================

    function lerConfiguracaoPotencias() {
        const quantidade = Number($("quantidadeQuestoes")?.value || 10);
        const opcoes = { quantidade };

        if (
            estado.modalidade === "naturais" ||
            estado.modalidade === "sinais" ||
            estado.modalidade === "pratica-sinais"
        ) {
            const expoentes = marcadosPot("expoente").map(Number);
            const bases = marcadosPot("base").map(Number);

            opcoes.expoentes = expoentes.length
                ? expoentes
                : [0, 1, 2];

            opcoes.bases = bases.length ? bases : [10];
        }

        if (
            estado.modalidade === "sinais" ||
            estado.modalidade === "pratica-sinais"
        ) {
            const formatos = marcadosPot("formato");

            opcoes.formatos = formatos.length
                ? formatos
                : formatosPadrao();
        }

        return opcoes;
    }

    function mostrarConfiguracaoPotencias(id, botao) {
        const config = $("configuracao");

        // Clicar novamente na mesma modalidade fecha a configuração.
        if (
            estado.modalidade === id &&
            config &&
            !config.classList.contains("escondida")
        ) {
            config.classList.add("escondida");
            botao?.classList.remove("ativa");
            estado.modalidade = "";
            return;
        }

        estado.modalidade = id;

        document.querySelectorAll("#listaModalidades .modalidade")
            .forEach(b => b.classList.remove("ativa"));

        botao?.classList.add("ativa");

        const opcoesNaturais = id === "naturais" ? `
            <div class="pot-grupo">
                <strong>Escolha os expoentes:</strong>

                ${[0, 1, 2, 3].map(n => `
                    <label class="pot-check">
                        <input type="checkbox" name="expoente" value="${n}">
                        Expoente ${n}
                    </label>
                `).join("")}
            </div>

            <div class="pot-grupo">
                <strong>Limite das bases:</strong>

                <label class="pot-check">
                    <input type="checkbox" name="base" value="5">
                    Bases até 5
                </label>

                <label class="pot-check">
                    <input type="checkbox" name="base" value="10">
                    Bases até 10
                </label>

                <p class="pot-observacao">
                    Sem seleção, serão utilizados expoentes 0, 1 e 2,
                    com bases até 10.
                </p>
            </div>` : "";

        const opcoesInteiros = (
            id === "sinais" || id === "pratica-sinais"
        ) ? `
            <div class="pot-grupo">
                <strong>Escolha os expoentes:</strong>

                ${[0, 1, 2, 3].map(n => `
                    <label class="pot-check">
                        <input type="checkbox" name="expoente" value="${n}">
                        Expoente ${n}
                    </label>
                `).join("")}
            </div>

            <div class="pot-grupo">
                <strong>Limite das bases:</strong>

                <label class="pot-check">
                    <input type="checkbox" name="base" value="5">
                    Bases de −5 até +5
                </label>

                <label class="pot-check">
                    <input type="checkbox" name="base" value="10">
                    Bases de −10 até +10
                </label>
            </div>

            <div class="pot-grupo">
                <strong>Escolha os formatos das expressões:</strong>

                <label class="pot-check">
                    <input type="checkbox" name="formato" value="mais-parenteses">
                    +(a)<sup>b</sup>
                </label>

                <label class="pot-check">
                    <input type="checkbox" name="formato" value="menos-parenteses">
                    −(a)<sup>b</sup>
                </label>

                <label class="pot-check">
                    <input type="checkbox" name="formato" value="sem-sinal">
                    a<sup>b</sup>
                </label>
            </div>

            <p class="pot-observacao">
                Sem seleção, serão utilizados expoentes 0, 1 e 2,
                bases de −10 até +10 e os três formatos.
                No formato sem parênteses, base negativa será representada
                por −a<sup>b</sup> e base positiva por +a<sup>b</sup>.
            </p>` : "";

        $("opcoesConfiguracao").innerHTML = `
            ${explicacoes[id] || ""}
            ${opcoesNaturais}
            ${opcoesInteiros}

            <label class="pot-label" for="quantidadeQuestoes">
                Quantidade de questões:
            </label>

            <select id="quantidadeQuestoes" class="campo-configuracao">
                <option value="10" selected>10 questões</option>
                <option value="20">20 questões</option>
                <option value="30">30 questões</option>
                <option value="50">50 questões</option>
            </select>
        `;

        const lista = $("listaModalidades");
        const item = botao?.closest(".modalidade");

        if (config && item) {
            item.insertAdjacentElement("afterend", config);
        }

        config?.classList.remove("escondida");
        lista?.classList.remove("escondida");
    }

    // =====================================================
    // TECLADO VIRTUAL
    // =====================================================

    function montarTecladoPotencias() {
        const teclado = $("teclado");
        if (!teclado) return;

        if (estado.modalidade === "sinais") {
            teclado.innerHTML = "";
            teclado.classList.add("escondida");
            return;
        }

        const teclas = [
            "1", "2", "3",
            "4", "5", "6",
            "7", "8", "9",
            "0", "×", "⌫"
        ];

        teclado.innerHTML = teclas.map(t => `
            <button type="button"
                class="pot-tecla"
                onclick="digitarPotencia('${t}')">
                ${t}
            </button>
        `).join("");

        teclado.classList.remove("escondida");
    }

    window.digitarPotencia = function(valor) {
        const input = $("respostaPotencia");
        if (!input || input.disabled) return;

        if (valor === "⌫") {
            input.value = input.value.slice(0, -1);
        } else {
            input.value += valor === "×" ? "x" : valor;
        }

        input.focus();
    };

    // =====================================================
    // EXEMPLO ABAIXO DO TECLADO
    // =====================================================

    function mostrarExemploAbaixoTeclado(q) {
        const teclado = $("teclado");
        if (!teclado) return;

        document.getElementById("potExemploQuestao")?.remove();

        if (!q.respostaTexto || !q.exemplo) return;

        const exemplo = document.createElement("div");
        exemplo.id = "potExemploQuestao";
        exemplo.className = "pot-exemplo-ajuda";
        exemplo.innerHTML = q.exemplo;

        teclado.insertAdjacentElement("afterend", exemplo);
    }

    // =====================================================
    // MOSTRAR QUESTÃO
    // =====================================================

    function mostrarQuestaoPotencias() {
        if (temporizadorSolucaoPot) {
            clearTimeout(temporizadorSolucaoPot);
            temporizadorSolucaoPot = null;
        }

        if (temporizadorAvancoPot) {
            clearTimeout(temporizadorAvancoPot);
            temporizadorAvancoPot = null;
        }

        if (estado.indice >= estado.questoes.length) {
            pararCronometro();
            finalizarAtividade();
            return;
        }

        const q = estado.questoes[estado.indice];

        estado.respostaConferida = false;
        estado.errou = false;

        $("numeroQuestao").textContent =
            `Questão ${estado.indice + 1} de ${estado.questoes.length}`;

        $("instrucaoQuestao").innerHTML = q.enunciado;
        $("feedback").textContent = "";

        $("areaQuestao").innerHTML = `
            <div class="pot-questao">
                ${q.escolhaSinal ? `
                    <div class="pot-sinais-resposta">
                        <button type="button"
                            class="pot-alternativa"
                            data-pot-sinal="positivo">
                            Positivo (+)
                        </button>

                        <button type="button"
                            class="pot-alternativa"
                            data-pot-sinal="negativo">
                            Negativo (−)
                        </button>
                    </div>
                ` : `
                    <label class="pot-label" for="respostaPotencia">
                        Sua resposta:
                    </label>

                    <input
                        id="respostaPotencia"
                        class="pot-input"
                        type="text"
                        autocomplete="off"
                        inputmode="text"
                        placeholder="Digite sua resposta"
                    >
                `}
            </div>
        `;

        $("acoesQuestao").innerHTML = `
            <button class="botao-principal pot-confirmar"
                onclick="confirmarAtividade()">
                Confirmar resposta
            </button>

            <button class="botao-secundario"
                onclick="pularQuestaoPotencias()">
                Pular questão
            </button>
        `;

        if (q.escolhaSinal) {
            document.querySelectorAll("[data-pot-sinal]").forEach(b => {
                b.onclick = () => {
                    document.querySelectorAll("[data-pot-sinal]")
                        .forEach(x => x.classList.remove("pot-escolhida"));

                    b.classList.add("pot-escolhida");
                };
            });
        } else {
            const input = $("respostaPotencia");

            input.addEventListener("keydown", e => {
                if (e.key === "Enter") confirmarAtividade();
            });

            input.focus();
            estado.campoAtivo = input;
        }

        montarTecladoPotencias();
        mostrarExemploAbaixoTeclado(q);
    }

    // =====================================================
    // NORMALIZAÇÃO E CONFERÊNCIA
    // =====================================================

    function normalizarPot(valor) {
        return String(valor ?? "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[−–]/g, "-")
            .replace(/[×·*]/g, "x")
            .replace(/,/g, ".");
    }

    function conferirPotencias() {
        if (estado.respostaConferida) return;

        const q = estado.questoes[estado.indice];

        const selecionada = document.querySelector(
            "[data-pot-sinal].pot-escolhida"
        );

        const resposta = selecionada
            ? selecionada.dataset.potSinal
            : $("respostaPotencia")?.value;

        if (!String(resposta ?? "").trim()) {
            $("feedback").textContent = q.escolhaSinal
                ? "Escolha o sinal positivo ou negativo."
                : "Digite sua resposta antes de confirmar.";
            return;
        }

        if (normalizarPot(resposta) === normalizarPot(q.resposta)) {
            estado.respostaConferida = true;

            $("feedback").innerHTML =
                `Resposta correta! ✅<br>${q.explicacao}`;

            estado.resultados.push({
                correto: true,
                corrigida: estado.errou
            });

            document.querySelectorAll(
                "#areaQuestao input, #areaQuestao button, #acoesQuestao button"
            ).forEach(c => c.disabled = true);

            temporizadorAvancoPot = setTimeout(() => {
                estado.indice++;
                mostrarQuestaoPotencias();
            }, 1800);

        } else {
            estado.errou = true;

            $("feedback").textContent =
                "Resposta incorreta. Tente novamente ou consulte a resolução.";

            $("acoesQuestao").innerHTML = `
                <button class="botao-principal"
                    onclick="tentarNovamentePotencias()">
                    Tentar novamente
                </button>

                <button class="botao-secundario"
                    onclick="entenderRespostaPotencias()">
                    Entender a resposta correta
                </button>

                <button class="botao-secundario"
                    onclick="pularQuestaoPotencias()">
                    Pular questão
                </button>
            `;
        }
    }

    // =====================================================
    // ENTENDER A RESPOSTA — AVANÇO MANUAL
    // =====================================================

    function entenderRespostaPotencias() {
        if (estado.respostaConferida) return;

        const q = estado.questoes[estado.indice];
        estado.respostaConferida = true;

        $("feedback").innerHTML = `
            <div class="pot-solucao">
                <strong>Entenda a resolução:</strong>
                <p>${q.explicacao}</p>
                <p><strong>Resposta correta:</strong> ${q.resposta}</p>
            </div>
        `;

        $("acoesQuestao").innerHTML = `
            <button class="botao-principal"
                onclick="avancarAposEntenderPotencias()">
                Entendido ✅
            </button>
        `;

        document.querySelectorAll(
            "#areaQuestao input, #areaQuestao button"
        ).forEach(c => c.disabled = true);
    }

    window.avancarAposEntenderPotencias = function() {
        if (!estado.respostaConferida) return;

        estado.resultados.push({
            correto: false,
            corrigida: false,
            pulada: true
        });

        estado.indice++;
        mostrarQuestaoPotencias();
    };

    function pularQuestaoPotencias() {
        if (estado.respostaConferida) return;

        estado.resultados.push({
            correto: false,
            corrigida: false,
            pulada: true
        });

        estado.indice++;
        mostrarQuestaoPotencias();
    }

    window.pularQuestaoPotencias = pularQuestaoPotencias;
    window.entenderRespostaPotencias = entenderRespostaPotencias;

    window.tentarNovamentePotencias = function() {
        $("feedback").textContent = "";

        $("acoesQuestao").innerHTML = `
            <button class="botao-principal pot-confirmar"
                onclick="confirmarAtividade()">
                Confirmar resposta
            </button>

            <button class="botao-secundario"
                onclick="pularQuestaoPotencias()">
                Pular questão
            </button>
        `;

        const input = $("respostaPotencia");

        if (input) {
            input.value = "";
            input.focus();
            estado.campoAtivo = input;
        }

        document.querySelectorAll("[data-pot-sinal]").forEach(b => {
            b.classList.remove("pot-escolhida");
        });
    };

    // =====================================================
    // INTEGRAÇÃO COM O CURSO
    // =====================================================

    window.abrirOperacao = function(op) {
        restaurarConfiguracaoPotencias();

        if (op !== "potencias") {
            return abrirOperacaoOriginal(op);
        }

        pararCronometro();

        if (temporizadorSolucaoPot) clearTimeout(temporizadorSolucaoPot);
        if (temporizadorAvancoPot) clearTimeout(temporizadorAvancoPot);

        estado.operacao = "potencias";
        estado.modalidade = "";

        $("tituloOperacao").textContent = "Potenciação";
        $("descricaoOperacao").textContent =
            "Estude a explicação e pratique cada etapa.";

        $("menuQuatroOperacoes")?.classList.add("escondida");
        $("listaModalidades").classList.remove("escondida");
        $("configuracao").classList.add("escondida");

        $("listaModalidades").innerHTML = MODOS_POTENCIAS.map(([id, nome]) => `
            <button class="modalidade"
                onclick="selecionarModalidade('${id}',this)">
                ${nome}
            </button>
        `).join("");

        document.getElementById("potExemploQuestao")?.remove();

        mostrarTela("operacao");
    };

    window.selecionarModalidade = function(id, botao) {
        if (estado.operacao === "potencias") {
            mostrarConfiguracaoPotencias(id, botao);
            return;
        }

        return selecionarModalidadeOriginal(id, botao);
    };

    window.iniciarAtividade = function() {
        if (estado.operacao !== "potencias") {
            return iniciarAtividadeOriginal();
        }

        try {
            const opcoes = lerConfiguracaoPotencias();

            estado.opcoes = opcoes;

            estado.ultimaConfiguracao = {
                operacao: "potencias",
                modalidade: estado.modalidade,
                opcoes: JSON.parse(JSON.stringify(opcoes))
            };

            estado.questoes = gerarQuestoesPotencias(
                estado.modalidade,
                opcoes.quantidade,
                opcoes
            );

            estado.indice = 0;
            estado.resultados = [];
            estado.errou = false;
            estado.respostaConferida = false;

            if (!estado.questoes.length) {
                throw new Error("Não foram geradas questões.");
            }

            document.getElementById("potExemploQuestao")?.remove();

            mostrarTela("estudo");
            iniciarCronometro();
            mostrarQuestaoPotencias();

        } catch (e) {
            console.error("Erro ao iniciar potenciação:", e);
            alert("Não foi possível iniciar esta atividade: " + e.message);
        }
    };

    window.mostrarQuestao = function() {
        if (estado.operacao === "potencias") {
            return mostrarQuestaoPotencias();
        }

        return mostrarQuestaoOriginal();
    };

    window.confirmarAtividade = function() {
        if (estado.operacao === "potencias") {
            return conferirPotencias();
        }

        return confirmarAtividadeOriginal();
    };

    window.novoEstudo = function() {
        if (estado.operacao !== "potencias") {
            return novoEstudoOriginal();
        }

        pararCronometro();

        if (temporizadorSolucaoPot) clearTimeout(temporizadorSolucaoPot);
        if (temporizadorAvancoPot) clearTimeout(temporizadorAvancoPot);

        restaurarConfiguracaoPotencias();
        window.abrirOperacao("potencias");
    };

    window.revisarAtividade = function() {
        if (estado.operacao !== "potencias") {
            return revisarAtividadeOriginal();
        }

        if (!estado.ultimaConfiguracao) {
            return novoEstudoOriginal();
        }

        estado.operacao = "potencias";
        estado.modalidade = estado.ultimaConfiguracao.modalidade;
        estado.opcoes = { ...estado.ultimaConfiguracao.opcoes };

        estado.questoes = gerarQuestoesPotencias(
            estado.modalidade,
            estado.opcoes.quantidade,
            estado.opcoes
        );

        estado.indice = 0;
        estado.resultados = [];
        estado.errou = false;
        estado.respostaConferida = false;

        mostrarTela("estudo");
        iniciarCronometro();
        mostrarQuestaoPotencias();
    };

    // =====================================================
    // CSS DO MÓDULO
    // =====================================================

    const estilo = document.createElement("style");

    estilo.textContent = `
        .pot-aula {
            background: #f4f8ff;
            border: 1px solid #d9e6f7;
            border-radius: 12px;
            padding: 14px;
            margin: 12px 0 18px;
            line-height: 1.55;
        }

        .pot-aula h3 {
            margin-top: 0;
            color: #285da8;
        }

        .pot-exemplo {
            background: #fff;
            border-radius: 9px;
            padding: 10px;
            margin: 9px 0;
            text-align: center;
            font-size: 1.2rem;
            font-weight: 700;
        }

        .pot-label {
            display: block;
            font-weight: 700;
            margin: 12px 0 7px;
        }

        .pot-observacao {
            color: #64748b;
            font-size: .9rem;
            line-height: 1.5;
        }

        #instrucaoQuestao {
            font-size: 1.45rem;
            line-height: 1.6;
            text-align: center;
            font-weight: 700;
            max-width: 720px;
            margin: 18px auto 24px;
        }

        .pot-questao {
            padding: 18px 12px;
            background: #f8faff;
            border: 1px solid #dce6f4;
            border-radius: 14px;
            max-width: 650px;
            margin: 0 auto;
        }

        .pot-expressao {
            text-align: center;
            font-size: 1.7rem;
            font-weight: 700;
            margin: 14px 0;
            line-height: 1.8;
        }

        .pot-pergunta-sinal {
            text-align: center;
            font-size: 1.1rem;
            font-weight: 600;
            margin-top: 12px;
        }

        .pot-input {
            display: block;
            width: min(100%, 320px);
            box-sizing: border-box;
            margin: 8px auto;
            padding: 13px;
            border: 2px solid #b8cbe5;
            border-radius: 10px;
            font-size: 1.2rem;
            text-align: center;
        }

        .pot-alternativa {
            padding: 14px 8px;
            border: 2px solid #dce6f4;
            border-radius: 10px;
            background: white;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .pot-alternativa.pot-escolhida {
            border-color: #285da8;
            background: #edf4ff;
        }

        .pot-sinais-resposta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 18px auto;
            max-width: 420px;
        }

        .pot-grupo {
            border: 1px solid #d9e0e8;
            border-radius: 11px;
            padding: 12px;
            margin: 12px 0;
            background: #fff;
        }

        .pot-check {
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 8px 2px;
        }

        .pot-check input {
            width: 18px;
            height: 18px;
            accent-color: #285da8;
        }

        #teclado:has(.pot-tecla) {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 9px;
            width: min(100%, 360px);
            margin: 18px auto;
        }

        .pot-tecla {
            min-height: 54px;
            border: 1px solid #d9e0e8;
            border-radius: 10px;
            background: white;
            font-size: 21px;
            font-weight: bold;
        }

        .pot-tecla:active {
            background: #edf4ff;
            border-color: #285da8;
        }

        #potExemploQuestao {
            width: min(100%, 520px);
            box-sizing: border-box;
            margin: 16px auto;
            padding: 13px;
            border-radius: 10px;
            background: #fff3ce;
            text-align: center;
            font-size: 1.1rem;
            font-weight: 600;
            line-height: 1.7;
        }

        .pot-confirmar {
            margin-bottom: 9px;
        }

        .pot-solucao {
            padding: 12px;
            background: #fff3ce;
            border-radius: 10px;
            line-height: 1.6;
        }

        .pot-questao sup,
        .pot-aula sup,
        .pot-expressao sup {
            font-size: .7em;
        }

        @media (max-width: 420px) {
            #instrucaoQuestao {
                font-size: 1.25rem;
                padding: 0 8px;
            }

            .pot-expressao {
                font-size: 1.45rem;
            }

            .pot-tecla {
                min-height: 50px;
            }
        }
    `;

    document.head.appendChild(estilo);

    atualizarDesempenho();

})();
