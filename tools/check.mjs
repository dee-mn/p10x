import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(process.env.P10X_CHECK_ROOT||'.'),errors=[],checked=new Set();
const routes=JSON.parse(fs.readFileSync('docs/routes.json','utf8'));
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
for(const {route} of routes){
 const file=path.join(root,route.slice(1),'index.html');scan(file);if(!fs.existsSync(file))continue;
 const html=fs.readFileSync(file,'utf8');
 if((html.match(/<h1\b/g)||[]).length!==1)errors.push(`${route}: expected one primary heading`);
 if(!/<title>[^<]+<\/title>/.test(html))errors.push(`${route}: missing page title`);
 if(!html.includes(`rel="canonical" href="https://p10x.flevor.me${route}"`))errors.push(`${route}: incorrect canonical URL`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]),unique=new Set(ids);
 for(const id of new Set(ids.filter((x,i)=>ids.indexOf(x)!==i)))errors.push(`${route}: duplicate ID ${id}`);
 for(const m of html.matchAll(/href="#([^"]+)"/g))if(!unique.has(m[1]))errors.push(`${route}: missing anchor ${m[1]}`);
 for(const m of html.matchAll(/href="(\/[^"?#]*)/g)){
  const target=decodeURIComponent(m[1]);if(target.startsWith('/assets/')||target.startsWith('/styles/')||target.startsWith('/scripts/'))continue;
  if(['/contact.php','/sitemap.xml'].includes(target))continue;
  if(!fs.existsSync(path.join(root,target,'index.html')))errors.push(`${route}: missing destination ${target}`);
 }
 if(/srcset=/.test(html))errors.push(`${route}: image variants are not part of this work`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Checked ${routes.length} pages and ${checked.size} source/asset files; routes, anchors, local dependencies and JavaScript syntax resolve.`);
