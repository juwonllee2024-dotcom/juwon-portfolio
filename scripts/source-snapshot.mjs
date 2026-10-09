// Local preparation only. Never invoked by the public build and never uploads.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const skipped = /^(?:node_modules(?:\..*)?|dist|out|data|outputs|artifacts|results|research|release(?:-test)?|test-results|tmp|__pycache__|vendor\.bak-.*)$/;
const extensions = /\.(?:js|jsx|mjs|cjs|ts|mts|cts|tsx|css|html|json|md|py|toml|yml|yaml|ps1|cmd|sh|txt|sql|srt|svg|png|jpg|webp|woff2?)$/i;
const privateText = /(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-(?:proj-)?[A-Za-z0-9_-]{25,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|C:[\\/]+Users[\\/]+juwon|\/Users\/juwon|[A-Za-z0-9._%+-]+@(?:gmail|outlook|hotmail|yahoo|icloud)\.com)/i;
const binary = /\.(?:png|jpg|webp|woff2?)$/i;
function rejectLinks(root,relative) {
  let cursor=root;
  for(const part of relative.split(/[\\/]/)) {
    cursor=path.join(cursor,part);
    if(fs.lstatSync(cursor).isSymbolicLink())throw Error('symlink: '+relative);
  }
}

export function planSnapshot(source, selections, {reviewedBinary={}}={}) {
  const root=fs.realpathSync(source),files=[];
  function visit(relative) {
    rejectLinks(root,relative);
    const file=path.join(root,relative),stat=fs.lstatSync(file);
    if (stat.isSymbolicLink()) throw Error('symlink: '+relative);
    const actual=path.relative(root,fs.realpathSync(file));
    if(actual.startsWith('..') || path.isAbsolute(actual)) throw Error('symlink or escaped source: '+relative);
    const name=path.basename(file);
    if (name.startsWith('.') || skipped.test(name) || name==='tsconfig.tsbuildinfo') return;
    if (stat.isDirectory()) {
      for(const child of fs.readdirSync(file).sort()) visit(path.join(relative,child));
      return;
    }
    const reviewed=Object.hasOwn(reviewedBinary,relative.replace(/\\/g,'/'));
    if(binary.test(name) && !reviewed)throw Error('review required: '+relative);
    if(!stat.isFile() || (!extensions.test(name) && !reviewed) || stat.size>4*1024*1024) throw Error('review required: '+relative);
    const bytes=fs.readFileSync(file),isBinary=binary.test(name)||reviewed;
    if(reviewed && digest(bytes)!==reviewedBinary[relative.replace(/\\/g,'/')])throw Error('review required: '+relative);
    if(!isBinary && (bytes.includes(0) || privateText.test(bytes.toString('utf8')))) throw Error('review required: '+relative);
    files.push({path:relative.replace(/\\/g,'/'),bytes:stat.size,sha256:digest(bytes),binary:isBinary});
  }
  for(const selection of selections) {
    if(typeof selection!=='string'||path.isAbsolute(selection)||selection.split(/[\\/]/).some(p=>!p||p==='..'||p==='.'))throw Error('invalid selection');
    visit(selection);
  }
  files.sort((a,b)=>a.path.localeCompare(b.path,'en'));
  if(!files.length || new Set(files.map(f=>f.path.toLowerCase())).size!==files.length)throw Error('empty or colliding snapshot');
  return {root,files};
}

export function copySnapshot(plan,destination) {
  const target=path.resolve(destination);
  if(fs.existsSync(target))throw Error('destination exists');
  for(const file of plan.files) {
    const original=path.resolve(plan.root,file.path);
    const relative=path.relative(plan.root,original);
    if(relative.startsWith('..')||path.isAbsolute(relative)||fs.lstatSync(original).isSymbolicLink())throw Error('invalid source path');
    rejectLinks(plan.root,relative);
    const actual=path.relative(plan.root,fs.realpathSync(original));
    if(actual.startsWith('..')||path.isAbsolute(actual))throw Error('invalid source path');
    if(digest(fs.readFileSync(original))!==file.sha256)throw Error('source changed: '+file.path);
  }
  fs.mkdirSync(target,{recursive:true});
  for(const file of plan.files) {
    const copied=path.join(target,file.path);
    fs.mkdirSync(path.dirname(copied),{recursive:true});
    fs.copyFileSync(path.join(plan.root,file.path),copied,fs.constants.COPYFILE_EXCL);
    if(digest(fs.readFileSync(copied))!==file.sha256)throw Error('copied bytes differ: '+file.path);
  }
}
