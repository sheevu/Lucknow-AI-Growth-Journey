import Link from "next/link";

export function BlogSiteHeader() {
  return (
    <>
      <div className="ecosystem-banner" aria-label="Sudarshan AI Growth Ecosystem">
        <div className="ecosystem-inner">
          <span className="ecosystem-tag">SUDARSHAN AI</span>
          <span className="ecosystem-text">Strategic Services:</span>
          <a href="https://sudarshan-ai.com/" target="_blank" rel="noreferrer">Digital Marketing services</a>
          <span className="eco-sep">•</span>
          <a href="https://sudarshan-ai.com/" target="_blank" rel="noreferrer">Social Media Marketing in Lucknow</a>
          <span className="eco-sep">•</span>
          <a href="https://sudarshan-ai.com/" target="_blank" rel="noreferrer">SEO</a>
          <span className="eco-sep">•</span>
          <a href="https://sudarshan-ai.com/" target="_blank" rel="noreferrer">Lead Generation</a>
          <span className="eco-sep">•</span>
          <a href="https://sudarshan-ai.com/" target="_blank" rel="noreferrer">best digital marketing services</a>
          <span className="eco-sep">•</span>
          <a href="https://sudarshan-ai.com/" target="_blank" rel="noreferrer">marketing agency</a>
        </div>
      </div>
      <nav className="library-nav" aria-label="Primary navigation">
        <Link className="comic-brand" href="/">
          <span>S</span>
          <span className="brand-copy"><b>SUDARSHAN AI LABS</b><small>KNOWLEDGE LIBRARY</small></span>
        </Link>
        <div className="library-nav-links">
          <Link href="/">Home</Link>
          <Link href="/blogs/">All Articles</Link>
          <Link href="/blogs/#categories">Categories</Link>
          <Link href="/blogs/#latest">Latest</Link>
          <a className="nav-pop" href="https://vyapai.in/" target="_blank" rel="noreferrer">LET&apos;S GROW ↗</a>
        </div>
      </nav>
      <nav className="library-mobile-nav" aria-label="Blog navigation">
        <Link href="/blogs/">All Articles</Link>
        <Link href="/blogs/#categories">Categories</Link>
        <Link href="/blogs/#featured">Featured</Link>
        <Link href="/blogs/author/sheevum-goel/">Author</Link>
      </nav>
    </>
  );
}
