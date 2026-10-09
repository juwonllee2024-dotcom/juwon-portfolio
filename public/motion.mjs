import {sampleStory,splitGraphemes} from './story.mjs';
import {createFrameMonitor} from './motion-policy.mjs';

function defaultEnvironment() {
  return {window,document,get storage(){return window.localStorage;},
    async loadDependencies(quality){
      const [THREE,G,L,P]=await Promise.all([import('./vendor-three.mjs'),import('./vendor-gsap.mjs'),import('./vendor-lenis.mjs'),quality==='high'?import('./vendor-postprocessing.mjs'):Promise.resolve(null)]);
      return {THREE,...G,Lenis:L.default,postprocessing:P};
    },async createUniverse(options){return (await import('./universe.mjs')).init(options);}
  };
}

export async function startMotion({root,projects,environment=defaultEnvironment()}) {
  const env=environment,win=env.window,doc=env.document,body=doc.body;
  const journey=root.querySelector('#journey'),canvas=root.querySelector('#universe-canvas'),button=root.querySelector('#motion-toggle');
  const chapters=Array.from(root.querySelectorAll('[data-story-chapter]'));
  const media=win.matchMedia('(prefers-reduced-motion: reduce)');
  const dialog=root.querySelector('#detail');
  let disabled=false,stopped=false,generation=0,engine=null,deps=null,lenis=null,ticking=false,insideJourney=false,quality='low',monitor=null;
  const cleanups=[],animations=[],splits=[],clones=[];
  try{disabled=env.storage?.getItem('juwon-motion-disabled')==='true';}catch{}
  function buttonState(){if(!button)return;button.setAttribute('aria-pressed',String(disabled||media.matches));button.disabled=media.matches;button.textContent=media.matches?'모션 꺼짐':disabled?'모션 켜기':'모션 끄기';}
  function listen(target,event,handler){target?.addEventListener(event,handler);cleanups.push(()=>target?.removeEventListener(event,handler));}
  function progress(){
    let result=0;
    for(let i=0;i<chapters.length;i++){
      const r=chapters[i].getBoundingClientRect();
      if(r.top>0)break;
      result=(i+Math.max(0,Math.min(1,-r.top/Math.max(1,r.height))))/5;
    }
    return Math.max(0,Math.min(1,result));
  }
  function now(){return win.performance?.now()??performance.now();}
  function resize(){if(!engine)return;engine.resize(win.innerWidth,win.innerHeight,win.devicePixelRatio||1);}
  function tick(seconds){
    if(stopped||!engine||doc.hidden||dialog?.open)return;
    lenis?.raf(seconds*1000);
    if(!insideJourney)return;
    const next=monitor.record({timeMs:now(),visible:true});
    if(next==='off'){disabled=true;deactivate();buttonState();return;}
    if(next!==quality){quality=next;engine.setQuality(next);resize();}
    const p=progress();engine.update(sampleStory(p),seconds);
    const meter=root.querySelector('#story-meter');if(meter)meter.style.transform=`scaleX(${p})`;
  }
  function suspend(){if(ticking){deps.gsap.ticker.remove(tick);ticking=false;}lenis?.stop();}
  function sync(){
    if(!engine||stopped)return;
    const r=journey.getBoundingClientRect();
    insideJourney=r.bottom>0&&r.top<win.innerHeight;
    // Lenis owns document scrolling, so its clock must outlive the visible 3D scene.
    const active=!doc.hidden&&!dialog?.open&&(insideJourney||!!lenis);
    if(!insideJourney)monitor.reset(now());
    if(!active){suspend();monitor.reset(now());return;}
    if(!ticking){monitor.reset(now());deps.gsap.ticker.add(tick);ticking=true;lenis?.start();}
  }
  function deactivate(){
    generation++;suspend();lenis?.destroy();lenis=null;
    for(const animation of animations.splice(0))animation.kill();
    for(const split of splits.splice(0))split.revert();
    for(const clone of clones.splice(0))clone.remove();
    engine?.dispose();engine=null;
    body.classList.remove('motion-ready');body.classList.add('motion-off');
    deps?.ScrollTrigger.refresh();
  }
  function typography(){
    for(const source of root.querySelectorAll('[data-reveal], [data-type]')){
      const clone=source.cloneNode(true);clone.removeAttribute('id');clone.removeAttribute('data-reveal');clone.removeAttribute('data-type');clone.classList.remove('story-readable');clone.classList.add('story-clone');clone.setAttribute('aria-hidden','true');
      source.after(clone);clones.push(clone);
      let units=[clone];
      const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('ko',{granularity:'grapheme'}):null;
      if(source.hasAttribute('data-type')&&segmenter){
        clone.textContent='';units=splitGraphemes(source.textContent,segmenter).map(text=>{const span=doc.createElement('span');span.textContent=text;span.style.display='inline-block';span.style.whiteSpace='pre';clone.append(span);return span;});
      }else if(!source.hasAttribute('data-type')&&segmenter&&deps.SplitText){const split=new deps.SplitText(clone,{type:'words',aria:'none'});splits.push(split);units=split.words;}
      const initial=source.closest('[data-story-chapter="spark"]');
      animations.push(deps.gsap.fromTo(units,{opacity:0,y:source.hasAttribute('data-type')?4:46,rotateX:source.hasAttribute('data-type')?0:15},{opacity:1,y:0,rotateX:0,duration:initial?1.1:1,stagger:source.hasAttribute('data-type')?.035:.075,ease:'power3.out',delay:initial?.18:0,...(!initial?{scrollTrigger:{trigger:source.closest('article')||source.closest('[data-story-chapter]'),start:'top 75%',end:'top 15%',scrub:.5}}:{})}));
    }
  }
  async function launch(){
    if(stopped||engine||disabled||media.matches||!journey||!canvas)return;
    const token=++generation;
    quality=win.matchMedia('(pointer: coarse)').matches||win.innerWidth<=760?'low':'high';
    try{
      const loaded=await env.loadDependencies(quality);
      if(stopped||token!==generation)return;
      deps=loaded;deps.gsap.registerPlugin(deps.ScrollTrigger,...(deps.SplitText?[deps.SplitText]:[]));
      const created=await env.createUniverse({canvas,projects,quality,dependencies:{THREE:deps.THREE,postprocessing:deps.postprocessing},onFailure:()=>{disabled=true;deactivate();buttonState();}});
      if(stopped||token!==generation){created.dispose();return;}
      engine=created;monitor=createFrameMonitor(quality);monitor.reset(now());
      typography();body.classList.remove('motion-off');body.classList.add('motion-ready','motion-layout');
      if(win.matchMedia('(pointer: fine)').matches&&deps.Lenis){lenis=new deps.Lenis({autoRaf:false,anchors:true,smoothWheel:true,syncTouch:false,prevent:node=>node.closest?.('dialog')});lenis.on('scroll',deps.ScrollTrigger.update);}
      animations.push(deps.ScrollTrigger.create({trigger:journey,start:'top bottom',end:'bottom top',onEnter:sync,onLeave:sync,onEnterBack:sync,onLeaveBack:sync}));
      resize();deps.ScrollTrigger.refresh();
      const hash=win.location?.hash;
      if(['#works','#selected','#projects','#about'].includes(hash))root.querySelector(hash)?.scrollIntoView({behavior:'instant'});
      sync();tick(0);
      doc.fonts?.ready.then(()=>{if(!stopped&&engine){deps.ScrollTrigger.refresh();resize();}}).catch(()=>{});
    }catch{if(!stopped&&token===generation){disabled=true;deactivate();buttonState();}}
  }
  function toggle(){disabled=!disabled;try{env.storage?.setItem('juwon-motion-disabled',String(disabled));}catch{}if(disabled)deactivate();else launch();buttonState();}
  function refresh(){resize();deps?.ScrollTrigger.refresh();sync();}
  listen(button,'click',toggle);listen(win,'resize',refresh);listen(win,'scroll',sync);listen(doc,'visibilitychange',sync);listen(doc,'portfolio:dialog',sync);listen(dialog,'toggle',sync);listen(dialog,'close',sync);
  listen(media,'change',()=>{if(media.matches)deactivate();else if(!disabled)launch();buttonState();});
  listen(win,'pagehide',()=>{deactivate();});
  listen(win,'pageshow',()=>{if(!stopped&&!disabled&&!media.matches)launch();});
  body.classList.add('motion-off');buttonState();launch();
  return {stop(){if(stopped)return;stopped=true;deactivate();for(const cleanup of cleanups.splice(0))cleanup();},refresh};
}
