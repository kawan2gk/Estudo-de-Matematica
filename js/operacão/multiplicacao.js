
/* =====================================================
   CURSO DE MATEMÁTICA
   Módulo: MULTIPLICAÇÃO
   Arquivo: js/operacoes/multiplicacao.js
   ===================================================== */

const Multiplicacao = (() => {

    let questoes = [];
    let indiceAtual = 0;
    let respostas = [];
    let configuracao = {};
    let sequenciaAtual = null;

    const modalidades = {
        sequencial: "Multiplicação Sequencial",
        diversas: "Multiplicações Diversas",
        sequencia: "Estudar Sequência Numérica",
        tabuada: "Memorizar Tabuada"
    };

    // -------------------------------------------------
    // FUNÇÕES AUXILIARES
    // -------------------------------------------------

    function aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function quantidadeDeDigitos(casa) {
        const casas = {
            unidade: 1,
            dezena: 2,
            centena: 3
        };

        return casas[casa] || 1;
    }

    function gerarNumero(casa) {
        const digitos = quantidadeDeDigitos(casa);

        const minimo = digitos === 1
            ? 0
            : Math.pow(10, digitos - 1);

        const maximo = Math.pow(10, digitos) - 1;

        return aleatorio(minimo, maximo);
    }

    function embaralhar(lista) {
        return [...lista].sort(() => Math.random() - 0.5);
    }

    // -------------------------------------------------
    // MULTIPLICAÇÃO SEQUENCIAL
    // -------------------------------------------------

    function gerarSequencial(opcoes) {
        const casas = opcoes.unidades || [];
        const multiplicadores = opcoes.multiplicadores || [];

        if (!casas.length || !multiplicadores.length) {
            throw new Error(
                "Selecione as casas e os multiplicadores."
            );
        }

        const combinacoes = [];

        casas.forEach(casa => {
            multiplicadores.forEach(valor => {
                combinacoes.push({
                    casa,
                    multiplicador: Number(valor)
                });
            });
        });

        const lista = [];

        for (let i = 0; i < configuracao.quantidade; i++) {
            const combinacao = combinacoes[
                aleatorio(0, combinacoes.length - 1)
            ];

            const primeiro = gerarNumero(combinacao.casa);
            const segundo = combinacao.multiplicador;

            lista.push(criarQuestao(primeiro, segundo));
        }

        return lista;
    }

    // -------------------------------------------------
    // MULTIPLICAÇÕES DIVERSAS
    // -------------------------------------------------

    function gerarDiversas(opcoes) {

        // Combinações permitidas:
        // Unidade × Unidade
        // Dezena × Unidade
        // Centena × Unidade
        // Dezena × Dezena
        // Centena × Dezena

        const combinacoesPermitidas = [
            ["unidade", "unidade"],
            ["dezena", "unidade"],
            ["centena", "unidade"],
            ["dezena", "dezena"],
            ["centena", "dezena"]
        ];

        const selecionadas = opcoes.combinacoes || [];

        if (!selecionadas.length) {
            throw new Error(
                "Selecione pelo menos uma combinação."
            );
        }

        const combinacoes = selecionadas
            .map(indice => combinacoesPermitidas[Number(indice)])
            .filter(Boolean);

        if (!combinacoes.length) {
            throw new Error("Combinações inválidas.");
        }

        const lista = [];

        for (let i = 0; i < configuracao.quantidade; i++) {
            const combinacao = combinacoes[
                aleatorio(0, combinacoes.length - 1)
            ];

            const primeiro = gerarNumero(combinacao[0]);
            const segundo = gerarNumero(combinacao[1]);

            lista.push(criarQuestao(primeiro, segundo));
        }

        return lista;
    }

    // -------------------------------------------------
    // CRIAÇÃO DA QUESTÃO
    // -------------------------------------------------

    function criarQuestao(primeiro, segundo) {
        const produto = primeiro * segundo;

        const digitosSegundo = String(segundo).length;

        let produtosParciais = [];

        if (digitosSegundo > 1) {
            const algarismos = String(segundo)
                .split("")
                .reverse();

            produtosParciais = algarismos.map(
                (algarismo, indice) => {
                    const valor = primeiro * Number(algarismo);

                    return {
                        algarismo: Number(algarismo),
                        valor,
                        deslocamento: indice,
                        resultadoVisual: valor * Math.pow(10, indice)
                    };
                }
            );
        }

        return {
            tipo: "multiplicacao",
            primeiro,
            segundo,
            resultado: produto,
            produtosParciais,
            possuiParciais: produtosParciais.length > 0
        };
    }

    // -------------------------------------------------
    // SEQUÊNCIA NUMÉRICA
    // -------------------------------------------------

    function gerarSequencia(numero) {

        const valores = Array.from(
            { length: 10 },
            (_, indice) => numero * (indice + 1)
        );

        // Quatro posições são preenchidas.
        const posicoesPreenchidas = embaralhar(
            Array.from({ length: 10 }, (_, i) => i)
        ).slice(0, 4);

        const preenchidos = new Set(posicoesPreenchidas);

        const posicoes = valores.map((valor, indice) => ({
            posicao: indice + 1,
            valor: preenchidos.has(indice) ? valor : null,
            resposta: preenchidos.has(indice) ? valor : null,
            preenchida: preenchidos.has(indice)
        }));

        sequenciaAtual = {
            numero,
            valores,
            posicoes,
            preenchidos: 4,
            faltantes: 6
        };

        return sequenciaAtual;
    }

    function corrigirSequencia(respostasAluno) {

        if (!sequenciaAtual) {
            throw new Error("Nenhuma sequência foi iniciada.");
        }

        const resultado = sequenciaAtual.posicoes.map(
            (posicao, indice) => {

                if (posicao.preenchida) {
                    return {
                        posicao: indice + 1,
                        correto: true,
                        resposta: posicao.valor
                    };
                }

                const resposta = respostasAluno[indice];

                return {
                    posicao: indice + 1,
                    correto:
                        resposta !== "" &&
                        resposta !== null &&
                        Number(resposta) === sequenciaAtual.valores[indice],
                    resposta:
                        resposta === "" || resposta === null
                            ? null
                            : Number(resposta),
                    esperado: sequenciaAtual.valores[indice]
                };
            }
        );

        const acertos = resultado.filter(
            item => item.correto
        ).length;

        return {
            total: 10,
            acertos,
            erros: 10 - acertos,
            percentual: acertos * 10,
            resultado
        };
    }

    // -------------------------------------------------
    // TABUADA DE MULTIPLICAÇÃO
    // -------------------------------------------------

    function gerarTabuada(unidade) {
        const lista = [];

        for (let i = 0; i <= 10; i++) {
            lista.push(
                criarQuestao(unidade, i)
            );
        }

        return embaralhar(lista);
    }

    // -------------------------------------------------
    // SEPARAÇÃO DOS ALGARISMOS
    // -------------------------------------------------

    function separarDigitos(numero) {
        const texto = String(numero).padStart(6, " ");

        return {
            centenaMilhar: texto[0] === " " ? "" : texto[0],
            dezenaMilhar: texto[1] === " " ? "" : texto[1],
            unidadeMilhar: texto[2] === " " ? "" : texto[2],
            centena: texto[3] === " " ? "" : texto[3],
            dezena: texto[4] === " " ? "" : texto[4],
            unidade: texto[5] === " " ? "" : texto[5]
        };
    }

    // -------------------------------------------------
    // CONTA ARMADA
    // -------------------------------------------------

    function criarContaArmada(questao) {

        return {
            primeiro: separarDigitos(questao.primeiro),
            segundo: separarDigitos(questao.segundo),
            resultado: separarDigitos(questao.resultado),
            sinal: "×",

            produtosParciais: questao.produtosParciais.map(
                parcial => ({
                    valor: parcial.valor,
                    deslocamento: parcial.deslocamento,
                    resultadoVisual: parcial.resultadoVisual,
                    algarismo: parcial.algarismo
                })
            ),

            reservas: {
                centenaMilhar: "",
                dezenaMilhar: "",
                unidadeMilhar: "",
                centena: "",
                dezena: "",
                unidade: ""
            }
        };
    }

    // -------------------------------------------------
    // RESERVAS
    // -------------------------------------------------

    function limparReservas() {
        document.querySelectorAll("[data-reserva]").forEach(
            campo => {
                campo.value = "";
            }
        );
    }

    // -------------------------------------------------
    // INICIAR ATIVIDADE
    // -------------------------------------------------

    function iniciar(modalidade, opcoes = {}) {

        indiceAtual = 0;
        respostas = [];
        sequenciaAtual = null;

        configuracao = {
            quantidade: Number(opcoes.quantidade) || 10
        };

        if (modalidade === "sequencial") {
            questoes = gerarSequencial(opcoes);

        } else if (modalidade === "diversas") {
            questoes = gerarDiversas(opcoes);

        } else if (modalidade === "tabuada") {

            const unidade = Number(opcoes.unidade);

            if (!Number.isInteger(unidade) ||
                unidade < 1 ||
                unidade > 10) {
                throw new Error(
                    "Informe uma tabuada entre 1 e 10."
                );
            }

            questoes = gerarTabuada(unidade);

        } else if (modalidade === "sequencia") {

            const numero = Number(opcoes.numero);

            if (!Number.isInteger(numero) ||
                numero < 2 ||
                numero > 10) {
                throw new Error(
                    "Escolha uma sequência entre 2 e 10."
                );
            }

            return gerarSequencia(numero);

        } else {
            throw new Error(
                "Modalidade de multiplicação inválida."
            );
        }

        return proximaQuestao();
    }

    // -------------------------------------------------
    // PRÓXIMA QUESTÃO
    // -------------------------------------------------

    function proximaQuestao() {

        if (indiceAtual >= questoes.length) {
            return null;
        }

        const questao = questoes[indiceAtual];

        return {
            numero: indiceAtual + 1,
            total: questoes.length,
            primeiro: questao.primeiro,
            segundo: questao.segundo,
            resultadoEsperado: questao.resultado,
            possuiParciais: questao.possuiParciais,
            produtosParciais: questao.produtosParciais,
            conta: criarContaArmada(questao)
        };
    }

    // -------------------------------------------------
    // CORREÇÃO
    // -------------------------------------------------

    function corrigir(resposta) {

        const questao = questoes[indiceAtual];

        if (!questao) {
            return {
                correto: false,
                mensagem: "Não há questão ativa."
            };
        }

        if (resposta === "" || resposta === null ||
            !Number.isFinite(Number(resposta))) {
            return {
                correto: false,
                mensagem: "Digite uma resposta válida."
            };
        }

        const valor = Number(resposta);
        const correto = valor === questao.resultado;

        respostas.push({
            questao: indiceAtual + 1,
            primeiro: questao.primeiro,
            segundo: questao.segundo,
            resposta: valor,
            resultado: questao.resultado,
            correto
        });

        return {
            correto,
            mensagem: correto
                ? "Resposta Correta! ✅"
                : "Resposta Incorreta! ❌",
            esperado: questao.resultado
        };
    }

    // -------------------------------------------------
    // CORREÇÃO DOS PRODUTOS PARCIAIS
    // -------------------------------------------------

    function corrigirProdutosParciais(respostasAluno) {

        const questao = questoes[indiceAtual];

        if (!questao || !questao.possuiParciais) {
            return {
                correto: true,
                mensagem: "Não há produtos parciais."
            };
        }

        const resultado = questao.produtosParciais.map(
            (parcial, indice) => ({
                indice,
                resposta: Number(respostasAluno[indice]),
                esperado: parcial.valor,
                correto:
                    respostasAluno[indice] !== "" &&
                    respostasAluno[indice] !== null &&
                    Number(respostasAluno[indice]) === parcial.valor
            })
        );

        return {
            correto: resultado.every(item => item.correto),
            resultado
        };
    }

    // -------------------------------------------------
    // AVANÇAR
    // -------------------------------------------------

    function avancar() {

        indiceAtual++;

        if (indiceAtual >= questoes.length) {
            return {
                finalizado: true,
                relatorio: gerarRelatorio()
            };
        }

        return {
            finalizado: false,
            questao: proximaQuestao()
        };
    }

    // -------------------------------------------------
    // PULAR
    // -------------------------------------------------

    function pular() {

        const questao = questoes[indiceAtual];

        if (!questao) return null;

        respostas.push({
            questao: indiceAtual + 1,
            primeiro: questao.primeiro,
            segundo: questao.segundo,
            resposta: null,
            resultado: questao.resultado,
            correto: false,
            pulada: true
        });

        return avancar();
    }

    // -------------------------------------------------
    // RELATÓRIO
    // -------------------------------------------------

    function gerarRelatorio() {

        const acertos = respostas.filter(
            resposta => resposta.correto
        ).length;

        const erros = respostas.filter(
            resposta => !resposta.correto
        ).length;

        const total = questoes.length;

        return {
            total,
            acertos,
            erros,
            percentual: Math.round(
                (acertos / total) * 100
            ),
            respostas: [...respostas]
        };
    }

    // -------------------------------------------------
    // MODALIDADES
    // -------------------------------------------------

    function listarModalidades() {
        return modalidades;
    }

    // -------------------------------------------------
    // API PÚBLICA
    // -------------------------------------------------

    return {
        iniciar,
        proximaQuestao,
        corrigir,
        corrigirProdutosParciais,
        corrigirSequencia,
        avancar,
        pular,
        gerarRelatorio,
        listarModalidades,
        limparReservas
    };

})();

window.Multiplicacao = Multiplicacao;
