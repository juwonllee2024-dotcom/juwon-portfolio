const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const reviewedShots = project => (project.exhibit?.shots || []).filter(shot => /^\.\/[a-z0-9-]+\.(?:png|jpg)$/.test(shot.src));
export function renderExhibitCard(project) {
  const shot = reviewedShots(project)[0];
  const media = shot
    ? `<img src="${esc(shot.src)}" alt="${esc(shot.alt)}" loading="lazy" decoding="async"><span class="capture-label">실제 실행 화면 · 기록 캡처</span>`
    : `<div class="capture-pending"><span>SCREEN CAPTURE PENDING</span><strong>${esc(project.name)}</strong><small>화면 캡처 준비 중 · 가상 화면 아님</small></div>`;
  return `<button class="exhibit-card" data-project="${esc(project.id)}" aria-label="${esc(project.name)} 작품 설명 보기"><div class="exhibit-media">${media}</div><div class="exhibit-info"><span class="status ${project.exhibit.state==='partial'?'idea':''}">${esc(project.status)}</span><h3>${esc(project.name)}</h3><p>${esc(project.description)}</p><span class="exhibit-more">작품 설명 · 화면 · 근거 보기 ↗</span></div></button>`;
}
export function renderExhibitMedia(project) {
  const shots = reviewedShots(project);
  if (!shots.length) return project.exhibit ? '<p class="detail-unavailable">공개할 실제 화면 캡처를 준비 중입니다. 컨셉 이미지를 실행 화면으로 표시하지 않습니다.</p>' : '';
  return shots.map(shot => `<figure class="detail-capture"><a href="${esc(shot.src)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(shot.alt)} 원본 화면 보기"><img src="${esc(shot.src)}" alt="${esc(shot.alt)}" loading="lazy" decoding="async"></a><figcaption>${esc(shot.caption)} · 현재 실행 상태를 보장하지 않습니다.</figcaption></figure>`).join('');
}
