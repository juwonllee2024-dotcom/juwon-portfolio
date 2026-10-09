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
    render(scene,camera){state.renders++;state.scene=scene;state.camera=camera;scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);assert.ok(camera.isPerspectiveCamera);}
    dispose(){state.disposes++;}
    setClearColor(){}
  }
  class Loader {load(url,success,progress,failure){state.loads.push({url,success,failure});}}
  return {state,THREE:{...THREE,WebGLRenderer:Renderer,TextureLoader:Loader}};
}
const projects=Array.from({length:10},(_,i)=>({id:i===0?'iphone':i===1?'village':'screen-'+i,exhibit:{shots:[{src:'./'+i+'-screen.jpg',alt:'screen',caption:'UI preview'}]}}));

test('sculptures keep their world coordinates and do not toggle existence at chapter boundaries',async()=>{
  const b=backend(),engine=await universe.init({canvas:new EventTarget(),projects,quality:'low',dependencies:{THREE:b.THREE,postprocessing:null}});
  engine.resize(1440,900,1);engine.update(sampleStory(.799999),5);
  const snapshot=[];b.state.scene.traverse(n=>{if(n.isMesh&&!n.userData.projectId)snapshot.push([n,n.getWorldPosition(new THREE.Vector3()),n.visible]);});
  engine.update(sampleStory(.800001),5);
  for(const [n,position,visible] of snapshot){assert.ok(position.distanceTo(n.getWorldPosition(new THREE.Vector3()))<1e-7,'world geometry must not teleport');assert.equal(n.visible,visible,'arrival must come from camera travel, not sudden visibility switches');}
  engine.dispose();
});

test('late screenshots fade into fixed positions without a load-completion pop',async()=>{
  const b=backend(),engine=await universe.init({canvas:new EventTarget(),projects,quality:'low',dependencies:{THREE:b.THREE,postprocessing:null}});
  engine.resize(1440,900,1);engine.update(sampleStory(.4),10);
  assert.ok(b.state.loads.some(r=>r.url==='./1-screen.jpg'),'next station image must be prefetched');
  b.state.loads.find(r=>r.url==='./0-screen.jpg').success(new THREE.Texture({width:1280,height:720}));
  engine.update(sampleStory(.4),10);let mesh;b.state.scene.traverse(n=>{if(n.userData.projectId==='iphone')mesh=n;});
  assert.equal(mesh.material.opacity,0,'new texture starts transparent');
  const position=mesh.position.clone();
  engine.update(sampleStory(.4),10.225);assert.ok(mesh.material.opacity>0&&mesh.material.opacity<.85);
  engine.update(sampleStory(.4),10.5);assert.ok(mesh.material.opacity>=.85);
  engine.update(sampleStory(.399999),10.5);assert.ok(mesh.position.distanceTo(position)<1e-7,'same image stays anchored when leaving its chapter');
  engine.dispose();
});

test('core sculptures use lit reflective surfaces with selective emission and release their studio texture',async()=>{
  const b=backend(),engine=await universe.init({canvas:new EventTarget(),projects,quality:'low',dependencies:{THREE:b.THREE,postprocessing:null}});
  engine.resize(1440,900,2);engine.update(sampleStory(.81),0);
  const scene=b.state.scene,lights=[],surfaces=[];
  scene.traverse(n=>{if(n.isLight)lights.push(n);if(n.isMesh&&n.material.isMeshStandardMaterial)surfaces.push(n);});
  assert.ok(lights.length>=3,'key, fill and rim illumination must shape the sculpture');
  assert.ok(scene.environment?.isDataTexture,'reflective objects need a bounded studio environment');
  assert.ok(surfaces.length>=24,'architecture must have actual lit surfaces, not flat silhouettes');
  assert.ok(surfaces.some(n=>n.material.metalness>.5));
  assert.ok(surfaces.some(n=>n.material.emissiveIntensity>1));
  assert.ok(lights.every(n=>!n.castShadow),'no extra shadow-map passes on the laptop');
  let released=0;scene.environment.addEventListener('dispose',()=>released++);
  engine.dispose();engine.dispose();assert.equal(released,1);
});

