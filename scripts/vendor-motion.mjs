// Rebuild reviewed browser artifacts, using only the isolated pinned tool install.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
const root=fileURLToPath(new URL('../',import.meta.url));
const tools=path.join(root,'.superpowers/sdd/2026-10-04-cinematic-universe/vendor-build');
const {build}=await import(pathToFileURL(path.join(tools,'node_modules/esbuild/lib/main.js')));
const entries={
  three:"export * from 'three';",
  gsap:"export {gsap} from 'gsap'; export {ScrollTrigger} from 'gsap/ScrollTrigger'; export {SplitText} from 'gsap/SplitText';",
  lenis:"export {default} from 'lenis';",
  postprocessing:"export {EffectComposer,RenderPass,EffectPass,BloomEffect,ToneMappingEffect} from 'postprocessing';"
};
const versions={three:'0.186.1',gsap:'3.15.0',lenis:'1.3.26',postprocessing:'6.39.5'};
const libraries=[];
let licenses='Motion libraries used by JUWON. Original copyright and license notices follow.\n\n';
let gzipInitial=0;
for(const [name,contents] of Object.entries(entries)) {
  const packageRoot=path.join(tools,'node_modules',name);
  const metadata=JSON.parse(readFileSync(path.join(packageRoot,'package.json'),'utf8'));
  if(metadata.version!==versions[name]) throw new Error('Unreviewed version: '+name);
  const filename='vendor-'+name+'.mjs';
  await build({stdin:{contents,resolveDir:tools,sourcefile:name+'-entry.mjs'},outfile:path.join(root,'public',filename),bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',legalComments:'inline',plugins:name==='postprocessing'?[{name:'local-three',setup(b){b.onResolve({filter:/^three$/},()=>({path:'./vendor-three.mjs',external:true}));}}]:[]});
  const bytes=readFileSync(path.join(root,'public',filename));
  if(name!=='postprocessing')gzipInitial+=gzipSync(bytes).length;
  libraries.push({name,version:metadata.version,sourceUrl:'https://registry.npmjs.org/'+name+'/'+metadata.version,license:metadata.license,files:[{path:'public/'+filename,sha256:createHash('sha256').update(bytes).digest('hex')}]});
  const licenseName=['LICENSE','LICENSE.txt','license.txt','LICENSE.md'].find(f=>existsSync(path.join(packageRoot,f)));
  const licenseText=licenseName?readFileSync(path.join(packageRoot,licenseName),'utf8'):name==='gsap'?readFileSync(path.join(packageRoot,'gsap-core.js'),'utf8').match(/\/\*![\s\S]*?\*\//)?.[0]:null;
  if(!licenseText)throw new Error('Missing license notice: '+name);
  licenses+=name+' '+metadata.version+' — '+metadata.license+'\n'+licenseText+'\n\n';
}
const rebuild='rtk npm install --prefix .superpowers/sdd/2026-10-04-cinematic-universe/vendor-build --no-save --ignore-scripts --no-audit --no-fund three@0.186.1 gsap@3.15.0 lenis@1.3.26 postprocessing@6.39.5 esbuild@0.28.2; rtk proxy node scripts/vendor-motion.mjs';
writeFileSync(path.join(root,'public/motion-licenses.txt'),licenses);
writeFileSync(path.join(root,'docs/motion-vendors.json'),JSON.stringify({libraries,bundler:'esbuild@0.28.2',rebuild,initialVendorGzipBytes:gzipInitial},null,2)+'\n');
console.log(JSON.stringify({modules:libraries.map(l=>l.name+'@'+l.version),initialVendorGzipBytes:gzipInitial}));
