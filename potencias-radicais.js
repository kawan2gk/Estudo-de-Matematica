/* =========================================================
   MATEMÁTICA COM DETALHES — MÓDULO DE POTENCIAÇÃO
   Arquivo: potencias-radicais.js
   Este arquivo é carregado depois de script.js e inteiros.js.
   Não altera a chave de armazenamento do curso.
========================================================= */

(() => {
    "use strict";

    const MODOS_POTENCIAS = [
        ["conceito", "1. Conceito de potenciação"],
        ["naturais", "2. Potências com números naturais"],
        ["sinais", "3. Sinais com números inteiros"],
        ["pratica-sinais", "4. Prática de sinais"],
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

    // Acrescenta Potenciação ao mesmo sistema de desempenho do curso.
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

    const explicacoes = {
        conceito: `
            <div class="pot-aula">
                <h3>O que é potenciação?</h3>
                <p>Potenciação é uma forma abreviada de escrever uma multiplicação de fatores iguais.</p>
                <div class="pot-exemplo">3<sup>4</sup> = 3 × 3 × 3 × 3 = 81</div>
                <p><strong>Base:</strong> número que será multiplicado.</p>
                <p><strong>Expoente:</strong> quantidade de vezes que a base aparece como fator.</p>
                <p><strong>Potência:</strong> resultado da operação.</p>
                <p>Exemplo: em 5<sup>3</sup>, a base é 5 e o expoente é 3.</p>
            </div>`,
        naturais: `
            <div class="pot-aula">
                <h3>Potências com números naturais</h3>
                <p>Para calcular uma potência, repetimos a base como fator tantas vezes quanto indica o expoente.</p>
                <div class="pot-exemplo">2<sup>4</sup> = 2 × 2 × 2 × 2 = 16</div>
                <p>Todo número natural diferente de zero elevado a zero é igual a 1.</p>
                <div class="pot-exemplo">7<sup>0</sup> = 1</div>
                <p>Quando a base é 1, qualquer expoente natural produz resultado 1.</p>
            </div>`,
        sinais: `
            <div class="pot-aula">
                <h3>Potenciação com base negativa</h3>
                <p>Quando a base negativa está entre parênteses, o sinal faz parte da base.</p>
                <div class="pot-exemplo">(−2)<sup>2</sup> = (−2) × (−2) = 4</div>
                <div class="pot-exemplo">(−2)<sup>3</sup> = (−2) × (−2) × (−2) = −8</div>
                <p>Expoente par: resultado positivo. Expoente ímpar: resultado negativo.</p>
                <p>Atenção: −2<sup>2</sup> = −(2 × 2) = −4. Sem parênteses, a potência é calculada antes do sinal de menos.</p>
            </div>`,
        "expoentes-negativos": `
            <div class="pot-aula">
                <h3>Expoente negativo</h3>
                <p>Uma potência com expoente negativo corresponde ao inverso da potência com expoente positivo, desde que a base seja diferente de zero.</p>
                <div class="pot-exemplo">2<sup>−3</sup> = 1 ÷ 2<sup>3</sup> = 1/8</div>
                <p>Para base fracionária, invertemos a fração:</p>
                <div class="pot-exemplo">(2/3)<sup>−2</sup> = (3/2)<sup>2</sup> = 9/4</div>
            </div>`,
        "bases-iguais": `
            <div class="pot-aula">
                <h3>Multiplicação e divisão de potências de mesma base</h3>
                <p><strong>Multiplicação:</strong> conservamos a base e somamos os expoentes.</p>
                <div class="pot-exemplo">a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup></div>
                <p><strong>Divisão:</strong> conservamos a base e subtraímos os expoentes (base diferente de zero).</p>
                <div class="pot-exemplo">a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup></div>
            </div>`,
        "expoentes-inteiros": `
            <div class="pot-aula">
                <h3>Potência de potência</h3>
                <p>Conservamos a base e multiplicamos os expoentes.</p>
                <div class="pot-exemplo">(a<sup>m</sup>)<sup>n</sup> = a<sup>m×n</sup></div>
                <p>Exemplo: (2<sup>3</sup>)<sup>2</sup> = 2<sup>6</sup> = 64.</p>
            </div>`,
        "base-dez": `
            <div class="pot-aula">
                <h3>Potências de base 10</h3>
                <p>As potências de base 10 ajudam a escrever números grandes e pequenos.</p>
                <div class="pot-exemplo">10<sup>1</sup> = 10</div>
                <div class="pot-exemplo">10<sup>2</sup> = 100</div>
                <div class="pot-exemplo">10<sup>3</sup> = 1 000</div>
                <p>Para expoentes naturais, 10 elevado a n é 1 seguido de n zeros.</p>
            </div>`,
        comparacao: `
            <div class="pot-aula">
                <h3>Comparação de potências</h3>
                <p>Para comparar potências, podemos calcular seus valores ou usar propriedades quando as bases ou os expoentes permitem.</p>
                <div class="pot-exemplo">2<sup>3</sup> = 8 e 3<sup>2</sup> = 9</div>
                <p>Logo, 2<sup>3</sup> &lt; 3<sup>2</sup>.</p>
            </div>`,
        "area-volume": `
            <div class="pot-aula">
                <h3>Potenciação na geometria</h3>
                <p>A área de um quadrado de lado l é l<sup>2</sup>.</p>
                <div class="pot-exemplo">A = l × l = l<sup>2</sup></div>
                <p>O volume de um cubo de aresta a é a<sup>3</sup>.</p>
                <div class="pot-exemplo">V = a × a × a = a<sup>3</sup></div>
            </div>`
    };

    function aleatorioPot(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function embaralharPot(lista) {
        return [...lista].sort(() => Math.random() - 0.5);
    }

    function pergunta(enunciado, resposta, explicacao, opcoes = null) {
        return { tipo: "potencia", enunciado, resposta: String(resposta), explicacao, opcoes };
    }

    function gerarQuestoesPotencias(modo, quantidade) {
        const qs = [];
        const adicionar = (q) => qs.push(q);

        if (modo === "conceito") {
            const base = aleatorioPot(2, 9);
            const expo = aleatorioPot(2, 5);
            adicionar(pergunta(
                `Na potência ${base}<sup>${expo}</sup>, qual é a base?`,
                base, "A base é o número que aparece como fator repetido.",
                [base, expo, base + expo, base * expo].map(String)
            ));
            adicionar(pergunta(
                `Na potência 4<sup>3</sup>, qual é o expoente?`,
                3, "O expoente indica quantas vezes a base aparece como fator.",
                ["4", "3", "7", "12"]
            ));
            adicionar(pergunta(
                `Escreva como multiplicação: 3<sup>4</sup>.`,
                "3x3x3x3", "A base 3 aparece quatro vezes como fator."
            ));
            adicionar(pergunta(
                `Calcule: 2<sup>3</sup>.`,
                8, "2 × 2 × 2 = 8."
            ));
        }

        if (modo === "naturais") {
            for (let i = 0; i < quantidade; i++) {
                const base = aleatorioPot(0, 9);
                const expo = aleatorioPot(0, 5);
                const valor = expo === 0 ? (base === 0 ? null : 1) : Math.pow(base, expo);
                if (valor === null || valor > 100000) { i--; continue; }
                adicionar(pergunta(
                    `Calcule: ${base}<sup>${expo}</sup>.`,
                    valor,
                    expo === 0 ? "Todo número diferente de zero elevado a zero é igual a 1." :
                    `${Array(expo).fill(base).join(" × ")} = ${valor}.`
                ));
            }
        }

        if (modo === "sinais" || modo === "pratica-sinais") {
            const exemplos = [
                ["(−3)<sup>2</sup>", 9, "Expoente par: o produto de dois fatores negativos é positivo."],
                ["(−2)<sup>3</sup>", -8, "Expoente ímpar: sobra um fator negativo."],
                ["−4<sup>2</sup>", -16, "Sem parênteses, calculamos 4² primeiro e mantemos o sinal de menos."],
                ["−(−3)<sup>2</sup>", -9, "Calculamos (−3)² = 9 e depois aplicamos o sinal de menos."],
                ["(−2)<sup>4</sup>", 16, "Expoente par produz resultado positivo."],
                ["(−1)<sup>7</sup>", -1, "A base −1 elevada a expoente ímpar resulta em −1."],
                ["(−1)<sup>8</sup>", 1, "A base −1 elevada a expoente par resulta em 1."],
                ["+(−3)<sup>3</sup>", -27, "O sinal positivo não altera o resultado da potência."]
            ];
            const lista = modo === "sinais" ? exemplos.slice(0, 4) : exemplos;
            while (qs.length < quantidade) {
                const e = lista[aleatorioPot(0, lista.length - 1)];
                adicionar(pergunta(`Calcule: ${e[0]}.`, e[1], e[2]));
            }
        }

        if (modo === "expoentes-negativos") {
            const exemplos = [
                [2, -1, "1/2"], [2, -2, "1/4"], [2, -3, "1/8"],
                [3, -1, "1/3"], [3, -2, "1/9"], [5, -1, "1/5"],
                [4, -2, "1/16"], [10, -2, "1/100"]
            ];
            while (qs.length < quantidade) {
                const e = exemplos[aleatorioPot(0, exemplos.length - 1)];
                adicionar(pergunta(
                    `Calcule ${e[0]}<sup>${e[1]}</sup>. Escreva o resultado como fração.`,
                    e[2], `Expoente negativo indica o inverso: 1/${e[0]}<sup>${Math.abs(e[1])}</sup>.`
                ));
            }
        }

        if (modo === "bases-iguais") {
            const tipos = ["mult", "div"];
            while (qs.length < quantidade) {
                const tipo = tipos[aleatorioPot(0, 1)];
                const base = aleatorioPot(2, 5);
                const m = aleatorioPot(1, 4);
                const n = aleatorioPot(1, 4);
                const exp = tipo === "mult" ? m + n : m + n;
                const resp = tipo === "mult" ? Math.pow(base, exp) : Math.pow(base, m);
                const texto = tipo === "mult"
                    ? `${base}<sup>${m}</sup> × ${base}<sup>${n}</sup>`
                    : `${base}<sup>${m+n}</sup> ÷ ${base}<sup>${n}</sup>`;
                adicionar(pergunta(
                    `Simplifique e calcule: ${texto}.`,
                    resp,
                    tipo === "mult"
                        ? `Na multiplicação de potências de mesma base, somamos os expoentes: ${m} + ${n} = ${exp}.`
                        : `Na divisão, subtraímos os expoentes: ${m+n} − ${n} = ${m}.`
                ));
            }
        }

        if (modo === "expoentes-inteiros") {
            while (qs.length < quantidade) {
                const base = aleatorioPot(2, 4);
                const m = aleatorioPot(1, 3);
                const n = aleatorioPot(2, 3);
                const exp = m * n;
                adicionar(pergunta(
                    `Calcule: (${base}<sup>${m}</sup>)<sup>${n}</sup>.`,
                    Math.pow(base, exp),
                    `Na potência de potência, multiplicamos os expoentes: ${m} × ${n} = ${exp}.`
                ));
            }
        }

        if (modo === "base-dez") {
            while (qs.length < quantidade) {
                const expo = aleatorioPot(0, 6);
                adicionar(pergunta(
                    `Calcule: 10<sup>${expo}</sup>.`,
                    Math.pow(10, expo),
                    `10 elevado a ${expo} é 1 seguido de ${expo} zero(s).`
                ));
            }
        }

        if (modo === "comparacao") {
            while (qs.length < quantidade) {
                const pares = [
                    [2, 3, 3, 2], [2, 4, 4, 2], [3, 2, 2, 3],
                    [2, 5, 5, 2], [3, 3, 2, 4], [4, 2, 2, 4]
                ];
                const p = pares[aleatorioPot(0, pares.length - 1)];
                const a = Math.pow(p[0], p[1]);
                const b = Math.pow(p[2], p[3]);
                const sinal = a > b ? ">" : a < b ? "<" : "=";
                adicionar(pergunta(
                    `Complete com &lt;, &gt; ou =: ${p[0]}<sup>${p[1]}</sup> ___ ${p[2]}<sup>${p[3]}</sup>.`,
                    sinal,
                    `Os valores são ${a} e ${b}, respectivamente.`
                ));
            }
        }

        if (modo === "area-volume") {
            while (qs.length < quantidade) {
                const medida = aleatorioPot(2, 8);
                if (Math.random() < 0.5) {
                    adicionar(pergunta(
                        `Um quadrado tem lado de ${medida} cm. Qual é sua área em cm²?`,
                        medida * medida,
                        `A = lado² = ${medida}² = ${medida * medida} cm².`
                    ));
                } else {
                    adicionar(pergunta(
                        `Um cubo tem aresta de ${medida} cm. Qual é seu volume em cm³?`,
                        medida ** 3,
                        `V = aresta³ = ${medida}³ = ${medida ** 3} cm³.`
                    ));
                }
            }
        }

        return embaralharPot(qs).slice(0, quantidade);
    }

    function normalizarResposta(valor) {
        return String(valor ?? "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[−–]/g, "-")
            .replace(/×/g, "x")
            .replace(/,/g, ".");
    }

    function configurarPotencias() {
        estado.opcoes = {
            quantidade: 10
        };
        estado.ultimaConfiguracao = {
            operacao: "potencias",
            modalidade: estado.modalidade,
            opcoes: { quantidade: 10 }
        };
    }

    function mostrarConfiguracaoPotencias(id, botao) {
        estado.modalidade = id;
        document.querySelectorAll(".modalidade").forEach(b => b.classList.remove("selecionada"));
        botao?.classList.add("selecionada");

        const nome = MODOS_POTENCIAS.find(m => m[0] === id)?.[1] || "Potenciação";
        $("tituloConfiguracao").textContent = nome;

        $("opcoesConfiguracao").innerHTML = `
            ${explicacoes[id] || ""}
            <p class="pot-label">Quantidade de questões</p>
            <select id="quantidade">
                <option value="10">10 questões</option>
                <option value="20">20 questões</option>
                <option value="30">30 questões</option>
            </select>
            <p class="pot-observacao">Nas questões de resposta aberta, digite apenas o resultado. Nas frações, use o formato 1/2.</p>
        `;
        $("configuracao").classList.remove("escondida");
    }

    function mostrarQuestaoPotencias() {
        if (estado.indice >= estado.questoes.length) {
            finalizarAtividade();
            return;
        }

        const q = estado.questoes[estado.indice];
        estado.errou = false;
        estado.respostaConferida = false;
        estado.campoAtivo = null;

        $("feedback").textContent = "";
        $("numeroQuestao").textContent = `Questão ${estado.indice + 1} de ${estado.questoes.length}`;
        $("instrucaoQuestao").textContent = "Resolva a questão:";
        $("barraQuestao").style.width = `${estado.indice / estado.questoes.length * 100}%`;

        $("areaQuestao").innerHTML = `
            <div class="pot-questao">
                <div class="pot-enunciado">${q.enunciado}</div>
                ${q.opcoes ? `
                    <div class="pot-alternativas">
                        ${embaralharPot(q.opcoes).map(op => `
                            <button type="button" class="pot-alternativa" data-pot-opcao="${op}">${op}</button>
                        `).join("")}
                    </div>
                ` : `
                    <label class="pot-label" for="respostaPotencia">Sua resposta</label>
                    <input id="respostaPotencia" class="pot-input" autocomplete="off" inputmode="text">
                `}
            </div>
            <div class="area-botao-ok">
                <button type="button" class="botao-ok-resposta" onclick="confirmarAtividade()">OK ✅</button>
            </div>
        `;

        $("acoesQuestao").innerHTML = `
            <button class="botao-secundario" onclick="pularQuestao()">Pular questão</button>
        `;
        $("teclado").innerHTML = "";

        document.querySelectorAll("[data-pot-opcao]").forEach(b => {
            b.addEventListener("click", () => {
                document.querySelectorAll("[data-pot-opcao]").forEach(x => x.classList.remove("pot-escolhida"));
                b.classList.add("pot-escolhida");
                estado.campoAtivo = b;
            });
        });

        const input = $("respostaPotencia");
        if (input) {
            input.addEventListener("keydown", e => {
                if (e.key === "Enter") confirmarAtividade();
            });
            input.focus();
            estado.campoAtivo = input;
        }
    }

    function conferirPotencias() {
        if (estado.respostaConferida) return;

        const q = estado.questoes[estado.indice];
        const selecionada = document.querySelector(".pot-alternativa.pot-escolhida");
        const input = $("respostaPotencia");
        const resposta = selecionada ? selecionada.dataset.potOpcao : input?.value;

        if (!String(resposta ?? "").trim()) {
            $("feedback").textContent = "Escolha uma alternativa ou digite sua resposta.";
            return;
        }

        const correto = normalizarResposta(resposta) === normalizarResposta(q.resposta);

        if (correto) {
            estado.respostaConferida = true;
            $("feedback").textContent = `Resposta correta! ✅ ${q.explicacao}`;
            estado.resultados.push({ correto: true, corrigida: estado.errou });
            document.querySelectorAll("#areaQuestao input, #areaQuestao button").forEach(c => c.disabled = true);
            setTimeout(() => {
                estado.indice++;
                mostrarQuestaoPotencias();
            }, 1700);
        } else {
            estado.errou = true;
            $("feedback").textContent = "Ainda não. Revise o conteúdo e tente novamente.";
            $("acoesQuestao").innerHTML = `
                <button class="botao-principal" onclick="tentarNovamentePotencias()">Tentar novamente</button>
                <button class="botao-secundario" onclick="pularQuestao()">Pular questão</button>
            `;
        }
    }

    window.tentarNovamentePotencias = function() {
        $("feedback").textContent = "";
        $("acoesQuestao").innerHTML = `<button class="botao-secundario" onclick="pularQuestao()">Pular questão</button>`;
        $("respostaPotencia")?.focus();
    };

    // Intercepta somente a navegação da nova área.
    window.abrirOperacao = function(op) {
        if (op !== "potencias") return abrirOperacaoOriginal(op);

        pararCronometro();
        estado.operacao = "potencias";
        estado.modalidade = "";
        $("tituloOperacao").textContent = "Potenciação";
        $("descricaoOperacao").textContent = "Estude a explicação e pratique cada etapa.";
        $("menuQuatroOperacoes")?.classList.add("escondida");
        $("listaModalidades").classList.remove("escondida");
        $("configuracao").classList.add("escondida");
        $("listaModalidades").innerHTML = MODOS_POTENCIAS.map(([id, nome]) => `
            <button class="modalidade" onclick="selecionarModalidade('${id}',this)">${nome}</button>
        `).join("");
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
        if (estado.operacao !== "potencias") return iniciarAtividadeOriginal();

        try {
            const quantidade = Number($("quantidade")?.value || 10);
            estado.opcoes = { quantidade };
            estado.ultimaConfiguracao = {
                operacao: "potencias",
                modalidade: estado.modalidade,
                opcoes: { quantidade }
            };
            estado.questoes = gerarQuestoesPotencias(estado.modalidade, quantidade);
            estado.indice = 0;
            estado.resultados = [];
            estado.errou = false;
            estado.respostaConferida = false;
            mostrarTela("estudo");
            iniciarCronometro();
            mostrarQuestaoPotencias();
        } catch (e) {
            alert("Não foi possível iniciar esta atividade: " + e.message);
        }
    };

    window.mostrarQuestao = function() {
        if (estado.operacao === "potencias") return mostrarQuestaoPotencias();
        return mostrarQuestaoOriginal();
    };

    window.confirmarAtividade = function() {
        if (estado.operacao === "potencias") return conferirPotencias();
        return confirmarAtividadeOriginal();
    };

    window.revisarAtividade = function() {
        if (estado.operacao !== "potencias") return revisarAtividadeOriginal();

        if (!estado.ultimaConfiguracao) return novoEstudoOriginal();
        estado.operacao = "potencias";
        estado.modalidade = estado.ultimaConfiguracao.modalidade;
        estado.opcoes = { ...estado.ultimaConfiguracao.opcoes };
        estado.questoes = gerarQuestoesPotencias(estado.modalidade, estado.opcoes.quantidade);
        estado.indice = 0;
        estado.resultados = [];
        estado.errou = false;
        estado.respostaConferida = false;
        mostrarTela("estudo");
        iniciarCronometro();
        mostrarQuestaoPotencias();
    };

    // CSS específico do módulo.
    const estilo = document.createElement("style");
    estilo.textContent = `
        .pot-aula { background:#f4f8ff; border:1px solid #d9e6f7; border-radius:12px; padding:14px; margin:12px 0 18px; line-height:1.55; }
        .pot-aula h3 { margin-top:0; color:#285da8; }
        .pot-exemplo { background:#fff; border-radius:9px; padding:10px; margin:9px 0; text-align:center; font-size:1.2rem; font-weight:700; }
        .pot-label { display:block; font-weight:700; margin:12px 0 7px; }
        .pot-observacao { color:#64748b; font-size:.9rem; }
        .pot-questao { padding:18px 12px; background:#f8faff; border:1px solid #dce6f4; border-radius:14px; }
        .pot-enunciado { font-size:1.25rem; line-height:1.6; text-align:center; font-weight:700; }
        .pot-input { display:block; width:min(100%,320px); box-sizing:border-box; margin:8px auto; padding:13px; border:2px solid #b8cbe5; border-radius:10px; font-size:1.2rem; text-align:center; }
        .pot-alternativas { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-top:16px; }
        .pot-alternativa { padding:13px 8px; border:2px solid #dce6f4; border-radius:10px; background:white; font-size:1.1rem; }
        .pot-alternativa.pot-escolhida { border-color:#285da8; background:#edf4ff; }
        .pot-questao sup, .pot-aula sup { font-size:.72em; }
        @media(max-width:420px){ .pot-enunciado{font-size:1.1rem;} .pot-alternativas{gap:7px;} }
    `;
    document.head.appendChild(estilo);

    // Atualiza os textos iniciais, agora considerando as novas modalidades.
    document.addEventListener("DOMContentLoaded", () => {
        const total = Object.values(modalidades).reduce((s, lista) => s + lista.length, 0);
        $("textoProgresso").textContent = `0 de ${total} modalidades dominadas`;
        $("qtdNaoIniciadas").textContent = total;
        $("faltam").textContent = `Faltam ${total} modalidades para dominar tudo.`;
    });
})();
