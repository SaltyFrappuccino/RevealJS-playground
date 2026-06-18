const eps = 1e-12;

export function cloneMatrix(matrix) {
  return matrix.map((row) => row.slice());
}

export function parseSystem(input) {
  const rows = input
    .replace(/\r/g, "")
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length === 0) throw new Error("Введите хотя бы одно уравнение.");

  const parsed = rows.map((line) => {
    const normalized = line.replace(/,/g, ".");
    const parts = normalized.includes("|")
      ? normalized.split("|").map((part) => extractNumbers(part))
      : [extractNumbers(normalized)];

    if (parts.length === 2) {
      if (parts[1].length !== 1) throw new Error("После символа | должно быть одно свободное значение.");
      return { coefficients: parts[0], value: parts[1][0] };
    }

    const numbers = parts[0];
    if (numbers.length < 2) throw new Error("В строке должно быть минимум два числа.");
    return { coefficients: numbers.slice(0, -1), value: numbers.at(-1) };
  });

  const n = parsed.length;
  if (!parsed.every((row) => row.coefficients.length === n)) {
    throw new Error("Матрица коэффициентов должна быть квадратной.");
  }

  return {
    A: parsed.map((row) => row.coefficients),
    b: parsed.map((row) => row.value),
    n
  };
}

export function extractNumbers(text) {
  const matches = text.match(/[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi);
  if (!matches) return [];
  return matches.map(Number);
}

export function augment(A, b) {
  return A.map((row, index) => [...row, b[index]]);
}

export function multiplyMatrixVector(A, x) {
  return A.map((row) => row.reduce((sum, value, index) => sum + value * x[index], 0));
}

export function subtractVectors(a, b) {
  return a.map((value, index) => value - b[index]);
}

export function normInf(vector) {
  return Math.max(...vector.map((value) => Math.abs(value)));
}

export function norm2(vector) {
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
}

export function residual(A, x, b) {
  const r = subtractVectors(multiplyMatrixVector(A, x), b);
  return {
    vector: r,
    normInf: normInf(r),
    norm2: norm2(r)
  };
}

export function isNearZero(value) {
  return Math.abs(value) < eps;
}

export function roundClean(value) {
  if (Math.abs(value) < eps) return 0;
  return value;
}

export function diagonalDominance(A) {
  return A.map((row, i) => {
    const diagonal = Math.abs(row[i]);
    const rest = row.reduce((sum, value, j) => sum + (i === j ? 0 : Math.abs(value)), 0);
    return { diagonal, rest, ok: diagonal >= rest };
  });
}
