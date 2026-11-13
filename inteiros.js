
function abrirOperacao(op) {
    pararCronometro();

    estado.operacao = op;
    estado.modalidade = "";

    // NÚMEROS INTEIROS
    if (op === "inteiros") {
        $("tituloOperacao").textContent = "Números Inteiros";

        $("descricaoOperacao").textContent =
            "Aprenda a trabalhar com números positivos e negativos. Escolha uma modalidade para começar.";

        $("configuracao").classList.add("escondida");

        $("listaModalidades").innerHTML =
            modalidadesInteiros.map(([id, nome], i) => `
                <button class="modalidade"
                    onclick="selecionarModalidade('inteiros_${id}',this)">
                    ${i + 1}. ${nome}
                </button>
            `).join("");

        mostrarTela("operacao");
        return;
    }

    // QUATRO OPERAÇÕES ORIGINAIS
    const nomes = {
        soma: "Soma",
        subtracao: "Subtração",
        multiplicacao: "Multiplicação",
        divisao: "Divisão"
    };

    if (!modalidades[op]) {
        console.error("Operação não encontrada:", op);
        return;
    }

    $("tituloOperacao").textContent = nomes[op];

    $("descricaoOperacao").textContent =
        "Escolha uma modalidade para estudar.";

    $("configuracao").classList.add("escondida");

    $("listaModalidades").innerHTML =
        modalidades[op].map(([id, nome]) => `
            <button class="modalidade"
                onclick="selecionarModalidade('${id}',this)">
                ${nome}
            </button>
        `).join("");

    mostrarTela("operacao");
}
