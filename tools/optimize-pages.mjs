/* Publish lightweight styles and stable media boxes without changing authored visuals. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';
const routes=JSON.parse(await fs.readFile('docs/routes.json','utf8'));
const dimensions=JSON.parse(await fs.readFile('docs/image-dimensions.json','utf8'));
const manifestPath='docs/style-manifest.json';
let manifest={};try{manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
await fs.mkdir('styles/generated',{recursive:true});
const sourceCache=new Map(),stats=[];
function attr(tag,name){return tag.match(new RegExp('(?:^|\\s)'+name+'=["\\\']([^"\\\']*)'))?.[1];}
for(const {route} of routes){
 const file=route==='/'?'index.html':route.slice(1)+'index.html';let html=await fs.readFile(file,'utf8');
 const links=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)];
 const extra=links.map(m=>attr(m[0],'href')).filter(h=>!h.startsWith('/styles/generated/'));
 const sources=links.some(m=>m[0].includes('/styles/generated/'))?[...(manifest[route]||[]),...extra.filter(h=>!(manifest[route]||[]).includes(h))]:extra;
 if(!sources.length)throw Error('No stylesheet sources for '+route);manifest[route]=sources;
 const classes=new Set([...html.matchAll(/\bclass="([^"]*)"/g)].flatMap(m=>m[1].split(/\s+/)));
 const chunks=['','',''];let chunk=0,original='',originalGzipSum=0;let removed=0;
 for(const src of sources){
  if(!src.startsWith('/styles/'))throw Error('Unexpected stylesheet '+src);
  if(!sourceCache.has(src))sourceCache.set(src,await fs.readFile('.'+src,'utf8'));
  const shared=src==='/styles/reference/b163d126be3f87ed.css';if(shared)chunk=1;
  const text=sourceCache.get(src);original+=text;originalGzipSum+=zlib.gzipSync(text).length;
  const ast=postcss.parse(text,{from:src});
  ast.walkAtRules('charset',n=>n.remove());
  if(!shared)ast.walkRules(rule=>{
   const selectors=selectorParser().astSync(rule.selector);
   selectors.each(selector=>{
    let impossible=false;
    selector.walkClasses(n=>{
     // Only positive, top-level page/root classes are invariant; leave pseudo states untouched.
     if(n.parent?.parent?.type!=='root')return;
     if(/^(view-\d+|page-id-\d+|p10x-(about|ppf|tint|detail|window|wrap|faq))$/.test(n.value)&&!classes.has(n.value))impossible=true;
    });
    if(impossible){selector.remove();removed++;}
   });
   if(selectors.nodes.length)rule.selector=selectors.toString();else rule.remove();
  });
  ast.walkDecls(decl=>{
   const value=valueParser(decl.value);
   value.walk(node=>{
    if(node.type!=='function'||node.value.toLowerCase()!=='url')return;
    const arg=node.nodes.find(n=>n.type!=='space');if(!arg)return false;
    const url=arg.value;
    if(!/^(data:|https?:|\/|#|%23)/i.test(url))arg.value=path.posix.resolve(path.posix.dirname(src),url);
    return false;
   });decl.value=value.toString();
  });
  ast.walkAtRules(n=>{if(n.nodes&&!n.nodes.length)n.remove();});chunks[chunk]+=ast.toString()+'\n';if(shared)chunk=2;
 }
 // Compact whitespace through the syntax tree, preserving values and legacy syntax exactly.
 const codes=chunks.filter(Boolean).map(css=>{const compact=postcss.parse(css);
 compact.walk(n=>{
  if(n.type==='comment'&&!n.text.startsWith('!')&&!/copyright|licen[cs]e|@preserve/i.test(n.text)){n.remove();return;}
  n.raws.before='';
  if(n.type==='decl'){n.raws.between=':';if(n.important)n.raws.important='!important';}
  if(n.nodes){n.raws.after='';n.raws.between='';n.raws.semicolon=false;}
  if(n.type==='atrule'&&n.params)n.raws.afterName=' ';
 });
 compact.raws.after='';return compact.toString();});
 const bundles=[];
 for(const code of codes){
  const hash=crypto.createHash('sha256').update(code).digest('hex').slice(0,12);
  const bundle='/styles/generated/site-'+hash+'.css';await fs.writeFile('.'+bundle,code);bundles.push(bundle);
 }
 let first=true;html=html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,()=>{if(!first)return '';first=false;return bundles.map(bundle=>'<link rel="stylesheet" href="'+bundle+'">').join('');});
 html=html.replace(/<img\b[^>]*>/g,tag=>{
  const size=dimensions[attr(tag,'src')];if(!size)return tag;
  let attrs='';if(!attr(tag,'width'))attrs+=' width="'+size[0]+'"';if(!attr(tag,'height'))attrs+=' height="'+size[1]+'"';
  return attrs?tag.replace(/\/?>(?=$)/,m=>attrs+m):tag;
 });
 if(!html.includes('as="font"'))html=html.replace('</head>','<link rel="preload" href="/assets/fonts/inter-normal-latin.woff2" as="font" type="font/woff2" crossorigin></head>');
 if(route==='/')for(const weight of [400,500])if(!html.includes('rel="preload" href="/assets/fonts/inter-'+weight+'.ttf"'))html=html.replace('</head>','<link rel="preload" href="/assets/fonts/inter-'+weight+'.ttf" as="font" type="font/ttf" crossorigin></head>');
 await fs.writeFile(file,html);
 stats.push({route,stylesheetsBefore:sources.length,stylesheetsAfter:bundles.length,originalBytes:Buffer.byteLength(original),bundleBytes:codes.reduce((n,s)=>n+Buffer.byteLength(s),0),originalGzip:originalGzipSum,bundleGzip:codes.reduce((n,s)=>n+zlib.gzipSync(s).length,0),removedOtherPageSelectors:removed,bundles});
}
const used=new Set(stats.flatMap(s=>s.bundles.map(b=>path.posix.basename(b))));
for(const name of await fs.readdir('styles/generated'))if(name.endsWith('.css')&&!used.has(name))await fs.unlink('styles/generated/'+name);
await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
await fs.mkdir('qa',{recursive:true});await fs.writeFile('qa/style-optimization.json',JSON.stringify(stats,null,2)+'\n');
console.log('Optimized styles and image dimensions for '+stats.length+' pages. Homepage:',JSON.stringify(stats[0]));
