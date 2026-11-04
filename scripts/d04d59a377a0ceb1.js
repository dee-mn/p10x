(function(){
 function init(){
  const root=document.querySelector('.elementor-20');if(!root||root.dataset.mobileRepairReady)return;root.dataset.mobileRepairReady='true';
  const mq=matchMedia('(max-width:1024px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const pillar=root.querySelector('.elementor-element-559aab1b'),strip=root.querySelector('#home-fivepillar .pxl-inner-content');
  const cards=strip?Array.from(strip.querySelectorAll('.pxl--item-circular')):[],tabs=Array.from(root.querySelectorAll('.p10x-pillar-nav button'));
  const disabled=new Set();
  function configure(){
   if(window.ScrollTrigger&&pillar){
    if(mq.matches){ScrollTrigger.getAll().forEach(st=>{if(st.trigger instanceof Element&&pillar.contains(st.trigger)&&!st.trigger.closest('.pxl-heading,.p10x-pillar-heading')){if(st.enabled){st.disable(true);disabled.add(st);}}});}
    else{disabled.forEach(st=>{if(ScrollTrigger.getAll().includes(st))st.enable();});disabled.clear();}
    ScrollTrigger.refresh();
   }
   const hint=root.querySelector('#p10x-expert-lab .x-hint span');if(hint)hint.textContent=mq.matches?'Tap a perspective to explore':'Scroll to explore · or choose a perspective';
  }
  if(strip){
   strip.setAttribute('aria-label','P10X divisions');strip.setAttribute('role','region');strip.tabIndex=0;
   const hint=document.createElement('p');hint.className='p10x-pillar-touchhint';hint.textContent='Swipe to explore our five divisions';strip.closest('#home-fivepillar').append(hint);
   tabs.forEach((b,i)=>b.addEventListener('click',()=>{if(mq.matches&&cards[i])strip.scrollTo({left:cards[i].offsetLeft-cards[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'});}));
   strip.addEventListener('keydown',e=>{if(!mq.matches||e.target!==strip||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();let current=0;cards.forEach((card,i)=>{if(Math.abs(card.offsetLeft-cards[0].offsetLeft-strip.scrollLeft)<Math.abs(cards[current].offsetLeft-cards[0].offsetLeft-strip.scrollLeft))current=i;});const next=e.key==='Home'?0:e.key==='End'?cards.length-1:Math.max(0,Math.min(cards.length-1,current+(e.key==='ArrowRight'?1:-1)));tabs[next]?.click();});
  }
  const video=root.querySelector('.pxl-video-sticky1 video'),toggle=root.querySelector('.pxl-video-toggle');
  if(video&&toggle){const sync=()=>toggle.setAttribute('aria-label',video.paused?'Play video':'Pause video');video.addEventListener('play',sync);video.addEventListener('pause',sync);sync();}
  mq.addEventListener('change',configure);configure();setTimeout(configure,350);
  if(document.fonts)document.fonts.ready.then(configure);
 }
 if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});
})();
(function(){
 function initFilm(){
  const section=document.querySelector('.elementor-20 .pxl-video-sticky1');
  if(!section||section.dataset.mobileFilmReady)return;
  const inner=section.querySelector('.pxl-video-inner'),frame=section.querySelector('.pxl-item--bg'),video=section.querySelector('video'),toggle=section.querySelector('.pxl-video-toggle');
  if(!inner||!frame||!video||!toggle)return;
  section.dataset.mobileFilmReady='true';
  const mobile=matchMedia('(max-width:1280px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let running=false,raf=0,progress=0,target=0,manualPause=false,pending=false,lastVisible=false;
  const clamp=v=>Math.max(0,Math.min(1,v));
  function sync(){
   toggle.setAttribute('aria-label',video.paused?'Play video':'Pause video');
   toggle.setAttribute('aria-pressed',String(!video.paused));
   if(!mobile.matches)return;
   const icon=toggle.querySelector('i');
   if(icon){icon.classList.toggle('fa-pause',!video.paused);icon.classList.toggle('caseicon-play1',video.paused);}
  }
  function play(){
   if(pending)return;pending=true;
   const attempt=video.play();
   if(attempt&&attempt.then)attempt.then(()=>{pending=false;if(mobile.matches&&!lastVisible)video.pause();}).catch(()=>{pending=false;manualPause=true;sync();});
   else pending=false;
  }
  function measure(){
   if(!running)return;
   const r=section.getBoundingClientRect(),h=inner.clientHeight;
   target=clamp(-r.top/Math.max(1,r.height-h));
   lastVisible=r.top<h&&r.bottom>0;
   if(!lastVisible){if(!video.paused)video.pause();}
   else if(target>.035&&!manualPause&&video.paused)play();
   if(!raf)raf=requestAnimationFrame(draw);
  }
  function draw(){
   raf=0;if(!running)return;
   progress+= (target-progress)*.13;
   if(Math.abs(target-progress)<.0007)progress=target;
   const p=clamp(progress/.76),e=p*p*(3-2*p),w=document.documentElement.clientWidth,h=inner.clientHeight,start=Math.min(w*.58,260);
   section.style.setProperty('--p10x-film-width',(start+(w-start)*e).toFixed(2)+'px');
   section.style.setProperty('--p10x-film-height',(start*.625+(h-start*.625)*e).toFixed(2)+'px');
   section.style.setProperty('--p10x-film-radius',(10*(1-e)).toFixed(2)+'px');
   section.style.setProperty('--p10x-film-copy',String(1-clamp(progress/.3)));
   if(progress!==target)raf=requestAnimationFrame(draw);
  }
  function configure(){
   const wasRunning=running;
   running=mobile.matches&&!reduced.matches;
   section.classList.toggle('p10x-film-scroll',running);
   cancelAnimationFrame(raf);raf=0;progress=0;target=0;
   ['width','height','radius','copy'].forEach(k=>section.style.removeProperty('--p10x-film-'+k));
   if(mobile.matches){video.muted=true;video.playsInline=true;video.pause();lastVisible=section.getBoundingClientRect().top<innerHeight&&section.getBoundingClientRect().bottom>0;}
   else if(wasRunning&&!manualPause)video.play()?.catch(()=>{});
   sync();measure();
   if(window.ScrollTrigger)requestAnimationFrame(()=>ScrollTrigger.refresh());
  }
  toggle.addEventListener('click',event=>{
   if(!mobile.matches)return;
   event.preventDefault();event.stopImmediatePropagation();
   lastVisible=true;manualPause=!video.paused;
   if(video.paused)play();else video.pause();sync();
  },true);
  ['loadeddata','canplay','playing'].forEach(name=>video.addEventListener(name,()=>frame.classList.add('video-loaded')));
  ['play','pause','ended'].forEach(name=>video.addEventListener(name,sync));
  if(video.readyState>=2)frame.classList.add('video-loaded');
  window.addEventListener('scroll',measure,{passive:true});
  window.addEventListener('resize',measure,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!mobile.matches)return;if(document.hidden)video.pause();else measure();});
  mobile.addEventListener('change',configure);reduced.addEventListener('change',configure);configure();
 }
 if(document.readyState==='complete')initFilm();else window.addEventListener('load',initFilm,{once:true});
})();
(function(){function mount(){const root=document.querySelector('#p10x-expert-lab');if(!root||root.dataset.ready)return;root.dataset.ready='true';const tabs=[...root.querySelectorAll('[role=tab]')],cards=[...root.querySelectorAll('.x-card')],scene=root.querySelector('.x-scene'),deck=root.querySelector('.x-deck'),copy=root.querySelector('.x-copy'),title=root.querySelector('h3'),desc=root.querySelector('.x-desc'),kicker=root.querySelector('.x-kicker'),test=root.querySelector('.x-test'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),titles=["Workmanship","Team","Driver Personality Test"],descs=["Careful preparation. Precise application. A considered finish. Our standards are built into every stage of the work.","The people behind the finish. Technical skill, shared experience and honest advice bring our standards to life.","Every driver has different priorities. Discover your preferences and start a more personal car-care conversation."],labels=["01 / THE CRAFT","02 / THE PEOPLE","03 / YOUR DRIVE"];let current=0,animation;let selectCard=i=>choose(i);function choose(i){if(i===current)return;current=i;tabs.forEach((b,n)=>{b.setAttribute('aria-selected',String(i===n));b.tabIndex=i===n?0:-1;});cards.forEach((c,n)=>{c.dataset.place=n===i?'front':n===(i+1)%3?'right':'left';c.setAttribute('aria-hidden',String(n!==i));const a=c.querySelector('a');if(a)a.tabIndex=n===i?0:-1;});title.textContent=titles[i];if(i===2){const a=document.createElement('a');a.href='https://www.p10x.my/blank-9';a.target='_blank';a.rel='noopener noreferrer';a.textContent=titles[i];title.replaceChildren(a);}desc.textContent=descs[i];kicker.textContent=labels[i];test.hidden=i!==2;copy.setAttribute('aria-labelledby','x-tab-'+i);if(!reduced.matches){animation?.cancel();animation=copy.animate([{opacity:.3,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});}}tabs.forEach((b,i)=>{b.addEventListener('click',()=>selectCard(i));b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%3;else if(e.key==='ArrowLeft')n=(i+2)%3;else if(e.key==='Home')n=0;else if(e.key==='End')n=2;else return;e.preventDefault();selectCard(n);tabs[n].focus({preventScroll:true});});});scene.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const r=scene.getBoundingClientRect();deck.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*8+'deg');deck.style.setProperty('--rx',-((e.clientY-r.top)/r.height-.5)*6+'deg');},{passive:true});scene.addEventListener('pointerleave',()=>{deck.style.setProperty('--rx','0deg');deck.style.setProperty('--ry','0deg');});
const inner=root.querySelector('.x-inner');let pinned=false,span=0,lastBucket=-1,queued=false,measureQueued=false;
function bounds(){const r=root.getBoundingClientRect();return {start:window.scrollY+r.top-parseFloat(root.style.getPropertyValue('--x-sticky-top')||0),height:r.height};}
function updateFromScroll(){
 queued=false;
 if(window.innerWidth<=1024)return;const b=bounds(),vh=window.innerHeight;
 const progress=pinned?(window.scrollY-b.start)/span:(vh*.8-root.getBoundingClientRect().top)/(b.height+vh*.35);
 const bucket=Math.max(0,Math.min(2,Math.floor(progress*3)));
 if(bucket!==lastBucket){lastBucket=bucket;choose(bucket);}
}
function measure(){
 measureQueued=false;
 root.classList.remove('x-scroll-ready');
 const height=inner.getBoundingClientRect().height+65;
 pinned=!reduced.matches&&window.innerWidth>1024&&height<=window.innerHeight-20;
 if(pinned){
  span=window.innerHeight*1.45;
  root.style.setProperty('--x-sticky-top',Math.max(10,(window.innerHeight-height)/2)+'px');
  root.style.setProperty('--x-runway',(height+span)+'px');
  root.classList.add('x-scroll-ready');
 }
 lastBucket=-1;updateFromScroll();
}
selectCard=function(i){
 choose(i);
 if(pinned){
  const b=bounds(),y=window.scrollY;
  if(y>=b.start-120&&y<=b.start+span+120){
   lastBucket=i;
   window.scrollTo({top:b.start+span*((i+.5)/3),behavior:'instant'});
  }
 }
};
window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateFromScroll);}},{passive:true});
window.addEventListener('resize',()=>{if(!measureQueued){measureQueued=true;requestAnimationFrame(measure);}},{passive:true});
reduced.addEventListener('change',measure);
if(document.fonts)document.fonts.ready.then(measure);else measure();
const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;if(!reduced.matches){root.querySelector('h2').animate([{clipPath:'inset(100% 0 0 0)',transform:'translateY(24px)'},{clipPath:'inset(0% 0 0 0)',transform:'translateY(0)'}],{duration:1100,easing:'cubic-bezier(.16,1,.3,1)'});deck.animate([{opacity:0,transform:'translateY(65px) rotateX(12deg)'},{opacity:1,transform:'translateY(0) rotateX(0)'}],{duration:1400,easing:'cubic-bezier(.16,1,.3,1)'});}observer.disconnect();},{threshold:.18});observer.observe(root);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();})();