test('automatic quality downgrade disables costly clearcoat on every physical surface',async()=>{
  const b=backend(),engine=await universe.init({canvas:new EventTarget(),projects,quality:'high',dependencies:{THREE:b.THREE,postprocessing:null}});
  engine.update(sampleStory(.81),0);
  const materials=new Set();b.state.scene.traverse(n=>{if(n.isMesh&&n.material.isMeshPhysicalMaterial)materials.add(n.material);});
  assert.ok([...materials].some(m=>m.clearcoat>0));
  engine.setQuality('low');
  assert.ok([...materials].every(m=>m.clearcoat===0),'low quality must disable secondary coat shading');
  engine.dispose();
});

test('desktop origin sculpture is a substantial object rather than a tiny decorative dot',async()=>{
  const b=backend(),engine=await universe.init({canvas:new EventTarget(),projects,quality:'low',dependencies:{THREE:b.THREE,postprocessing:null}});
  engine.resize(1440,900,1);engine.update(sampleStory(0),0);
  let spark;b.state.scene.traverse(n=>{if(n.isMesh&&n.geometry.type==='IcosahedronGeometry'&&n.getWorldPosition(new THREE.Vector3()).x<10)spark=n;});
  const box=new THREE.Box3().setFromObject(spark),xs=[];
  for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])xs.push(new THREE.Vector3(x,y,z).project(b.state.camera).x);
  assert.ok((Math.max(...xs)-Math.min(...xs))*720>=200,'origin object must occupy at least 200 desktop pixels');
  assert.ok(xs.every(x=>Math.abs(x)<=1),'origin sculpture must fit horizontally');engine.dispose();
});
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
test('portrait viewport keeps the focused screenshot inside its horizontal frustum',async()=>{
  const b=backend(),canvas=new EventTarget();
  const engine=await universe.init({canvas,projects,quality:'low',dependencies:{THREE:b.THREE,postprocessing:null},onFailure:e=>assert.fail(String(e))});
  engine.resize(360,780,1);engine.update(sampleStory(.4),0);
  b.state.loads.forEach(r=>r.success(new THREE.Texture({width:1280,height:720})));
  engine.update(sampleStory(.4),1);
  let mesh;b.state.scene.traverse(node=>{if(node.userData.projectId==='iphone')mesh=node;});
  assert.ok(mesh);
  const vertices=mesh.geometry.getAttribute('position');
  for(let i=0;i<vertices.count;i++){
    const projected=new THREE.Vector3().fromBufferAttribute(vertices,i).applyMatrix4(mesh.matrixWorld).project(b.state.camera);
    assert.ok(Math.abs(projected.x)<=1,'focused screenshot must not be cropped horizontally');
  }
  engine.dispose();
});

test('bounded screenshot cache fades old visible cards out before releasing them',async()=>{
  const b=backend(),engine=await universe.init({canvas:new EventTarget(),projects,quality:'low',dependencies:{THREE:b.THREE,postprocessing:null}});
  engine.update(sampleStory(.2),0);
  b.state.loads.forEach(r=>r.success(new THREE.Texture({width:1280,height:720})));
  engine.update(sampleStory(.2),1);const old=[];b.state.scene.traverse(n=>{if(n.userData.projectId)old.push(n);});
  engine.update(sampleStory(.4),1);
  assert.ok(old.every(n=>n.parent),'cache change must not delete visible cards in one frame');
  engine.update(sampleStory(.4),1.15);
  assert.ok(old.some(n=>n.parent&&n.material.opacity>0&&n.material.opacity<.88),'departing cards fade gradually');
  engine.update(sampleStory(.4),1.31);
  assert.ok(old.some(n=>!n.parent),'fully faded cards release their GPU resources');
  let cards=0;b.state.scene.traverse(n=>{if(n.userData.projectId)cards++;});assert.ok(cards<=4);
  engine.dispose();
});
