```javascript
                );
                else adicionar(
                    `Escreva como multiplicação: ${base}<sup>${expo}</sup>.`,
                    Array(expo).fill(base).join("×"),
                    `A base ${base} aparece ${expo} vezes: ${Array(expo).fill(base).join(" × ")}.`,
                    { exemplo: "Exemplo de como escrever: a⁵ = a × a × a × a × a", respostaTexto: true }
                );
            }
        }

        else if (modo === "naturais") {
            const expoentes = opcoes.expoentes?.length ? opcoes.expoentes : [3];
            const bases = opcoes.bases?.length ? opcoes.bases : [10];

            for (let i = 0; i < quantidade; i++) {
                const expo = Number(expoentes[aleatorioPot(0, expoentes.length - 1)]);
                let maxBase = expo === 2 ? 12 : 10;
                if (bases.includes(5)) maxBase = Math.min(maxBase, 5);
                if (bases.includes(10)) maxBase = Math.min(maxBase, 10);
                const base = aleatorioPot(0, maxBase);
                const resultado = base ** expo;
                adicionar(
                    `Calcule: ${base}<sup>${expo}</sup>.`,
                    resultado,
                    `${base}<sup>${expo}</sup> = ${Array(expo).fill(base).join(" × ")} = ${resultado}.`
                );
            }
        }

        else if (modo === "sinais" || modo === "pratica-sinais") {
            const expoentes = opcoes.expoentes?.length ? opcoes.expoentes : [3];
            const bases = opcoes.bases?.length ? opcoes.bases : [10];
            const formatos = opcoes.formatos?.length
                ? opcoes.formatos
                : (modo === "sinais" ? ["mais-parenteses", "menos-parenteses", "menos-sem-parenteses"] : ["mais-parenteses", "menos-parenteses", "sem-sinal"]);

            for (let i = 0; i < quantidade; i++) {
                const expo = Number(expoentes[aleatorioPot(0, expoentes.length - 1)]);
                let maxBase = expo === 2 ? 12 : 10;
                if (bases.includes(5)) maxBase = Math.min(maxBase, 5);
                if (bases.includes(10)) maxBase = Math.min(maxBase, 10);
                let base = aleatorioPot(-maxBase, maxBase);
                if (expo === 0 && base === 0) base = 1;

                const formato = formatos[aleatorioPot(0, formatos.length - 1)];
                let expressao = "";
                let valor = 0;
                let explicacao = "";

                if (formato === "mais-parenteses") {
                    expressao = `+${formatarBasePot(base)}<sup>${expo}</sup>`;
                    valor = base ** expo;
                    const fatores = Array(expo).fill(formatarBasePot(base)).join(" × ");
                    explicacao = `Primeiro calculamos a potência: ${fatores || "1"} = ${valor}. O sinal de + que está fora dos parênteses mantém o resultado: +${valor}.`;
                } else if (formato === "menos-parenteses") {
                    expressao = `−${formatarBasePot(base)}<sup>${expo}</sup>`;
                    valor = -(base ** expo);
                    const fatores = Array(expo).fill(formatarBasePot(base)).join(" × ");
                    explicacao = `Primeiro calculamos a potência: ${fatores || "1"} = ${base ** expo}. Depois aplicamos o sinal de menos que está fora dos parênteses: ${valor}.`;
                } else if (formato === "menos-sem-parenteses") {
                    expressao = `−${Math.abs(base)}<sup>${expo}</sup>`;
                    valor = -(Math.abs(base) ** expo);
                    explicacao = `Sem parênteses, calculamos primeiro ${Math.abs(base)}<sup>${expo}</sup> = ${Math.abs(base) ** expo}. Depois aplicamos o sinal de menos: ${valor}.`;
                } else {
                    expressao = base < 0 ? `(−${Math.abs(base)})<sup>${expo}</sup>` : `${base}<sup>${expo}</sup>`;
                    valor = base ** expo;
                    const fatores = Array(expo).fill(formatarBasePot(base)).join(" × ");
                    explicacao = `Calculamos a potência: ${fatores || "1"} = ${valor}.`;
                }

                if (modo === "sinais") {
                    adicionar(
                        `Observe a expressão <strong>${expressao}</strong>. O resultado será positivo ou negativo?`,
                        valor < 0 ? "negativo" : "positivo",
                        `${explicacao} Portanto, o resultado é ${valor < 0 ? "negativo" : "positivo"}.`,
                        { escolhaSinal: true }
                    );
                } else {
                    adicionar(
                        `Calcule o valor da expressão: <strong>${expressao}</strong>.`,
                        valor,
                        explicacao
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
                } else if (modo === "bases-iguais") {
                    const e1 = aleatorioPot(1, 4);
                    const e2 = aleatorioPot(1, 4);
                    adicionar(
                        `Simplifique: ${base}<sup>${e1}</sup> × ${base}<sup>${e2}</sup>.`,
                        `${base}<sup>${e1 + e2}</sup>`,
                        `Na multiplicação de potências de mesma base, somamos os expoentes: ${e1} + ${e2} = ${e1 + e2}.`
                    );
                } else if (modo === "expoentes-inteiros") {
                    const e1 = aleatorioPot(2, 3);
                    const e2 = aleatorioPot(2, 3);
                    adicionar(
                        `Simplifique: (${base}<sup>${e1}</sup>)<sup>${e2}</sup>.`,
                        `${base}<sup>${e1 * e2}</sup>`,
                        `Na potência de potência, multiplicamos os expoentes: ${e1} × ${e2} = ${e1 * e2}.`
                    );
                } else if (modo === "base-dez") {
                    const e = aleatorioPot(1, 5);
                    adicionar(
                        `Calcule: 10<sup>${e}</sup>.`,
                        `1${"0".repeat(e)}`,
                        `10 elevado a ${e} é 1 seguido de ${e} zeros.`
                    );
                } else if (modo === "comparacao") {
                    const a = aleatorioPot(2, 5);
                    const b = aleatorioPot(2, 5);
                    const x = a ** expo;
                    const y = b ** expo;
                    adicionar(
                        `Complete com &gt;, &lt; ou =: ${a}<sup>${expo}</sup> ___ ${b}<sup>${expo}</sup>.`,
                        x > y ? ">" : x < y ? "<" : "=",
                        `${a}<sup>${expo}</sup> = ${x} e ${b}<sup>${expo}</sup> = ${y}. Portanto, ${x} ${x > y ? ">" : x < y ? "<" : "="} ${y}.`
                    );
                } else if (modo === "area-volume") {
                    const medida = aleatorioPot(2, 10);
                    const tipo = i % 2;
                    if (tipo === 0) adicionar(
                        `Um quadrado tem lado de ${medida} cm. Qual é sua área?`,
                        `${medida ** 2}`,
                        `A área do quadrado é lado × lado: ${medida} × ${medida} = ${medida ** 2} cm².`
                    );
                    else adicionar(
                        `Um cubo tem aresta de ${medida} cm. Qual é seu volume?`,
                        `${medida ** 3}`,
                        `O volume do cubo é aresta × aresta × aresta: ${medida} × ${medida} × ${medida} = ${medida ** 3} cm³.`
                    );
                }
            }
        }

        return embaralharPot(qs).slice(0, quantidade);
    }

    let temporizadorSolucaoPot = null;

    function lerConfiguracaoPotencias() {
        const quantidade = Number($("quantidadeQuestoes")?.value || 10);
        const o = { quantidade };

        if (estado.modalidade === "naturais") {
            const exp = marcadosPot("expoente").map(Number);
            const bas = marcadosPot("base").map(Number);
            o.expoentes = exp.length ? exp : [3];
            o.bases = bas.length ? bas : (exp.length ? [12] : [10]);
        }

        if (estado.modalidade === "sinais" || estado.modalidade === "pratica-sinais") {
            const exp = marcadosPot("expoente").map(Number);
            const bas = marcadosPot("base").map(Number);
            o.expoentes = exp.length ? exp : [3];
            o.bases = bas.length ? bas : (exp.length ? [12] : [10]);
            o.formatos = marcadosPot("formato");
            if (!o.formatos.length) {
                o.formatos = estado.modalidade === "sinais"
                    ? ["mais-parenteses", "menos-parenteses", "menos-sem-parenteses"]
                    : ["mais-parenteses", "menos-parenteses", "sem-sinal"];
            }
        }

        return o;
    }

    function mostrarConfiguracaoPotencias(id, botao) {
        estado.modalidade = id;
        document.querySelectorAll("#listaModalidades .modalidade").forEach(b => b.classList.remove("ativa"));
        botao?.classList.add("ativa");

        const explicacao = explicacoes[id] || "";
        const opcoes = id === "naturais" ? `
            <div class="pot-grupo">
                <strong>Escolha os expoentes que deseja praticar:</strong>
                <label class="pot-check"><input type="checkbox" name="expoente" value="0"> Potência de 0</label>
                <label class="pot-check"><input type="checkbox" name="expoente" value="1"> Potência de 1</label>
                <label class="pot-check"><input type="checkbox" name="expoente" value="2"> Potência de 2</label>
                <label class="pot-check"><input type="checkbox" name="expoente" value="3"> Potência de 3</label>
            </div>
            <div class="pot-grupo">
                <strong>Limite das bases:</strong>
                <label class="pot-check"><input type="checkbox" name="base" value="5"> Bases até 5</label>
                <label class="pot-check"><input type="checkbox" name="base" value="10"> Bases até 10</label>
                <p class="pot-observacao">Sem seleção, serão usadas potências de expoente 3 e bases até 10. Para expoente 2, a base poderá chegar a 12 quando não houver limite menor selecionado.</p>
            </div>` : "";

        const opcoesInteiros = (id === "sinais" || id === "pratica-sinais") ? `
            <div class="pot-grupo">
                <strong>Escolha os expoentes:</strong>
                <label class="pot-check"><input type="checkbox" name="expoente" value="0"> Expoente 0</label>
                <label class="pot-check"><input type="checkbox" name="expoente" value="1"> Expoente 1</label>
                <label class="pot-check"><input type="checkbox" name="expoente" value="2"> Expoente 2</label>
                <label class="pot-check"><input type="checkbox" name="expoente" value="3"> Expoente 3</label>
            </div>
            <div class="pot-grupo">
                <strong>Limite das bases:</strong>
                <label class="pot-check"><input type="checkbox" name="base" value="5"> Bases de −5 até +5</label>
                <label class="pot-check"><input type="checkbox" name="base" value="10"> Bases de −10 até +10</label>
            </div>
            <div class="pot-grupo">
                <strong>Escolha os formatos das expressões:</strong>
                ${id === "sinais" ? `
                    <label class="pot-check"><input type="checkbox" name="formato" value="mais-parenteses"> +(a)<sup>b</sup></label>
                    <label class="pot-check"><input type="checkbox" name="formato" value="menos-parenteses"> −(a)<sup>b</sup></label>
                    <label class="pot-check"><input type="checkbox" name="formato" value="menos-sem-parenteses"> −a<sup>b</sup></label>
                ` : `
                    <label class="pot-check"><input type="checkbox" name="formato" value="menos-parenteses"> −(a)<sup>b</sup></label>
                    <label class="pot-check"><input type="checkbox" name="formato" value="mais-parenteses"> +(a)<sup>b</sup></label>
                    <label class="pot-check"><input type="checkbox" name="formato" value="sem-sinal"> a<sup>b</sup></label>
                `}
            </div>
            <p class="pot-observacao">Sem seleção, serão usados expoente 3, bases de −10 a +10 e todos os formatos disponíveis nesta atividade.</p>` : "";

        $("opcoesConfiguracao").innerHTML = `
            ${explicacao}
            ${opcoes}
            ${opcoesInteiros}
            <label class="pot-label" for="quantidadeQuestoes">Quantidade de questões:</label>
            <select id="quantidadeQuestoes" class="campo-configuracao">
                <option value="5">5 questões</option>
                <option value="10" selected>10 questões</option>
                <option value="15">15 questões</option>
                <option value="20">20 questões</option>
            </select>
            <button class="botao-principal" onclick="iniciarAtividade()">Começar atividade</button>
        `;

        const config = $("configuracao");
        const lista = $("listaModalidades");
        const item = botao?.closest(".modalidade");
        if (config && item) item.insertAdjacentElement("afterend", config);
        config?.classList.remove("escondida");
        lista?.classList.remove("escondida");
    }

    function montarTecladoPotencias() {
        const teclado = $("teclado");
        if (!teclado) return;
        const teclas = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "-", "×", "C", "⌫"];
        teclado.innerHTML = teclas.map(t =>
            `<button type="button" class="pot-tecla" onclick="digitarPotencia('${t}')">${t}</button>`
        ).join("");
        teclado.classList.remove("escondida");
    }

    window.digitarPotencia = function(valor) {
        const input = $("respostaPotencia");
        if (!input || input.disabled) return;
        if (valor === "C") input.value = "";
        else if (valor === "⌫") input.value = input.value.slice(0, -1);
        else input.value += valor === "×" ? "x" : valor;
        input.focus();
    };

    function mostrarQuestaoPotencias() {
        if (temporizadorSolucaoPot) { clearTimeout(temporizadorSolucaoPot); temporizadorSolucaoPot = null; }

        if (estado.indice >= estado.questoes.length) {
            pararCronometro();
            estado.modalidade = estado.modalidade || "conceito";
            finalizarAtividade();
            return;
        }

        const q = estado.questoes[estado.indice];
        estado.respostaConferida = false;
        estado.errou = false;

        $("progressoQuestao").textContent = `Questão ${estado.indice + 1} de ${estado.questoes.length}`;
        $("enunciado").innerHTML = q.enunciado;
        $("feedback").textContent = "";
        $("areaQuestao").innerHTML = `
            <div class="pot-questao">
                ${q.exemplo ? `<div class="pot-exemplo-ajuda">${q.exemplo}</div>` : ""}
                ${q.escolhaSinal ? `
                    <div class="pot-valor-absoluto">Escolha o sinal do resultado:</div>
                    <div class="pot-sinais-resposta">
                        <button type="button" class="pot-alternativa" data-pot-sinal="positivo">Positivo (+)</button>
                        <button type="button" class="pot-alternativa" data-pot-sinal="negativo">Negativo (−)</button>
                    </div>
                ` : `
                    <label class="pot-label" for="respostaPotencia">Sua resposta:</label>
                    <input id="respostaPotencia" class="pot-input" type="text" autocomplete="off" inputmode="text" placeholder="Digite sua resposta">
                `}
            </div>`;
        $("acoesQuestao").innerHTML = `<button class="botao-secundario" onclick="pularQuestaoPotencias()">Pular questão</button>`;
        if (q.escolhaSinal) {
            document.querySelectorAll("[data-pot-sinal]").forEach(b => b.onclick = () => {
                document.querySelectorAll("[data-pot-sinal]").forEach(x => x.classList.remove("pot-escolhida"));
                b.classList.add("pot-escolhida");
            });
        } else {
            const input = $("respostaPotencia");
            input.addEventListener("keydown", e => { if (e.key === "Enter") confirmarAtividade(); });
            input.focus();
            estado.campoAtivo = input;
        }
        montarTecladoPotencias();
    }

    function normalizarPot(valor) {
        return String(valor ?? "").trim().toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[−–]/g, "-")
            .replace(/[×·*]/g, "x")
            .replace(/,/g, ".");
    }

    function conferirPotencias() {
        if (estado.respostaConferida) return;
        const q = estado.questoes[estado.indice];
        const selecionada = document.querySelector("[data-pot-sinal].pot-escolhida");
        const resposta = selecionada ? selecionada.dataset.potSinal : $("respostaPotencia")?.value;

        if (!String(resposta ?? "").trim()) {
            $("feedback").textContent = "Escolha uma opção ou digite sua resposta.";
            return;
        }

        if (normalizarPot(resposta) === normalizarPot(q.resposta)) {
            estado.respostaConferida = true;
            $("feedback").textContent = `Resposta correta! ✅ ${q.explicacao}`;
            estado.resultados.push({ correto: true, corrigida: estado.errou });
            document.querySelectorAll("#areaQuestao input, #areaQuestao button").forEach(c => c.disabled = true);
            setTimeout(() => {
                estado.indice++;
                mostrarQuestaoPotencias();
            }, 1500);
        } else {
            estado.errou = true;
            $("feedback").textContent = "Resposta incorreta. Tente novamente ou consulte a resolução.";
            $("acoesQuestao").innerHTML = `
                <button class="botao-principal" onclick="tentarNovamentePotencias()">Tentar novamente</button>
                <button class="botao-secundario" onclick="entenderRespostaPotencias()">Entender a resposta correta</button>
                <button class="botao-secundario" onclick="pularQuestaoPotencias()">Pular questão</button>`;
        }
    }

    function entenderRespostaPotencias() {
        if (estado.respostaConferida) return;
        const q = estado.questoes[estado.indice];
        estado.respostaConferida = true;
        $("feedback").innerHTML = `
            <div class="pot-solucao">
                <strong>Entenda a resolução:</strong>
                <p>${q.explicacao}</p>
                <p><strong>Resposta correta:</strong> ${q.resposta}</p>
                <small>Avançando em 3 segundos...</small>
            </div>`;
        $("acoesQuestao").innerHTML = "";
        document.querySelectorAll("#areaQuestao input, #areaQuestao button").forEach(c => c.disabled = true);

        temporizadorSolucaoPot = setTimeout(() => {
            estado.resultados.push({ correto: false, corrigida: false, pulada: true });
            estado.indice++;
            temporizadorSolucaoPot = null;
            mostrarQuestaoPotencias();
        }, 3000);
    }

    function pularQuestaoPotencias() {
        if (estado.respostaConferida) return;
        estado.resultados.push({ correto: false, corrigida: false, pulada: true });
        estado.indice++;
        mostrarQuestaoPotencias();
    }

    window.tentarNovamentePotencias = function() {
        $("feedback").textContent = "";
        $("acoesQuestao").innerHTML = `<button class="botao-secundario" onclick="pularQuestaoPotencias()">Pular questão</button>`;
        const input = $("respostaPotencia");
        if (input) {
            input.value = "";
            input.focus();
            estado.campoAtivo = input;
        }
        document.querySelectorAll("[data-pot-sinal]").forEach(b => b.classList.remove("pot-escolhida"));
    };

    window.entenderRespostaPotencias = entenderRespostaPotencias;
    window.pularQuestaoPotencias = pularQuestaoPotencias;

    // Intercepta somente a navegação da nova área.
    window.abrirOperacao = function(op) {
        restaurarConfiguracaoPotencias();
        if (op !== "potencias") return abrirOperacaoOriginal(op);

        pararCronometro();
        if (temporizadorSolucaoPot) {
            clearTimeout(temporizadorSolucaoPot);
            temporizadorSolucaoPot = null;
        }

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
            const opcoes = lerConfiguracaoPotencias();
            const quantidade = opcoes.quantidade;
            estado.opcoes = opcoes;
            estado.ultimaConfiguracao = {
                operacao: "potencias",
                modalidade: estado.modalidade,
                opcoes: JSON.parse(JSON.stringify(opcoes))
            };
            estado.questoes = gerarQuestoesPotencias(estado.modalidade, quantidade, opcoes);
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

    window.novoEstudo = function() {
        if (estado.operacao !== "potencias") return novoEstudoOriginal();
        pararCronometro();
        if (temporizadorSolucaoPot) {
            clearTimeout(temporizadorSolucaoPot);
            temporizadorSolucaoPot = null;
        }
        restaurarConfiguracaoPotencias();
        window.abrirOperacao("potencias");
    };

    window.revisarAtividade = function() {
        if (estado.operacao !== "potencias") return revisarAtividadeOriginal();

        if (!estado.ultimaConfiguracao) return novoEstudoOriginal();
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

    // CSS específico do módulo.
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
        }
        .pot-questao {
            padding: 18px 12px;
            background: #f8faff;
            border: 1px solid #dce6f4;
            border-radius: 14px;
        }
        .pot-enunciado {
            font-size: 1.25rem;
            line-height: 1.6;
            text-align: center;
            font-weight: 700;
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
        .pot-alternativas {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            margin-top: 16px;
        }
        .pot-alternativa {
            padding: 13px 8px;
            border: 2px solid #dce6f4;
            border-radius: 10px;
            background: white;
            font-size: 1.1rem;
        }
        .pot-alternativa.pot-escolhida {
            border-color: #285da8;
            background: #edf4ff;
        }
        .pot-questao sup, .pot-aula sup {
            font-size: .72em;
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
        .pot-exemplo-ajuda {
            margin: 12px 0;
            padding: 12px;
            border-radius: 10px;
            background: #fff3ce;
            text-align: center;
            line-height: 1.6;
        }
        .pot-valor-absoluto {
            margin: 12px auto;
            padding: 10px;
            background: #fff;
            border-radius: 9px;
        }
        .pot-sinais-resposta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 15px;
        }
        .pot-solucao {
            padding: 10px;
            background: #fff3ce;
            border-radius: 10px;
            line-height: 1.5;
        }
        .pot-tecla {
            min-height: 48px;
            border: 1px solid #d9e0e8;
            border-radius: 10px;
            background: white;
            font-size: 19px;
            font-weight: bold;
        }
        #teclado:has(.pot-tecla) {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 8px;
            max-width: 420px;
            margin: 18px auto;
        }
        @media (max-width: 420px) {
            .pot-enunciado { font-size: 1.1rem; }
            .pot-alternativas { gap: 7px; }
        }
    `;
    document.head.appendChild(estilo);

    // Atualiza os textos iniciais, agora considerando as novas modalidades.
    atualizarDesempenho();
})();
