import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(process.env.P10X_CHECK_ROOT||'.'),errors=[],checked=new Set();
function scan(file){
  if(checked.has(file))return;checked.add(file);
  if(!fs.existsSync(file)){errors.push(`Missing: ${path.relative(root,file)}`);return;}
  const ext=path.extname(file);if(!['.html','.css','.js'].includes(ext))return;
  const text=fs.readFileSync(file,'utf8');
  if(/p10xx\.flevor\.me|wp-content\/|wp-includes\/|elementorFrontend|window\.jQuery|window\.gsap|ScrollTrigger/.test(text))errors.push(`External framework dependency: ${path.relative(root,file)}`);
  if(ext==='.js'){try{new vm.Script(text,{filename:file});}catch(e){errors.push(e.message);}}
  for(const m of text.matchAll(/(?:src|href|poster|data-src)=["'](\/(?:assets|styles|scripts)\/[^"'?#]+)|url\(["']?(\/(?:assets|styles|scripts)\/[^"')?#\s]+)/g)){
    const relative=decodeURIComponent(m[1]||m[2]);scan(path.join(root,relative));
  }
}
scan(path.join(root,'index.html'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
for(const m of html.matchAll(/href="#([^"]+)"/g))if(!ids.has(m[1]))errors.push(`Missing anchor: ${m[1]}`);
if(/srcset=/.test(html))errors.push('Responsive image variants are deferred to the final image pass.');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Checked ${checked.size} homepage source and asset files; local dependencies and anchors resolve.`);
