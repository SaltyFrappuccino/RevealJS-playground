import { readFileSync } from "node:fs";

const files = ["index.html", "slides/main.md", "styles/theme.css"];
const external = /\bhttps?:\/\//i;
const hits = files.flatMap((file) => {
  const content = readFileSync(file, "utf8");
  return external.test(content) ? [file] : [];
});

if (hits.length) {
  console.error(`Найдены зависимости: ${hits.join(", ")}`);
  process.exit(1);
}