import manifest from "./image-manifest.json";
import { SITE_BASE_PATH, sitePath } from "./site";

type ImageEntry = { width: number; height: number; variants: { src: string; width: number }[] };
const images = manifest as Record<string, ImageEntry>;
export const HERO_SIZES = "(max-width: 600px) calc(100vw - 44px), (max-width: 1100px) 680px, 46vw";
export function responsiveImage(src: string, sizes = "(max-width: 600px) calc(100vw - 32px), (max-width: 1100px) 50vw, 40vw") {
  const local = SITE_BASE_PATH && src.startsWith(SITE_BASE_PATH + "/") ? src.slice(SITE_BASE_PATH.length) : src;
  const image = images[local];
  if (!image) return { src, width: 1200, height: 800 };
  return {
    src: sitePath(image.variants.at(-1)!.src),
    srcSet: image.variants.map(v => `${sitePath(v.src)} ${v.width}w`).join(", "),
    sizes,
    width: image.width,
    height: image.height,
  };
}
