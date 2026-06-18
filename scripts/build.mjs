import { access, cp, mkdir, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function copy(name) {
  const from = new URL(name, root);
  const to = new URL(name, dist);

  if (await exists(from)) {
    await cp(from, to, { recursive: true });
  }
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const name of [
  "index.html",
  "assets",
  "slides",
  "src",
  "styles",
  "vendor"
]) {
  await copy(name);
}

console.log("Build complete: dist/");