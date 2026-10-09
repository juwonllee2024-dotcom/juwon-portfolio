import test from 'node:test';
import assert from 'node:assert/strict';
import {createPreviewServer} from '../scripts/serve.mjs';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// Execute the actual pre-initialization redirect against the browser location boundary.
test('legacy redirects accept only the four former section anchors',()=>{
  const source=readFileSync(new URL('../public/app.mjs',import.meta.url),'utf8');
  const bootstrap=source.slice(0,source.indexOf('const esc =')).replace(/^import .*;$/gm,'');
  for(const [hash,want] of [['#works','./works.html'],['#selected','./selected.html'],['#projects','./projects.html'],['#about','./about.html'],['#constructor',null],['#toString',null],['#home',null],['#project-kraude',null],['',null]]){
    const destinations=[];
    runInNewContext(bootstrap,{document:{body:{dataset:{page:'home'}}},location:{hash,replace:value=>destinations.push(value)}});
    assert.deepEqual(destinations,want?[want]:[],hash);
  }
});

// Catches a split that leaves collections on home or publishes broken page links.
test('home ends at the signature and each collection has its own reachable document',async()=>{
  const server=createPreviewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
    const base='http://127.0.0.1:'+server.address().port+'/';
    const home=await (await fetch(base)).text();
    const main=home.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
    assert.match(main,/universe-signature/);
    for(const id of ['works','selected','projects','about'])assert.ok(!main.includes('id="'+id+'"'),id+' must leave home');
    for(const [file,id] of [['works.html','works'],['selected.html','selected'],['projects.html','projects'],['about.html','about']]){
      const response=await fetch(base+file);assert.equal(response.status,200,file);
      const html=await response.text();assert.match(html,new RegExp('id="'+id+'"'));
      assert.match(html,/<h1\b[^>]*>[\s\S]+?<\/h1>/,'independent documents need a primary page heading');
      assert.ok(!html.includes('id="journey"'));assert.ok(!html.includes('<canvas'));
      assert.ok(html.includes('aria-current="page"'));
      for(const link of [...html.matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)][0][1].matchAll(/href="([^"]+)"/g)){
        assert.equal((await fetch(new URL(link[1],base+file))).status,200,link[1]);
      }
    }
  }finally{await new Promise(resolve=>server.close(resolve));}
});
