
function mostrarQuestao() {
    if (estado.indice >= estado.questoes.length) {
        finalizarAtividade();
        return;
    }

    const q = estado.questoes[estado.indice];

    estado.errou = false;
    estado.campoAtivo = null;

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

    // Botão OK logo abaixo da área de resposta.
    $("areaQuestao").insertAdjacentHTML("beforeend", `
        <div class="area-botao-ok">
            <button type="button"
                class="botao-ok-resposta"
                onclick="confirmarAtividade()">
                OK ✅
            </button>
        </div>
    `);

    // Mantém apenas o botão de pular abaixo do teclado.
    $("acoesQuestao").innerHTML = `
        <button class="botao-secundario"
            onclick="pularQuestao()">
            Pular questão
        </button>
    `;

    prepararCampos();
    montarTeclado();
}
