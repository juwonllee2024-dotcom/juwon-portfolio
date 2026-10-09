import test from 'node:test';
import assert from 'node:assert/strict';
import { renderProjectLinks } from '../public/showcase.mjs';

test('verified demos appear separately from their source with escaped verification notes',()=>{
  const html=renderProjectLinks({demo:{url:'https://zephyr-demo.juwonllee2026.workers.dev/',note:'Keyboard verified <camera untested>'},repositories:[{url:'https://github.com/juwonllee2024-dotcom/zephyr',kind:'source'}]});
  assert.match(html,/href="https:\/\/zephyr-demo\.juwonllee2026\.workers\.dev\/"/);
  assert.match(html,/체험하기/);
  assert.match(html,/href="https:\/\/github.com\/juwonllee2024-dotcom\/zephyr"/);
  assert.match(html,/&lt;camera untested&gt;/);
  assert.match(html,/rel="noopener noreferrer"/);
});
test('demo links reject unreviewed hosts, credentials and scripts',()=>{
  for(const url of ['javascript:alert(1)','https://evil.test/','https://zephyr-demo.juwonllee2026.workers.dev.evil.test/','https://user:secret@zephyr-demo.juwonllee2026.workers.dev/','https://zephyr-demo.juwonllee2026.workers.dev/?token=secret']) {
    const html=renderProjectLinks({demo:{url}});
    assert.doesNotMatch(html,/href=/);
  }
});
test('reviewed Seoul Zero and Diamond Rivalry demos retain their own source links',()=>{
  for(const [demo,repository] of [
    ['https://seoul-zero-demo.juwonllee2026.workers.dev/','https://github.com/juwonllee2024-dotcom/seoul-zero'],
    ['https://diamond-rivalry-demo.juwonllee2026.workers.dev/','https://github.com/juwonllee2024-dotcom/diamond-rivalry']
  ]) {
    const html=renderProjectLinks({demo:{url:demo,note:'검증된 공개 게임'},repositories:[{url:repository,kind:'source'}]});
    assert.ok(html.includes(`href="${demo}"`));
    assert.ok(html.includes(`href="${repository}"`));
    assert.match(html,/체험하기/);
  }
});
