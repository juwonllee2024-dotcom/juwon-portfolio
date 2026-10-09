import {projects,categoryLabels,filterProjects,exhibitGroups} from './catalog.mjs';
import {renderExhibitCard,renderExhibitMedia,renderProjectLinks} from './showcase.mjs';
const $ = s=>document.querySelector(s);
const legacyPages={works:'works.html',selected:'selected.html',projects:'projects.html',about:'about.html'};
if(document.body.dataset.page==='home'&&Object.hasOwn(legacyPages,location.hash.slice(1)))location.replace('./'+legacyPages[location.hash.slice(1)]);
const esc = v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let category='all';
let exhibitGroup='all';
const exhibitProjects=projects.filter(p=>p.exhibit).sort((a,b)=>Number(b.exhibit.shots.length>0)-Number(a.exhibit.shots.length>0));
if($('#works-grid')){
$('#work-count').textContent=String(exhibitProjects.length);
$('#work-filters').innerHTML=Object.entries(exhibitGroups).map(([key,label])=>`<button class="filter ${key==='all'?'active':''}" data-exhibit-group="${key}" aria-pressed="${key==='all'}">${esc(label)}</button>`).join('');
function renderExhibition(){
  const rows=filterProjects(exhibitProjects,$('#work-search').value).filter(p=>exhibitGroup==='all'||p.exhibit.group===exhibitGroup);
  $('#works-grid').innerHTML=rows.map(renderExhibitCard).join('');
  $('#work-results').textContent=`${rows.length}개 전시 / 전체 ${exhibitProjects.length}개 · 미완성·연동 작품 포함`;
  $('#work-empty').hidden=rows.length!==0;
}
$('#work-filters').addEventListener('click',e=>{const button=e.target.closest('[data-exhibit-group]');if(!button)return;exhibitGroup=button.dataset.exhibitGroup;for(const b of $('#work-filters').children){const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}renderExhibition();});
$('#work-search').addEventListener('input',renderExhibition);
renderExhibition();
}
const statusClass=p=>/구상|목표|보류|주제/.test(p.status)?'idea':'';
const card=p=>`<button class="project-card" data-project="${esc(p.id)}" aria-label="${esc(p.name)} 상세 보기"><div class="card-top"><span class="card-category">${esc(categoryLabels[p.category])}</span><span class="card-arrow">↗</span></div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="card-bottom"><span>${esc(p.tags[0])}</span><span class="status ${statusClass(p)}">${esc(p.status)}</span></div></button>`;
const artworks = {
  kraude:`<g stroke="#849d64" fill="#303e26"><path d="M65 70L160 50L260 86L207 151L107 158Z" fill="none"/><path d="M160 50V118M65 70L160 118L260 86M160 118L207 151M160 118L107 158" stroke-dasharray="3 3"/><circle cx="160" cy="118" r="19" fill="#c8f36b"/><circle cx="65" cy="70" r="12"/><circle cx="160" cy="50" r="12"/><circle cx="260" cy="86" r="12"/><circle cx="207" cy="151" r="12"/><circle cx="107" cy="158" r="12"/></g><text x="153" y="123" font-size="14" fill="#162010">j.</text><text x="100" y="205" fill="#a5b991" font-size="10" letter-spacing="3">AGENT WORLD</text>`,
  antistudy:`<rect x="43" y="42" width="243" height="156" rx="8" fill="#222b1b" stroke="#536442"/><text x="63" y="67" font-size="10" fill="#bbd297">TODAY'S MISSION</text><rect x="63" y="82" width="198" height="31" rx="4" fill="#323f26"/><circle cx="80" cy="97" r="6" fill="#c8f36b"/><path d="M76 97l3 3 5-6" stroke="#273519" fill="none"/><rect x="95" y="94" width="109" height="5" rx="2" fill="#a8bf8c"/><rect x="63" y="122" width="198" height="29" rx="4" fill="#293422"/><rect x="63" y="160" width="125" height="5" rx="2" fill="#688151"/><rect x="63" y="174" width="184" height="4" rx="2" fill="#4b5d3b"/>`,
  'lee-relay':`<path d="M78 100H248" stroke="#8995a7" stroke-width="2" stroke-dasharray="5 7"/><g fill="#293038" stroke="#616e7a"><rect x="39" y="69" width="75" height="66" rx="12"/><rect x="128" y="101" width="75" height="66" rx="12"/><rect x="218" y="69" width="75" height="66" rx="12"/></g><g fill="#ccd7c1" font-size="25" font-weight="700"><text x="62" y="111">AI</text><text x="151" y="143">AI</text><text x="241" y="111">AI</text></g><path d="M114 99h14m75 0h15" stroke="#c8f36b"/><text x="83" y="198" fill="#aab4be" font-size="10" letter-spacing="2">ROOM → RUN → REPORT</text>`,
  'token-saver':`<g font-size="12" fill="#84966c" font-family="monospace"><text x="40" y="63">context: {</text><text x="57" y="86">goal, evidence, next</text><text x="40" y="109">}</text><text x="40" y="140" fill="#c8f36b">LESS NOISE.</text><text x="40" y="163" fill="#c8f36b">MORE SIGNAL.</text></g><g fill="#465835"><rect x="228" y="51" width="10" height="117" rx="3"/><rect x="245" y="79" width="10" height="89" rx="3"/><rect x="262" y="102" width="10" height="66" rx="3"/><rect x="279" y="126" width="10" height="42" rx="3" fill="#c8f36b"/></g>`,
  'yt-korean':`<rect x="48" y="37" width="233" height="126" rx="6" fill="#2c3230" stroke="#6a7f6b"/><path d="M149 71l29 18-29 18z" fill="#c8f36b"/><rect x="78" y="132" width="170" height="16" rx="3" fill="#161c16"/><text x="100" y="143" fill="#dbe5d0" font-size="8">영어 영상에서 한국어 이야기로.</text><g fill="#738967"><rect x="49" y="180" width="52" height="13" rx="2"/><rect x="106" y="180" width="83" height="13" rx="2"/><rect x="194" y="180" width="43" height="13" rx="2"/><rect x="242" y="180" width="40" height="13" rx="2"/></g><path d="M157 172v29" stroke="#c8f36b"/>`,
  command:`<rect x="43" y="43" width="244" height="148" rx="6" fill="#21291c" stroke="#687956"/><path d="M43 74H287M106 74V191" stroke="#48563b"/><g fill="#829667"><rect x="57" y="56" width="90" height="5" rx="2"/><rect x="56" y="92" width="35" height="5" rx="2"/><rect x="56" y="112" width="29" height="5" rx="2"/><rect x="56" y="132" width="36" height="5" rx="2"/></g><g fill="#34452a"><rect x="119" y="87" width="71" height="41" rx="4"/><rect x="199" y="87" width="71" height="41" rx="4"/><rect x="119" y="139" width="151" height="37" rx="4"/></g><circle cx="132" cy="102" r="4" fill="#c8f36b"/><path d="M133 157h43m12 0h42" stroke="#9cb57e"/>`
};
const featuredIds=['kraude','antistudy','lee-relay','token-saver','yt-korean','command'];
if($('#featured'))$('#featured').innerHTML=featuredIds.map((id,i)=>{const p=projects.find(p=>p.id===id);return `<button class="featured-card" data-project="${id}" aria-label="${esc(p.name)} 상세 보기"><div class="feature-art" style="background:${id==='lee-relay'?'#1e252c':'#1e251c'}"><span class="art-number">0${i+1}</span><svg viewBox="0 0 330 235" aria-hidden="true">${artworks[id]}</svg><span class="art-caption">CONCEPT VISUAL / NOT A LIVE SCREENSHOT</span></div><div class="featured-info"><p class="eyebrow">${esc(p.tags.join(' / '))}</p><h3>${esc(p.name)}</h3><span class="featured-arrow">↗</span><p>${esc(p.description)}</p></div></button>`}).join('');
if($('#total-count'))$('#total-count').textContent=String(projects.length);
if($('#catalog')){
$('#filters').innerHTML=Object.entries(categoryLabels).map(([key,label])=>`<button class="filter ${key==='all'?'active':''}" data-category="${key}" aria-pressed="${key==='all'}">${esc(label)}</button>`).join('');
function render(){const rows=filterProjects(projects,$('#search').value,category);$('#catalog').innerHTML=rows.map(card).join('');$('#results').textContent=`${rows.length}개의 기록 / 전체 ${projects.length}`;$('#empty').hidden=rows.length!==0;}
$('#filters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;for(const button of $('#filters').children){const active=button===b;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));}render();});
$('#search').addEventListener('input',render);
$('#view').addEventListener('change',e=>$('#catalog').classList.toggle('list',e.target.value==='list'));
$('#reset').addEventListener('click',()=>{$('#search').value='';$('#filters').querySelector('[data-category="all"]').click();$('#search').focus();});
render();
}
function openDetail(id){const p=projects.find(p=>p.id===id);if(!p)return;$('#detail-category').textContent=p.exhibit?exhibitGroups[p.exhibit.group]:categoryLabels[p.category];$('#detail-title').textContent=p.name;$('#detail-description').textContent=p.description;$('#detail-media').innerHTML=renderExhibitMedia(p);$('#detail-tags').innerHTML=p.tags.map(t=>`<span>${esc(t)}</span>`).join('');$('#detail-status').textContent=p.status;$('#detail-evidence').textContent=p.evidence;$('#detail-link').innerHTML=renderProjectLinks(p);$('#detail').showModal();document.body.classList.add('no-scroll');document.dispatchEvent(new Event('portfolio:dialog'));}
document.addEventListener('click',e=>{const b=e.target.closest('[data-project]');if(b)openDetail(b.dataset.project);});
$('#close-detail').addEventListener('click',()=>$('#detail').close());
$('#detail').addEventListener('close',()=>{document.body.classList.remove('no-scroll');document.dispatchEvent(new Event('portfolio:dialog'));if(location.hash.startsWith('#project-'))history.replaceState(null,'',location.pathname);});
$('#detail').addEventListener('click',e=>{if(e.target!==$('#detail'))return;const r=$('#detail').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#detail').close();});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#detail').open&&($('#search')||$('#work-search'))){e.preventDefault();($('#search')||$('#work-search')).focus();}});
if($('#journey'))import('./motion.mjs').then(({startMotion})=>startMotion({root:document,projects})).catch(()=>document.body.classList.add('motion-off'));
