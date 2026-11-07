/* Keep focused service panels in view when the strip scrolls on smaller screens. */
(()=>{
 const strip=document.querySelector('#services .sc-grid');if(!strip)return;
 const cards=[...strip.querySelectorAll('.sc-card')];
 strip.addEventListener('focusin',event=>{
  const card=event.target.closest('.sc-card');if(!card||!matchMedia('(max-width:1100px)').matches)return;
  requestAnimationFrame(()=>{
   if(document.activeElement!==card)return;
   const left=card.getBoundingClientRect().left-strip.getBoundingClientRect().left+strip.scrollLeft-(strip.clientWidth-card.offsetWidth)/2;
   strip.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  });
 });
 strip.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey)return;
  const index=cards.indexOf(event.target);if(index<0)return;
  let next=index;
  if(event.key==='ArrowRight')next=Math.min(cards.length-1,index+1);
  else if(event.key==='ArrowLeft')next=Math.max(0,index-1);
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=cards.length-1;
  else return;
  event.preventDefault();cards[next].focus();
 });
})();
