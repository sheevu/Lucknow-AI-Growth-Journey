import { publisherSchema } from "@/lib/structured-data";
import { siteUrl, sitePath } from "@/lib/site";
import type { Metadata } from "next";
import criticalStyles, { stylesVersion } from "virtual:critical-css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl("/")),
  title: "Lucknow’s AI Growth Journey | Sudarshan AI Labs",
  description: "Explore AI, digital marketing, local SEO and business automation guides for Indian MSMEs, published from Lucknow by Sudarshan AI Labs.",
  keywords: [
    "MSME Growth in India",
    "Artificial Intelligence for Small Business",
    "Business Automation",
    "Digital Marketing",
    "SEO and Local Search",
    "Social Media and Content",
    "Retail, E-commerce and Quick Commerce",
    "Technology and Digital Security",
    "Sales, CRM and Customer Retention",
    "Lucknow MSMEs",
  ],
  authors: [{ name: "Lucknow AI Digital Journey Editorial Desk", url: siteUrl("/") }],
  creator: "Lucknow AI Digital Journey Editorial Desk",
  publisher: "Vyapai",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  alternates: {
    canonical: siteUrl("/"),
  },
  openGraph: {
    title: "Lucknow’s AI Growth Journey | Sudarshan AI Labs",
    description: "Explore AI, digital marketing, local SEO and business automation guides for Indian MSMEs, published from Lucknow by Sudarshan AI Labs.",
    type: "website",
    locale: "en_IN",
    url: siteUrl("/"),
    siteName: "Blogs and Articles for Lucknow AI Digital Journey",
    images: [{ url: siteUrl("/og.png"), width: 1200, height: 630, alt: "Blogs and Articles for Lucknow AI Digital Journey" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucknow’s AI Growth Journey | Sudarshan AI Labs",
    description: "Explore AI, digital marketing, local SEO and business automation guides for Indian MSMEs, published from Lucknow by Sudarshan AI Labs.",
    images: [siteUrl("/og.png")],
  },
  icons: { icon: siteUrl("/favicon.svg"), shortcut: siteUrl("/favicon.svg") },
};

const BASE = siteUrl("/").replace(/\/$/, "");
const PUBLISHER_ID = `${BASE}/#publisher`;
const BLOG_ID = `${BASE}/#blog`;

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    publisherSchema,
    {
      "@type": "WebSite",
      "@id": siteUrl("/#website"),
      name: "AI & Digital Marketing Tips for Indian Businesses",
      url: siteUrl("/"),
      inLanguage: "en-IN",
      publisher: { "@id": PUBLISHER_ID },
    },
    {
      "@type": "Blog",
      "@id": BLOG_ID,
      name: "Blogs and Articles for Lucknow AI Digital Journey",
      alternateName: "Lucknow AI Digital Journey",
      url: `${BASE}/`,
      description: "Practical AI, digital marketing, SEO, automation, e-commerce, retail and growth guides created to help MSMEs and small businesses across India.",
      inLanguage: "en-IN",
      publisher: {
        "@id": PUBLISHER_ID,
      },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "MSMEs, small businesses, retailers, founders and entrepreneurs in India",
      },
      about: [
        { "@type": "Thing", name: "MSME Growth in India" },
        { "@type": "Thing", name: "Artificial Intelligence for Small Business" },
        { "@type": "Thing", name: "Business Automation" },
        { "@type": "Thing", name: "Digital Marketing" },
        { "@type": "Thing", name: "SEO and Local Search" },
        { "@type": "Thing", name: "Social Media and Content" },
        { "@type": "Thing", name: "Retail, E-commerce and Quick Commerce" },
        { "@type": "Thing", name: "Technology and Digital Security" },
        { "@type": "Thing", name: "Sales, CRM and Customer Retention" },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <head>
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="yY8zwocFyre0v1coEaXe/Q" async />
        <link rel="preconnect" href="https://static.cloudflareinsights.com" crossOrigin="anonymous" />
        <style id="critical-css" dangerouslySetInnerHTML={{ __html: criticalStyles }} />
        <link data-site-styles="" rel="stylesheet" href={sitePath(`/site-styles.css?v=${stylesVersion}`)} media="print" suppressHydrationWarning />
        <noscript><link rel="stylesheet" href={sitePath(`/site-styles.css?v=${stylesVersion}`)} /></noscript>
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
        {children}
        <script defer src={sitePath("/load-styles.js")} />
        {/* Cloudflare Web Analytics */}
        <script
          type="module"
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "7e6fa3b1fd3a4f1b9e6946a1f15eac4d"}'
        />
        {/* End Cloudflare Web Analytics */}
      </body>
    </html>
  );
}
