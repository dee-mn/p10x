import {mkdir,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const name of ['index.html','contact.php','styles','scripts','assets'])await cp(name,`dist/${name}`,{recursive:true});
console.log('Exported homepage and local assets to dist/.');
