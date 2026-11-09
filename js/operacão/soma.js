
/* =====================================================
   CURSO DE MATEMÁTICA
   Módulo: SOMA
   Arquivo: js/operacoes/soma.js
   ===================================================== */

const Soma = (() => {

    let questoes = [];
    let indiceAtual = 0;
    let respostas = [];
    let configuracao = {};

    const modalidades = {
        sequencial: "Soma Sequencial",
        diversas: "Somas Diversas",
        tabuada: "Memorizar Tabuada"
    };

    // -------------------------------------------------
    // GERAÇÃO DE NÚMEROS
    // -------------------------------------------------

    function aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function quantidadeDeDigitos(valor) {
        if (valor === "unidade") return 1;
        if (valor === "dezena") return 2;
        if (valor === "centena") return 3;
        return 1;
    }

    function gerarNumero(casas) {
        const digitos = quantidadeDeDigitos(casas);
        const minimo = digitos === 1 ? 0 : Math.pow(10, digitos - 1);
        const maximo = Math.pow(10, digitos) - 1;

        return aleatorio(minimo, maximo);
    }

    // -------------------------------------------------
    // SOMA SEQUENCIAL
    // -------------------------------------------------

    function gerarSequencial(opcoes) {
        const questoesGeradas = [];

        const unidades = opcoes.unidades || [];
        const somas = opcoes.somas || [];

        if (!unidades.length || !somas.length) {
            throw new Error("Selecione as casas e os valores da soma.");
        }

        for (let i = 0; i < configuracao.quantidade; i++) {
            const casa = unidades[aleatorio(0, unidades.length - 1)];
            const valorSoma = somas[aleatorio(0, somas.length - 1)];

            const primeiro = gerarNumero(casa);
            const segundo = valorSoma;

            questoesGeradas.push({
                tipo: "sequencial",
                primeiro,
                segundo,
                resultado: primeiro + segundo
            });
        }

        return questoesGeradas;
    }

    // -------------------------------------------------
    // SOMAS DIVERSAS
    // -------------------------------------------------

    function gerarDiversas(opcoes) {
        const questoesGeradas = [];

        const casasPrimeiro = opcoes.primeiro || [];
        const casasSegundo = opcoes.segundo || [];

        if (!casasPrimeiro.length || !casasSegundo.length) {
            throw new Error("Selecione as casas dos dois números.");
        }

        const combinacoes = [];

        casasPrimeiro.forEach(casa1 => {
            casasSegundo.forEach(casa2 => {
                combinacoes.push([casa1, casa2]);
            });
        });

        for (let i = 0; i < configuracao.quantidade; i++) {
            const combinacao = combinacoes[
                aleatorio(0, combinacoes.length - 1)
            ];

            let primeiro = gerarNumero(combinacao[0]);
            let segundo = gerarNumero(combinacao[1]);

            // O maior número deve ficar em cima.
            if (segundo > primeiro) {
                [primeiro, segundo] = [segundo, primeiro];
            }

            questoesGeradas.push({
                tipo: "diversas",
                primeiro,
                segundo,
                resultado: primeiro + segundo
            });
        }

        return questoesGeradas;
    }

    // -------------------------------------------------
    // TABUADA DA SOMA
    // -------------------------------------------------

    function gerarTabuada(unidade) {
        const questoesGeradas = [];

        for (let i = 1; i <= 10; i++) {
            questoesGeradas.push({
                tipo: "tabuada",
                primeiro: unidade,
                segundo: i,
                resultado: unidade + i
            });
        }

        return questoesGeradas.sort(() => Math.random() - 0.5);
    }

    // -------------------------------------------------
    // CONTA ARMADA
    // -------------------------------------------------

    function separarDigitos(numero) {
        const texto = String(numero).padStart(4, " ");

        return {
            milhar: texto[0] === " " ? "" : texto[0],
            centena: texto[1] === " " ? "" : texto[1],
            dezena: texto[2] === " " ? "" : texto[2],
            unidade: texto[3] === " " ? "" : texto[3]
        };
    }

    function criarContaArmada(questao) {
        return {
            primeiro: separarDigitos(questao.primeiro),
            segundo: separarDigitos(questao.segundo),
            resultado: separarDigitos(questao.resultado),
            sinal: "+"
        };
    }

    // -------------------------------------------------
    // CAMPOS DE RESERVA
    // -------------------------------------------------

    function criarReservas() {
        return {
            milhar: "",
            centena: "",
            dezena: "",
            unidade: ""
        };
    }

    function limparReservas() {
        const campos = document.querySelectorAll(
            "[data-reserva]"
        );

        campos.forEach(campo => {
            campo.value = "";
        });
    }

    // -------------------------------------------------
    // INICIALIZAÇÃO DA ATIVIDADE
    // -------------------------------------------------

    function iniciar(modalidade, opcoes = {}) {
        const quantidade = Number(opcoes.quantidade) || 10;

        configuracao = {
            quantidade: modalidade === "tabuada" ? 10 : quantidade
        };

        respostas = [];
        indiceAtual = 0;

        if (modalidade === "sequencial") {
            questoes = gerarSequencial(opcoes);
        } else if (modalidade === "diversas") {
            questoes = gerarDiversas(opcoes);
        } else if (modalidade === "tabuada") {
            if (opcoes.unidade === undefined) {
                throw new Error("Informe a unidade da tabuada.");
            }

            questoes = gerarTabuada(Number(opcoes.unidade));
        } else {
            throw new Error("Modalidade de soma inválida.");
        }

        return proximaQuestao();
    }

    // -------------------------------------------------
    // QUESTÕES
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
            conta: criarContaArmada(questao),
            reservas: criarReservas()
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

        const valor = Number(resposta);

        if (resposta === "" || !Number.isFinite(valor)) {
            return {
                correto: false,
                mensagem: "Digite uma resposta válida."
            };
        }

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
    // AVANÇAR QUESTÃO
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
    // PULAR QUESTÃO
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
            percentual: Math.round((acertos / total) * 100),
            respostas: [...respostas]
        };
    }

    // -------------------------------------------------
    // CONSULTA DE MODALIDADES
    // -------------------------------------------------

    function listarModalidades() {
        return modalidades;
    }

    // -------------------------------------------------
    // API PÚBLICA DO MÓDULO
    // -------------------------------------------------

    return {
        iniciar,
        proximaQuestao,
        corrigir,
        avancar,
        pular,
        gerarRelatorio,
        listarModalidades,
        limparReservas
    };

})();

// Disponibiliza o módulo para o restante do curso.
window.Soma = Soma;
