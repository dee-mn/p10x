import fs from 'node:fs/promises';
import path from 'node:path';
const routes=JSON.parse(await fs.readFile('docs/routes.json','utf8'));
const header=(await fs.readFile('components/header.html','utf8')).trim();
const footer=(await fs.readFile('components/footer.html','utf8')).trim();
for(const {route} of routes){
 const file=path.join('.',route.slice(1),'index.html');let html=await fs.readFile(file,'utf8');
 html=html.replace(/<header\b[^>]*class="site-header"[\s\S]*?<\/dialog>/,header);
 html=html.replace(/<footer\b[^>]*class="site-footer[^"\n]*"[\s\S]*?<\/footer>/,footer);
 await fs.writeFile(file,html);
}
console.log(`Shared header and footer applied to ${routes.length} pages.`);
