import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const module = async () => import('../scripts/source-snapshot.mjs').catch(e=>e.code==='ERR_MODULE_NOT_FOUND'?{}:Promise.reject(e));
const fixture = t => {const d=fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-snapshot-test-'));t.after(()=>fs.rmSync(d,{recursive:true,force:true}));return d;};
test('snapshot copies selected original bytes and never imports hidden state or source history', async t => {
  const root=fixture(t),destination=path.join(fixture(t),'snapshot');
  fs.mkdirSync(path.join(root,'src'));fs.writeFileSync(path.join(root,'src/app.js'),'export const x=1;\r\n');
  fs.writeFileSync(path.join(root,'src/.env'),'PRIVATE=value');
  const {planSnapshot,copySnapshot}=await module();
  assert.equal(typeof planSnapshot,'function');
  const plan=planSnapshot(root,['src']);
  assert.deepEqual(plan.files.map(x=>x.path),['src/app.js']);
  copySnapshot(plan,destination);
  assert.deepEqual(fs.readFileSync(path.join(destination,'src/app.js')),Buffer.from('export const x=1;\r\n'));
  assert.ok(!fs.existsSync(path.join(destination,'src/.env')));
});
test('snapshot refuses traversal and symlinks instead of copying another project', async t => {
  const root=fixture(t);const {planSnapshot}=await module();
  assert.equal(typeof planSnapshot,'function');
  assert.throws(()=>planSnapshot(root,['../other']),/selection/);
  fs.mkdirSync(path.join(root,'target'));
  fs.writeFileSync(path.join(root,'target','app.js'),'safe');
  fs.symlinkSync(path.join(root,'target'),path.join(root,'link'),process.platform==='win32'?'junction':'dir');
  assert.throws(()=>planSnapshot(root,['link']),/symlink/);
  assert.throws(()=>planSnapshot(root,['link/app.js']),/symlink/);
});
test('snapshot blocks credential-shaped content and personal paths without printing their values', async t => {
  const root=fixture(t);const {planSnapshot}=await module();
  assert.equal(typeof planSnapshot,'function');
  fs.writeFileSync(path.join(root,'bad.js'),'const key="ghp_'+'A'.repeat(30)+'";');
  assert.throws(()=>planSnapshot(root,['bad.js']),/review required: bad.js/);
  fs.writeFileSync(path.join(root,'bad.js'),'C:/Users/juwon/private');
  assert.throws(()=>planSnapshot(root,['bad.js']),/review required: bad.js/);
  fs.writeFileSync(path.join(root,'bad.js'),'test-only.fake@gmail.com');
  assert.throws(()=>planSnapshot(root,['bad.js']),/review required: bad.js/);
});
test('snapshot refuses changed source bytes and an occupied destination', async t => {
  const root=fixture(t);fs.writeFileSync(path.join(root,'app.js'),'first');
  const {planSnapshot,copySnapshot}=await module();assert.equal(typeof planSnapshot,'function');
  const plan=planSnapshot(root,['app.js']);fs.writeFileSync(path.join(root,'app.js'),'changed');
  const destination=path.join(fixture(t),'new');
  assert.throws(()=>copySnapshot(plan,destination),/source changed/);
  assert.ok(!fs.existsSync(destination));
  assert.throws(()=>copySnapshot(plan,root),/destination exists/);
});
test('snapshot preserves textual schema, typed configuration and subtitle test fixtures', async t => {
  const root=fixture(t);const {planSnapshot}=await module();
  for(const [name,body] of [['schema.sql','CREATE TABLE example(id integer);'],['config.mts','export default {};'],['view.jsx','export const View=()=> <div/>;'],['cue.srt','1\n00:00:01,000 --> 00:00:02,000\nExample\n']])fs.writeFileSync(path.join(root,name),body);
  assert.equal(planSnapshot(root,['schema.sql','config.mts','view.jsx','cue.srt']).files.length,4);
});
test('only the exact separately reviewed binary fixture is copied; generated tmp state stays private', async t => {
  const root=fixture(t);const {planSnapshot}=await module();
  const bytes=Buffer.from([0,1,2,3]);fs.writeFileSync(path.join(root,'fixture.mp4'),bytes);
  fs.mkdirSync(path.join(root,'tmp'));fs.writeFileSync(path.join(root,'tmp','private.json'),'private');
  assert.throws(()=>planSnapshot(root,['fixture.mp4']),/review required/);
  const sha=crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(planSnapshot(root,['fixture.mp4','tmp'],{reviewedBinary:{'fixture.mp4':sha}}).files.length,1);
  assert.throws(()=>planSnapshot(root,['fixture.mp4'],{reviewedBinary:{'fixture.mp4':'wrong'}}),/review required/);
  fs.writeFileSync(path.join(root,'photo.png'),bytes);
  assert.throws(()=>planSnapshot(root,['photo.png']),/review required/);
  assert.equal(planSnapshot(root,['photo.png'],{reviewedBinary:{'photo.png':sha}}).files.length,1);
});
