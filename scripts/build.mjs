import {cpSync,mkdirSync,readdirSync,lstatSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const source=fileURLToPath(new URL('../public/',import.meta.url));
const target=fileURLToPath(new URL('../out/',import.meta.url));
mkdirSync(target,{recursive:true});
for(const name of readdirSync(source)){
  if(name.startsWith('.')||!lstatSync(path.join(source,name)).isFile())throw new Error('Only public regular assets may be deployed');
  cpSync(path.join(source,name),path.join(target,name));
}
console.log('Static portfolio prepared in out/');
