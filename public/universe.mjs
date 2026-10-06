import {qualityLimits} from './motion-policy.mjs';
import {coreIds,workIds} from './story.mjs';

export async function init({canvas,projects,quality,dependencies,onFailure=()=>{}}) {
  const T=dependencies.THREE;
  const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:quality==='high',powerPreference:'low-power'});
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(44,1,.1,150);
  const resources=new Set(),cache=new Map(),cards=new Map();
  let disposed=false,failed=false,composer=null,currentQuality=quality;
  const keep=r=>{resources.add(r);return r;};
  const release=r=>{if(resources.delete(r))r.dispose();};
  const material=(color,opacity=1)=>keep(new T.MeshBasicMaterial({color,transparent:true,opacity,wireframe:false,depthWrite:false}));
  const root=new T.Group();scene.add(root);
  const starPositions=new Float32Array(1200*3);
  for(let i=0;i<1200;i++){
    const a=i*2.399963,b=Math.acos(1-2*(i+.5)/1200),r=14+(i%19);
    starPositions[i*3]=Math.sin(b)*Math.cos(a)*r;
    starPositions[i*3+1]=Math.sin(b)*Math.sin(a)*r;
    starPositions[i*3+2]=Math.cos(b)*r-12;
  }
  const starGeometry=keep(new T.BufferGeometry());starGeometry.setAttribute('position',new T.BufferAttribute(starPositions,3));
  const stars=new T.Points(starGeometry,keep(new T.PointsMaterial({color:0xc9dfdf,size:.045,transparent:true,opacity:.6,depthWrite:false})));root.add(stars);
  const spark=new T.Mesh(keep(new T.IcosahedronGeometry(.4,2)),material(0xc8f36b));root.add(spark);
  const orbit=new T.Group();root.add(orbit);
  for(let i=0;i<5;i++){
    const ring=new T.Mesh(keep(new T.TorusGeometry(3+i*.52,.012,6,110)),material(i%2?0x82cccc:0xc8f36b,.42));
    ring.rotation.set(i*.37,i*.62,i*.26);orbit.add(ring);
  }
  const cores=coreIds.map((id,index)=>{
    const group=new T.Group();root.add(group);
    if(index===0){
      const geometry=keep(new T.BoxGeometry(.4,1,.4)),paint=material(0xc8f36b,.6);
      for(let i=0;i<24;i++){const box=new T.Mesh(geometry,paint);box.position.set((i%6-2.5)*.75,-1,(Math.floor(i/6)-1.5)*.75);box.scale.y=.5+(i*7%11)/4;group.add(box);}
    }else if(index===1){
      const vertices=[];
      for(let i=0;i<40;i++){const a=i*2.399963,r=1.3+(i%7)*.19;vertices.push(new T.Vector3(Math.cos(a)*r,Math.sin(a)*r,Math.sin(i*1.3)*1.6));}
      const lines=[];for(let i=0;i<vertices.length;i++){lines.push(vertices[i],vertices[(i+7)%vertices.length]);}
      group.add(new T.LineSegments(keep(new T.BufferGeometry().setFromPoints(lines)),keep(new T.LineBasicMaterial({color:0x8adfdd,transparent:true,opacity:.7}))));
      const sphere=keep(new T.SphereGeometry(.07,8,6)),paint=material(0x8adfdd);
      vertices.forEach(v=>{const node=new T.Mesh(sphere,paint);node.position.copy(v);group.add(node);});
    }else{
      for(let i=0;i<3;i++){const ring=new T.Mesh(keep(new T.TorusGeometry(1.5+i*.25,.018,8,80)),material(0xc8f36b,.8));ring.rotation.set(i*Math.PI/3,i*.7,0);group.add(ring);}
      const diamond=new T.Mesh(keep(new T.OctahedronGeometry(.65)),material(0xf3edcf,.85));group.add(diamond);
    }
    return group;
  });
  const loader=new T.TextureLoader();
  function fail(error){if(failed||disposed)return;failed=true;onFailure(error);dispose();}
  const loss=e=>{e.preventDefault();fail(new Error('WebGL context lost'));};canvas.addEventListener('webglcontextlost',loss);
  function removeEntry(entry){
    if(entry.mesh){root.remove(entry.mesh);release(entry.mesh.geometry);release(entry.mesh.material);cards.delete(entry.id);}
    if(entry.texture)release(entry.texture);
  }
  function loadScreen(project){
    if(!project || disposed)return;
    const shot=project.exhibit?.shots?.[0];
    if(!shot || !/^\.\/[a-z0-9-]+\.(png|jpg)$/.test(shot.src))return;
    if(cache.has(project.id)){const entry=cache.get(project.id);cache.delete(project.id);cache.set(project.id,entry);return;}
    const cap=qualityLimits(currentQuality).textures;if(!cap)return;
    while(cache.size>=cap){const [id,entry]=cache.entries().next().value;cache.delete(id);removeEntry(entry);}
    const entry={id:project.id,texture:null,mesh:null};cache.set(project.id,entry);
    loader.load(shot.src,texture=>{
      if(disposed || cache.get(project.id)!==entry){texture.dispose();return;}
      texture.colorSpace=T.SRGBColorSpace;entry.texture=keep(texture);
      const ratio=(texture.image?.width||1280)/(texture.image?.height||720);
      const geometry=keep(new T.PlaneGeometry(5.4,5.4/ratio));
      const paint=keep(new T.MeshBasicMaterial({map:texture,transparent:true,opacity:0,depthWrite:false,toneMapped:false,side:T.DoubleSide}));
      entry.mesh=new T.Mesh(geometry,paint);entry.mesh.userData.projectId=project.id;root.add(entry.mesh);cards.set(project.id,entry.mesh);
    },undefined,error=>{if(cache.get(project.id)===entry)fail(error);});
  }
  function configure(){
    const limits=qualityLimits(currentQuality);starGeometry.setDrawRange(0,limits.particles);
    if(composer){composer.dispose();composer=null;}
    const P=dependencies.postprocessing;
    if(limits.bloom&&P){
      composer=new P.EffectComposer(renderer,{multisampling:0});
      composer.addPass(new P.RenderPass(scene,camera));
      composer.addPass(new P.EffectPass(camera,new P.BloomEffect({intensity:.4,luminanceThreshold:.9,mipmapBlur:true}),new P.ToneMappingEffect()));
    }
    while(cache.size>limits.textures){const [id,entry]=cache.entries().next().value;cache.delete(id);removeEntry(entry);}
  }
  configure();
  function dispose(){
    if(disposed)return;disposed=true;canvas.removeEventListener('webglcontextlost',loss);
    if(composer){composer.dispose();composer=null;}
    for(const entry of cache.values())removeEntry(entry);cache.clear();cards.clear();
    for(const r of resources)r.dispose();resources.clear();renderer.dispose();scene.clear();
  }
  return {
    update(frame,timeSeconds){
      if(disposed)return;
      camera.position.set(...frame.camera.position);camera.lookAt(...frame.camera.target);
      stars.rotation.z=timeSeconds*.009;stars.rotation.y=frame.local*.03;
      spark.visible=frame.chapter==='spark'||frame.chapter==='convergence';
      spark.scale.setScalar(frame.chapter==='spark'?.5+frame.local*2:.35);
      spark.rotation.y=timeSeconds*.13;
      orbit.visible=frame.chapter!=='spark';orbit.rotation.set(frame.local*.15,timeSeconds*.03,frame.chapter==='convergence'?frame.local*.2:.3);
      cores.forEach((group,i)=>{group.visible=frame.chapter==='core'&&frame.focusId===coreIds[i];group.rotation.y=timeSeconds*.09;group.position.set(0,.3,-1);});
      const candidates=frame.focusId?[frame.focusId,(frame.chapter==='core'?coreIds:workIds)[((frame.chapter==='core'?coreIds:workIds).indexOf(frame.focusId)+1)%3]]:frame.chapter==='constellation'?projects.filter(p=>p.exhibit?.shots?.length&&!coreIds.includes(p.id)).slice(0,qualityLimits(currentQuality).textures).map(p=>p.id):[];
      candidates.forEach(id=>loadScreen(projects.find(p=>p.id===id)));
      let index=0;
      for(const [id,mesh] of cards){
        const focused=id===frame.focusId;
        mesh.visible=focused||frame.chapter==='constellation';
        mesh.material.opacity=focused?.85:.28;
        if(focused){mesh.position.set(0,-1.6,1);mesh.rotation.set(-.06,Math.sin(frame.local*Math.PI)*.12,0);mesh.scale.setScalar(.95);}
        else{const a=index++*2.399963;mesh.position.set(Math.cos(a)*7,Math.sin(a)*3.5,-4-index*.8);mesh.rotation.set(.08,Math.cos(a)*-.35,0);mesh.scale.setScalar(.65);}
      }
      if(composer)composer.render();else renderer.render(scene,camera);
    },
    resize(width,height,dpr){if(disposed)return;camera.aspect=Math.max(1,width)/Math.max(1,height);camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(dpr||1,qualityLimits(currentQuality).dpr));renderer.setSize(width,height,false);composer?.setSize(width,height);},
    setQuality(next){if(disposed||next===currentQuality)return;currentQuality=next;if(next==='off'){dispose();return;}configure();},
    dispose
  };
}
