
/* =====================================================
   CURSO DE MATEMÁTICA
   Módulo: DIVISÃO
   Arquivo: js/operacoes/divisao.js
   ===================================================== */

const Divisao = (() => {

    let questoes = [];
    let indiceAtual = 0;
    let respostas = [];
    let configuracao = {};
    let sequenciaAtual = null;

    const modalidades = {
        pratica: "Prática de Divisão",
        sequencia: "Sequencial dos Números",
        resto: "Divisão com Resto",
        tabuada: "Memorizar Tabuada"
    };

    // -------------------------------------------------
    // FUNÇÕES AUXILIARES
    // -------------------------------------------------

    function aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function embaralhar(lista) {
        return [...lista].sort(() => Math.random() - 0.5);
    }

    function validarDivisor(valor) {
        const numero = Number(valor);

        if (!Number.isInteger(numero) || numero < 1 || numero > 10) {
            throw new Error("O divisor deve estar entre 1 e 10.");
        }

        return numero;
    }

    // -------------------------------------------------
    // PRÁTICA DE DIVISÃO EXATA
    // -------------------------------------------------

    function gerarPratica(opcoes) {

        const divisores = (opcoes.divisores || [])
            .map(validarDivisor);

        if (!divisores.length) {
            throw new Error("Selecione pelo menos um divisor.");
        }

        const lista = [];

        for (let i = 0; i < configuracao.quantidade; i++) {

            const divisor = divisores[
                aleatorio(0, divisores.length - 1)
            ];

            // Gera os múltiplos de 0 até 10.
            const quociente = aleatorio(0, 10);
            const dividendo = divisor * quociente;

            lista.push({
                tipo: "pratica",
                dividendo,
                divisor,
                quociente,
                resto: 0
            });
        }

        return lista;
    }

    // -------------------------------------------------
    // SEQUÊNCIA NUMÉRICA
    // -------------------------------------------------

    function gerarSequencia(numero) {

        const valores = Array.from(
            { length: 10 },
            (_, indice) => numero * (indice + 1)
        );

        // Quatro posições preenchidas aleatoriamente.
        const posicoesPreenchidas = embaralhar(
            Array.from({ length: 10 }, (_, i) => i)
        ).slice(0, 4);

        const preenchidos = new Set(posicoesPreenchidas);

        const posicoes = valores.map((valor, indice) => ({
            posicao: indice + 1,
            valor: preenchidos.has(indice) ? valor : null,
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

                const correto =
                    resposta !== "" &&
                    resposta !== null &&
                    Number(resposta) === sequenciaAtual.valores[indice];

                return {
                    posicao: indice + 1,
                    resposta:
                        resposta === "" || resposta === null
                            ? null
                            : Number(resposta),
                    esperado: sequenciaAtual.valores[indice],
                    correto
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
    // DIVISÃO COM RESTO
    // -------------------------------------------------

    function gerarComResto(opcoes) {

        const divisores = (opcoes.divisores || [])
            .map(validarDivisor);

        if (!divisores.length) {
            throw new Error("Selecione pelo menos um divisor.");
        }

        const lista = [];

        for (let i = 0; i < configuracao.quantidade; i++) {

            const divisor = divisores[
                aleatorio(0, divisores.length - 1)
            ];

            // O dividendo fica entre 0 e 10 vezes o divisor.
            const dividendo = aleatorio(0, divisor * 10);

            const quociente = Math.floor(dividendo / divisor);
            const resto = dividendo % divisor;

            lista.push({
                tipo: "resto",
                dividendo,
                divisor,
                quociente,
                resto
            });
        }

        return lista;
    }

    // -------------------------------------------------
    // TABUADA DE DIVISÃO
    // -------------------------------------------------

    function gerarTabuada(divisor) {

        divisor = validarDivisor(divisor);

        const lista = [];

        for (let i = 0; i <= 10; i++) {

            lista.push({
                tipo: "tabuada",
                dividendo: divisor * i,
                divisor,
                quociente: i,
                resto: 0
            });
        }

        return lista;
    }

    // -------------------------------------------------
    // CONTA ARMADA
    // -------------------------------------------------

    function criarContaArmada(questao) {

        return {
            dividendo: questao.dividendo,
            divisor: questao.divisor,
            quociente: questao.quociente,
            resto: questao.resto,
            sinal: "÷"
        };
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

        if (
            !Number.isInteger(configuracao.quantidade) ||
            configuracao.quantidade < 1
        ) {
            throw new Error("Quantidade de questões inválida.");
        }

        if (modalidade === "pratica") {

            questoes = gerarPratica(opcoes);

        } else if (modalidade === "resto") {

            questoes = gerarComResto(opcoes);

        } else if (modalidade === "tabuada") {

            const divisor = validarDivisor(opcoes.divisor);

            questoes = gerarTabuada(divisor);

        } else if (modalidade === "sequencia") {

            const numero = validarDivisor(opcoes.numero);

            return gerarSequencia(numero);

        } else {

            throw new Error("Modalidade de divisão inválida.");
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
            dividendo: questao.dividendo,
            divisor: questao.divisor,
            conta: criarContaArmada(questao),
            exigeResto: questao.tipo === "resto"
        };
    }

    // -------------------------------------------------
    // CORREÇÃO
    // -------------------------------------------------

    function corrigir(respostaQuociente, respostaResto = 0) {

        const questao = questoes[indiceAtual];

        if (!questao) {
            return {
                correto: false,
                mensagem: "Não há questão ativa."
            };
        }

        if (
            respostaQuociente === "" ||
            respostaQuociente === null ||
            !Number.isFinite(Number(respostaQuociente))
        ) {
            return {
                correto: false,
                mensagem: "Digite o quociente."
            };
        }

        // Resto pode ficar vazio quando for zero.
        const restoInformado =
            respostaResto === "" || respostaResto === null
                ? 0
                : Number(respostaResto);

        if (
            !Number.isInteger(Number(respostaQuociente)) ||
            !Number.isInteger(restoInformado)
        ) {
            return {
                correto: false,
                mensagem: "Informe números inteiros."
            };
        }

        const quocienteCorreto =
            Number(respostaQuociente) === questao.quociente;

        const restoCorreto =
            restoInformado === questao.resto;

        const correto =
            quocienteCorreto && restoCorreto;

        respostas.push({
            questao: indiceAtual + 1,
            dividendo: questao.dividendo,
            divisor: questao.divisor,
            respostaQuociente: Number(respostaQuociente),
            respostaResto: restoInformado,
            quocienteEsperado: questao.quociente,
            restoEsperado: questao.resto,
            correto
        });

        return {
            correto,
            mensagem: correto
                ? "Resposta Correta! ✅"
                : "Resposta Incorreta! ❌",
            quocienteEsperado: questao.quociente,
            restoEsperado: questao.resto
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
            dividendo: questao.dividendo,
            divisor: questao.divisor,
            respostaQuociente: null,
            respostaResto: null,
            quocienteEsperado: questao.quociente,
            restoEsperado: questao.resto,
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
        corrigirSequencia,
        avancar,
        pular,
        gerarRelatorio,
        listarModalidades
    };

})();

window.Divisao = Divisao;
