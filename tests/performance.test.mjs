import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import worker from '../dist/server/index.js';

const origin = 'https://blogs.vyapai.in';
const ctx = { waitUntil() {}, passThroughOnException() {} };
const env = { ASSETS: { fetch: async request => {
  try { return new Response(readFileSync(resolve('dist/client', '.' + new URL(request.url).pathname))); }
  catch { return new Response('Not found', { status: 404 }); }
} } };
const request = path => worker.fetch(new Request(origin + path, { headers: { accept: 'text/html' } }), env, ctx);
const data = JSON.parse(readFileSync('lib/blog-data.json', 'utf8'));

test('first paint has inline responsive CSS and a non-blocking full stylesheet with a no-JS fallback', async () => {
  for (const path of ['/', '/blogs/', `/blogs/${data.articles.find(a => a.indexable && a.status === 'published').slug}/`]) {
    const response = await request(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
    const critical = head.match(/<style id="critical-css">([\s\S]*?)<\/style>/)[1];
    assert.ok(critical.includes('.comic-hero') && critical.includes('.article-hero') && critical.includes('.ecosystem-banner'));
    assert.ok(critical.includes('@media') && critical.length < 30000, `Critical CSS: ${critical.length} chars`);
    assert.match(head, /<noscript><link rel="stylesheet" href="\/site-styles\.css\?v=[a-f0-9]+"\/><\/noscript>/);
    const activeHead = head.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
    for (const link of activeHead.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)) assert.match(link[0], /media="print"/);
    assert.match(activeHead, /rel="preconnect" href="https:\/\/static\.cloudflareinsights\.com"/);
    const cssUrl = head.match(/data-site-styles=""[^>]*href="([^"]+)"/)[1];
    const cssResponse = await request(cssUrl);
    assert.equal(cssResponse.status, 200);
    assert.match(cssResponse.headers.get('content-type'), /text\/css/);
    const full = await cssResponse.text();
    assert.ok(full.includes('.footer-location') && full.includes('.comic-hero'));
    assert.ok(!full.includes('@import "tailwindcss"'));
    assert.ok(critical.length < full.length / 2);
    assert.ok(html.indexOf('/load-styles.js') > html.indexOf('</main>'));
    for (const script of html.matchAll(/<script\b[^>]*\bsrc="[^"]+"[^>]*>/g)) assert.match(script[0], /\b(?:defer|async|type="module")/);
  }
});

test('the homepage preloads its eager hero once without preloading unrelated covers', async () => {
  const html = await (await request('/')).text();
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
  const hints = [...head.matchAll(/<link\b[^>]*rel="preload"[^>]*as="image"[^>]*>/g)];
  assert.equal(hints.length, 1);
  assert.match(hints[0][0], /imageSrcSet="[^"]*optimized\/ai-creativity-/i);
  assert.match(hints[0][0], /fetchPriority="high"/i);
  const hero = html.match(/<img\b[^>]*src="[^"]*optimized\/ai-creativity-[^"]*"[^>]*>/)[0];
  assert.match(hero, /loading="eager"/);
});

test('stylesheet loader handles downloads before and after deferred script execution', () => {
  const source = readFileSync('public/load-styles.js', 'utf8');
  for (const cached of [false, true]) {
    const listeners = {};
    const link = { media: 'print', sheet: cached ? {} : null, addEventListener: (event, fn) => { listeners[event] = fn; } };
    vm.runInNewContext(source, { document: { querySelector: () => link } });
    if (!cached) { assert.equal(link.media, 'print'); listeners.load(); }
    assert.equal(link.media, 'all');
  }
});
