import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// A root-absolute asset URL breaks project Pages while looking fine on workers.dev.
test('browser asset requests stay within the site at root and repository-prefix URLs', () => {
  const publicRoot = new URL('../public/', import.meta.url);
  const html = ['index.html','works.html','selected.html','projects.html','about.html'].map(file=>readFileSync(new URL(file, publicRoot), 'utf8')).join('\n');
  const assets = [...html.matchAll(/<(?:link|script)\b[^>]*\b(?:href|src)="([^"]+)"/g)]
    .map(match => match[1]);
  assert.ok(assets.length >= 3, 'the page must include its icon, stylesheet and app');
  for (const base of ['https://portfolio.example/', 'https://owner.github.io/juwon-portfolio/']) {
    const site = new URL(base);
    for (const asset of assets) {
      const request = new URL(asset, site);
      assert.equal(request.origin, site.origin);
      assert.ok(request.pathname.startsWith(site.pathname), `${asset} escapes ${site.pathname}`);
      const relativePath = request.pathname.slice(site.pathname.length);
      assert.ok(existsSync(fileURLToPath(new URL(relativePath, publicRoot))), `${request.href} must map to a published file`);
    }
  }
});
