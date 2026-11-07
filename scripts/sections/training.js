/* Academy learning areas and scroll-led workshop chapters. */
(()=>{
 'use strict';
 const root=document.querySelector('.tr-page');if(!root)return;
 const tabs=[...root.querySelectorAll('[role=tab]')],panels=[...root.querySelectorAll('[role=tabpanel]')];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let panelAnimation;
 function select(index){
  panelAnimation?.cancel();
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});
  if(!reduced.matches)panelAnimation=panels[index].animate([{opacity:.25,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.16,1,.3,1)'});
  window.ScrollTrigger?.refresh();
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>select(i));
  tab.addEventListener('keydown',event=>{
   let next=i;
   if(['ArrowRight','ArrowDown'].includes(event.key))next=(i+1)%tabs.length;
   else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(i+tabs.length-1)%tabs.length;
   else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;
   event.preventDefault();select(next);tabs[next].focus();
  });
 });
 const steps=[...root.querySelectorAll('.tr-step')],links=[...root.querySelectorAll('.tr-process-nav a')];
 let queued=false;
 function markStep(){
  queued=false;let active=0;
  steps.forEach((step,i)=>{if(step.getBoundingClientRect().top<innerHeight*.55)active=i;});
  links.forEach((link,i)=>{if(i===active)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
 }
 window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(markStep);}},{passive:true});markStep();
 // Details remain native and usable without JavaScript; only the opening copy animates.
 root.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{
  if(detail.open&&!reduced.matches)detail.querySelector('p').animate([{opacity:.2,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:400,easing:'ease-out'});
  window.ScrollTrigger?.refresh();
 }));
 function motion(){
  if(!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion:no-preference)',()=>{
   gsap.from(root.querySelectorAll('.tr-hero .tr-eyebrow,.tr-hero h1,.tr-hero-lead,.tr-hero .tr-button'),{y:28,opacity:0,duration:1.15,stagger:.12,ease:'power3.out'});
   gsap.from(root.querySelector('.tr-hero-photo img'),{scale:1.08,duration:1.9,ease:'power2.out'});
   root.querySelectorAll('[data-tr-reveal]').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
   if(window.SplitText)root.querySelectorAll('[data-tr-type]').forEach(title=>{
    const label=title.innerText.replace(/\s+/g,' ').trim();
    const split=new SplitText(title,{type:'words,chars',charsClass:'tr-char'});
    title.setAttribute('aria-label',label);
    const colour=getComputedStyle(title).color;
    gsap.fromTo(split.chars,{opacity:.2},{opacity:1,stagger:.025,ease:'none',scrollTrigger:{trigger:title,start:'top 90%',end:'top 55%',scrub:.35}});
    title.style.color=colour;
   });
  });
  gsap.matchMedia().add('(min-width:1101px) and (min-height:760px) and (prefers-reduced-motion:no-preference)',()=>{
   steps.slice(0,-1).forEach((step,i)=>gsap.to(step.querySelector('.tr-step-surface'),{scale:.96,opacity:.45,ease:'none',scrollTrigger:{trigger:steps[i+1],start:'top 85%',end:'top 115px',scrub:.6}}));
  });
  ScrollTrigger.refresh();
 }
 function ready(){if(document.fonts)document.fonts.ready.then(motion);else motion();}
 if(document.readyState==='complete')ready();else window.addEventListener('load',ready,{once:true});
})();
