
/* MATEMÁTICA COM DETALHES — POTENCIAÇÃO
   Módulo independente. Preparado para receber Radicais futuramente.
*/

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[rand(0, a.length - 1)];
const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const terms = ["a", "x", "y"];

const esc = s => String(s).replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;",
  '"': "&quot;", "'": "&#39;"
}[c]));

function choices(title, values, correct, explanation) {
  return {
    kind: "pot-choice",
    title,
    values: shuffle(values.map(String)),
    answer: String(correct),
    explanation
  };
}

function input(title, answer, explanation, placeholder = "Digite sua resposta") {
  return {
    kind: "pot-input",
    title,
    answer: String(answer),
    explanation,
    placeholder
  };
}

function lesson(title, html) {
  return { kind: "pot-lesson", title, html };
}

function power(base, exp) {
  return Math.pow(base, exp);
}

function modeQuestions(mode, cfg) {
  const out = [];

  if (mode === "conceito") {
    out.push(lesson("O que é potência?", `
      <p>Potenciação é uma forma abreviada de representar uma multiplicação de fatores iguais.</p>
      <div class="pot-visual">
        <div>
          <div class="pot-square"></div>
          <b>Quadrado: 3²</b>
          <p>3 × 3 = 9</p>
        </div>
        <div>
          <div class="pot-cube">▧</div>
          <b>Cubo: 2³</b>
          <p>2 × 2 × 2 = 8</p>
        </div>
      </div>
      <p><b>Exemplos:</b></p>
      <p>3² = 3 × 3 = 9</p>
      <p>5² = 5 × 5 = 25</p>
      <p>2³ = 2 × 2 × 2 = 8</p>
      <p>4³ = 4 × 4 × 4 = 64</p>
    `));

    out.push(lesson("Base e expoente", `
      <p>Observe a potência <b>5²</b>.</p>
      <div class="pot-highlight">5<sup>2</sup></div>
      <p><b>Base:</b> é o número que será multiplicado por ele mesmo. Neste exemplo, a base é 5.</p>
      <p><b>Expoente:</b> indica quantas vezes a base aparece como fator. Neste exemplo, o expoente é 2.</p>
    `));

    for (let i = 0; i < 2; i++) {
      const a = rand(0, 9);
      const b = rand(0, 9);

      out.push(choices(
        `Na potência ${a}<sup>${b}</sup>, identifique a base.`,
        [a, b, rand(0, 9), rand(0, 9)],
        a,
        `A base é ${a}: é o número que aparece elevado ao expoente.`
      ));

      out.push(choices(
        `Na potência ${a}<sup>${b}</sup>, identifique o expoente.`,
        [a, b, rand(0, 9), rand(0, 9)],
        b,
        `O expoente é ${b}: ele indica quantas vezes a base aparece como fator.`
      ));
    }

    for (let i = 0; i < 2; i++) {
      const a = rand(1, 9);
      out.push(input(
        `Complete: ${a}² = ${a} × ${a} =`,
        a * a,
        `${a}² significa ${a} × ${a}, que é igual a ${a * a}.`
      ));
    }

    for (let i = 0; i < 2; i++) {
      const b = rand(1, 4);
      out.push(input(
        `Complete: ${b}³ = ${b} × ${b} × ${b} =`,
        b * b * b,
        `${b}³ significa ${b} × ${b} × ${b}, que é igual a ${b * b * b}.`
      ));
    }

    out.push(lesson("Casos especiais: base 1 e expoente zero", `
      <p>Quando a base é 1, qualquer expoente natural resulta em 1:</p>
      <p class="pot-formula">1⁴ = 1 × 1 × 1 × 1 = 1</p>
      <p>Quando a base é diferente de zero e o expoente é zero, o resultado é 1:</p>
      <p class="pot-formula">7⁰ = 1 &nbsp; e &nbsp; 25⁰ = 1</p>
      <p><b>Atenção:</b> nesta regra, a base não pode ser zero.</p>
    `));

    return out;
  }

  if (mode === "naturais") {
    const exp = Number(cfg.expoente || 0);
    const limit = exp === 0 || exp === 1
      ? 99
      : exp === 2
        ? (Number(cfg.limite) || 12) - 1
        : 5;

    for (let i = 0; i < 10; i++) {
      const b = rand(exp === 3 ? 0 : 1, limit);
      out.push(input(
        `${b}<sup>${exp}</sup> =`,
        power(b, exp),
        `${b} elevado a ${exp} é ${power(b, exp)}.`
      ));
    }
    return out;
  }

  if (mode === "sinais") {
    out.push(lesson("Potência com base negativa", `
      <p>Quando a base negativa está entre parênteses, o sinal depende da paridade do expoente.</p>
      <p class="pot-formula">(−3)² = (−3) × (−3) = +9</p>
      <p class="pot-formula">(−3)³ = (−3) × (−3) × (−3) = −27</p>
      <p>Expoente <b>par</b>: resultado positivo.</p>
      <p>Expoente <b>ímpar</b>: resultado negativo.</p>
      <p>Se o sinal de menos estiver fora dos parênteses:</p>
      <p class="pot-formula">−(−3)² = −9</p>
      <p class="pot-formula">−(−3)³ = +27</p>
      <p>Sem parênteses envolvendo a base, em −5², calculamos primeiro a potência:</p>
      <p class="pot-formula">−5² = −(5 × 5) = −25</p>
    `));

    for (const exp of [2, 3]) {
      for (const prefix of ["paren", "minus", "plus", "bare"]) {
        const a = rand(3, 9);
        const base = prefix === "bare" ? a : -a;
        let ans = power(Math.abs(base), exp);

        if (prefix === "paren" && base < 0 && exp % 2) ans = -ans;
        if (prefix === "minus") ans = -power(a, exp);
        if (prefix === "plus") ans = exp % 2 ? -power(a, exp) : power(a, exp);
        if (prefix === "bare") ans = -power(a, exp);

        const label = prefix === "paren"
          ? `(−${a})${exp === 2 ? "²" : "³"}`
          : prefix === "minus"
            ? `−(−${a})${exp === 2 ? "²" : "³"}`
            : prefix === "plus"
              ? `+(−${a})${exp === 2 ? "²" : "³"}`
              : `−${a}${exp === 2 ? "²" : "³"}`;

        out.push(choices(
          `${label} =`,
          [`+${Math.abs(ans)}`, `−${Math.abs(ans)}`, `+${Math.abs(ans) + 1}`, `−${Math.abs(ans) + 1}`],
          ans > 0 ? `+${ans}` : `${ans}`,
          `O resultado é ${ans}. ${exp % 2 === 0
            ? "Expoente par: o produto de fatores negativos é positivo."
            : "Expoente ímpar: permanece um fator negativo no produto."}`
        ));
      }
    }
    return out;
  }

  if (mode === "praticar-sinais") {
    const tipos = cfg.tipos?.length ? cfg.tipos : ["2", "3", "1"];

    for (let i = 0; i < 20; i++) {
      let exp = Number(pick(tipos));

      if (tipos.includes("1") && (i % 4 === 3 || i % 7 === 6)) {
        exp = rand(0, 99);
      } else if (exp === 1) {
        exp = rand(0, 99);
      }

      const base = exp === 1
        ? (Math.random() < 0.5 ? 1 : -1)
        : (Math.random() < 0.5 ? rand(2, 9) : -rand(2, 9));

      let value = power(base, exp);
      const outside = Math.random() < 0.25;
      if (outside) value = -value;

      const label = `${outside ? "−" : ""}${base < 0 ? `(${base})` : base}<sup>${exp}</sup>`;

      out.push(choices(
        `${label} = ?`,
        [`+${Math.abs(value)}`, `−${Math.abs(value)}`],
        value >= 0 ? `+${value}` : `−${Math.abs(value)}`,
        `O expoente é ${exp}. ${outside
          ? "Há um sinal de menos fora da potência, que troca o sinal do resultado."
          : exp === 0
            ? "Toda base não nula elevada a zero resulta em 1."
            : exp % 2 === 0
              ? "Expoente par: o resultado de uma base negativa entre parênteses é positivo."
              : "Expoente ímpar: o resultado de uma base negativa entre parênteses é negativo."}`
      ));
    }
    return out;
  }

  if (mode === "negativos") {
    out.push(lesson("Expoente negativo", `
      <p>Um expoente negativo indica que devemos inverter a fração e tornar o expoente positivo.</p>
      <p class="pot-formula">(a/b)<sup>−n</sup> = (b/a)<sup>n</sup></p>
      <p>Exemplo:</p>
      <p class="pot-formula">(3/7)<sup>−2</sup> = (7/3)² = 49/9</p>
      <p>O numerador e o denominador trocam de posição. Depois, elevamos os dois à potência indicada.</p>
    `));

    for (let i = 0; i < 10; i++) {
      let a = rand(1, 9);
      let b = rand(1, 9);

      while ((function gcd(x, y) {
        return y ? gcd(y, x % y) : x;
      })(a, b) !== 1) {
        a = rand(1, 9);
        b = rand(1, 9);
      }

      const e = rand(1, 2);

      out.push(input(
        `(${a}/${b})<sup>−${e}</sup> = ? (responda como numerador/denominador)`,
        `${b ** e}/${a ** e}`,
        `Invertemos a fração: (${b}/${a})${e === 1 ? "" : "²"} = ${b ** e}/${a ** e}.`,
        "Ex.: 49/9"
      ));
    }
    return out;
  }

  if (mode === "propriedades" || mode === "propriedades-inteiros") {
    const signed = mode === "propriedades-inteiros";

    out.push(lesson(
      signed ? "Propriedades com expoentes inteiros" : "Propriedades de potências de bases iguais",
      `
        <p>Vamos estudar três propriedades.</p>
        <p><b>Multiplicação:</b> conservamos a base e somamos os expoentes.</p>
        <p><b>Divisão:</b> conservamos a base e subtraímos o expoente do denominador do expoente do numerador.</p>
        <p><b>Potência de potência:</b> conservamos a base e multiplicamos os expoentes.</p>
        <p>${signed
          ? "Nesta etapa, os expoentes também podem ser negativos."
          : "Nesta etapa, trabalharemos com expoentes naturais."}</p>
      `
    ));

    const min = signed ? -12 : 1;
    const max = 8;

    for (const prop of ["mul", "div", "pot"]) {
      const a = pick(terms);
      let e1 = rand(min, max);
      let e2 = rand(min, max);

      if (signed && prop === "pot") {
        while (Math.abs(e1 * e2) >= 20) {
          e1 = rand(min, max);
          e2 = rand(min, max);
        }
      }

      let result, label, explain;

      if (prop === "mul") {
        result = e1 + e2;
        label = `${a}<sup>${e1}</sup> · ${a}<sup>${e2}</sup> = ${a}<sup>?</sup>`;
        explain = `Somamos os expoentes: ${e1} + (${e2}) = ${result}.`;
      }

      if (prop === "div") {
        result = e1 - e2;
        label = `${a}<sup>${e1}</sup> / ${a}<sup>${e2}</sup> = ${a}<sup>?</sup>`;
        explain = `Subtraímos os expoentes: ${e1} − (${e2}) = ${result}.`;
      }

      if (prop === "pot") {
        result = e1 * e2;
        label = `(${a}<sup>${e1}</sup>)<sup>${e2}</sup> = ${a}<sup>?</sup>`;
        explain = `Multiplicamos os expoentes: ${e1} × (${e2}) = ${result}.`;
      }

      out.push(input(label, result, explain));
      out.push(input(`Resolva novamente: ${label}`, result, explain));
    }
    return out;
  }

  if (mode === "base10") {
    out.push(lesson("Potências de base 10", `
      <p>Nas potências de base 10, o expoente indica quantas vezes o fator 10 aparece.</p>
      <p class="pot-formula">10¹ = 10</p>
      <p class="pot-formula">10² = 10 × 10 = 100</p>
      <p class="pot-formula">10³ = 1.000</p>
      <p class="pot-formula">10⁴ = 10.000</p>
      <p>Para expoentes naturais positivos, o resultado é 1 seguido de tantos zeros quanto indica o expoente.</p>
    `));

    for (let i = 0; i < 10; i++) {
      const e = rand(1, 5);
      out.push(input(
        `10<sup>${e}</sup> =`,
        10 ** e,
        `10 elevado a ${e} é 1 seguido de ${e} zero(s): ${10 ** e}.`
      ));
    }
    return out;
  }

  if (mode === "comparacao") {
    out.push(lesson("Comparando potências", `
      <p>Para comparar potências, podemos calcular cada uma e depois comparar os resultados.</p>
      <p>Use os sinais:</p>
      <p class="pot-formula">&gt; maior que &nbsp;&nbsp; &lt; menor que &nbsp;&nbsp; = igual a</p>
      <p>Exemplo: 2⁴ = 16 e 4² = 16. Portanto, 2⁴ = 4².</p>
    `));

    const pairs = [
      [2, 4, 4, 2], [3, 4, 9, 2], [2, 5, 4, 3],
      [3, 3, 2, 4], [5, 2, 2, 5], [2, 3, 3, 2],
      [4, 2, 2, 3], [3, 2, 2, 3], [2, 4, 8, 2],
      [3, 2, 9, 1]
    ];

    for (let i = 0; i < 15; i++) {
      let [a, e, b, f] = i < pairs.length
        ? pairs[i]
        : [rand(2, 5), rand(2, 4), rand(2, 5), rand(2, 4)];

      const x = a ** e;
      const y = b ** f;

      if (Math.max(x, y) > 10000) {
        i--;
        continue;
      }

      const answer = x > y ? ">" : x < y ? "<" : "=";

      out.push(choices(
        `${a}<sup>${e}</sup> ___ ${b}<sup>${f}</sup>`,
        [">", "<", "="],
        answer,
        `${a} elevado a ${e} é ${x}; ${b} elevado a ${f} é ${y}. Portanto, o sinal correto é ${answer}.`
      ));
    }
    return out;
  }

  if (mode === "area-volume") {
    out.push(lesson("Área do quadrado", `
      <p>A área mede a superfície de uma figura.</p>
      <p>No quadrado, multiplicamos a medida do lado por ela mesma.</p>
      <p class="pot-formula">Área = lado × lado = lado²</p>
      <p>Se o lado mede 3 cm: A = 3 × 3 = 9 cm².</p>
      <p>Observe que a unidade também fica elevada ao quadrado.</p>
    `));

    for (let i = 0; i < 5; i++) {
      const l = rand(1, 10);
      const u = pick(["m", "cm", "dm"]);

      out.push(input(
        `Qual é a área de um quadrado com lados medindo ${l} ${u}? Responda em ${u}².`,
        l * l,
        `Área = lado × lado = ${l} × ${l} = ${l * l} ${u}².`
      ));
    }

    out.push(lesson("Volume do cubo", `
      <p>O volume mede o espaço ocupado por um sólido.</p>
      <p>No cubo, multiplicamos a medida da aresta três vezes.</p>
      <p class="pot-formula">Volume = lado × lado × lado = lado³</p>
      <p>Se o lado mede 3 cm: V = 3 × 3 × 3 = 27 cm³.</p>
      <p>A unidade fica elevada ao cubo.</p>
    `));

    for (let i = 0; i < 5; i++) {
      const l = rand(1, 5);
      const u = pick(["m", "cm", "dm"]);

      out.push(input(
        `Qual é o volume de um cubo com lados medindo ${l} ${u}? Responda em ${u}³.`,
        l * l * l,
        `Volume = lado × lado × lado = ${l} × ${l} × ${l} = ${l * l * l} ${u}³.`
      ));
    }
    return out;
  }

  return out;
}

