import { siteUrl } from "@/lib/site";

// Keep publisher identity consistent across the homepage and every article.
// A complete street address has not been verified, so do not publish a partial one.
export const publisherSchema = {
  "@type": "Organization",
  "@id": siteUrl("/#publisher"),
  name: "Vyapai",
  alternateName: "Lucknow AI Digital Journey",
  url: siteUrl("/"),
  telephone: "+91-7080842220",
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "City", name: "Lucknow" },
  ],
  image: siteUrl("/og.png"),
  logo: { "@type": "ImageObject", url: siteUrl("/logo.png"), width: 512, height: 512 },
};

// Legacy imports contain calendar dates, not recorded publication times.
// Use the start of that calendar day in the publication's local time zone.
export function schemaDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+05:30` : value;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(date)) return undefined;
  return Number.isNaN(Date.parse(date)) ? undefined : date;
}
