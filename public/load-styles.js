// Run after parsing without waiting for hydration. The print stylesheet downloads
// without blocking paint; no-JavaScript visitors use the noscript stylesheet.
(() => {
  const link = document.querySelector('link[data-site-styles]');
  if (!link) return;
  const enable = () => { link.media = 'all'; };
  link.addEventListener('load', enable, { once: true });
  link.addEventListener('error', enable, { once: true });
  if (link.sheet) enable();
})();
