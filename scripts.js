const displayPrincipal = document.querySelector(".display-principal");
const numericalExpression = document.querySelector(".numerical-expression");

let expression = "";
let overwrite = false;

const updateDisplay = () => {
  displayPrincipal.textContent = expression || "0";

  // Tenta calcular resultado
  try {
    const liveResult = Function(`return (${expression})`)();
    if (expression && expression !== liveResult.toString()) {
      numericalExpression.textContent = "= " + liveResult;
    } else {
      numericalExpression.textContent = "";
    }
  } catch {
    numericalExpression.textContent = "";
  }
};

const saveNumber = (value) => {
  if (overwrite) {
    expression = value;
    overwrite = false;
  } else {
    expression += value;
  }
  updateDisplay();
};

const clearDisplay = () => {
  expression = "";
  overwrite = false;
  displayPrincipal.textContent = "0";
  numericalExpression.textContent = "";
};

const deleteLast = () => {
  if (overwrite) return;
  expression = expression.slice(0, -1);
  updateDisplay();
};

const addOperator = (op) => {
  if (overwrite) overwrite = false;
  const lastChar = expression.slice(-1);
  if ("+-*/**".includes(lastChar)) {
    expression = expression.slice(0, -1);
  }
  expression += op;
  updateDisplay();
};

const add = () => addOperator("+");
const subtract = () => addOperator("-");
const multiply = () => addOperator("*");
const divide = () => addOperator("/");
const exponent = () => addOperator("**");

const percentage = () => {
  expression += "/100";
  updateDisplay();
};

const sqrt = () => {
  expression += "**0.5";
  updateDisplay();
};

let parenthesesState = true;
const saveParenteses = () => {
  const lastChar = expression.slice(-1);
  const open = parenthesesState ? "(": ")";

  // Verifica se precisa adicionar '*' antes do parêntese
  if (
    (open === "(" && /\d|\)/.test(lastChar)) || // número ou ')'
    (open === ")" && lastChar === "(") // caso raro de "(()"
  ) {
    expression += "*" + open;
  } else {
    expression += open;
  }
  parenthesesState = !parenthesesState;
  updateDisplay();
};

const changeSignal = () => {
  const match = expression.match(/(-?\d+\.?\d*)$/);
  if (match) {
    const number = match[0];
    const inverted = number.startsWith("-") ? number.slice(1): "-" + number;
    expression = expression.replace(/(-?\d+\.?\d*)$/, inverted);
    updateDisplay();
  }
};

const equal = () => {
  try {
    const result = Function(`return (${expression})`)();
    displayPrincipal.textContent = result;
    numericalExpression.textContent = "";
    expression = result.toString();
    overwrite = true;
  } catch {
    displayPrincipal.textContent = "Erro";
    numericalExpression.textContent = "";
    expression = "";
    overwrite = false;
  }
};