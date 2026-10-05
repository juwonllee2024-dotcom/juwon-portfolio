import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';

// Missing exhibit metadata must not silently turn every idea or CLI into a visual work.
test('visual works expose reviewed descriptions without promoting ideas to completed apps', async () => {
  const {projects} = await import('../public/catalog.mjs');
  const works = projects.filter(p => p.exhibit);
  assert.ok(works.some(p => p.id === 'seoul'), 'Seoul Zero must appear in the exhibition');
  assert.ok(works.some(p => p.id === 'factory-proof'));
  assert.ok(works.some(p => p.id === 'atlas'));
  assert.ok(!works.some(p => p.id === 'token-saver' || p.id === 'github-goal'));
  const iphone = works.find(p => p.id === 'iphone');
  assert.equal(iphone.exhibit.state, 'partial');
  assert.match(iphone.evidence, /초기|미완성/);
  for (const p of works) {
    assert.ok(['world','web','app'].includes(p.exhibit.group));
    assert.ok(p.exhibit.note);
    for (const shot of p.exhibit.shots || []) {
      assert.match(shot.src, /^\.\/[a-z0-9-]+\.(?:png|jpg)$/);
      assert.ok(shot.alt && shot.caption);
      assert.ok(existsSync(new URL('../public/' + shot.src.slice(2), import.meta.url)));
    }
    assert.doesNotMatch(JSON.stringify(p), /C:\\|127\.0\.0\.1|localhost:\d|api[_-]?key/i);
  }
});

// Exercise real markup, not DOM mocks. An unsafe image URL or unescaped title must never publish.
test('exhibition rendering escapes text and distinguishes real captures from missing captures', async () => {
  const module = await import('../public/showcase.mjs').catch(error => {
    if (error.code === 'ERR_MODULE_NOT_FOUND') return {};
    throw error;
  });
  const render = module.renderExhibitCard || (() => '');
  const p = {id:'safe',name:'<script>alert(1)</script>',description:'A & B',status:'구현 자료',exhibit:{group:'world',state:'implemented',note:'기록 확인',shots:[]}};
  const missing = render(p);
  assert.match(missing, /&lt;script&gt;/);
  assert.doesNotMatch(missing, /<script>/);
  assert.match(missing, /화면 캡처 준비 중/);
  assert.doesNotMatch(missing, /<img/);
  const shot = render({...p,exhibit:{...p.exhibit,shots:[{src:'./seoul-zero-city.jpg',alt:'서울 도시',caption:'기록된 실제 실행 화면'}]}});
  assert.match(shot, /<img[^>]+src="\.\/seoul-zero-city\.jpg"/);
  assert.match(shot, /실제 실행 화면/);
  const unsafe = render({...p,exhibit:{...p.exhibit,shots:[{src:'https://tracking.example/a.png',alt:'x',caption:'x'}]}});
  assert.doesNotMatch(unsafe, /<img/);
});

test('UI preview photos never imply a connected backend or verified execution', async () => {
  const {renderExhibitCard,renderExhibitMedia} = await import('../public/showcase.mjs');
  const p={id:'preview',name:'Preview',description:'UI only',status:'구현 자료',exhibit:{state:'partial',shots:[{src:'./preview-screen.png',alt:'UI',caption:'백엔드 미연결',kind:'ui-preview'}]}};
  assert.match(renderExhibitCard(p),/실제 UI 캡처 · 미리보기/);
  assert.doesNotMatch(renderExhibitCard(p),/실제 실행 화면/);
  assert.match(renderExhibitMedia(p),/실제 UI 캡처 · 미리보기/);
  assert.match(renderExhibitMedia(p),/백엔드 미연결/);
  const missing={...p,exhibit:{shots:[],captureIssue:'데스크톱 런타임 연결 필요 <check>'}};
  assert.match(renderExhibitMedia(missing),/데스크톱 런타임 연결 필요 &lt;check&gt;/);
});

test('24 visual works have 25 reviewed raster captures; missing works keep explicit reasons', async () => {
  const {projects}=await import('../public/catalog.mjs');
  const works=projects.filter(p=>p.exhibit);
  assert.equal(works.length,26);
  assert.equal(works.filter(p=>p.exhibit.shots.length).length,24);
  const shots=works.flatMap(p=>p.exhibit.shots);
  assert.equal(shots.length,25);
  assert.deepEqual(works.filter(p=>!p.exhibit.shots.length).map(p=>p.id).sort(),['local-chat','openhands']);
  for(const p of works.filter(p=>!p.exhibit.shots.length)) assert.ok(p.exhibit.captureIssue);
  for(const shot of shots.filter(s=>s.src.endsWith('-screen.jpg'))) {
    assert.ok(['running-ui','ui-preview'].includes(shot.kind));
    const data=readFileSync(new URL('../public/'+shot.src.slice(2),import.meta.url));
    assert.equal(data.subarray(0,3).toString('hex'),'ffd8ff');
    let dimensions;
    for(let offset=2;offset<data.length;) {
      assert.equal(data[offset++],0xff);
      while(data[offset]===0xff) offset++;
      const marker=data[offset++];
      if([0xc0,0xc1,0xc2].includes(marker)){dimensions={height:data.readUInt16BE(offset+3),width:data.readUInt16BE(offset+5)};break;}
      if(marker===0xda||marker===0xd9) break;
      offset+=data.readUInt16BE(offset);
    }
    assert.ok(dimensions?.width>=1000 && dimensions?.height>=600);
    assert.ok(data.length<25*1024*1024);
  }
});
