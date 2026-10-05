import test from 'node:test';
import assert from 'node:assert/strict';

test('preview serves only public assets and cannot expose its source or hosting identity', async () => {
  const { createPreviewServer } = await import('../scripts/serve.mjs');
  const server=createPreviewServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
    const base=`http://127.0.0.1:${server.address().port}`;
    const home=await fetch(base);
    assert.equal(home.status,200);
    assert.match(await home.text(),/JUWON/);
    assert.equal((await fetch(base+'/catalog.mjs')).status,200);
    const capture=await fetch(base+'/seoul-zero-city.jpg');
    assert.equal(capture.status,200,'reviewed screenshots must be served');
    assert.equal(capture.headers.get('content-type'),'image/jpeg');
    assert.deepEqual([...new Uint8Array(await capture.arrayBuffer()).slice(0,3)],[255,216,255]);
    const png=await fetch(base+'/kraude-land.png');
    assert.equal(png.status,200);
    assert.equal(png.headers.get('content-type'),'image/png');
    assert.deepEqual([...new Uint8Array(await png.arrayBuffer()).slice(0,8)],[137,80,78,71,13,10,26,10]);
    for(const route of ['/package.json','/.openai/hosting.json','/%2e%2e%2fpackage.json','/unknown.html'])assert.equal((await fetch(base+route)).status,404,route);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});