let filaPotencias = [];

export const potencias = {
  title: "Potenciação",
  description: "Compreenda as potências, pratique as propriedades e aplique seus conhecimentos.",

  modes: [
    ["conceito", "Conceito de potência", "Base, expoente e leitura"],
    ["naturais", "Potência de números naturais", "Expoentes 0, 1, 2 e 3"],
    ["sinais", "Sinais de potências com inteiros", "Parênteses e regra de sinais"],
    ["praticar-sinais", "Praticar sinais com inteiros", "Escolha positivo ou negativo"],
    ["negativos", "Potências com expoentes negativos", "Inversão de frações"],
    ["propriedades", "Propriedades de bases iguais", "Expoentes naturais"],
    ["propriedades-inteiros", "Propriedades com expoentes inteiros", "Expoentes positivos e negativos"],
    ["base10", "Potências de base 10", "Relação entre expoente e zeros"],
    ["comparacao", "Comparação de potências", "Maior, menor ou igual"],
    ["area-volume", "Calculando área e volume", "Quadrado e cubo"]
  ],

  configure(mode) {
    if (mode === "naturais") {
      return {
        html: `
          <div class="field-group">
            <span class="field-title">Escolha o expoente</span>
            <div class="choice-list">
              ${[0, 1, 2, 3].map(n => `
                <label class="choice">
                  <input type="radio" name="pot-exp" value="${n}" ${n === 0 ? "checked" : ""}> ${n}
                </label>
              `).join("")}
            </div>
          </div>

          <div class="field-group">
            <span class="field-title">Limite da base (para expoente 2)</span>
            <div class="choice-list">
              <label class="choice"><input type="radio" name="pot-limit" value="12" checked> Bases menores que 12</label>
              <label class="choice"><input type="radio" name="pot-limit" value="15"> Bases menores que 15</label>
              <label class="choice"><input type="radio" name="pot-limit" value="20"> Bases menores que 20</label>
            </div>
            <p class="inline-note">Para expoente 0 ou 1, as bases vão de 1 a 99. Para expoente 3, de 1 a 5.</p>
          </div>
        `,
        read: () => ({
          expoente: document.querySelector('[name="pot-exp"]:checked')?.value || "0",
          limite: document.querySelector('[name="pot-limit"]:checked')?.value || "12"
        })
      };
    }

    if (mode === "praticar-sinais") {
      return {
        html: `
          <div class="field-group">
            <span class="field-title">Escolha os tipos de potência</span>
            <div class="choice-list">
              ${[
                ["2", "Potência de 2"],
                ["3", "Potência de 3"],
                ["1", "Base 1 e −1"]
              ].map(([v, l]) => `
                <label class="choice">
                  <input type="checkbox" name="pot-sign" value="${v}" checked> ${l}
                </label>
              `).join("")}
            </div>
            <p class="inline-note">Se nenhuma opção for alterada, serão praticados os três tipos.</p>
          </div>
        `,
        read: () => ({
          tipos: [...document.querySelectorAll('[name="pot-sign"]:checked')].map(x => x.value)
        })
      };
    }

    return {
      html: '<p class="inline-note">A atividade apresentará explicações e questões em sequência.</p>',
      read: () => ({})
    };
  },

  generate(mode, cfg) {
    if (!filaPotencias.length) filaPotencias = modeQuestions(mode, cfg || {});
    return filaPotencias.shift();
  },

  count(mode, cfg) {
    filaPotencias = modeQuestions(mode, cfg || {});
    return filaPotencias.length;
  },

  render(q) {
    if (q.kind === "pot-lesson") {
      return {
        label: "LEITURA E APRENDIZAGEM",
        question: `<div class="pot-lesson"><h3>${q.title}</h3>${q.html}</div>`,
        answer: "",
        button: "Continuar",
        lesson: true
      };
    }

    if (q.kind === "pot-choice") {
      return {
        label: "ESCOLHA A RESPOSTA",
        question: `<div class="pot-question">${q.title}</div>`,
        answer: `
          <div class="pot-options">
            ${q.values.map(v => `
              <button type="button" class="pot-option" data-pot-value="${esc(v.replace(/<[^>]*>/g, ""))}">
                ${v}
              </button>
            `).join("")}
          </div>
        `,
        button: "Conferir"
      };
    }

    return {
      label: "RESOLVA A QUESTÃO",
      question: `<div class="pot-question">${q.title}</div>`,
      answer: `<input class="pot-input" id="potAnswer" inputmode="text" placeholder="${esc(q.placeholder || "Digite sua resposta")}">`,
      button: "Conferir"
    };
  },

  check(q) {
    let value;

    if (q.kind === "pot-choice") {
      value = document.querySelector("[data-pot-value].chosen")?.dataset.potValue;
    } else {
      value = document.getElementById("potAnswer")?.value.trim();
    }

    if (value == null || value === "") return { empty: true };

    const norm = s => String(s).replace(/\s/g, "").replace(/^\+/, "");

    return {
      correct: norm(value) === norm(q.answer),
      explanation: q.explanation,
      answer: q.answer
    };
  }
};
