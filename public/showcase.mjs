const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const reviewedShots = project => (project.exhibit?.shots || []).filter(shot => /^\.\/[a-z0-9-]+\.(?:png|jpg)$/.test(shot.src));
const captureLabel = shot => shot.kind === 'ui-preview' ? '실제 UI 캡처 · 미리보기' : shot.kind === 'running-ui' ? '실제 앱 화면 · 캡처' : '실제 실행 화면 · 기록 캡처';
export function renderExhibitCard(project) {
  const shot = reviewedShots(project)[0];
  const media = shot
    ? `<img src="${esc(shot.src)}" alt="${esc(shot.alt)}" loading="lazy" decoding="async"><span class="capture-label">${captureLabel(shot)}</span>`
    : `<div class="capture-pending"><span>SCREEN CAPTURE PENDING</span><strong>${esc(project.name)}</strong><small>화면 캡처 준비 중 · 가상 화면 아님</small></div>`;
  return `<button class="exhibit-card" data-project="${esc(project.id)}" aria-label="${esc(project.name)} 작품 설명 보기"><div class="exhibit-media">${media}</div><div class="exhibit-info"><span class="status ${project.exhibit.state==='partial'?'idea':''}">${esc(project.status)}</span><h3>${esc(project.name)}</h3><p>${esc(project.description)}</p><span class="exhibit-more">작품 설명 · 화면 · 근거 보기 ↗</span></div></button>`;
}
export function renderExhibitMedia(project) {
  const shots = reviewedShots(project);
  if (!shots.length) return project.exhibit ? `<p class="detail-unavailable">공개할 실제 화면 캡처를 준비 중입니다. ${esc(project.exhibit.captureIssue || '')} 컨셉 이미지를 실행 화면으로 표시하지 않습니다.</p>` : '';
  return shots.map(shot => `<figure class="detail-capture"><a href="${esc(shot.src)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(shot.alt)} 원본 화면 보기"><img src="${esc(shot.src)}" alt="${esc(shot.alt)}" loading="lazy" decoding="async"></a><figcaption>${captureLabel(shot)} · ${esc(shot.caption)} · 현재 실행 상태를 보장하지 않습니다.</figcaption></figure>`).join('');
}

const repositoryUrl = value => typeof value === 'string' && /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value);
export function renderProjectLinks(project) {
  const seen = new Set();
  const labels = {source:'GitHub 코드 저장소',shared:'공용 코드 저장소', 'upstream-copy':'외부 원작 기반 사본',snapshot:'원본 코드 공개 스냅샷',integration:'활용 실험 코드 저장소'};
  const links = [];
  for (const repo of project.repositories || []) {
    if (!repositoryUrl(repo.url) || !Object.hasOwn(labels,repo.kind) || seen.has(repo.url)) continue;
    seen.add(repo.url);
    links.push(`<div class="detail-source"><a class="primary" href="${esc(repo.url)}" target="_blank" rel="noopener noreferrer">${labels[repo.kind]} <span>↗</span></a><p>${esc(repo.note || '')}</p></div>`);
  }
  const related = project.url;
  if (!project.relatedLinkUnavailable && typeof related === 'string' && !seen.has(related) && (repositoryUrl(related) || /^https:\/\/www\.youtube\.com\/@[^\s"'<>]+$/.test(related))) {
    const label = project.status === '외부 도구 활용' ? '외부 원작 보기' : repositoryUrl(related) ? '기존 관련 소스' : '관련 채널 보기';
    links.push(`<div class="detail-source"><a class="primary" href="${esc(related)}" target="_blank" rel="noopener noreferrer">${label} <span>↗</span></a></div>`);
  }
  if(project.relatedLinkUnavailable) links.push(`<p class="detail-unavailable">${esc(project.relatedLinkUnavailable)}</p>`);
  if (!seen.size) links.push(`<p class="detail-unavailable">${esc(project.sourceStatus || '확인된 공개 코드 저장소가 없습니다. 원본 코드와 공개 가능 여부 확인 전에는 임의의 리포를 연결하지 않습니다.')}</p>`);
  else links.push('<p class="detail-unavailable">코드 저장소 링크입니다. 공개 실행 데모나 전체 기능의 정상 작동을 보장하지 않습니다. 저장소의 현재 버전은 기록된 캡처와 다를 수 있습니다.</p>');
  return links.join('');
}
