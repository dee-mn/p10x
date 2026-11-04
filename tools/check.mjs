import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve('dist');
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else files.push(p);}}
walk(root);
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
}
for(const file of files.filter(p=>p.endsWith('.js'))){
  try{new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});}
  catch(error){if(!/Unexpected token 'export'|Cannot use import/.test(error.message))errors.push(`${path.relative(root,file)}: ${error.message}`);}
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Checked ${pages.length} pages, local asset references and JavaScript syntax.`);
