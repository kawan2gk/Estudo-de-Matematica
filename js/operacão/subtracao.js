
/* =====================================================
   CURSO DE MATEMÁTICA
   Módulo: SUBTRAÇÃO
   Arquivo: js/operacoes/subtracao.js
   ===================================================== */

const Subtracao = (() => {

    let questoes = [];
    let indiceAtual = 0;
    let respostas = [];
    let configuracao = {};

    const modalidades = {
        sequencial: "Subtração Sequencial",
        diversas: "Subtrações Diversas",
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

    // Verifica se a subtração exige empréstimo.
    function possuiReserva(minuendo, subtraendo) {
        const a = String(minuendo).padStart(4, "0");
        const b = String(subtraendo).padStart(4, "0");

        let emprestimo = 0;

        for (let i = 3; i >= 0; i--) {
            const digitoA = Number(a[i]) - emprestimo;
            const digitoB = Number(b[i]);

            if (digitoA < digitoB) {
                emprestimo = 1;
                return true;
            }

            emprestimo = 0;
        }

        return false;
    }

    // -------------------------------------------------
    // GERAÇÃO DE SUBTRAÇÕES COM E SEM RESERVA
    // -------------------------------------------------

    function gerarQuestao(primeiro, segundo, tipoReserva) {

        if (segundo > primeiro) {
            [primeiro, segundo] = [segundo, primeiro];
        }

        if (tipoReserva === "com" &&
            !possuiReserva(primeiro, segundo)) {
            return null;
        }

        if (tipoReserva === "sem" &&
            possuiReserva(primeiro, segundo)) {
            return null;
        }

        return {
            primeiro,
            segundo,
            resultado: primeiro - segundo,
            possuiReserva: possuiReserva(primeiro, segundo)
        };
    }

    function gerarLista(combinacoes, quantidade, tipoReserva) {
        const lista = [];
        let tentativas = 0;
        const limite = quantidade * 100;

        while (lista.length < quantidade && tentativas < limite) {
            tentativas++;

            const combinacao = combinacoes[
                aleatorio(0, combinacoes.length - 1)
            ];

            const primeiro = gerarNumero(combinacao[0]);
            const segundo = gerarNumero(combinacao[1]);

            const questao = gerarQuestao(
                primeiro,
                segundo,
                tipoReserva
            );

            if (questao) {
                lista.push(questao);
            }
        }

        // Caso não seja possível preencher a lista,
        // completa com questões de qualquer tipo.
        while (lista.length < quantidade) {
            const combinacao = combinacoes[
                aleatorio(0, combinacoes.length - 1)
            ];

            let primeiro = gerarNumero(combinacao[0]);
            let segundo = gerarNumero(combinacao[1]);

            if (segundo > primeiro) {
                [primeiro, segundo] = [segundo, primeiro];
            }

            lista.push({
                primeiro,
                segundo,
                resultado: primeiro - segundo,
                possuiReserva: possuiReserva(primeiro, segundo)
            });
        }

        return lista;
    }

    function obterTipoReserva(opcoes) {
        const com = Boolean(opcoes.comReserva);
        const sem = Boolean(opcoes.semReserva);

        if (com && !sem) return "com";
        if (sem && !com) return "sem";

        return "ambos";
    }

    // -------------------------------------------------
    // SUBTRAÇÃO SEQUENCIAL
    // -------------------------------------------------

    function gerarSequencial(opcoes) {
        const casas = opcoes.unidades || [];
        const subtraendos = opcoes.subtraendos || [];

        if (!casas.length || !subtraendos.length) {
            throw new Error(
                "Selecione as casas e os valores da subtração."
            );
        }

        const combinacoes = [];

        casas.forEach(casa => {
            subtraendos.forEach(valor => {
                combinacoes.push([casa, "unidade", Number(valor)]);
            });
        });

        const lista = [];

        const tipoReserva = obterTipoReserva(opcoes);

        while (lista.length < configuracao.quantidade) {
            const combinacao = combinacoes[
                aleatorio(0, combinacoes.length - 1)
            ];

            const primeiro = gerarNumero(combinacao[0]);
            const segundo = combinacao[2];

            const questao = gerarQuestao(
                primeiro,
                segundo,
                tipoReserva
            );

            if (questao) {
                lista.push({
                    ...questao,
                    tipo: "sequencial"
                });
            }
        }

        return lista;
    }

    // -------------------------------------------------
    // SUBTRAÇÕES DIVERSAS
    // -------------------------------------------------

    function gerarDiversas(opcoes) {
        const casasPrimeiro = opcoes.primeiro || [];
        const casasSegundo = opcoes.segundo || [];

        if (!casasPrimeiro.length || !casasSegundo.length) {
            throw new Error(
                "Selecione as casas dos dois números."
            );
        }

        const combinacoes = [];

        casasPrimeiro.forEach(casa1 => {
            casasSegundo.forEach(casa2 => {
                combinacoes.push([casa1, casa2]);
            });
        });

        const tipoReserva = obterTipoReserva(opcoes);

        return gerarLista(
            combinacoes,
            configuracao.quantidade,
            tipoReserva
        ).map(questao => ({
            ...questao,
            tipo: "diversas"
        }));
    }

    // -------------------------------------------------
    // TABUADA DE SUBTRAÇÃO
    // -------------------------------------------------

    function gerarTabuada(unidade) {
        const lista = [];

        for (let i = 0; i <= 10; i++) {
            lista.push({
                tipo: "tabuada",
                primeiro: unidade + i,
                segundo: unidade,
                resultado: i
            });
        }

        return lista;
    }

    // -------------------------------------------------
    // SEPARAÇÃO DOS ALGARISMOS
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

    // -------------------------------------------------
    // CONTA ARMADA
    // -------------------------------------------------

    function criarContaArmada(questao) {
        return {
            primeiro: separarDigitos(questao.primeiro),
            segundo: separarDigitos(questao.segundo),
            resultado: separarDigitos(questao.resultado),
            sinal: "−",
            reservas: {
                milhar: ["", ""],
                centena: ["", ""],
                dezena: ["", ""],
                unidade: ["", ""]
            }
        };
    }

    // -------------------------------------------------
    // LIMPAR RESERVAS
    // -------------------------------------------------

    function limparReservas() {
        document.querySelectorAll("[data-reserva]").forEach(campo => {
            campo.value = "";
        });
    }

    // -------------------------------------------------
    // INICIAR ATIVIDADE
    // -------------------------------------------------

    function iniciar(modalidade, opcoes = {}) {
        configuracao = {
            quantidade: modalidade === "tabuada"
                ? 11
                : Number(opcoes.quantidade) || 10
        };

        indiceAtual = 0;
        respostas = [];

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
                    "Informe uma unidade entre 1 e 10."
                );
            }

            questoes = gerarTabuada(unidade);

        } else {
            throw new Error(
                "Modalidade de subtração inválida."
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
            possuiReserva: questao.possuiReserva || false,
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
            percentual: Math.round(
                (acertos / total) * 100
            ),
            respostas: [...respostas]
        };
    }

    // -------------------------------------------------
    // MODALIDADES DISPONÍVEIS
    // -------------------------------------------------

    function listarModalidades() {
        return modalidades;
    }

    // -------------------------------------------------
    // API DO MÓDULO
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

window.Subtracao = Subtracao;
