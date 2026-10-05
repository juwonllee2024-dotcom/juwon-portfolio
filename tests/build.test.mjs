import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readdirSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
test('deployment contains exactly the public asset tree, never repository or private metadata',()=>{
  const root=fileURLToPath(new URL('../',import.meta.url));
  execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'pipe'});
  assert.deepEqual(readdirSync(root+'out').sort(),['app.mjs','catalog.mjs','index.html','kraude-land.png','mark.svg','seoul-zero-city.jpg','seoul-zero-play.jpg','showcase.mjs','style.css']);
  assert.match(readFileSync(root+'out/index.html','utf8'),/JUWON/);
  assert.ok(!readFileSync(root+'out/catalog.mjs','utf8').includes('C:\\Users'));
});
