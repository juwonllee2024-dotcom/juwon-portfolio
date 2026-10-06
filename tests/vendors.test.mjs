import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
const root=new URL('../',import.meta.url);
function requests(source) { return [...source.matchAll(/\b(?:from\s*|import\s*\()\s*['"]([^'"]+)['"]/g)].map(m=>m[1]); }
function validate(source,base) {
  for(const specifier of requests(source)) {
    assert.ok(specifier.startsWith('./'),specifier+' must remain relative');
    const url=new URL(specifier,base);
    assert.equal(url.origin,new URL(base).origin);
    assert.ok(url.pathname.startsWith(new URL(base).pathname.replace(/[^/]*$/,'')));
    assert.ok(existsSync(new URL('public/'+specifier.slice(2),root)),specifier+' must be published');
  }
}
test('reviewed self-hosted modules match pinned provenance, checksums and browser exports',async()=>{
  const manifestPath=new URL('docs/motion-vendors.json',root);
  assert.ok(existsSync(manifestPath),'pinned motion manifest must exist');
  const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));
  assert.deepEqual(manifest.libraries.map(v=>v.name).sort(),['gsap','lenis','postprocessing','three']);
  let initialBytes=0;
  for(const library of manifest.libraries) {
    assert.match(library.version,/^\d+\.\d+\.\d+$/);
    assert.match(library.sourceUrl,/^https:\/\/(registry\.npmjs\.org|github\.com)\//);
    for(const file of library.files) {
      const data=readFileSync(new URL(file.path,root));
      assert.equal(createHash('sha256').update(data).digest('hex'),file.sha256);
      if(!file.path.includes('postprocessing')) initialBytes+=gzipSync(data).length;
      for(const base of ['https://portfolio.example/vendor.mjs','https://owner.github.io/juwon-portfolio/vendor.mjs']) validate(data.toString(),base);
    }
  }
  assert.ok(initialBytes<=600*1024,'first-load vendor gzip budget');
  const licenses=readFileSync(new URL('public/motion-licenses.txt',root),'utf8');
  for(const license of ['MIT','Zlib','https://gsap.com/standard-license']) assert.ok(licenses.includes(license));
  const three=await import('../public/vendor-three.mjs');
  assert.equal(typeof three.PerspectiveCamera,'function');
  const gsap=await import('../public/vendor-gsap.mjs');
  assert.equal(typeof gsap.gsap.timeline,'function');
  assert.equal(typeof gsap.ScrollTrigger.create,'function');
  assert.equal(typeof gsap.SplitText,'function');
  assert.equal(typeof (await import('../public/vendor-lenis.mjs')).default,'function');
  assert.equal(typeof (await import('../public/vendor-postprocessing.mjs')).EffectComposer,'function');
});
test('external dynamic module and missing local dependency are rejected',()=>{
  assert.throws(()=>validate("import('https://tracking.example/mod.mjs')",'https://portfolio.example/test.mjs'));
  assert.throws(()=>validate("export {x} from './not-published.mjs'",'https://portfolio.example/test.mjs'));
});
