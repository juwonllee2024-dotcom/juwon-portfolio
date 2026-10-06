import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../public/vendor-three.mjs';
import {sampleStory} from '../public/story.mjs';
const missing = async path => import(path).catch(e=>{if(e.code==='ERR_MODULE_NOT_FOUND')return {};throw e;});
const policy=await missing('../public/motion-policy.mjs');
const universe=await missing('../public/universe.mjs');

test('quality monitor degrades only after visible, warmed-up complete slow windows',()=>{
  assert.equal(typeof policy.createFrameMonitor,'function');
  const monitor=policy.createFrameMonitor('high');
  monitor.reset(0);
  let time=0;
  for(let i=0;i<40;i++) assert.equal(monitor.record({timeMs:time+=40,visible:true}),'high');
  time=2101;monitor.record({timeMs:time,visible:true});
  for(let i=0;i<120;i++) monitor.record({timeMs:time+=32,visible:true});
  assert.equal(monitor.record({timeMs:time,visible:true}),'high');
  for(let i=0;i<120;i++) monitor.record({timeMs:time+=32.1,visible:true});
  assert.equal(monitor.record({timeMs:time,visible:true}),'low');
  for(let i=0;i<120;i++) monitor.record({timeMs:time+=32.1,visible:true});
  assert.equal(monitor.record({timeMs:time,visible:true}),'low');
  for(let i=0;i<120;i++) monitor.record({timeMs:time+=16,visible:true});
  for(let i=0;i<120;i++) monitor.record({timeMs:time+=33,visible:true});
  assert.equal(monitor.record({timeMs:time,visible:true}),'low');
  for(let i=0;i<120;i++) monitor.record({timeMs:time+=33,visible:true});
  assert.equal(monitor.record({timeMs:time,visible:true}),'off');
});
test('hidden time and resume are not counted as slow frames',()=>{
  assert.equal(typeof policy.createFrameMonitor,'function');
  const monitor=policy.createFrameMonitor('high');
  monitor.reset(0);
  monitor.record({timeMs:100000,visible:false});
  for(let i=0;i<45;i++) assert.equal(monitor.record({timeMs:100010+i*40,visible:true}),'high');
});
function backend() {
  const state={renders:0,disposes:0,loads:[],scene:null,pixelRatio:null};
  class Renderer {
    setPixelRatio(value){state.pixelRatio=value;}
    setSize(){}
    render(scene,camera){state.renders++;state.scene=scene;assert.ok(camera.isPerspectiveCamera);}
    dispose(){state.disposes++;}
    setClearColor(){}
  }
  class Loader {load(url,success,progress,failure){state.loads.push({url,success,failure});}}
  return {state,THREE:{...THREE,WebGLRenderer:Renderer,TextureLoader:Loader}};
}
const projects=Array.from({length:10},(_,i)=>({id:i===0?'iphone':i===1?'village':'screen-'+i,exhibit:{shots:[{src:'./'+i+'-screen.jpg',alt:'screen',caption:'UI preview'}]}}));
test('actual scene respects low-power draw budget, cache capacity and resource lifetime',async()=>{
  assert.equal(typeof universe.init,'function');
  const b=backend(),canvas=new EventTarget();
  const engine=await universe.init({canvas,projects,quality:'low',dependencies:{THREE:b.THREE,postprocessing:null},onFailure:e=>assert.fail(String(e))});
  engine.resize(360,780,3);
  engine.update(sampleStory(.4),0);
  assert.equal(b.state.pixelRatio,1);
  assert.equal(b.state.renders,1);
  const stars=[];b.state.scene.traverse(node=>{if(node.isPoints)stars.push(node);});
  assert.ok(stars.length>0);
  assert.ok(stars.every(p=>p.geometry.drawRange.count<=350));
  assert.ok(b.state.loads.length<=4);
  engine.dispose();engine.dispose();
  assert.equal(b.state.disposes,1);
  let releases=0;
  for(const request of b.state.loads){const texture=new THREE.Texture({width:1280,height:720});texture.addEventListener('dispose',()=>releases++);request.success(texture);}
  assert.equal(releases,b.state.loads.length,'late GPU textures must be released');
  engine.update(sampleStory(.5),1);
  assert.equal(b.state.renders,1,'disposed scene cannot render');
});
test('lost context or failed texture falls back once without leaking renderer',async()=>{
  assert.equal(typeof universe.init,'function');
  for(const mode of ['context','texture']){
    const b=backend(),canvas=new EventTarget();let failures=0;
    const engine=await universe.init({canvas,projects,quality:'low',dependencies:{THREE:b.THREE,postprocessing:null},onFailure:()=>failures++});
    engine.update(sampleStory(.4),0);
    if(mode==='context')canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));
    else b.state.loads[0].failure(new Error('download failed'));
    engine.dispose();
    assert.equal(failures,1);assert.equal(b.state.disposes,1);
  }
});
