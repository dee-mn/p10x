/* Product series, individual products and the shared desktop product dialog. */
(() => {
 'use strict';
 const panel=document.querySelector('.ui-hidden-panel-popup'),root=panel?.querySelector('.view-6523');
 if(!panel||!root)return;
 if(panel.dataset.productDialogReady)return;
 panel.dataset.productDialogReady='true';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
 const triggers=[...document.querySelectorAll('.ui-anchor-button')],content=panel.querySelector('.ui-popup--conent'),backdrop=panel.querySelector('.ui-popup--overlay');
 let closeButton=panel.querySelector('.ui-close-button');
 if(closeButton&&closeButton.tagName!=='BUTTON'){
  const button=document.createElement('button');button.className=closeButton.className;button.type='button';button.setAttribute('aria-label','Close products');
  while(closeButton.firstChild)button.append(closeButton.firstChild);closeButton.replaceWith(button);closeButton=button;
 }
 panel.classList.add('product-dialog');panel.classList.remove('active');panel.hidden=true;panel.id='p10x-product-dialog';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Products');panel.setAttribute('aria-hidden','true');panel.inert=true;
 let opened=false,lastFocus=null,overflow='',animations=[],inertNodes=[],preparePreview=()=>{},cancelPreview=()=>{};
 const stop=()=>{animations.forEach(animation=>animation.cancel());animations=[];};
 function animate(element,frames,options){if(!element)return;animations.push(element.animate(frames,options));}
 function setTriggers(value){triggers.forEach(trigger=>trigger.setAttribute('aria-expanded',String(value)));}
 function lockPage(){
  overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  let branch=panel;
  while(branch.parentElement){for(const sibling of branch.parentElement.children){if(sibling!==branch&&!sibling.inert&&!['SCRIPT','STYLE','LINK'].includes(sibling.tagName)){sibling.inert=true;inertNodes.push(sibling);}}branch=branch.parentElement;if(branch===document.body)break;}
 }
 function unlockPage(){inertNodes.forEach(node=>node.inert=false);inertNodes=[];document.body.style.overflow=overflow;}
 function open(trigger){
  if(opened){close();return;}
  opened=true;stop();lastFocus=trigger||document.activeElement;lockPage();
  panel.hidden=false;panel.inert=false;panel.classList.add('active');panel.setAttribute('aria-hidden','false');panel.style.visibility='visible';setTriggers(true);preparePreview();
  if(!reduced.matches){
   animate(content,[{opacity:0,transform:'translate3d(0,-20px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:320,easing:'cubic-bezier(.16,1,.3,1)'});
   animate(backdrop,[{opacity:0},{opacity:1}],{duration:220,easing:'ease-out'});
  }
  closeButton?.focus({preventScroll:true});
 }
 function close({restoreFocus=true}={}){
  if(!opened&&panel.hidden)return;
  opened=false;stop();cancelPreview();
  // Closing is synchronous: image visibility and animation promises cannot keep the panel onscreen.
  panel.hidden=true;panel.inert=true;panel.classList.remove('active');panel.style.visibility='hidden';panel.setAttribute('aria-hidden','true');setTriggers(false);unlockPage();
  if(restoreFocus&&lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
 }
 triggers.forEach(trigger=>{
  trigger.setAttribute('role','button');trigger.tabIndex=0;trigger.setAttribute('aria-label','Product — open menu');trigger.setAttribute('aria-controls',panel.id);trigger.setAttribute('aria-expanded','false');
  trigger.addEventListener('click',event=>{event.preventDefault();open(trigger);});
  trigger.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open(trigger);}});
 });
 panel.addEventListener('click',event=>{if(event.target.closest('.ui-close-button,.ui-close-popup,.ui-popup--overlay')){event.preventDefault();close();}});
 document.addEventListener('keydown',event=>{
  if(!opened)return;
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key==='Tab'){
   const controls=[...panel.querySelectorAll('a[href],button,[tabindex="0"]')].filter(element=>!element.closest('[hidden]')&&element.getClientRects().length&&!element.disabled);
   const first=controls[0],last=controls[controls.length-1];
   if(event.shiftKey&&(document.activeElement===first||!panel.contains(document.activeElement))){event.preventDefault();last?.focus();}
   else if(!event.shiftKey&&(document.activeElement===last||!panel.contains(document.activeElement))){event.preventDefault();first?.focus();}
  }
 });
 addEventListener('pagehide',()=>close({restoreFocus:false}));
 matchMedia('(max-width:1200px)').addEventListener('change',event=>{if(event.matches)close();});

 const menu=root.querySelector('.block-7d82470'),photo=root.querySelector('.block-076c59e'),list=menu?.querySelector('.ui-menu-primary');
 if(!menu||!photo||!list)return;
 menu.classList.add('ui-products-ready');list.setAttribute('aria-label','Product series');
 const eyebrow=document.createElement('p');eyebrow.className='product-series-label';eyebrow.textContent='Product series';menu.prepend(eyebrow);
 const series=[...list.children].filter(node=>node.tagName==='LI'),allLinks=[...list.querySelectorAll('li>a')];
 const fallback='/assets/images/P10X-Aura-product-menu-placeholder.jpg';
 const stage=document.createElement('div');stage.className='p10x-product-stage';stage.setAttribute('aria-live','polite');stage.innerHTML='<div class="p10x-product-layer"><img alt=""></div><div class="p10x-product-layer" style="visibility:hidden"><img alt=""></div><div class="p10x-product-caption"><span></span><span class="p10x-product-number"></span></div>';photo.prepend(stage);
 const layers=[...stage.querySelectorAll('.p10x-product-layer')],caption=stage.querySelector('.p10x-product-caption span'),number=stage.querySelector('.p10x-product-number');
 let layerIndex=0,activeLink=null,previewVersion=0,previewAnimations=[],groupAnimation=null,selectedSeries=null;
 layers.forEach(layer=>layer.setAttribute('aria-hidden','true'));
 function show(link,instant=false){
  if(!opened||!link||link===activeLink)return;activeLink=link;const current=++previewVersion;
  previewAnimations.forEach(animation=>animation.cancel());previewAnimations=[];
  allLinks.forEach(anchor=>anchor.classList.toggle('p10x-preview-active',anchor===link));
  const item=link.closest('li'),parent=series.find(series=>series===item||series.contains(item)),seriesIndex=series.indexOf(parent);
  const seriesLink=parent?.querySelector(':scope>a'),name=seriesLink?.querySelector('.ui-text-menu')?.textContent.trim()||seriesLink?.textContent.trim()||'';
  const products=[...(parent?.querySelector(':scope>.sub-menu')?.children||[])],productIndex=products.indexOf(item);
  const label=link.querySelector('.ui-text-menu')?.textContent.trim()||link.textContent.trim();
  const description=productIndex>=0?`${name} / ${label} ${String(productIndex+1).padStart(2,'0')}`:label;
  caption.textContent=description;number.textContent=productIndex>=0?`${String(seriesIndex+1).padStart(2,'0')} / ${String(productIndex+1).padStart(2,'0')}`:String(seriesIndex+1).padStart(2,'0');
  const incoming=layers[1-layerIndex],outgoing=layers[layerIndex],image=incoming.querySelector('img'),src=link.dataset.previewImage||fallback;
  image.alt=description+' — product preview';
  if(image.getAttribute('src')!==src)image.src=src;
  function reveal(){
   if(!opened||current!==previewVersion)return;
   outgoing.style.visibility='visible';outgoing.style.zIndex='0';incoming.style.visibility='visible';incoming.style.zIndex='1';outgoing.setAttribute('aria-hidden','true');incoming.setAttribute('aria-hidden','false');layerIndex=1-layerIndex;
   if(instant||reduced.matches){outgoing.style.visibility='hidden';return;}
   const fade=incoming.animate([{opacity:0},{opacity:1}],{duration:260,easing:'ease-out'});
   const movement=image.animate([{transform:'translate3d(12px,0,0) scale(1.025)'},{transform:'translate3d(0,0,0) scale(1)'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
   previewAnimations=[fade,movement];fade.finished.then(()=>{if(current===previewVersion)outgoing.style.visibility='hidden';}).catch(()=>{});
  }
  if(image.complete&&image.naturalWidth)reveal();else image.decode().then(reveal).catch(()=>{if(opened&&current===previewVersion){image.src=fallback;image.decode().then(reveal).catch(()=>{});}});
 }
 function chooseSeries(item,focusProduct=false){
  if(!opened)return;
  const group=item.querySelector(':scope>.sub-menu'),link=item.querySelector(':scope>a');
  if(!group)return;
  const changed=selectedSeries!==item;selectedSeries=item;if(changed)groupAnimation?.cancel();
  series.forEach(other=>{const children=other.querySelector(':scope>.sub-menu'),anchor=other.querySelector(':scope>a'),selected=other===item;other.classList.toggle('hoverd',!selected);anchor?.classList.toggle('active',selected);anchor?.setAttribute('aria-expanded',String(selected));if(children){children.hidden=!selected;children.classList.toggle('active',selected);children.style.display=selected?'block':'none';}});
  if(changed&&!reduced.matches)groupAnimation=group.animate([{opacity:0,transform:'translate3d(0,8px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:180,easing:'ease-out'});
  if(focusProduct)group.querySelector('a')?.focus();
  if(changed)show(link);
 }
 series.forEach((item,index)=>{
  const link=item.querySelector(':scope>a'),group=item.querySelector(':scope>.sub-menu');if(!link||!group)return;
  group.id='p10x-series-products-'+(index+1);group.hidden=true;group.setAttribute('aria-label',(link.querySelector('.ui-text-menu')?.textContent.trim()||link.textContent.trim())+' products');link.setAttribute('role','button');link.setAttribute('aria-controls',group.id);link.setAttribute('aria-expanded','false');
  [...group.querySelectorAll('li>a')].forEach((product,i)=>product.setAttribute('aria-label',`${link.querySelector('.ui-text-menu')?.textContent.trim()||link.textContent.trim()}, Product ${i+1}`));
  item.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&fine.matches)chooseSeries(item);});
 });
 menu.addEventListener('pointerover',event=>{if(event.pointerType==='touch')return;const link=event.target.closest('li>a');if(link&&menu.contains(link)){const item=series.find(item=>item.contains(link));if(item)chooseSeries(item);show(link);}});
 menu.addEventListener('focusin',event=>{const link=event.target.closest('li>a');if(link){const item=series.find(item=>item.contains(link));if(item)chooseSeries(item);show(link);}});
 menu.addEventListener('click',event=>{const link=event.target.closest('li>a');if(!link)return;if(!link.getAttribute('href')||/^#+$/.test(link.getAttribute('href')))event.preventDefault();const item=series.find(item=>item.contains(link));if(item)chooseSeries(item);show(link);});
 menu.addEventListener('keydown',event=>{
  const link=event.target.closest('li>a');if(!link)return;const item=series.find(item=>item.contains(link)),index=series.indexOf(item);if(index<0)return;
  const top=link===item.querySelector(':scope>a');
  if(top&&['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?series.length-1:(index+(event.key==='ArrowDown'?1:-1)+series.length)%series.length;series[next].querySelector(':scope>a')?.focus();}
  else if(top&&event.key==='ArrowRight'){event.preventDefault();chooseSeries(item,true);}
  else if(event.key==='ArrowLeft'){event.preventDefault();item.querySelector(':scope>a')?.focus();}
  else if(top&&(event.key===' '||event.key==='Enter')){event.preventDefault();chooseSeries(item,true);}
 });
 preparePreview=()=>{
  layers.forEach(layer=>{const image=layer.querySelector('img');if(!image.getAttribute('src'))image.src=fallback;});
  show(series[0]?.querySelector(':scope>a'),true);
 };
 cancelPreview=()=>{
  ++previewVersion;activeLink=null;selectedSeries=null;
  previewAnimations.forEach(animation=>animation.cancel());previewAnimations=[];groupAnimation?.cancel();groupAnimation=null;
  layers.forEach(layer=>{layer.style.visibility='hidden';layer.setAttribute('aria-hidden','true');});
  allLinks.forEach(link=>link.classList.remove('p10x-preview-active','active'));
  series.forEach(item=>{item.classList.remove('hoverd');item.querySelector(':scope>a')?.setAttribute('aria-expanded','false');const group=item.querySelector(':scope>.sub-menu');if(group){group.hidden=true;group.classList.remove('active');group.style.display='none';}});
 };
})();
