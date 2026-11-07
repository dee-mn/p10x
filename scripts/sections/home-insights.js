/* Local article navigation; article content is present before JavaScript runs. */
(()=>{
 const root=document.querySelector('[data-home-insights]');if(!root)return;
 const track=root.querySelector('.ui-swiper-wrapper'),slides=[...track.children];
 const previous=root.querySelector('.home-insights-prev'),next=root.querySelector('.home-insights-next'),status=root.querySelector('.home-insights-status');
 let index=0,start=null,dragged=false;
 function move(value){
  const shown=innerWidth<768?1:innerWidth<992?2:3;
  index=Math.max(0,Math.min(value,slides.length-shown));
  const step=slides[0].getBoundingClientRect().width+30;
  track.style.transform=`translateX(${-index*step}px)`;
  previous.disabled=index===0;next.disabled=index>=slides.length-shown;
  status.textContent=`${index+1}–${Math.min(index+shown,slides.length)} of ${slides.length}`;
  slides.forEach((slide,i)=>{
   const hidden=i<index||i>=index+shown;
   if(hidden&&slide.contains(document.activeElement))root.focus({preventScroll:true});
   slide.inert=hidden;slide.setAttribute('aria-hidden',String(hidden));
  });
 }
 previous.addEventListener('click',()=>move(index-1));next.addEventListener('click',()=>move(index+1));
 root.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey)return;
  const value=event.key==='ArrowRight'?index+1:event.key==='ArrowLeft'?index-1:event.key==='Home'?0:event.key==='End'?slides.length:null;
  if(value===null)return;event.preventDefault();move(value);
 });
 root.addEventListener('pointerdown',event=>{if(event.button!==0||event.target.closest('button'))return;start={x:event.clientX,y:event.clientY,id:event.pointerId};dragged=false;});
 root.addEventListener('pointerup',event=>{
  if(!start||event.pointerId!==start.id)return;
  const dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){dragged=true;move(index+(dx<0?1:-1));}
 });
 root.addEventListener('pointercancel',()=>{start=null;dragged=false;});
 root.addEventListener('click',event=>{if(dragged){event.preventDefault();event.stopPropagation();dragged=false;}},true);
 root.addEventListener('dragstart',event=>event.preventDefault());
 addEventListener('resize',()=>move(index));move(0);
})();
