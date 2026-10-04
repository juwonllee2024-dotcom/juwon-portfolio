import test from 'node:test';
import assert from 'node:assert/strict';

const load = () => import('../public/catalog.mjs');
test('search matches Korean descriptions and English names, with category intersection', async () => {
  const { filterProjects } = await load();
  const rows = [{name:'Lee Relay',description:'AI 협업',category:'ai',tags:['Chrome']},{name:'Clip',description:'AI 영상',category:'content',tags:[]}];
  assert.deepEqual(filterProjects(rows,' RELAY ','all').map(p=>p.name),['Lee Relay']);
  assert.deepEqual(filterProjects(rows,'AI','content').map(p=>p.name),['Clip']);
  assert.deepEqual(filterProjects(rows,'협업','ai').map(p=>p.name),['Lee Relay']);
  assert.deepEqual(filterProjects(rows,'chrome','all').map(p=>p.name),['Lee Relay']);
  assert.deepEqual(filterProjects(rows,'없음','all'),[]);
});
test('public catalog preserves all audit families, unique IDs, and evidence uncertainty', async () => {
  const { projects } = await load();
  assert.ok(projects.length >= 86);
  assert.equal(new Set(projects.map(p=>p.id)).size,projects.length);
  for(const p of projects){
    assert.ok(p.name && p.description && p.evidence && p.status);
    assert.ok(!('progress' in p));
    assert.ok(!/C:\\|127\.0\.0\.1|api[_-]?key|a9e4aea1/i.test(JSON.stringify(p)));
    if(p.url)assert.match(p.url,/^https:\/\/(github\.com|www\.youtube\.com)\//);
  }
  for(const name of ['KRAUDE','AntiStudy Mission Engine','LEE RELAY','Token Saver','YT Korean Studio','FreshSend','DreamCore','Symphony'])assert.ok(projects.some(p=>p.name===name),name);
});
