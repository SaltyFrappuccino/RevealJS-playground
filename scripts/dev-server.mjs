import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.env.PORT || 4173);

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
  [".map", "application/json; charset=utf-8"]
]);

function targetPath(url) {
  const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const clean = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const absolute = resolve(join(root, clean));
  if (!absolute.startsWith(root)) return null;
  if (existsSync(absolute) && statSync(absolute).isDirectory()) return join(absolute, "index.html");
  return absolute;
}

createServer((request, response) => {
  const file = targetPath(request.url);
  if (!file || !existsSync(file)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": types.get(extname(file)) || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  createReadStream(file).pipe(response);
}).listen(port, () => {
  console.log(`http://localhost:${port}`);
});
