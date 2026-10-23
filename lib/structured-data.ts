import { siteUrl } from "@/lib/site";

// Keep publisher identity consistent across the homepage and every article.
// Registered office matches the published corporate record (CIN U62099UP2025OPC223943).
export const publisherSchema = {
  "@type": "Organization",
  "@id": siteUrl("/#publisher"),
  name: "Vyapai",
  legalName: "NAVA-NETRA NEURAL SUDARSHAN LABS (OPC) PRIVATE LIMITED",
  alternateName: "Lucknow AI Digital Journey",
  url: siteUrl("/"),
  telephone: "+91-7080842220",
  address: {
    "@type": "PostalAddress",
    streetAddress: "C-469/C, Indira Nagar, Near HAL",
    addressLocality: "Lucknow",
    addressRegion: "Uttar Pradesh",
    postalCode: "226016",
    addressCountry: "IN",
  },
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
