import test from 'node:test';
import assert from 'node:assert/strict';
const module=await import('../public/motion.mjs').catch(e=>{if(e.code==='ERR_MODULE_NOT_FOUND')return {};throw e;});
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function fixture({reduced=false,denyStorage=false,rejectLoad=false,pending=false}={}) {
  const classes=new Set(),ticker=new Set(),calls={load:0,created:0,disposed:0,frames:[]};
  const window=new EventTarget();Object.assign(window,{innerWidth:1440,innerHeight:900,devicePixelRatio:2,scrollY:0,performance:{now:()=>0},matchMedia:q=>Object.assign(new EventTarget(),{matches:q.includes('reduced-motion')&&reduced})});
  const document=new EventTarget();Object.assign(document,{hidden:false,body:{classList:{add:(...a)=>a.forEach(v=>classes.add(v)),remove:(...a)=>a.forEach(v=>classes.delete(v)),contains:v=>classes.has(v)}}});
  const button=new EventTarget();button.setAttribute=()=>{};
  const canvas=new EventTarget(),dialog=Object.assign(new EventTarget(),{open:false});
  const chapters=['spark','constellation','work','convergence','core'].map((id,i)=>({dataset:{storyChapter:id},getBoundingClientRect:()=>({top:i*1000-window.scrollY,height:1000,bottom:(i+1)*1000-window.scrollY})}));
  const journey={getBoundingClientRect:()=>({top:-window.scrollY,bottom:5000-window.scrollY,height:5000})};
  const nodes={'#journey':journey,'#universe-canvas':canvas,'#motion-toggle':button,'#detail':dialog};
  document.querySelector=s=>nodes[s]||null;document.querySelectorAll=s=>s==='[data-story-chapter]'?chapters:[];
  const gsap={registerPlugin(){},ticker:{add:cb=>ticker.add(cb),remove:cb=>ticker.delete(cb)},fromTo:()=>({kill(){}}),set(){}};
  const deps={gsap,ScrollTrigger:{create:()=>({kill(){}}),refresh(){},update(){}},SplitText:null,THREE:{},postprocessing:null,Lenis:null};
  let release;
  const hold=new Promise(resolve=>release=resolve);
  const environment={window,document,storage:{getItem(){if(denyStorage)throw Error('denied');return null;},setItem(){}},loadDependencies:async()=>{calls.load++;if(rejectLoad)throw Error('module failed');return pending?hold:deps;},createUniverse:async()=>{calls.created++;return {update:frame=>calls.frames.push(frame),resize(){},setQuality(){},dispose(){calls.disposed++;}};}};
  return {environment,document,window,button,dialog,ticker,calls,classes,release:()=>release(deps)};
}
test('reduced motion shows document without loading graphics or starting a loop',async()=>{
  assert.equal(typeof module.startMotion,'function');
  const f=fixture({reduced:true});const handle=await module.startMotion({root:f.document,projects:[],environment:f.environment});await settle();
  assert.equal(f.calls.load,0);assert.equal(f.ticker.size,0);assert.ok(f.classes.has('motion-off'));handle.stop();
});
test('storage denial does not prevent graphics; module rejection leaves static document usable',async()=>{
  assert.equal(typeof module.startMotion,'function');
  for(const options of [{denyStorage:true},{rejectLoad:true}]){
    const f=fixture(options),handle=await module.startMotion({root:f.document,projects:[],environment:f.environment});await settle();
    if(options.denyStorage)assert.equal(f.calls.created,1);
    else{assert.ok(f.classes.has('motion-off'));assert.equal(f.calls.created,0);}
    handle.stop();
  }
});
test('one frame loop follows real section geometry in either direction and does not move deep links',async()=>{
  assert.equal(typeof module.startMotion,'function');
  const f=fixture();f.window.scrollY=2500;
  const handle=await module.startMotion({root:f.document,projects:[],environment:f.environment});await settle();
  assert.equal(f.window.scrollY,2500);assert.equal(f.ticker.size,1);
  for(const [position,focus] of [[2000,'iphone'],[2500,'village'],[4500,'secondbrain3d'],[2000,'iphone']]){
    f.window.scrollY=position;for(const cb of f.ticker)cb(1);
    assert.equal(f.calls.frames.at(-1).focusId,focus);
  }
  handle.stop();handle.stop();assert.equal(f.calls.disposed,1);assert.equal(f.ticker.size,0);
});
test('hidden tab and open dialog suspend the graphics loop, then resume only once',async()=>{
  assert.equal(typeof module.startMotion,'function');
  const f=fixture(),handle=await module.startMotion({root:f.document,projects:[],environment:f.environment});await settle();
  f.document.hidden=true;f.document.dispatchEvent(new Event('visibilitychange'));assert.equal(f.ticker.size,0);
  f.document.hidden=false;f.document.dispatchEvent(new Event('visibilitychange'));assert.equal(f.ticker.size,1);
  f.dialog.open=true;f.document.dispatchEvent(new Event('portfolio:dialog'));assert.equal(f.ticker.size,0);
  f.dialog.open=false;f.document.dispatchEvent(new Event('portfolio:dialog'));assert.equal(f.ticker.size,1);handle.stop();
});
test('late dependency completion after stop cannot resurrect graphics',async()=>{
  assert.equal(typeof module.startMotion,'function');
  const f=fixture({pending:true}),handle=await module.startMotion({root:f.document,projects:[],environment:f.environment});
  handle.stop();f.release();await settle();assert.equal(f.calls.created,0);assert.equal(f.ticker.size,0);
});
test('pageshow on an already active document cannot create a second renderer',async()=>{
  const f=fixture(),handle=await module.startMotion({root:f.document,projects:[],environment:f.environment});await settle();
  f.window.dispatchEvent(new Event('pageshow'));await settle();
  assert.equal(f.calls.created,1);assert.equal(f.ticker.size,1);handle.stop();
});
