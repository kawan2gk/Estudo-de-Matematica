
function mostrarQuestaoPotencias() {
    if (temporizadorSolucaoPot) {
        clearTimeout(temporizadorSolucaoPot);
        temporizadorSolucaoPot = null;
    }

    if (estado.indice >= estado.questoes.length) {
        pararCronometro();
        estado.modalidade = estado.modalidade || "conceito";
        finalizarAtividade();
        return;
    }

    const q = estado.questoes[estado.indice];

    estado.respostaConferida = false;
    estado.errou = false;

    // Identificadores corrigidos conforme o index.html
    const numeroQuestao = $("numeroQuestao");
    const instrucaoQuestao = $("instrucaoQuestao");

    if (!numeroQuestao || !instrucaoQuestao) {
        console.error(
            "Elementos numeroQuestao ou instrucaoQuestao não encontrados no HTML."
        );
        return;
    }

    numeroQuestao.textContent =
        `Questão ${estado.indice + 1} de ${estado.questoes.length}`;

    instrucaoQuestao.innerHTML = q.enunciado;

    $("feedback").textContent = "";

    $("areaQuestao").innerHTML = `
        <div class="pot-questao">

            ${q.exemplo ? `
                <div class="pot-exemplo-ajuda">
                    ${q.exemplo}
                </div>
            ` : ""}

            ${q.escolhaSinal ? `
                <div class="pot-valor-absoluto">
                    Escolha o sinal do resultado:
                </div>

                <div class="pot-sinais-resposta">
                    <button type="button" class="pot-alternativa"
                        data-pot-sinal="positivo">
                        Positivo (+)
                    </button>

                    <button type="button" class="pot-alternativa"
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
        <button class="botao-secundario"
            onclick="pularQuestaoPotencias()">
            Pular questão
        </button>
    `;

    if (q.escolhaSinal) {
        document.querySelectorAll("[data-pot-sinal]").forEach(b => {
            b.onclick = () => {
                document.querySelectorAll("[data-pot-sinal]").forEach(x => {
                    x.classList.remove("pot-escolhida");
                });

                b.classList.add("pot-escolhida");
            };
        });
    } else {
        const input = $("respostaPotencia");

        input.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                confirmarAtividade();
            }
        });

        input.focus();
        estado.campoAtivo = input;
    }

    montarTecladoPotencias();
}
