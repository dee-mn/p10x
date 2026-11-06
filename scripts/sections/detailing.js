(function(){
 'use strict';
 function init(){
  const root=document.querySelector('.p10x-detail');if(!root||root.dataset.dtReady)return;root.dataset.dtReady='true';
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const thumbs=Array.from(root.querySelectorAll('.dt-thumb')),panels=Array.from(root.querySelectorAll('.dt-panel'));
  const grid=root.querySelector('.dt-thumb-grid'),count=root.querySelector('.dt-view-count');let current=0;
  grid.setAttribute('role','tablist');grid.setAttribute('aria-label','Interior detail photographs');
  const buttons=thumbs.map((thumb,i)=>{
   const button=document.createElement('button');button.type='button';button.className='dt-thumb-button';button.id='dt-thumb-button-'+i;
   button.setAttribute('role','tab');button.setAttribute('aria-controls',panels[i].id);button.setAttribute('aria-label',thumb.querySelector('.dt-meta').innerText.trim().replace(/^0\d\s*\/\s*/,''));
   const photo=thumb.querySelector('.dt-thumb-photo');photo.parentNode.insertBefore(button,photo);button.append(photo);
   panels[i].setAttribute('role','tabpanel');panels[i].setAttribute('aria-labelledby',button.id);
   button.addEventListener('click',()=>select(i,false));
   button.addEventListener('keydown',event=>{
    let next=i;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(i+1)%panels.length;
    else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(i+panels.length-1)%panels.length;
    else if(event.key==='Home')next=0;else if(event.key==='End')next=panels.length-1;else return;
    event.preventDefault();select(next,true);
   });return button;
  });
  function select(index,focus){
   const changed=current!==index;current=index;
   buttons.forEach((b,i)=>{b.setAttribute('aria-selected',i===index?'true':'false');b.tabIndex=i===index?0:-1;thumbs[i].classList.toggle('is-active',i===index);});
   panels.forEach((p,i)=>{p.classList.toggle('is-active',i===index);p.setAttribute('aria-hidden',i===index?'false':'true');p.inert=i!==index;});
   count.textContent=String(index+1).padStart(2,'0')+' / 06';
   if(changed&&window.gsap&&!reduced.matches)gsap.fromTo(panels[index].querySelector('img'),{scale:1.035},{scale:1,duration:.75,ease:'power2.out',overwrite:true});
   if(focus)buttons[index].focus({preventScroll:true});
  }
  root.classList.add('dt-enhanced');select(0,false);
  root.querySelector('.dt-prev').addEventListener('click',()=>select((current+panels.length-1)%panels.length,false));
  root.querySelector('.dt-next').addEventListener('click',()=>select((current+1)%panels.length,false));
  root.querySelectorAll('.dt-panel').forEach((panel,i)=>{
   const a=panel.querySelector('.dt-view-photo a');a.setAttribute('data-elementor-lightbox-slideshow','p10x-detail-cabin');
   a.setAttribute('data-elementor-lightbox-title',panel.querySelector('.dt-view-title').innerText);a.setAttribute('aria-label','Enlarge: '+buttons[i].getAttribute('aria-label'));
  });
  root.querySelectorAll('.dt-editorial-shot').forEach(shot=>{
   const a=shot.querySelector('.dt-frame-photo a'),caption=shot.querySelector('.dt-frame-caption').innerText.replace(/\s*↗\s*$/,'').trim();
   a.setAttribute('data-elementor-lightbox-slideshow','p10x-detail-exterior');a.setAttribute('data-elementor-lightbox-title',caption);a.setAttribute('aria-label','Enlarge: '+caption);
  });
  root.querySelectorAll('.heading-title').forEach(el=>{if(!el.hasAttribute('aria-label'))el.setAttribute('aria-label',el.innerText.replace(/\s+/g,' ').trim());});
  if(window.gsap){
   const media=gsap.matchMedia();
   media.add('(prefers-reduced-motion:no-preference)',()=>{
    gsap.from(root.querySelector('.dt-hero-title'),{y:28,opacity:0,duration:1.2,ease:'power3.out',delay:.15});
    gsap.from(root.querySelector('.dt-hero-kicker'),{y:15,opacity:0,duration:.9,delay:.1});
    gsap.from(root.querySelector('.dt-hero-bottom'),{y:20,opacity:0,duration:1,delay:.3,ease:'power3.out'});
    if(window.ScrollTrigger){
     root.querySelectorAll('.dt-frame-photo,.dt-viewer').forEach(el=>gsap.from(el,{opacity:0,y:30,duration:1.15,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
    }
   });
   media.add('(min-width:1025px) and (prefers-reduced-motion:no-preference)',()=>{
    if(!window.ScrollTrigger)return;
    root.querySelectorAll('.dt-frame-photo img').forEach((img,i)=>gsap.fromTo(img,{yPercent:i?3:-3,scale:1.08},{yPercent:i?-3:3,scale:1.08,ease:'none',scrollTrigger:{trigger:img.closest('.dt-frame-photo'),start:'top bottom',end:'bottom top',scrub:1.6}}));
    gsap.fromTo(root.querySelector('.dt-consult-scene'),{clipPath:'inset(8% 7% 8% 7% round 4px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:root.querySelector('.dt-consult'),start:'top 95%',end:'top 15%',scrub:1.7}});
    gsap.fromTo(root.querySelector('.dt-consult-photo img'),{scale:1.08},{scale:1,ease:'none',scrollTrigger:{trigger:root.querySelector('.dt-consult'),start:'top bottom',end:'bottom top',scrub:1.7}});
   });
  }
  function refresh(){if(window.ScrollTrigger)ScrollTrigger.refresh();}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(refresh);else refresh();
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(refresh,160);});
 }
 if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});
})();
