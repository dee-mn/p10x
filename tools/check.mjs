import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(process.env.P10X_CHECK_ROOT || '.');
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else files.push(p);}}
const routes=JSON.parse(fs.readFileSync('docs/migrated-pages.json','utf8'));
for(const {route} of routes)files.push(path.join(root,route.slice(1),'index.html'));
for(const folder of ['styles','scripts'])walk(path.join(root,folder));
const errors=[];
const pages=files.filter(p=>p.endsWith('.html'));
for(const file of pages){
  const text=fs.readFileSync(file,'utf8');
  if(!text.includes('<title>'))errors.push(`${file}: missing title`);
  if(/<form[^>]*action="[^\"]*(wp-json|admin-ajax)/.test(text))errors.push(`${file}: backend form dependency`);
  for(const match of text.matchAll(/(?:src|href)="(\/(?:assets|styles|scripts)\/[^"?#]+)[^"]*"/g)){
    const target=path.join(root,decodeURIComponent(match[1]));
    if(!fs.existsSync(target))errors.push(`${path.relative(root,file)}: missing ${match[1]}`);
  }
  for(const match of text.matchAll(/<a[^>]*href="(\/[^"?#]*)/g)){
    const route=match[1];
    if(route.startsWith('/wp-content/')||['/contact.php','/sitemap.xml'].includes(route))continue;
    if(!fs.existsSync(path.join(root,route,'index.html')))errors.push(`${file}: missing route ${route}`);
  }
}
for(const file of ['contact.php','robots.txt','sitemap.xml'])if(!fs.existsSync(path.join(root,file)))errors.push(`Missing deployment file ${file}`);
for(const file of files.filter(p=>p.endsWith('.js'))){
  try{new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});}
  catch(error){if(!/Unexpected token 'export'|Cannot use import/.test(error.message))errors.push(`${path.relative(root,file)}: ${error.message}`);}
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Checked ${pages.length} pages, internal links, local assets and JavaScript syntax in ${root}.`);
