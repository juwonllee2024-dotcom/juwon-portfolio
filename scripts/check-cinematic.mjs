import {gzipSync} from 'node:zlib';
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export function auditModules(assets,bases) {
  let requests=0,initialGzipBytes=0;
  for(const [name,source] of assets){
    if(!name.startsWith('vendor-')){
      if(/[a-z]:[\\/]+Users[\\/]|127\.0\.0\.1:\d+|localhost:\d+|(?:api[_-]?key|access[_-]?token)\s*[:=]\s*['"][^'"]+/i.test(source))throw new Error('Private content in '+name);
    }
    initialGzipBytes+=gzipSync(source).length; // Conservative high-quality first load includes postprocessing.
    const imports=[...source.matchAll(/\b(?:from\s*|import\s*\(\s*|import\s*)['"]([^'"]+)['"]/g)].map(m=>m[1]);
    for(const specifier of imports){
      if(!/^\.\/[a-z0-9-]+\.mjs$/.test(specifier))throw new Error('Non-local module: '+specifier);
      if(!assets.has(specifier.slice(2)))throw new Error('Unpublished module: '+specifier);
      for(const base of bases){const root=new URL(base),url=new URL(specifier,new URL(name,root));if(url.origin!==root.origin||!url.pathname.startsWith(root.pathname))throw new Error('Module escapes site root');}
      requests++;
    }
  }
  return {modules:assets.size,requests,initialGzipBytes};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const directory=new URL('../public/',import.meta.url);
  const assets=new Map(readdirSync(directory).filter(n=>n.endsWith('.mjs')).map(n=>[n,readFileSync(new URL(n,directory),'utf8')]));
  console.log(JSON.stringify(auditModules(assets,['https://portfolio.example/','https://owner.github.io/juwon-portfolio/'])));
}
