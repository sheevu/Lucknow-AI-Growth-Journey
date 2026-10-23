import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import worker from '../dist/server/index.js';

const env = { ASSETS: { fetch: async req => {
  try { return new Response(readFileSync(resolve('dist/client', '.' + new URL(req.url).pathname))); }
  catch { return new Response('Missing', { status: 404 }); }
} } };
const request = path => worker.fetch(new Request('https://blogs.vyapai.in' + path, { headers: { accept: 'text/html' } }), env, { waitUntil() {} });

test('HTML images reserve space and deliver responsive local variants', async () => {
  for (const path of ['/', '/blogs/']) {
    const html = await (await request(path)).text();
    const images = [...html.matchAll(/<img\b[^>]*>/g)];
    assert.ok(images.length > 5);
    for (const [img] of images) {
      assert.match(img, /width="\d+"/);
      assert.match(img, /height="\d+"/);
      assert.match(img, /srcSet=/i);
    }
  }
});

test('hashed images are served successfully with long-lived immutable cache headers', async () => {
  const manifest = JSON.parse(readFileSync('lib/image-manifest.json', 'utf8'));
  const hero = manifest['/storyboard/ai-creativity.webp'];
  const mobile = hero.variants[0];
  assert.ok(mobile.width <= 400);
  const response = await request(mobile.src);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'public, max-age=31536000, immutable');
  assert.ok((await response.arrayBuffer()).byteLength < 60000);
});

test('the client bundle excludes article bodies and stays within its size budget', () => {
  const files = readdirSync('dist/client/assets').filter(p => p.endsWith('.js'));
  const bytes = files.reduce((sum, file) => sum + statSync('dist/client/assets/' + file).size, 0);
  assert.ok(bytes < 450000, `All client JavaScript: ${bytes} bytes`);
  const archive = JSON.parse(readFileSync('lib/blog-data.json', 'utf8'));
  const paragraph = archive.articles.flatMap(a => a.blocks).find(b => b.type === 'paragraph' && b.text.length > 300).text.slice(0, 250);
  for (const file of files) assert.ok(!readFileSync('dist/client/assets/' + file, 'utf8').includes(paragraph));
});
