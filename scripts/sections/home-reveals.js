/* Homepage entrances keep readable defaults and finish before the content reaches centre. */
(()=>{
 'use strict';
 const root=document.querySelector('.view-20');if(!root)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const entrances=[...root.querySelectorAll('.wow,[data-home-reveal] .ui-split-text')]
  .filter(el=>!el.closest('.block-7b197f1')&&(el.textContent.trim()||el.querySelector('img,svg')));
 let observer;
 function observe(){
  observer?.disconnect();
  if(reduced.matches||!window.IntersectionObserver)return;
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const el=entry.target;observer.unobserve(el);
   const x=el.classList.contains('fadeInRight')?18:el.classList.contains('fadeInLeft')?-18:0;
   el.animate([{opacity:.15,transform:`translate(${x}px,18px)`},{opacity:1,transform:'translate(0,0)'}],{duration:750,easing:'cubic-bezier(.16,1,.3,1)'});
  }),{rootMargin:'0px 0px -4% 0px',threshold:0});
  entrances.forEach(el=>observer.observe(el));
 }
 observe();reduced.addEventListener('change',observe);
 function titles(){
  if(!window.gsap||!window.SplitText||!window.ScrollTrigger)return;
  gsap.registerPlugin(SplitText,ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion:no-preference)',()=>{
   const splits=[];
   root.querySelectorAll('[data-home-reveal] .ui-slip-text-color').forEach(title=>{
    const label=title.innerText.replace(/\s+/g,' ').trim();
    const split=new SplitText(title,{type:'words,chars',charsClass:'ui-char'});splits.push(split);
    title.classList.add('is-splitted');title.setAttribute('aria-label',label);
    // Use the complete heading, rather than a separate trigger for every line.
    gsap.fromTo(split.chars,{opacity:.35},{opacity:1,stagger:.025,ease:'none',scrollTrigger:{trigger:title,start:'top 94%',end:'top 70%',scrub:.25,invalidateOnRefresh:true}});
   });
   return()=>splits.forEach(split=>split.revert());
  });
  ScrollTrigger.refresh();
 }
 function ready(){if(document.fonts)document.fonts.ready.then(titles);else titles();}
 if(document.readyState==='complete')ready();else window.addEventListener('load',ready,{once:true});
})();
