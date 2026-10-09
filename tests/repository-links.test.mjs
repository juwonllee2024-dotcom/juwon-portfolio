import test from 'node:test';
import assert from 'node:assert/strict';

const renderer = async () => (await import('../public/showcase.mjs')).renderProjectLinks || (() => '');

test('details show a verified repository without replacing a separate channel link', async () => {
  const render = await renderer();
  const html = render({url:'https://www.youtube.com/@example',repositories:[{url:'https://github.com/owner/project',kind:'source',note:'README and source reviewed'}]});
  assert.match(html,/href="https:\/\/github.com\/owner\/project"/);
  assert.match(html,/href="https:\/\/www.youtube.com\/@example"/);
  assert.match(html,/README and source reviewed/);
  assert.doesNotMatch(html,/실행하기|완성 보장/);
});

test('shared repositories and upstream copies are explicitly credited, not separate creations', async () => {
  const render = await renderer();
  const html = render({repositories:[{url:'https://github.com/owner/company',kind:'shared',note:'Symphony module'},{url:'https://github.com/owner/rulesync',kind:'upstream-copy',note:'Upstream integration'}]});
  assert.match(html,/공용 코드 저장소/);
  assert.match(html,/외부 원작 기반 사본/);
  assert.match(html,/Symphony module/);
});

test('repository details reject unsafe destinations, escape evidence, and deduplicate links', async () => {
  const render = await renderer();
  const url='https://github.com/owner/project';
  const html = render({url,repositories:[{url,kind:'source',note:'<script>bad</script>'},{url,kind:'source'},{url:'javascript:alert(1)'},{url:'https://github.com.evil.test/owner/repo'},{url:'https://github.com/owner/repo?token=private'},{url:'https://github.com/owner/repo#private'}]});
  assert.equal((html.match(/href=/g)||[]).length,1);
  assert.match(html,/&lt;script&gt;bad&lt;\/script&gt;/);
  assert.doesNotMatch(html,/javascript:|evil\.test|token=|#private|<script>/);
  assert.match(html,/rel="noopener noreferrer"/);
});

test('missing originals have an honest pending state rather than a fabricated repository', async () => {
  const render = await renderer();
  const html = render({sourceStatus:'원본 코드와 공개 가능 여부 확인 중'});
  assert.match(html,/원본 코드와 공개 가능 여부 확인 중/);
  assert.doesNotMatch(html,/href=/);
});

test('catalog connects independently reviewed tools and preserves external attribution', async () => {
  const {projects}=await import('../public/catalog.mjs');
  const byId=id=>projects.find(p=>p.id===id);
  assert.equal(byId('actionslice').repositories?.[0]?.url,'https://github.com/juwonllee2024-dotcom/actionslice');
  assert.equal(byId('unicodefence').repositories?.[0]?.url,'https://github.com/juwonllee2024-dotcom/unicodefence');
  assert.equal(byId('symphony').repositories?.[0]?.kind,'shared');
  assert.equal(byId('rulesync').url,'https://github.com/rulesync/rulesync');
  assert.equal(byId('rulesync').repositories?.[0]?.kind,'integration');
  assert.ok(byId('rulesync').relatedLinkUnavailable);
  assert.ok(byId('kraude').sourceStatus);
  assert.equal(projects.length,123);
  assert.equal(projects.filter(p=>p.exhibit).length,26);
  assert.equal(byId('antistudy').repositories,undefined);
  assert.match(byId('antistudy').sourceStatus,/GitHub 생성 제한/);
  assert.equal(byId('diamond').repositories?.[0]?.kind,'snapshot');
  assert.equal(byId('yt-korean').repositories?.[0]?.url,'https://github.com/juwonllee2024-dotcom/yt-korean-studio');
  for(const p of projects)for(const repo of p.repositories||[]) {
    assert.match(repo.url,/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
    assert.ok(repo.note);
    assert.ok(['source','shared','upstream-copy','snapshot','integration'].includes(repo.kind));
  }
});
test('an unavailable original link is explained without replacing it with a lookalike', async () => {
  const render=await renderer();
  const html=render({url:'https://github.com/missing/original',relatedLinkUnavailable:'기존 원작 주소는 404로 확인되어 연결 검토 중',repositories:[{url:'https://github.com/owner/integration',kind:'integration',note:'확인된 개인 활용 실험 코드'}]});
  assert.match(html,/href="https:\/\/github.com\/owner\/integration"/);
  assert.doesNotMatch(html,/href="https:\/\/github.com\/missing\/original"/);
  assert.match(html,/기존 원작 주소는 404/);
  assert.match(html,/활용 실험 코드 저장소/);
});
