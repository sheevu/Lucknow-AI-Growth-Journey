import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const expected = process.env.EXPECTED_SITE_URL || 'https://blogs.vyapai.in';
const basePath = new URL(expected).pathname.replace(/\/$/, '');
const data = JSON.parse(readFileSync(new URL('../lib/blog-data.json', import.meta.url), 'utf8'));
const published = data.articles.filter(a => a.status === 'published' && a.indexable);
const {default: worker} = await import(new URL('../dist/server/index.js', import.meta.url));
const ctx = {waitUntil() {}, passThroughOnException() {}};
const env = {ASSETS: {fetch: async request => {
  try { return new Response(readFileSync(resolve('dist/client', '.' + new URL(request.url).pathname))); }
  catch { return new Response('Not found', {status:404}); }
}}};
async function request(path) {
  return worker.fetch(new Request(expected + path, {headers:{accept:'text/html'}}), env, ctx);
}
test('canonical URLs, article schema and sharing previews match the deployment address', async () => {
  for (const path of ['/', '/blogs/', '/blogs/' + published[0].slug + '/']) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, new RegExp('<link rel="canonical" href="' + (expected + path).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"'));
    assert.ok(!html.includes('https://ai-digital-marketing-trends-india.sheevumgoel.chatgpt.site'), path);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  }
});
test('sitemap includes only indexable published articles and uses canonical URLs', async () => {
  const response = await request('/sitemap.xml');
  assert.equal(response.status, 200);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.equal(urls.length, published.length + data.categories.length + 2);
  assert.ok(urls.every(url => url.startsWith(expected + '/')));
  assert.ok(!xml.includes('Invalid Date'));
});
test('robots points to the deployment sitemap', async () => {
  const response = await request('/robots.txt');
  assert.equal(response.status, 200);
  assert.ok((await response.text()).includes(expected + '/sitemap.xml'));
});
test('the prefix deployment serves cover images without requiring domain-root routes', async () => {
  if (!basePath) return;
  const response = await request('/box-covers/avatar-01.webp');
  assert.equal(response.status, 200);
  assert.ok((await response.arrayBuffer()).byteLength > 1000);
});
test('serves box marketing visual assets', async () => {
  const response = await request('/box-marketing/marketing-01.webp');
  assert.equal(response.status, 200);
  assert.ok((await response.arrayBuffer()).byteLength > 1000);
});


test('schema dates include timezones and publishers have verified image information', async () => {
  const paths = ['/', '/blogs/' + published[0].slug + '/', '/blogs/' + published.at(-1).slug + '/'];
  const walk = (value) => {
    if (!value || typeof value !== 'object') return;
    for (const key of ['datePublished', 'dateModified']) {
      if (value[key]) {
        assert.match(value[key], /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/);
        assert.ok(Number.isFinite(Date.parse(value[key])));
      }
    }
    if (value['@id'] === expected + '/#publisher' && value.name) {
      assert.equal(value.image, expected + '/og.png');
      assert.ok(value.logo.url.startsWith(expected + '/'));
      assert.equal(value.address.streetAddress, 'C-469/C, Indira Nagar, Near HAL');
      assert.equal(value.address.postalCode, '226016');
    }
    if (value['@type'] === 'BlogPosting') assert.ok(value.image, 'Use the visible article cover in schema');
    for (const child of Object.values(value)) walk(child);
  };
  for (const path of paths) {
    const response = await request(path);
    const html = await response.text();
    assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') || ''));
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) walk(JSON.parse(match[1]));
  }
});

test('www permanently redirects to the canonical hostname without losing the deep link', async () => {
  const response = await worker.fetch(new Request('https://www.blogs.vyapai.in/blogs/?topic=seo'), env, ctx);
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), 'https://blogs.vyapai.in/blogs/?topic=seo');
});
