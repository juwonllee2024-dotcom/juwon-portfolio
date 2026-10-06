import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readdirSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
test('deployment contains exactly the public asset tree, never repository or private metadata',()=>{
  const root=fileURLToPath(new URL('../',import.meta.url));
  execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'pipe'});
  const screens=['antistudy','atlas','blogfoundry','clipproof','company-lab','diamond','factory-proof','iphone','juwon-system','lee-relay','lee-ultra','localhost-commander','longform','nebula','portfolio','revenue-os','secondbrain3d','skybound','symphony','timeless','village','yt-korean'].map(id=>id+'-screen.jpg');
  const motion=['vendor-three.mjs','vendor-gsap.mjs','vendor-lenis.mjs','vendor-postprocessing.mjs','motion-licenses.txt'];
  assert.deepEqual(readdirSync(root+'out').sort(),['app.mjs','catalog.mjs','index.html','kraude-land.png','mark.svg','seoul-zero-city.jpg','seoul-zero-play.jpg','showcase.mjs','story.mjs','style.css',...motion,...screens].sort());
  assert.match(readFileSync(root+'out/index.html','utf8'),/JUWON/);
  assert.ok(!readFileSync(root+'out/catalog.mjs','utf8').includes('C:\\Users'));
});
