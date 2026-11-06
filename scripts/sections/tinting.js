(function(){
 'use strict';
 function init(){
  const root=document.querySelector('.p10x-tint');if(!root||root.dataset.tiReady)return;root.dataset.tiReady='true';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
  const fine=window.matchMedia('(hover:hover) and (pointer:fine)');
  // Keep the theme's own accordion behaviour, with native keyboard controls.
  const accordion=root.querySelector('.ti-priority-accordion .ui-accordion');
  if(accordion){
   const items=Array.from(accordion.querySelectorAll('.ui--item'));
   const buttons=items.map((item,i)=>{
    const title=item.querySelector('.ui-accordion--title'),panel=item.querySelector('.ui-accordion--content');
    const button=document.createElement('button');button.type='button';button.className='ti-accordion-toggle';button.id='ti-priority-toggle-'+i;
    while(title.firstChild)button.append(title.firstChild);title.append(button);
    button.setAttribute('aria-controls',panel.id);panel.setAttribute('role','region');panel.setAttribute('aria-labelledby',button.id);
    button.addEventListener('keydown',event=>{let next=i;if(event.key==='ArrowDown')next=(i+1)%items.length;else if(event.key==='ArrowUp')next=(i+items.length-1)%items.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=items.length-1;else return;event.preventDefault();buttons[next].focus();});
    return button;
   });
   function syncAccordion(){items.forEach((item,i)=>buttons[i].setAttribute('aria-expanded',item.classList.contains('active')?'true':'false'));}
   new MutationObserver(syncAccordion).observe(accordion,{subtree:true,attributes:true,attributeFilter:['class']});syncAccordion();
   accordion.addEventListener('click',()=>setTimeout(refresh,450));
  }
  root.querySelectorAll('.heading-title').forEach(el=>{if(!el.hasAttribute('aria-label'))el.setAttribute('aria-label',el.innerText.replace(/\s+/g,' ').trim());});
  root.querySelectorAll('.ti-chapter,.ti-detail-item').forEach(item=>{
   const link=item.querySelector('.ti-stage-photo a,.ti-detail-photo a');if(!link)return;
   const caption=item.querySelector('.ti-frame-caption').innerText.trim();
   link.setAttribute('data-elementor-lightbox-slideshow','p10x-tint-installation');
   link.setAttribute('data-elementor-lightbox-title',caption);
   link.setAttribute('aria-label','Enlarge: '+caption);
  });
  const chapters=Array.from(root.querySelectorAll('.ti-chapter')),nav=Array.from(root.querySelectorAll('.ti-process-nav a'));
  function updateStep(){let active=0;chapters.forEach((el,i)=>{if(el.getBoundingClientRect().top<=innerHeight*.55)active=i;});nav.forEach((a,i)=>{a.classList.toggle('is-active',i===active);if(i===active)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});}
  let tick=0;window.addEventListener('scroll',()=>{if(!tick)tick=requestAnimationFrame(()=>{tick=0;updateStep();});},{passive:true});updateStep();
  if(window.gsap){
   const media=gsap.matchMedia();
   media.add('(prefers-reduced-motion:no-preference)',()=>{
    gsap.from(root.querySelector('.ti-hero-title'),{y:24,opacity:0,duration:1.1,ease:'power3.out',delay:.15});
    gsap.from(root.querySelector('.ti-hero-kicker'),{y:14,opacity:0,duration:.8,delay:.1});
    gsap.from(root.querySelector('.ti-hero-aside'),{y:20,opacity:0,duration:1,delay:.35,ease:'power3.out'});
    if(window.ScrollTrigger)root.querySelectorAll('.ti-detail-photo').forEach((photo,i)=>gsap.from(photo,{clipPath:'inset(12% 0 0 0)',opacity:0,y:25,duration:1.1,delay:i*.12,ease:'power3.out',scrollTrigger:{trigger:photo,start:'top 90%',once:true}}));
   });
   media.add('(min-width:1025px) and (min-height:721px) and (prefers-reduced-motion:no-preference)',()=>{
    if(!window.ScrollTrigger)return;
    chapters.slice(0,-1).forEach((chapter,i)=>gsap.fromTo(chapter.querySelector('.ti-chapter-surface'),{scale:1,filter:'brightness(1)'},{scale:.955,filter:'brightness(0.72)',ease:'none',scrollTrigger:{trigger:chapters[i+1],start:'top 90%',end:'top 110px',scrub:1.2}}));
   });
  }
  if(!fine.matches||reduced.matches)root.querySelectorAll('.ui-image-tilt').forEach(el=>{if(el.vanillaTilt)el.vanillaTilt.destroy();});
  function refresh(){if(window.ScrollTrigger)ScrollTrigger.refresh();updateStep();}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(refresh);else refresh();
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(refresh,160);});
 }
 if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});
})();
