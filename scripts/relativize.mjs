// After build: make asset paths in dist relative (./_astro/, ./img/), so the demo opens from any sub-folder
// (GitHub Pages /veon-demo-zavet/) and from file:// alike. Works for any --base value.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const walk = async (dir) => (await Promise.all((await readdir(dir, { withFileTypes: true })).map((e) => {
  const p = join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
}))).flat();

let changed = 0;
for (const file of await walk(dist)) {
  if (file.endsWith(".html")) {
    const depth = file.slice(dist.length).split("/").length - 1;
    const up = depth ? "../".repeat(depth) : "./";
    const src = await readFile(file, "utf8");
    const out = src.replace(/(^|[\s"'(,=])\/(?:[\w.-]+\/)*?(_astro|img)\//g, (_m, pre, dir) => `${pre}${up}${dir}/`);
    if (out !== src) { await writeFile(file, out); changed++; }
  } else if (file.endsWith(".css")) {
    const src = await readFile(file, "utf8");
    const out = src
      .replace(/url\((["']?)\/(?:[\w.-]+\/)*?_astro\//g, "url($1./")
      .replace(/url\((["']?)\/(?:[\w.-]+\/)*?img\//g, "url($1../img/");
    if (out !== src) { await writeFile(file, out); changed++; }
  }
}
console.log(`relativize: ${changed} file(s) updated`);
