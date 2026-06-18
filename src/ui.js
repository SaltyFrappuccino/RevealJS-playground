import { parseSystem, residual } from "./core/matrix.js";
import { renderTex, solutionToTex, systemToTex, vectorToTex } from "./core/latex.js";
import { examples, createRandomDominantSystem } from "./examples.js";
import { solveGauss } from "./methods/gauss.js";
import { solveGaussJordan } from "./methods/gaussJordan.js";
import { solveGaussSeidel } from "./methods/gaussSeidel.js";
import { renderIterationChart } from "./charts.js";

const methods = {
  gauss: solveGauss,
  jordan: solveGaussJordan,
  seidel: solveGaussSeidel
};

export function initSolver() {
  const app = document.querySelector("#solverApp");
  if (!app || app.dataset.ready) return;
  app.dataset.ready = "true";

  const input = app.querySelector("#systemInput");
  const method = app.querySelector("#methodSelect");
  const tolerance = app.querySelector("#toleranceInput");
  const iterations = app.querySelector("#iterationInput");
  const preview = app.querySelector("#systemPreview");
  const result = app.querySelector("#solverResult");
  const residualBox = app.querySelector("#residualResult");
  const steps = app.querySelector("#solverSteps");
  const chart = app.querySelector("#iterationChart");
  const status = app.querySelector("#solverStatus");
  const compare = app.querySelector("#compareResult");

  input.value = examples.stable3.input;

  app.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = examples[button.dataset.example].input;
      updatePreview();
      solve();
    });
  });

  const randomSize = app.querySelector("#randomSize");
  const clampRandomSize = () => {
    const size = Math.min(6, Math.max(2, Math.round(Number(randomSize?.value) || 4)));
    if (randomSize) randomSize.value = String(size);
    return size;
  };
  randomSize?.addEventListener("change", clampRandomSize);
  app.querySelector("[data-random]").addEventListener("click", () => {
    const size = clampRandomSize();
    input.value = createRandomDominantSystem(size);
    updatePreview();
    solve();
  });

  app.querySelector("[data-solve]").addEventListener("click", solve);
  app.querySelector("[data-compare]").addEventListener("click", compareAll);
  enhanceMethodSelect(method);
  input.addEventListener("input", updatePreview);
  method.addEventListener("change", solve);
  tolerance.addEventListener("change", solve);
  iterations.addEventListener("change", solve);

  updatePreview();
  solve();

  function updatePreview() {
    try {
      const { A, b } = parseSystem(input.value);
      renderTex(preview, systemToTex(A, b));
      status.textContent = `${A.length} уравнений, ${A.length} неизвестных`;
      status.className = "solver-status good";
    } catch (error) {
      preview.textContent = error.message;
      status.textContent = "Проверьте формат ввода";
      status.className = "solver-status bad";
    }
  }

  function solve() {
    compare.innerHTML = "";
    chart.innerHTML = "";
    try {
      const { A, b } = parseSystem(input.value);
      const selected = method.value;
      const payload = selected === "seidel"
        ? methods[selected](A, b, { tolerance: tolerance.value, maxIterations: iterations.value })
        : methods[selected](A, b);

      renderTex(result, solutionToTex(payload.x));
      renderTex(residualBox, solverResidualToTex(A, payload.x, b));
      renderSteps(steps, payload);
      renderIterationChart(chart, payload);
      status.textContent = statusText(payload, A, b);
      status.className = "solver-status good";
    } catch (error) {
      result.textContent = error.message;
      residualBox.textContent = "";
      steps.innerHTML = "";
      chart.innerHTML = "";
      status.textContent = "Решение не построено";
      status.className = "solver-status bad";
    }
  }

  function compareAll() {
    compare.innerHTML = "";
    try {
      const { A, b } = parseSystem(input.value);
      const rows = [
        methods.gauss(A, b),
        methods.jordan(A, b),
        methods.seidel(A, b, { tolerance: tolerance.value, maxIterations: iterations.value })
      ];
      rows.forEach((row) => {
        const item = document.createElement("div");
        item.className = "compare-row";
        const title = document.createElement("strong");
        title.textContent = row.name;
        const tex = document.createElement("span");
        renderTex(tex, `x=${vectorToTex(row.x)},\\quad \\|r\\|_\\infty=${format(residual(A, row.x, b).normInf)}`, false);
        item.append(title, tex);
        compare.append(item);
      });
    } catch (error) {
      compare.textContent = error.message;
    }
  }
}

function enhanceMethodSelect(select) {
  if (!select || select.dataset.enhanced) return;
  select.dataset.enhanced = "true";

  const wrapper = document.createElement("div");
  wrapper.className = "method-picker";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "method-picker-trigger";
  const list = document.createElement("div");
  list.className = "method-picker-list";

  [...select.options].forEach((option) => {
    const item = document.createElement("button");
    item.type = "button";
    item.dataset.value = option.value;
    item.textContent = option.textContent;
    item.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      wrapper.classList.remove("open");
      update();
    });
    list.append(item);
  });

  trigger.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    wrapper.classList.toggle("open");
  });
  document.addEventListener("click", (event) => {
    if (!wrapper.contains(event.target)) wrapper.classList.remove("open");
  });

  select.classList.add("native-select-hidden");
  wrapper.append(trigger, list);
  select.insertAdjacentElement("afterend", wrapper);
  update();

  function update() {
    trigger.textContent = select.options[select.selectedIndex].textContent;
    list.querySelectorAll("button").forEach((item) => {
      item.classList.toggle("active", item.dataset.value === select.value);
    });
  }
}

function renderSteps(container, payload) {
  container.innerHTML = "";
  if (payload.history) {
    const last = payload.history.at(-1);
    const list = [
      `\\text{Старт: }x^{(0)}=(0,\\dots,0)^T`,
      `\\text{Итераций: }${payload.iterations}`,
      `\\text{Сходимость: }\\text{${payload.converged ? "достигнута" : "не достигнута за лимит"}}`,
      `\\text{Последнее изменение: }${format(last.delta)}`
    ];
    list.forEach((tex) => appendFormula(container, tex));
    return;
  }

  payload.steps.slice(0, 6).forEach((tex) => appendFormula(container, tex));
  if (payload.steps.length > 6) appendFormula(container, `\\text{ещё ${payload.steps.length - 6} шагов}` );
}

function appendFormula(container, tex) {
  const item = document.createElement("div");
  item.className = "step-formula";
  renderTex(item, tex, false);
  container.append(item);
}

function statusText(payload, A, b) {
  const r = residual(A, payload.x, b).normInf;
  if (payload.history) return `${payload.name}: ${payload.iterations} итераций, невязка ${format(r)}`;
  return `${payload.name}: решение найдено, невязка ${format(r)}`;
}

function solverResidualToTex(A, x, b) {
  const r = residual(A, x, b);
  return `\\begin{gathered}r=Ax-b=${vectorToTex(r.vector)}\\\\\\|r\\|_\\infty=${format(r.normInf)}\\end{gathered}`;
}

function format(value) {
  if (Math.abs(value) < 1e-12) return "0";
  return Number(value.toPrecision(6)).toString();
}
