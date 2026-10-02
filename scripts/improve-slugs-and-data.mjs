import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.resolve('lib/blog-data.json');
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Curated list of slug fixes for articles that had truncated words, weird endings, or poor slugs
const customSlugMap = {
  4: 'capitalist-trap-western-influence-fake-narratives-nielseniqs-reports-threaten-retail',
  9: 'hidden-costs-quick-commerce-examining-impact-indias-traditional-retail-ecosystem',
  13: 'collaborative-growth-amulyam-enterprises-partnerships-empowering-small-retailers',
  15: 'giver-snatcher-emergence-dark-stores-negative-impact-indias-restaurant-industry',
  18: 'bharats-new-world-order-once-rulers-now-beggars-west-needs-india',
  19: '15-minute-help-15-minute-exploitation-ugly-truth-about-instamart',
  23: 'beyond-dukaandari-indias-startup-ecosystem-needs-reality-check-minister-piyush-goyal',
  24: 'scandal-unfolds-gensols-promoters-treated-listed-company-like-own-piggy-bank',
  25: 'convenience-cruel-cost-unseen-sacrifices-delivery-partners-indias-quick-commerce',
  37: 'ai-powered-digital-marketing-revolutionizing-small-businesses-lucknow-beyond-google',
  39: 'revolutionizing-grocery-shopping-amulyam-enterprises-empowers-kiranas-digitally',
  50: 'transform-business-today-ultimate-guide-digital-success-lucknows-premier-marketing-agency',
  51: 'local-shop-digital-empire-lucknow-small-business-revolution-thats-changing-everything',
  52: 'indias-demographic-shift-examining-rising-muslim-population-urgent-need-policy',
  53: 'local-business-categories-lucknow-potential-clients-digital-marketing-ecommerce',
  55: 'revolutionizing-digital-marketing-lucknows-small-businesses-affordable-ai-power',
  57: '10-digital-marketing-companies-lucknow-rankings-and-review',
  58: 'in-loving-memory-of-my-mother-maa-july-2025',
  63: '6-digital-marketing-strategies-lucknow-small-businesses-insights-sudarshan-ai',
  69: 'innovate-educate-elevate-sudarshan-ai-labs-redefining-digital-marketing-lucknow',
  70: 'transforming-lucknows-business-landscape-affordable-digital-marketing-ai-power',
  72: 'local-global-lucknows-digital-marketing-company-revolutionizing-small-business',
  73: 'affordable-ai-solutions-accessible-ai-services-designed-for-msmes',
  74: 'lucknows-business-scene-transformed-sudarshan-ai-labs-ultimate-digital-marketing-hub',
  75: 'digital-marketing-services-lucknow-sudarshan-ai-labs-transforms-small-businesses',
  80: 'how-gen-ai-will-skyrocket-indian-retail-productivity',
  81: 'genai-will-skyrocket-indian-retail-productivity-part-2',
  83: 'digital-transformation-lucknows-heart-uttar-pradesh-business-landscape',
  87: 'transform-msme-business-lucknow-ai-powered-digital-growth-solutions-rupee-89',
  88: 'transform-msme-business-lucknow-ai-powered-digital-growth-solutions-edition-2',
  89: 'digital-marketing-services-lucknow-sudarshan-ai-labs-scale-small-business',
  91: 'sudarshan-ai-labs-uni-commerce-portal-gives-msmes-complete-growth',
  92: 'medium-community-guidelines-editorial-compliance',
  93: 'medium-author-verification-guidelines-declaration',
  94: 'medium-editorial-guidelines-acknowledgment-v1',
  95: 'medium-editorial-guidelines-acknowledgment-v2',
  98: 'tyohar-matlab-maa-festivals-and-mother',
  99: 'tragedy-extortion-male-suicide-inside-indias-matrimonial-nightmare-irretrievable-breakdown',
  100: 'ai-powered-social-media-marketing-content-that-converts-vyapaar-ka-ai-yug',
  105: 'ai-kranti-indian-msmes-digital-transformation-msme-sector',
  106: 'lucknow-2-0-googles-november-leap-matters-more-in-hazratganj',
  111: 'death-of-traditional-agency-digital-marketing-companies-going-ai-native',
  112: 'hasil-e-zindagi-jhoothe-ilzaam-aur-khali-aanchal',
  113: 'saath-tha-par-samajh-nahi-kahani-badal-gayi',
  114: 'bangladesh-violence-exposes-deep-communal-fault-lines-hindus-targeted-international-silence',
  116: 'amulyam-enterprises-empowers-kiranas-digitally-local-retail',
  123: 'family-court-me-anniversary-shadi-ki-salgirah',
  125: 'digital-vyapar-swaraj-lucknow-local-businesses-grow-online-just-rupee-89',
  127: '10-minute-mirage-tech-giants-burn-billions-bankrupt-local-vendors',
  131: 'digital-marketing-agency-lucknow-msmes-sudarshan-ai-labs-leads-the-game',
  133: 'digital-marketing-services-lucknow-grow-business-sudarshan-ai-labs',
  139: 'nocode-revolution-build-scalable-ai-solutions-without-coding-explore-sudarshan-ai',
  140: 'draft-digital-marketing-msme-growth-playbook'
};

// Box marketing images (20 new images downloaded from Box)
const boxMarketingImages = Array.from({ length: 20 }, (_, i) => `/box-marketing/marketing-${String(i + 1).padStart(2, '0')}.webp`);
// Box avatar images (22 existing images)
const boxAvatarImages = Array.from({ length: 22 }, (_, i) => `/box-covers/avatar-${String(i + 1).padStart(2, '0')}.webp`);

const allBoxImages = [...boxMarketingImages, ...boxAvatarImages];

let updatedSlugsCount = 0;

raw.articles.forEach((article, idx) => {
  const oldSlug = article.slug;
  if (!article.previousSlugs) {
    article.previousSlugs = [];
  }

  if (customSlugMap[article.id]) {
    const newSlug = customSlugMap[article.id];
    if (newSlug !== oldSlug) {
      if (!article.previousSlugs.includes(oldSlug)) {
        article.previousSlugs.push(oldSlug);
      }
      article.slug = newSlug;
      updatedSlugsCount++;
    }
  }

  // Update canonical to clean blogs.vyapai.in URL
  article.canonical = `https://blogs.vyapai.in/blogs/${article.slug}/`;

  // Distribute the Box images randomly and cleanly across articles
  // Articles with odd IDs or specific modules can use the brand new Box marketing images!
  if (!article.coverImage || article.coverImage.startsWith('/box-covers/')) {
    // Deterministic distribution across 42 Box images:
    const chosenImage = allBoxImages[(article.id * 17) % allBoxImages.length];
    article.coverImage = chosenImage;
  }
});

// Write updated JSON
fs.writeFileSync(dataPath, JSON.stringify(raw, null, 2), 'utf8');

console.log(`Updated ${updatedSlugsCount} slugs and refreshed all 140 article canonicals and Box covers!`);
