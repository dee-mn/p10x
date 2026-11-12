(function(){
 'use strict';
 function init(){
  const root=document.querySelector('.p10x-ppf');if(!root||root.dataset.ppReady)return;root.dataset.ppReady='true';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(hover:hover) and (pointer:fine)');
  // Keep photos and copy visible by default; run each entrance once as it comes into view.
  if(!reduced.matches&&window.IntersectionObserver){
   const entrances=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;entrances.unobserve(entry.target);
    entry.target.animate([{opacity:.15,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:750,easing:'cubic-bezier(.16,1,.3,1)'});
   }),{rootMargin:'0px 0px -4% 0px',threshold:0});
   root.querySelectorAll('[data-pp-reveal]').forEach(el=>entrances.observe(el));
  }
  root.querySelectorAll('.heading-title').forEach(el=>{if(!el.hasAttribute('aria-label'))el.setAttribute('aria-label',el.innerText.replace(/\s+/g,' ').trim());});
  const track=root.querySelector('.pp-track'),slides=Array.from(root.querySelectorAll('.pp-slide'));
  const prev=root.querySelector('.pp-gallery-prev'),next=root.querySelector('.pp-gallery-next'),status=root.querySelector('.pp-gallery-status'),progress=root.querySelector('.pp-gallery-progress span');
  let active=0,drag=null,blockClickUntil=0,raf=0,galleryScroll=null;
  const target=i=>Math.max(0,slides[i].offsetLeft-track.offsetLeft-(track.clientWidth-slides[i].clientWidth)/2);
  function updateGallery(){
   let nearest=0,distance=Infinity;
   slides.forEach((s,i)=>{const d=Math.abs(target(i)-track.scrollLeft);if(d<distance){distance=d;nearest=i;}});
   active=nearest;status.textContent=String(active+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
   prev.disabled=active===0;next.disabled=active===slides.length-1;
   const fraction=galleryScroll?Math.max(0,Math.min(1,track.scrollLeft/Math.max(1,track.scrollWidth-track.clientWidth))):active/(slides.length-1);
   progress.style.width=((1+fraction*(slides.length-1))/slides.length*100)+'%';
  }
  function go(i){
   const left=target(Math.max(0,Math.min(slides.length-1,i)));
   if(galleryScroll){window.scrollTo({top:galleryScroll.start+left/galleryScroll.max*galleryScroll.travel,behavior:'smooth'});}
   else track.scrollTo({left,behavior:reduced.matches?'auto':'smooth'});
  }
  track.setAttribute('tabindex','0');track.setAttribute('role','region');track.setAttribute('aria-label','PPF photo gallery. Use the arrow keys to browse.');
  slides.forEach((s,i)=>{s.setAttribute('role','group');s.setAttribute('aria-label','Photograph '+(i+1)+' of '+slides.length);const a=s.querySelector('a');if(a){a.setAttribute('data-elementor-lightbox-slideshow','p10x-ppf');a.setAttribute('data-elementor-lightbox-title',s.querySelector('.pp-photo-caption').innerText);a.setAttribute('aria-label','Enlarge: '+s.querySelector('.pp-photo-caption').innerText);}});
  prev.addEventListener('click',()=>go(active-1));next.addEventListener('click',()=>go(active+1));
  track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(active+(e.key==='ArrowRight'?1:-1));}});
  track.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;updateGallery();});},{passive:true});
  track.addEventListener('dragstart',e=>e.preventDefault());
  track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,left:track.scrollLeft,moved:false,id:e.pointerId};});
  track.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(!drag.moved&&Math.abs(dx)>7){drag.moved=true;track.classList.add('is-dragging');track.setPointerCapture(e.pointerId);}if(drag.moved){e.preventDefault();track.scrollLeft=drag.left-dx;}});
  function finishDrag(){if(!drag)return;const moved=drag.moved;drag=null;track.classList.remove('is-dragging');if(moved){blockClickUntil=Date.now()+350;if(galleryScroll){galleryScroll.target=track.scrollLeft;window.scrollTo({top:galleryScroll.start+track.scrollLeft/galleryScroll.max*galleryScroll.travel,behavior:'instant'});}updateGallery();go(active);}}
  track.addEventListener('pointerup',finishDrag);track.addEventListener('pointercancel',finishDrag);window.addEventListener('pointerup',finishDrag);
  track.addEventListener('click',e=>{if(Date.now()<blockClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
  updateGallery();
  // A native sticky frame translates page scrolling into a gently eased gallery.
  // Wheel events are never captured, so normal scrolling and anchor navigation remain available.
  const gallery=root.querySelector('.pp-gallery'),galleryBottom=root.querySelector('.pp-gallery-bottom');
  const galleryHint=root.querySelector('.pp-gallery-intro .pp-meta .text-block p');
  const originalHint=galleryHint.textContent;
  const scrollLayout=window.matchMedia('(min-width:1025px) and (min-height:620px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  let runway=null,scrollFrameNode=null,galleryMotion=0,galleryTime=0;
  function easeGallery(time){
   galleryMotion=0;if(!galleryScroll||drag)return;
   const delta=galleryScroll.target-track.scrollLeft;
   const elapsed=galleryTime?Math.min(64,time-galleryTime):16;galleryTime=time;
   track.scrollLeft=Math.abs(delta)<1?galleryScroll.target:track.scrollLeft+delta*(1-Math.exp(-elapsed/160));
   if(Math.abs(galleryScroll.target-track.scrollLeft)>1)galleryMotion=requestAnimationFrame(easeGallery);else track.scrollLeft=galleryScroll.target;
  }
  function followPageScroll(){
   if(!galleryScroll||drag)return;
   const position=Math.max(0,Math.min(1,(window.scrollY-galleryScroll.start)/galleryScroll.travel));
   galleryScroll.target=position*galleryScroll.max;
   if(!galleryMotion){galleryTime=0;galleryMotion=requestAnimationFrame(easeGallery);}
  }
  function sizeScrollGallery(){
   if(!galleryScroll)return;
   galleryScroll.max=Math.max(1,track.scrollWidth-track.clientWidth);
   galleryScroll.travel=Math.max(galleryScroll.max*.9,(slides.length-1)*innerHeight*.8);
   runway.style.height=(scrollFrameNode.offsetHeight+galleryScroll.travel)+'px';
   galleryScroll.start=runway.getBoundingClientRect().top+window.scrollY-110;
   followPageScroll();
  }
  function setScrollGallery(){
   if(scrollLayout.matches&&!galleryScroll){
    runway=document.createElement('div');runway.className='pp-gallery-runway';
    scrollFrameNode=document.createElement('div');scrollFrameNode.className='pp-gallery-scroll-frame';
    track.before(runway);runway.append(scrollFrameNode);scrollFrameNode.append(track,galleryBottom);
    gallery.classList.add('pp-gallery-scroll');galleryScroll={start:0,max:1,travel:1,target:0};
    galleryHint.textContent='Scroll to explore · Drag or use the arrows · Select a photo to enlarge';
    sizeScrollGallery();
   }else if(!scrollLayout.matches&&galleryScroll){
    cancelAnimationFrame(galleryMotion);galleryMotion=0;galleryScroll=null;
    runway.before(track,galleryBottom);runway.remove();runway=null;scrollFrameNode=null;
    gallery.classList.remove('pp-gallery-scroll');galleryHint.textContent=originalHint;updateGallery();
   }
   if(window.ScrollTrigger)ScrollTrigger.refresh();
  }
  window.addEventListener('scroll',followPageScroll,{passive:true});
  scrollLayout.addEventListener('change',setScrollGallery);setScrollGallery();
  function settleGallery(){sizeScrollGallery();if(window.ScrollTrigger)ScrollTrigger.refresh();if(galleryScroll&&location.hash){try{const anchor=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(anchor&&root.contains(anchor))anchor.scrollIntoView({block:'start',behavior:'instant'});}catch(e){}}}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(settleGallery);else settleGallery();
  const steps=Array.from(root.querySelectorAll('.pp-step')),frames=Array.from(root.querySelectorAll('.pp-stage-image')),tabs=Array.from(root.querySelectorAll('.pp-stage-tabs a'));
  let craftIndex=-1,scrollFrame=0;
  function updateCraft(){
   if(innerWidth<=1024)return;const point=innerHeight*.58;let i=0;steps.forEach((s,n)=>{if(s.getBoundingClientRect().top<=point)i=n;});
   if(i===craftIndex)return;craftIndex=i;
   frames.forEach((f,n)=>{f.classList.toggle('is-active',n===i);f.setAttribute('aria-hidden',n===i?'false':'true');});steps.forEach((s,n)=>s.classList.toggle('is-active',n===i));tabs.forEach((t,n)=>{t.classList.toggle('is-active',n===i);if(n===i)t.setAttribute('aria-current','step');else t.removeAttribute('aria-current');});
   root.querySelector('.pp-stage-count .text-block p').textContent='0'+(i+1)+' / 03';root.querySelector('.pp-stage-label .text-block p').textContent=steps[i].querySelector('.pp-step-meta').innerText;
  }
  window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;updateCraft();});},{passive:true});
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{sizeScrollGallery();updateGallery();updateCraft();if(window.ScrollTrigger)ScrollTrigger.refresh();},150);});updateCraft();
  if(window.gsap&&!reduced.matches){
   gsap.from(root.querySelector('.pp-hero-kicker'),{opacity:0,y:16,duration:.7,delay:.15});
   gsap.from(root.querySelector('.pp-hero-title'),{opacity:0,y:24,duration:1,delay:.2,ease:'power3.out'});
   gsap.from(root.querySelector('.pp-hero-aside'),{opacity:0,y:22,duration:.9,delay:.4,ease:'power3.out'});
  }
  // Disable native pointer tilt for touch devices and reduced motion.
  if(!fine.matches||reduced.matches)root.querySelectorAll('.ui-image-tilt').forEach(el=>{if(el.vanillaTilt)el.vanillaTilt.destroy();});
  if(window.ScrollTrigger)ScrollTrigger.refresh();
 }
 if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});
})();
