import { build } from "esbuild";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist/pages");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "dist/client"), output, { recursive: true });
await build({
  entryPoints: [resolve(root, "dist/server/index.js")],
  outfile: resolve(output, "_worker.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  external: ["node:*", "cloudflare:*"],
  minify: true,
});
await writeFile(resolve(output, "_routes.json"), JSON.stringify({ version: 1, include: ["/*"], exclude: ["/assets/*", "/optimized/*"] }));
await writeFile(resolve(output, "_headers"), "/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/optimized/*\n  Cache-Control: public, max-age=31536000, immutable\n");
console.log("Prepared Cloudflare Pages SSR deployment in dist/pages");
