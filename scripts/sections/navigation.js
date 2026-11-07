(function(){
 'use strict';
 function init(){
  // Desktop category controls open their child links with the keyboard as well as hover.
  document.querySelectorAll('.menu-p10x-main-container a[role="button"]').forEach(control=>{
   control.addEventListener('keydown',event=>{
    if(!['Enter',' ','ArrowDown'].includes(event.key))return;
    const child=control.nextElementSibling?.querySelector('a');
    if(child){event.preventDefault();child.focus();}
   });
  });
  if(document.body.classList.contains('surface-editor-active'))return;
  const source=document.querySelector('.p10x-mobile-content');
  const panel=document.querySelector('#ui-header-mobile .ui-header-menu');
  const trigger=document.querySelector('#ui-nav-mobile');
  if(!source||!panel||!trigger||panel.dataset.p10xReady)return;
  const scroll=panel.querySelector('.ui-header-menu-scroll');
  const nav=panel.querySelector('.ui-header-nav');
  const menu=nav&&nav.querySelector('ul');
  if(!scroll||!menu)return;
  panel.dataset.p10xReady='1';panel.setAttribute('data-lenis-prevent','');panel.id='p10x-mobile-menu';
  panel.classList.add('view-6744');panel.setAttribute('role','dialog');
  panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','P10X navigation');
  panel.setAttribute('aria-hidden','true');panel.inert=true;panel.tabIndex=-1;
  nav.setAttribute('aria-label','Main navigation');
  trigger.setAttribute('role','button');trigger.tabIndex=0;
  trigger.setAttribute('aria-label','Open navigation');trigger.setAttribute('aria-controls',panel.id);trigger.setAttribute('aria-expanded','false');
  const logo=panel.querySelector('.ui-logo-mobile');
  const oldClose=panel.querySelector('.ui-menu-close');
  const close=document.createElement('button');close.type='button';close.className='p10x-menu-close';close.setAttribute('aria-label','Close navigation');
  close.innerHTML='<span>Close</span><span class="p10x-close-mark" aria-hidden="true"></span>';
  if(oldClose)oldClose.remove();
  const top=document.createElement('div');top.className='p10x-menu-top';
  if(logo){top.append(logo);const a=logo.querySelector('a');if(a)a.setAttribute('aria-label','P10X home');}
  top.append(close);scroll.prepend(top);
  const search=panel.querySelector('.ui-header-mobile-search');if(search)search.remove();
  const eyebrow=source.querySelector('.p10x-menu-eyebrow');if(eyebrow)nav.before(eyebrow);
  const productSource=source.querySelector('.p10x-menu-products-source ul');
  const productTitle=source.querySelector('.p10x-menu-products-title');
  if(productSource){
   const item=document.createElement('li');item.className='menu-item menu-item-has-children p10x-menu-products';
   const label=document.createElement('a');label.textContent=productTitle?productTitle.textContent.trim():'Products';label.href='#';item.append(label);
   productSource.className='sub-menu p10x-product-list';
   productSource.removeAttribute('id');
   productSource.querySelectorAll('li').forEach(li=>li.removeAttribute('id'));
   productSource.querySelectorAll('li').forEach(li=>{if(!li.querySelector('ul'))li.classList.remove('menu-item-has-children');});
   item.append(productSource);
   const services=Array.from(menu.children).find(li=>li.querySelector('a')?.textContent.trim().toLowerCase()==='services');
   if(services)services.after(item);else menu.append(item);
  }
  const footer=source.querySelector('.p10x-menu-footer');if(footer)scroll.append(footer);
  panel.querySelectorAll('.ui-menu-toggle,.ui-arrow-toggle,.ui-icon-menu,.clone').forEach(el=>el.remove());
  const primary=Array.from(menu.children);let counter=0;
  function enhance(ul,depth){
   Array.from(ul.children).forEach(li=>{
    const anchor=Array.from(li.children).find(el=>el.tagName==='A');
    const children=Array.from(li.children).find(el=>el.tagName==='UL');
    if(!anchor)return;
    if(depth===0){li.classList.add('p10x-menu-row');li.style.setProperty('--menu-order',primary.indexOf(li));}
    let control=anchor;
    if(children){
     children.id='p10x-menu-group-'+(++counter);children.hidden=true;children.classList.add('p10x-menu-sub');
     control=document.createElement('button');control.type='button';control.className='p10x-menu-disclosure';
     while(anchor.firstChild)control.append(anchor.firstChild);
     anchor.replaceWith(control);control.setAttribute('aria-controls',children.id);control.setAttribute('aria-expanded','false');
     const mark=document.createElement('span');mark.className='p10x-menu-plus';mark.setAttribute('aria-hidden','true');control.append(mark);
     enhance(children,depth+1);
    }else if(!anchor.getAttribute('href')||/^#+$/.test(anchor.getAttribute('href'))){
     control=document.createElement('span');control.className='p10x-menu-placeholder';control.setAttribute('aria-disabled','true');
     while(anchor.firstChild)control.append(anchor.firstChild);anchor.replaceWith(control);
    }
    if(depth===0){const number=document.createElement('span');number.className='p10x-menu-number';number.setAttribute('aria-hidden','true');number.textContent=String(primary.indexOf(li)+1).padStart(2,'0');control.prepend(number);}
   });
  }
  enhance(menu,0);menu.classList.add('p10x-main-list');
  panel.querySelectorAll('.surface-social-icon').forEach(a=>{a.target='_blank';a.rel='noopener noreferrer';});
  document.body.append(panel);
  const oldBackdrop=document.querySelector('#ui-header-mobile .ui-header-menu-backdrop');if(oldBackdrop)oldBackdrop.hidden=true;
  let opened=false,lastFocus=null,savedY=0,scrollStyles=null,inertNodes=[];
  const mq=window.matchMedia('(max-width:1200px)');
  function open(){
   if(opened||!mq.matches)return;
   opened=true;lastFocus=document.activeElement;savedY=window.scrollY;
   const b=document.body;
   scrollStyles={position:b.style.position,top:b.style.top,left:b.style.left,right:b.style.right,width:b.style.width};
   b.style.position='fixed';b.style.top=-savedY+'px';b.style.left='0';b.style.right='0';b.style.width='100%';b.classList.add('p10x-menu-is-open');
   inertNodes=Array.from(b.children).filter(el=>el!==panel&&!['SCRIPT','STYLE','LINK'].includes(el.tagName)&&!el.inert);
   inertNodes.forEach(el=>el.inert=true);
   panel.inert=false;panel.setAttribute('aria-hidden','false');panel.classList.add('active');trigger.classList.add('active');trigger.setAttribute('aria-expanded','true');
   scroll.scrollTop=0;requestAnimationFrame(()=>close.focus({preventScroll:true}));
  }
  function shut(restoreFocus){
   if(!opened)return;
   opened=false;panel.classList.remove('active');trigger.classList.remove('active');trigger.setAttribute('aria-expanded','false');
   inertNodes.forEach(el=>el.inert=false);inertNodes=[];
   const b=document.body;Object.assign(b.style,scrollStyles);b.classList.remove('p10x-menu-is-open');
   const root=document.documentElement,previous=root.style.scrollBehavior;root.style.scrollBehavior='auto';window.scrollTo({top:savedY,behavior:'instant'});root.style.scrollBehavior=previous;
   if(restoreFocus&&lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});
   else if(panel.contains(document.activeElement))document.activeElement.blur();
   panel.setAttribute('aria-hidden','true');panel.inert=true;
  }
  document.addEventListener('click',event=>{
   const target=event.target instanceof Element?event.target:null;if(!target)return;
   if(target.closest('#ui-nav-mobile,.ui-anchor-mobile-menu')){if(!mq.matches)return;event.preventDefault();event.stopImmediatePropagation();opened?shut(true):open();return;}
   if(!panel.contains(target))return;
   if(target.closest('.p10x-menu-close')){event.preventDefault();event.stopImmediatePropagation();shut(true);return;}
   const toggle=target.closest('.p10x-menu-disclosure');
   if(toggle){
    event.preventDefault();event.stopImmediatePropagation();
    const group=document.getElementById(toggle.getAttribute('aria-controls')),expand=toggle.getAttribute('aria-expanded')!=='true';
    const parent=toggle.parentElement.parentElement;
    Array.from(parent.children).forEach(li=>{const sibling=Array.from(li.children).find(el=>el.classList.contains('p10x-menu-disclosure'));if(sibling&&sibling!==toggle){sibling.setAttribute('aria-expanded','false');document.getElementById(sibling.getAttribute('aria-controls')).hidden=true;}});
    toggle.setAttribute('aria-expanded',String(expand));group.hidden=!expand;return;
   }
   if(target.closest('a[href]'))shut(false);
  },true);
  document.addEventListener('keydown',event=>{
   if(event.target===trigger&&(event.key==='Enter'||event.key===' ')){event.preventDefault();opened?shut(true):open();return;}
   if(!opened)return;
   if(event.key==='Escape'){event.preventDefault();shut(true);return;}
   if(event.key==='Tab'){
    const focusable=Array.from(panel.querySelectorAll('a[href],button,[tabindex="0"]')).filter(el=>!el.closest('[hidden]')&&el.getClientRects().length);
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   }
  });
  mq.addEventListener('change',event=>{if(!event.matches)shut(false);});
  window.addEventListener('pagehide',()=>shut(false));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
