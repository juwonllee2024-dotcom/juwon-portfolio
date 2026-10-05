import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';

// Missing exhibit metadata must not silently turn every idea or CLI into a visual work.
test('visual works expose reviewed descriptions without promoting ideas to completed apps', async () => {
  const {projects} = await import('../public/catalog.mjs');
  const works = projects.filter(p => p.exhibit);
  assert.ok(works.some(p => p.id === 'seoul'), 'Seoul Zero must appear in the exhibition');
  assert.ok(works.some(p => p.id === 'factory-proof'));
  assert.ok(works.some(p => p.id === 'atlas'));
  assert.ok(!works.some(p => p.id === 'token-saver' || p.id === 'github-goal'));
  const iphone = works.find(p => p.id === 'iphone');
  assert.equal(iphone.exhibit.state, 'partial');
  assert.match(iphone.evidence, /초기|미완성/);
  for (const p of works) {
    assert.ok(['world','web','app'].includes(p.exhibit.group));
    assert.ok(p.exhibit.note);
    for (const shot of p.exhibit.shots || []) {
      assert.match(shot.src, /^\.\/[a-z0-9-]+\.(?:png|jpg)$/);
      assert.ok(shot.alt && shot.caption);
      assert.ok(existsSync(new URL('../public/' + shot.src.slice(2), import.meta.url)));
    }
    assert.doesNotMatch(JSON.stringify(p), /C:\\|127\.0\.0\.1|localhost:\d|api[_-]?key/i);
  }
});

// Exercise real markup, not DOM mocks. An unsafe image URL or unescaped title must never publish.
test('exhibition rendering escapes text and distinguishes real captures from missing captures', async () => {
  const module = await import('../public/showcase.mjs').catch(error => {
    if (error.code === 'ERR_MODULE_NOT_FOUND') return {};
    throw error;
  });
  const render = module.renderExhibitCard || (() => '');
  const p = {id:'safe',name:'<script>alert(1)</script>',description:'A & B',status:'구현 자료',exhibit:{group:'world',state:'implemented',note:'기록 확인',shots:[]}};
  const missing = render(p);
  assert.match(missing, /&lt;script&gt;/);
  assert.doesNotMatch(missing, /<script>/);
  assert.match(missing, /화면 캡처 준비 중/);
  assert.doesNotMatch(missing, /<img/);
  const shot = render({...p,exhibit:{...p.exhibit,shots:[{src:'./seoul-zero-city.jpg',alt:'서울 도시',caption:'기록된 실제 실행 화면'}]}});
  assert.match(shot, /<img[^>]+src="\.\/seoul-zero-city\.jpg"/);
  assert.match(shot, /실제 실행 화면/);
  const unsafe = render({...p,exhibit:{...p.exhibit,shots:[{src:'https://tracking.example/a.png',alt:'x',caption:'x'}]}});
  assert.doesNotMatch(unsafe, /<img/);
});
