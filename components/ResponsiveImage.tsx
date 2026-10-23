import type { ImgHTMLAttributes } from "react";
import { responsiveImage } from "@/lib/responsive-image";

export function ResponsiveImage({ src, sizes, ...props }: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string }) {
  return <img {...responsiveImage(src, sizes)} decoding="async" {...props} />;
}
