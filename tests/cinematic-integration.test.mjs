import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {projects} from '../public/catalog.mjs';
const audit=await import('../scripts/check-cinematic.mjs').catch(e=>{if(e.code==='ERR_MODULE_NOT_FOUND')return {};throw e;});
const fixtures=await import('./browser-fixtures.mjs').catch(e=>{if(e.code==='ERR_MODULE_NOT_FOUND')return {};throw e;});
test('the complete published module graph stays local at root and repository-prefix URLs',()=>{
  assert.equal(typeof audit.auditModules,'function','whole graph audit must exist');
  const directory=new URL('../public/',import.meta.url);
  const assets=new Map(readdirSync(directory).filter(name=>name.endsWith('.mjs')).map(name=>[name,readFileSync(new URL(name,directory),'utf8')]));
  const result=audit.auditModules(assets,['https://portfolio.example/','https://owner.github.io/juwon-portfolio/']);
  assert.ok(result.requests>=10);assert.ok(result.initialGzipBytes<=600*1024);
  assert.equal(projects.length,123);const exhibits=projects.filter(p=>p.exhibit);
  assert.equal(exhibits.length,26);assert.equal(exhibits.filter(p=>p.exhibit.shots.length).length,24);
  assert.equal(exhibits.flatMap(p=>p.exhibit.shots).length,25);
  assert.deepEqual(exhibits.filter(p=>!p.exhibit.shots.length).map(p=>p.id).sort(),['local-chat','openhands']);
});
test('deployment audit rejects external modules, missing modules and prefix escape',()=>{
  assert.equal(typeof audit.auditModules,'function');
  for(const source of ["import('https://tracker.example/remote.mjs')","import './missing.mjs'","export {x} from '../secret.mjs'"]){
    assert.throws(()=>audit.auditModules(new Map([['app.mjs',source]]),['https://owner.github.io/juwon-portfolio/']));
  }
});
test('public audit catches both escaped and ordinary Windows user paths',()=>{
  for(const source of [String.raw`const folder="C:\Users\private\notes";`,String.raw`const folder="C:\\Users\\private\\notes";`,'const folder="C:/Users/private/notes";']){
    assert.throws(()=>audit.auditModules(new Map([['app.mjs',source]]),['https://portfolio.example/']));
  }
});
test('private browser fixtures simulate failures without exposing repository files',async()=>{
  assert.equal(typeof fixtures.createFixtureServer,'function');
  const server=fixtures.createFixtureServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
    const base='http://127.0.0.1:'+server.address().port;
    const html=await (await fetch(base+'/no-js/')).text();assert.ok(!html.includes('<script'));assert.ok(html.includes('KRAUDE'));
    assert.equal((await fetch(base+'/module/vendor-gsap.mjs')).status,503);
    assert.equal((await fetch(base+'/normal/vendor-gsap.mjs')).status,200);
    assert.equal((await fetch(base+'/reduced/package.json')).status,404);
    assert.equal((await fetch(base+'/reduced/..%2fpackage.json')).status,404);
    assert.equal((await fetch(base+'/storage/')).headers.get('x-test-fixture'),'storage');
    assert.equal((await fetch(base+'/perf/')).status,200);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
