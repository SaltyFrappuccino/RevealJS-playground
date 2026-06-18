import { diagonalDominance, isNearZero, normInf, residual, roundClean } from "../core/matrix.js";

export function solveGaussSeidel(A, b, options = {}) {
  const n = A.length;
  const tolerance = Number(options.tolerance || 1e-8);
  const maxIterations = Number(options.maxIterations || 80);
  const x = Array(n).fill(0);
  const history = [];
  const dominance = diagonalDominance(A);

  for (let i = 0; i < n; i += 1) {
    if (isNearZero(A[i][i])) throw new Error("На главной диагонали есть нулевой элемент.");
  }

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const previous = x.slice();
    for (let i = 0; i < n; i += 1) {
      let sum = b[i];
      for (let j = 0; j < n; j += 1) {
        if (i !== j) sum -= A[i][j] * x[j];
      }
      x[i] = roundClean(sum / A[i][i]);
    }

    const delta = normInf(x.map((value, index) => value - previous[index]));
    const r = residual(A, x, b).normInf;
    history.push({ iteration, x: x.slice(), delta, residual: r });

    if (delta <= tolerance || r <= tolerance) {
      return {
        name: "Метод Гаусса-Зейделя",
        x: x.map(roundClean),
        iterations: iteration,
        converged: true,
        history,
        dominance
      };
    }
  }

  return {
    name: "Метод Гаусса-Зейделя",
    x: x.map(roundClean),
    iterations: maxIterations,
    converged: false,
    history,
    dominance
  };
}
