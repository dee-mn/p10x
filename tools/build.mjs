import './sync-layout.mjs';
import {mkdir,cp,rm,readFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const name of ['index.html','contact.php','styles','scripts','assets','robots.txt','sitemap.xml'])await cp(name,`dist/${name}`,{recursive:true});
const pages=JSON.parse(await readFile('docs/routes.json','utf8'));
for(const {route} of pages){if(route==='/')continue;await cp(route.slice(1),`dist/${route.slice(1)}`,{recursive:true});}
console.log(`Exported ${pages.length} pages and local assets to dist/.`);
