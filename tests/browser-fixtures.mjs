// Private loopback-only failure fixtures. Never part of public/ or out/.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../public/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
const injections={
  normal:'',
  perf:"document.addEventListener('DOMContentLoaded',()=>{let started=null,last=null,count=0,total=0,tries=0;function sample(time){if(++tries>600)return;if(document.body.classList.contains('motion-ready')){if(started===null)started=time;if(time-started>=2000){if(last!==null){total+=time-last;count++;}last=time;if(count===120){document.body.dataset.fixtureFrameMs=(total/count).toFixed(2);return;}}}requestAnimationFrame(sample);}requestAnimationFrame(sample);});",
  reduced:"const original=window.matchMedia.bind(window);window.matchMedia=q=>{const m=original(q);if(q.includes('prefers-reduced-motion'))Object.defineProperty(m,'matches',{value:true});return m;};",
  storage:"Object.defineProperty(window,'localStorage',{get(){throw new Error('Fixture storage denied');}});",
  segmenter:'delete Intl.Segmenter;',
  'no-webgl':"const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /^webgl/.test(type)?null:original.call(this,type,...args);};",
  context:"let tries=0;const interval=setInterval(()=>{if(++tries>50){clearInterval(interval);return;}if(document.body.classList.contains('motion-ready')){clearInterval(interval);const gl=document.querySelector('canvas').getContext('webgl2');gl?.getExtension('WEBGL_lose_context')?.loseContext();}},100);",
  texture:'',module:'','no-js':''
};
export function createFixtureServer(){return http.createServer(async(req,res)=>{
  try{
    const parts=decodeURIComponent(new URL(req.url,'http://localhost').pathname).split('/').filter(Boolean);
    const mode=parts.shift()||'normal',filename=parts.shift()||'index.html';
    if(!Object.hasOwn(injections,mode)||parts.length||!/^[a-z0-9-]+\.(?:html|mjs|css|jpg|png|svg|txt)$/.test(filename)||!['GET','HEAD'].includes(req.method))throw Error('Not public');
    if(mode==='module'&&filename==='vendor-gsap.mjs'||mode==='texture'&&filename==='juwon-system-screen.jpg'){res.writeHead(503);res.end('Deliberate fixture failure');return;}
    let body=await readFile(path.join(root,filename));
    if(filename==='motion.mjs'&&mode!=='normal')body=Buffer.from(body.toString().replace('}catch{if(!stopped&&token===generation)','}catch(error){console.error("Fixture motion failure",error);if(!stopped&&token===generation)').replace('onFailure:()=>{disabled=true','onFailure:(error)=>{console.error("Fixture universe failure",error);disabled=true'));
    if(filename==='index.html'){
      let html=body.toString();
      if(mode==='no-js')html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
      else if(injections[mode])html=html.replace('<head>','<head><script>'+injections[mode]+'</script>');
      body=Buffer.from(html);
    }
    res.writeHead(200,{'Content-Type':types[path.extname(filename)],'Cache-Control':'no-store','X-Test-Fixture':mode,'X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(404);res.end('Not found');}
});}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const server=createFixtureServer();server.listen(0,'127.0.0.1',()=>console.log('CINEMATIC_FIXTURES http://127.0.0.1:'+server.address().port+'/'));
}
