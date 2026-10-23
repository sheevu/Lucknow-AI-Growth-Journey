import sharp from "sharp";
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { resolve, relative, join, extname, basename } from "node:path";

const root = resolve(import.meta.dirname, "..");
const publicDir = join(root, "public");
const output = join(publicDir, "optimized");
await mkdir(output, { recursive: true });
async function collect(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (path === output) continue;
    if (entry.isDirectory()) files.push(...await collect(path));
    else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) files.push(path);
  }
  return files.sort();
}
const manifest = {};
for (const path of await collect(publicDir)) {
  const raw = await readFile(path);
  const avif = ["ai-creativity.webp", "ai-city-concept.webp"].includes(basename(path));
  const format = avif ? "avif" : "webp";
  const digest = createHash("sha256").update(raw).update(avif ? "avif-quality-45-v1" : "webp-quality-72-v2").digest("hex").slice(0, 12);
  const metadata = await sharp(raw).metadata();
  const rotated = [5, 6, 7, 8].includes(metadata.orientation);
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;
  const widths = [...new Set([...([400, 800, 1200].filter(w => w < width)), Math.min(width, 1200)])].sort((a, b) => a - b);
  const variants = [];
  for (const w of widths) {
    const filename = `${basename(path, extname(path))}-${digest}-${w}.${format}`;
    const target = join(output, filename);
    try { await stat(target); }
    catch {
      const image = sharp(raw).rotate().resize({ width: w, withoutEnlargement: true });
      await (avif ? image.avif({ quality: 45, effort: 4 }) : image.webp({ quality: 72, effort: 4 })).toFile(target);
    }
    variants.push({ src: `/optimized/${filename}`, width: w });
  }
  manifest["/" + relative(publicDir, path).split("\\").join("/")] = { width, height, variants };
}
await writeFile(join(root, "lib/image-manifest.json"), JSON.stringify(manifest) + "\n");
console.log(`Prepared ${Object.keys(manifest).length} responsive image families`);
