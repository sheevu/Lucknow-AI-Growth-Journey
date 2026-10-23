import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import postcss, { type Container, type ChildNode } from "postcss";
import type { Plugin } from "vite";

// Derive the first-screen rules from the shared stylesheet to prevent drift.
const firstScreen = /^(?::root|\*|html\b|body\b|a\b|img\b|::selection|\.(?:ecosystem-|eco-sep|ink-progress|comic-(?:nav|brand|links|hero)|brand-copy|nav-pop|mobile-index|burst-lines|hero-|issue-line|pop-button|panel-label|tape|sound-effect|effect-|library-(?:shell|nav|mobile-nav|hero|kicker|breadcrumb)|category-hero|author-archive-hero|article-(?:hero|deck|byline|eyebrow|labels)))/;

export function criticalCss(): Plugin {
  let root = process.cwd();
  return {
    name: "site-critical-css",
    configResolved(config) { root = config.root; },
    resolveId(id) { if (id === "virtual:critical-css") return "\0virtual:critical-css"; },
    load(id) {
      if (id !== "\0virtual:critical-css") return;
      const path = resolve(root, "app/globals.css");
      this.addWatchFile(path);
      const source = readFileSync(path, "utf8");
      const select = (container: Container): Container => {
        const result = container.clone({ nodes: [] });
        for (const node of container.nodes ?? []) {
          if (node.type === "rule") {
            const selectors = node.selectors.filter(s => firstScreen.test(s.trim()));
            if (selectors.length) result.append(node.clone({ selectors }));
          } else if (node.type === "atrule" && node.name === "media") {
            const selected = select(node);
            if (selected.nodes?.length) result.append(selected as ChildNode);
          }
        }
        return result;
      };
      const css = select(postcss.parse(source)).toString().replace(/\s+/g, " ");
      const version = createHash("sha256").update(source).digest("hex").slice(0, 12);
      return `export default ${JSON.stringify(css)}; export const stylesVersion = ${JSON.stringify(version)};`;
    },
  };
}
