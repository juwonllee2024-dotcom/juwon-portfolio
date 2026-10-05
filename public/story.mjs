export const coreIds = Object.freeze(['kraude','secondbrain3d','antistudy']);
export const workIds = Object.freeze(['iphone','village','yt-korean']);
export const storyChapters = Object.freeze([
  {id:'spark',title:'THE SPARK',copy:'작은 호기심 하나에서…'},
  {id:'constellation',title:'THE CONSTELLATION',copy:'아이디어는 서로 연결된다.'},
  {id:'work',title:'THE WORK',copy:'상상이 화면이 되는 순간.'},
  {id:'convergence',title:'THE CONVERGENCE',copy:'그리고, 하나의 세계가 되었다.'},
  {id:'core',title:'THE CORE',copy:'JUWON — STILL BUILDING.'}
]);
const positions = [[0,0,20],[1,1,11],[4,1,12],[-3,0,10],[0,2,14],[0,0,9]];
const smooth = t => t*t*(3-2*t);
export function sampleStory(progress) {
  const p = Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0));
  const scaled = p*5;
  const index = Math.min(4,Math.floor(scaled));
  const local = Math.max(0,Math.min(1,scaled-index));
  const t = smooth(local);
  const ids = index===2?workIds:index===4?coreIds:null;
  return {
    chapter:storyChapters[index].id,local,
    camera:{position:positions[index].map((v,i)=>v+(positions[index+1][i]-v)*t),target:[0,0,0]},
    focusId:ids?ids[Math.min(ids.length-1,Math.floor(local*ids.length))]:null
  };
}
export function splitGraphemes(text,segmenter) {
  if(!segmenter) return [text];
  return Array.from(segmenter.segment(text),entry=>entry.segment);
}
