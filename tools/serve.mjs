import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = { '.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.mp4':'video/mp4','.json':'application/json','.xml':'application/xml' };
const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.endsWith('.php')) { res.writeHead(501,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,message:'Email delivery needs PHP hosting. Please email info@p10x.my.'})); return; }
    let file = path.resolve(root, '.'+pathname);
    if (!file.startsWith(root+path.sep) && file !== root) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file=path.join(file,'index.html');
    const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);
  } catch {res.writeHead(404,{'Content-Type':'text/html'});res.end('<h1>Page not found</h1><a href="/">Return to P10X</a>');}
});
const portIndex=process.argv.indexOf('--port');
server.listen(Number(process.env.PORT||(portIndex>=0?process.argv[portIndex+1]:3000)),'0.0.0.0',()=>console.log(`P10X preview on http://localhost:${server.address().port}`));
