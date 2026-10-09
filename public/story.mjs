export const coreIds = Object.freeze(['kraude','secondbrain3d','antistudy']);
export const workIds = Object.freeze(['iphone','village','yt-korean']);
export const storyChapters = Object.freeze([
  {id:'spark',title:'THE SPARK',copy:'작은 호기심 하나에서…'},
  {id:'constellation',title:'THE CONSTELLATION',copy:'아이디어는 서로 연결된다.'},
  {id:'work',title:'THE WORK',copy:'상상이 화면이 되는 순간.'},
  {id:'convergence',title:'THE CONVERGENCE',copy:'그리고, 하나의 세계가 되었다.'},
  {id:'core',title:'THE CORE',copy:'JUWON — STILL BUILDING.'}
]);
const smooth = t => t*t*(3-2*t);
const clamp=t=>Math.max(0,Math.min(1,t));
export function worldPosition(id){
  const work=workIds.indexOf(id),core=coreIds.indexOf(id);
  if(work>=0)return [14+work*16,-1.6,1];
  if(core>=0)return [70+core*20,-1.6,1];
  let hash=0;for(const c of id)hash=(hash*31+c.charCodeAt(0))>>>0;
  return [(hash%160)/10-8,((hash>>>8)%80)/10-4,-8-((hash>>>16)%6)];
}
function stationTravel(local,start,gap,exit){
  const scaled=local*3,index=Math.min(2,Math.floor(scaled)),part=scaled-index;
  const from=start+index*gap,to=index===2?exit:from+gap;
  return from+(to-from)*smooth(clamp((part-.6)/.4));
}
export function sampleStory(progress) {
  const p = Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0));
  const scaled = p*5;
  const index = Math.min(4,Math.floor(scaled));
  const local = Math.max(0,Math.min(1,scaled-index));
  const t = smooth(local);
  const ids = index===2?workIds:index===4?coreIds:null;
  const x=index===0?0:index===1?14*t:index===2?stationTravel(local,14,16,58):index===3?58+12*t:stationTravel(local,70,20,110);
  const z=index===0?20-6*t:index===1?14-2*t:12;
  return {
    chapter:storyChapters[index].id,local,progress:p,
    camera:{position:[x,0,z],target:[x,0,0]},
    focusId:ids?ids[Math.min(ids.length-1,Math.floor(local*ids.length))]:null
  };
}
export function splitGraphemes(text,segmenter) {
  if(!segmenter) return [text];
  return Array.from(segmenter.segment(text),entry=>entry.segment);
}
