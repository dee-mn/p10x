(function(){
 'use strict';
 function init(){
  const root=document.querySelector('.p10x-wrap');
  if(!root||root.dataset.wrReady)return;
  root.dataset.wrReady='true';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
  const tabs=Array.from(root.querySelectorAll('.wr-finish-tabs [role="tab"]'));
  const panels=Array.from(root.querySelectorAll('.wr-finish-panel'));
  function select(index,focus){
   tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',i===index?'true':'false');tab.tabIndex=i===index?0:-1;});
   panels.forEach((panel,i)=>{panel.classList.toggle('is-active',i===index);panel.setAttribute('aria-hidden',i===index?'false':'true');panel.inert=i!==index;panel.tabIndex=i===index?0:-1;});
   if(focus)tabs[index].focus();
  }
  panels.forEach((panel,i)=>{panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tabs[i].id);});
  tabs.forEach((tab,i)=>{
   tab.addEventListener('click',()=>select(i,false));
   tab.addEventListener('keydown',event=>{
    let next=i;
    if(event.key==='ArrowRight')next=(i+1)%tabs.length;
    else if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=tabs.length-1;
    else return;
    event.preventDefault();select(next,true);
   });
  });
  root.classList.add('wr-enhanced');select(0,false);
  // Keep Archinic's native scroll-colour headings and Elementor's entrances.
  root.querySelectorAll('.pxl-item--title').forEach(el=>{if(!el.hasAttribute('aria-label'))el.setAttribute('aria-label',el.innerText.replace(/\s+/g,' ').trim());});
  root.querySelectorAll('.wr-look-item').forEach((item,i)=>{
   const link=item.querySelector('.wr-look-photo a');if(!link)return;
   const caption=item.querySelector('.wr-look-caption').innerText.replace(/\s+0\d\s*↗\s*$/,'').trim();
   link.setAttribute('data-elementor-lightbox-slideshow','p10x-wrap-lookbook');
   link.setAttribute('data-elementor-lightbox-title',caption);
   link.setAttribute('aria-label','Enlarge: '+caption);
  });
  if(window.gsap){
   const media=gsap.matchMedia();
   media.add('(prefers-reduced-motion:no-preference)',()=>{
    gsap.from(root.querySelector('.wr-hero-title'),{y:28,opacity:0,duration:1.1,delay:.15,ease:'power3.out'});
    gsap.from(root.querySelector('.wr-hero-kicker'),{y:14,opacity:0,duration:.8,delay:.1});
    gsap.from(root.querySelector('.wr-hero-line'),{y:20,opacity:0,duration:1,delay:.35,ease:'power3.out'});
    gsap.from(root.querySelector('.wr-hero-photo img'),{scale:1.06,duration:1.6,ease:'power2.out'});
   });
   media.add('(min-width:1025px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)',()=>{
    if(!window.ScrollTrigger)return;
    root.querySelectorAll('.wr-look-photo').forEach((photo,i)=>{
     const img=photo.querySelector('img');if(!img)return;
     gsap.fromTo(img,{yPercent:i%2?4:-4,scale:1.1},{yPercent:i%2?-4:4,scale:1.1,ease:'none',scrollTrigger:{trigger:photo,start:'top bottom',end:'bottom top',scrub:1.6}});
    });
   });
  }
  function refresh(){if(window.ScrollTrigger)ScrollTrigger.refresh();}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(refresh);else refresh();
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(refresh,160);});
 }
 if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});
})();
