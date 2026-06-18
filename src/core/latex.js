import { residual } from "./matrix.js";

export function formatNumber(value) {
  const clean = Math.abs(value) < 1e-12 ? 0 : value;
  if (Number.isInteger(clean)) return String(clean);
  return Number(clean.toPrecision(7)).toString();
}

export function matrixToTex(matrix) {
  return `\\begin{bmatrix}${matrix.map((row) => row.map(formatNumber).join(" & ")).join("\\\\")}\\end{bmatrix}`;
}

export function vectorToTex(vector) {
  return `\\begin{bmatrix}${vector.map(formatNumber).join("\\\\")}\\end{bmatrix}`;
}

export function systemToTex(A, b) {
  return `${matrixToTex(A)}x=${vectorToTex(b)}`;
}

export function solutionToTex(x) {
  return `x=${vectorToTex(x)}`;
}

export function residualToTex(A, x, b) {
  const r = residual(A, x, b);
  return `r=Ax-b=${vectorToTex(r.vector)},\\quad \\|r\\|_\\infty=${formatNumber(r.normInf)},\\quad \\|r\\|_2=${formatNumber(r.norm2)}`;
}

export function renderTex(element, tex, displayMode = true) {
  if (!element || !window.katex) return;
  window.katex.render(tex, element, {
    displayMode,
    throwOnError: false,
    strict: false,
    trust: true
  });
}

export function renderDocumentMath(root = document) {
  root.querySelectorAll("[data-tex]").forEach((element) => {
    renderTex(element, element.dataset.tex, element.dataset.display !== "inline");
  });
}
