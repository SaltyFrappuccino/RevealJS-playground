import { augment, cloneMatrix, isNearZero, roundClean } from "../core/matrix.js";
import { matrixToTex, vectorToTex } from "../core/latex.js";

export function solveGauss(A, b) {
  const n = A.length;
  const M = augment(cloneMatrix(A), b.slice());
  const steps = [];

  for (let k = 0; k < n - 1; k += 1) {
    let pivot = k;
    for (let i = k + 1; i < n; i += 1) {
      if (Math.abs(M[i][k]) > Math.abs(M[pivot][k])) pivot = i;
    }

    if (isNearZero(M[pivot][k])) throw new Error("Система не имеет единственного решения.");
    if (pivot !== k) {
      [M[k], M[pivot]] = [M[pivot], M[k]];
      steps.push(`${rowSymbol(k + 1)}↔${rowSymbol(pivot + 1)}`);
    }

    for (let i = k + 1; i < n; i += 1) {
      const factor = M[i][k] / M[k][k];
      for (let j = k; j <= n; j += 1) {
        M[i][j] = roundClean(M[i][j] - factor * M[k][j]);
      }
      steps.push(formatEliminationStep(i + 1, k + 1, factor));
    }
  }

  if (isNearZero(M[n - 1][n - 1])) throw new Error("Система не имеет единственного решения.");

  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    const sum = x.reduce((acc, value, j) => (j > i ? acc + M[i][j] * value : acc), 0);
    x[i] = roundClean((M[i][n] - sum) / M[i][i]);
  }

  return {
    name: "Метод Гаусса",
    x,
    steps,
    matrixTex: matrixToTex(M.map((row) => row.slice(0, n))),
    vectorTex: vectorToTex(M.map((row) => row[n]))
  };
}

function formatFactor(value) {
  const clean = Math.abs(value) < 1e-12 ? 0 : value;
  return Number(clean.toPrecision(6)).toString();
}

function rowSymbol(index) {
  return `R_{${index}}`;
}

function formatEliminationStep(target, source, factor) {
  const sign = factor < 0 ? "+" : "-";
  return `${rowSymbol(target)}<-${rowSymbol(target)}${sign}${formatFactor(Math.abs(factor))}${rowSymbol(source)}`;
}
