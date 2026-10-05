import test from 'node:test';
import assert from 'node:assert/strict';
const module = await import('../public/story.mjs').catch(e => {
  if (e.code === 'ERR_MODULE_NOT_FOUND') return {};
  throw e;
});

test('scroll travel has safe boundaries and a deterministic reverse path', () => {
  assert.equal(typeof module.sampleStory, 'function', 'story sampling must exist');
  const cases = [[-1,'spark',null],[0,'spark',null],[.1999,'spark',null],[.2,'constellation',null],[.4,'work','iphone'],[.5,'work','village'],[.59,'work','yt-korean'],[.6,'convergence',null],[.8,'core','kraude'],[.9,'core','secondbrain3d'],[1,'core','antistudy'],[2,'core','antistudy'],[NaN,'spark',null]];
  for (const [progress, chapter, focus] of cases) {
    const frame = module.sampleStory(progress);
    assert.equal(frame.chapter, chapter);
    assert.equal(frame.focusId, focus);
    assert.ok(frame.local >= 0 && frame.local <= 1);
    assert.equal(frame.camera.position.length,3);
    assert.ok([...frame.camera.position,...frame.camera.target].every(Number.isFinite));
  }
  const forward = cases.map(([p]) => module.sampleStory(p));
  for (let i=cases.length-1;i>=0;i--) assert.deepEqual(module.sampleStory(cases[i][0]), forward[i]);
});

test('core reveal preserves project order without appearing in early scenes', () => {
  assert.equal(typeof module.sampleStory,'function');
  assert.deepEqual([.81,.88,.96].map(p=>module.sampleStory(p).focusId),['kraude','secondbrain3d','antistudy']);
  assert.deepEqual(module.storyChapters.map(c=>c.id),['spark','constellation','work','convergence','core']);
  for(let i=0;i<80;i++) assert.ok(!['kraude','secondbrain3d','antistudy'].includes(module.sampleStory(i/100).focusId));
});

test('Korean combining characters and emoji stay intact in typing; missing segmenter keeps whole sentence', () => {
  assert.equal(typeof module.splitGraphemes,'function');
  const segmenter = new Intl.Segmenter('ko',{granularity:'grapheme'});
  assert.deepEqual(module.splitGraphemes('주원 👩‍💻',segmenter),['주','원',' ','👩‍💻']);
  assert.deepEqual(module.splitGraphemes('주원의 세계',null),['주원의 세계']);
});
