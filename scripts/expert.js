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
