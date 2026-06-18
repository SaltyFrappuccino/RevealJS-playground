export const examples = {
  easy2: {
    label: "2x2",
    input: "4 1 | 9\n2 3 | 13"
  },
  stable3: {
    label: "3x3",
    input: "10 -1 2 | 6\n-1 11 -1 | 22\n2 -1 10 | -10"
  },
  wide4: {
    label: "4x4",
    input: "12 -1 2 0 | 20\n-1 13 -1 2 | 30\n2 -1 14 -1 | 10\n0 2 -1 15 | 40"
  },
  exact4: {
    label: "Контроль",
    input: "3 1 -1 2 | 10\n2 4 1 -1 | 13\n-1 2 5 1 | 7\n1 -1 2 6 | 18"
  }
};

export function createRandomDominantSystem(size = 4) {
  const x = Array.from({ length: size }, (_, index) => index + 1);
  const A = Array.from({ length: size }, (_, i) => {
    const row = Array.from({ length: size }, (_, j) => {
      if (i === j) return 0;
      return ((i + 2) * (j + 3)) % 5 - 2;
    });
    row[i] = row.reduce((sum, value) => sum + Math.abs(value), 0) + size + i + 2;
    return row;
  });
  const b = A.map((row) => row.reduce((sum, value, index) => sum + value * x[index], 0));
  return A.map((row, index) => `${row.join(" ")} | ${b[index]}`).join("\n");
}
