import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const portFlag=process.argv.indexOf('--port');
const port=Number(process.env.PORT || (portFlag>=0?process.argv[portFlag+1]:3000));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.ttf':'font/ttf','.woff2':'font/woff2','.mp4':'video/mp4','.json':'application/json'};
createServer(async(req,res)=>{
  // Exercise the client submission flow locally without sending demonstration leads.
  if(new URL(req.url,'http://localhost').pathname==='/driver-test.php'&&req.method==='POST'){
    let body='';for await(const chunk of req){body+=chunk;if(body.length>24000){res.writeHead(413);res.end();return;}}
    try{const data=JSON.parse(body);if(!data.lead||!data.answers||!data.celebrityId)throw new Error('Incomplete test');res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({ok:true,preview:true}));}
    catch{res.writeHead(422,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,message:'Please complete the test.'}));}return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,message:'Email delivery is unavailable here. Please email info@p10x.my.'}));return;}
  try{
    const url=new URL(req.url,'http://localhost');
    if(/^\/tinting\/?$/.test(url.pathname)){
      res.writeHead(301,{'Location':'/automotive-window-tint/'+url.search});res.end();return;
    }
    let relative=decodeURIComponent(url.pathname);
    if(relative.endsWith('/'))relative+='index.html';
    const target=path.resolve(root,'.'+relative);
    if(!target.startsWith(root+path.sep)||target.endsWith('.php')||relative.includes('/.'))throw new Error('Not served');
    const info=await stat(target);if(!info.isFile())throw new Error('Not a file');
    const type=mime[path.extname(target)]||'application/octet-stream';
    const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(range){
      const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),info.size-1):info.size-1;
      if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});res.end();return;}
      const data=await readFile(target);res.writeHead(206,{'Content-Type':type,'Content-Range':`bytes ${start}-${end}/${info.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});res.end(req.method==='HEAD'?undefined:data.subarray(start,end+1));return;
    }
    res.writeHead(200,{'Content-Type':type,'Content-Length':info.size,'Accept-Ranges':'bytes'});res.end(req.method==='HEAD'?undefined:await readFile(target));
  }catch(_){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not available in this preview.');}
}).listen(port,'0.0.0.0');
