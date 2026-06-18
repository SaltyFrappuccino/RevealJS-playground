import { augment, cloneMatrix, isNearZero, roundClean } from "../core/matrix.js";
import { matrixToTex, vectorToTex } from "../core/latex.js";

export function solveGaussJordan(A, b) {
  const n = A.length;
  const M = augment(cloneMatrix(A), b.slice());
  const steps = [];

  for (let k = 0; k < n; k += 1) {
    let pivot = k;
    for (let i = k + 1; i < n; i += 1) {
      if (Math.abs(M[i][k]) > Math.abs(M[pivot][k])) pivot = i;
    }

    if (isNearZero(M[pivot][k])) throw new Error("Система не имеет единственного решения.");
    if (pivot !== k) {
      [M[k], M[pivot]] = [M[pivot], M[k]];
      steps.push(`${rowSymbol(k + 1)}↔${rowSymbol(pivot + 1)}`);
    }

    const divisor = M[k][k];
    for (let j = 0; j <= n; j += 1) M[k][j] = roundClean(M[k][j] / divisor);
    steps.push(`${rowSymbol(k + 1)}<-\\frac{${rowSymbol(k + 1)}}{${formatFactor(divisor)}}`);

    for (let i = 0; i < n; i += 1) {
      if (i === k) continue;
      const factor = M[i][k];
      for (let j = 0; j <= n; j += 1) {
        M[i][j] = roundClean(M[i][j] - factor * M[k][j]);
      }
      steps.push(formatEliminationStep(i + 1, k + 1, factor));
    }
  }

  return {
    name: "Метод Гаусса-Жордана",
    x: M.map((row) => roundClean(row[n])),
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
