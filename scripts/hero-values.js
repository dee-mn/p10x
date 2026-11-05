/* P10X values: local hover geometry, tap/keyboard exploration and a quiet typewriter. */
(() => {
  'use strict';
  const hero = document.getElementById('p10x-motion-hero');
  if (!hero) return;
  const stage = hero.querySelector('.pm-stage');
  const layer = hero.querySelector('.pm-values-layer');
  const card = hero.querySelector('.pm-value-card');
  const word = hero.querySelector('.pm-value-word');
  const description = hero.querySelector('.pm-value-description');
  const number = hero.querySelector('.pm-value-index');
  const svg = hero.querySelector('.pm-value-lines');
  const mesh = hero.querySelector('.pm-value-mesh');
  const leader = hero.querySelector('.pm-value-leader');
  const dot = hero.querySelector('.pm-value-dot');
  const accent = hero.querySelector('.pm-title-accent');
  const slot = hero.querySelector('.pm-type-slot');
  const pause = hero.querySelector('.pm-pause');
  const mobile = matchMedia('(max-width: 767px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const values = [...hero.querySelectorAll('.pm-values-data li')].map(el => ({word:el.dataset.word, description:el.textContent.trim()}));
  if (!values.length || !layer || !accent) return;
  const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
  let bounds, radius=1, cx=0, cy=0, active=-1, pressed=null, pending=null, pendingTimer=0, hoverFrame=0;
  let visible=true, keyboard=false;
  function geometry() {
    bounds=hero.getBoundingClientRect();cx=bounds.width/2;cy=bounds.height/2;
    const canvas=hero.querySelector('.pm-canvas');
    radius=Number(canvas?.dataset.radius) || (mobile.matches?Math.min(bounds.width*.35,bounds.height*.22):Math.min(bounds.width*.205,bounds.height*.275));
    svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
  }
  function point(event) {
    const b=hero.getBoundingClientRect();
    return {x:event.clientX-b.left,y:event.clientY-b.top};
  }
  function onGlobe(p) { return Math.hypot(p.x-cx,p.y-cy)<=radius*1.31; }
  function indexAt(p) {
    const angle=(Math.atan2(p.y-cy,p.x-cx)+Math.PI*2.5)%(Math.PI*2);
    return Math.floor(angle/(Math.PI*2)*values.length)%values.length;
  }
  function hide() {
    clearTimeout(pendingTimer);pendingTimer=0;pending=null;active=-1;keyboard=false;
    hero.classList.remove('is-value-revealed');layer.setAttribute('aria-hidden','true');
    delete hero.dataset.activeValue;
  }
  function drawMesh(p) {
    const step=mobile.matches?27:40, reach=mobile.matches?74:112;
    const paths=[];
    function node(col,row) {
      const x=cx+(col+(row%2)*.5)*step,y=cy+row*step*.866;
      const dx=x-p.x,dy=y-p.y,pull=Math.exp(-(dx*dx+dy*dy)/(reach*reach))*.15;
      return {x:x+dx*pull,y:y+dy*pull};
    }
    const row0=Math.floor((p.y-cy-reach)/(step*.866)),row1=Math.ceil((p.y-cy+reach)/(step*.866));
    const col0=Math.floor((p.x-cx-reach)/step)-1,col1=Math.ceil((p.x-cx+reach)/step)+1;
    for(let row=row0;row<=row1;row++)for(let col=col0;col<=col1;col++) {
      const a=node(col,row),b=node(col+1,row),c=node(col+(row%2?1:0),row+1);
      const mx=(a.x+b.x+c.x)/3,my=(a.y+b.y+c.y)/3,d=Math.hypot(mx-p.x,my-p.y);
      if(d>reach || Math.hypot(mx-cx,my-cy)>radius*1.3)continue;
      const opacity=Math.pow(1-d/reach,1.35)*.72;
      paths.push(`<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}L${c.x.toFixed(1)} ${c.y.toFixed(1)}Z" opacity="${opacity.toFixed(2)}"/>`);
    }
    mesh.innerHTML=paths.join('');
  }
  function position(p) {
    const cardWidth=mobile.matches?Math.min(bounds.width-44,280):270;
    card.style.width=`${cardWidth}px`;
    const cardHeight=card.offsetHeight || 110;
    const heroTop=hero.getBoundingClientRect().top;
    const topLine=hero.querySelector('.pm-topline').getBoundingClientRect();
    const minTop=topLine.bottom-heroTop+20;
    const copyTop=hero.querySelector('.pm-content').getBoundingClientRect().top-heroTop;
    const maxTop=Math.max(minTop,copyTop-cardHeight-24);
    let left,top,endX,endY;
    if(mobile.matches) {
      left=clamp(p.x-cardWidth/2,22,bounds.width-cardWidth-22);
      top=clamp(cy-radius*1.28-cardHeight-18,minTop,maxTop);
      endX=clamp(p.x,left+16,left+cardWidth-16);endY=top+cardHeight+10;
      leader.setAttribute('points',`${p.x},${p.y} ${p.x},${Math.max(endY,p.y-30)} ${endX},${endY}`);
    } else {
      const right=p.x+54+cardWidth<bounds.width-36;
      left=clamp(right?p.x+54:p.x-cardWidth-54,36,bounds.width-cardWidth-36);
      top=clamp(p.y-85,minTop,maxTop);
      endX=right?left-12:left+cardWidth+12;endY=top+29;
      const elbowX=p.x+(right?24:-24),elbowY=p.y-24;
      leader.setAttribute('points',`${p.x},${p.y} ${elbowX},${elbowY} ${endX},${endY}`);
    }
    card.style.left=`${left}px`;card.style.top=`${top}px`;
    dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);
    drawMesh(p);
  }
  function reveal(index,p,fromKeyboard=false) {
    if(!visible)return;
    const value=values[index];active=index;keyboard=fromKeyboard;
    word.textContent=value.word;description.textContent=value.description;
    number.textContent=`${String(index+1).padStart(2,'0')} / ${String(values.length).padStart(2,'0')}`;
    card.setAttribute('aria-live',fromKeyboard?'polite':'off');
    layer.setAttribute('aria-hidden','false');hero.dataset.activeValue=value.word;
    position(p);hero.classList.add('is-value-revealed');
  }
  function hover(p) {
    pending=null;hoverFrame=0;
    if(!onGlobe(p)){hide();return;}
    const index=indexAt(p);
    if(active<0 || index===active){clearTimeout(pendingTimer);pendingTimer=0;reveal(index,p);}
    else {
      position(p);
      if(!pendingTimer)pendingTimer=setTimeout(()=>{pendingTimer=0;reveal(index,p);},100);
    }
  }
  stage.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||pressed)return;
    pending=point(event);
    if(!hoverFrame)hoverFrame=requestAnimationFrame(()=>{const p=pending;if(p)hover(p);});
  });
  stage.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    const p=point(event);if(!onGlobe(p)){hide();return;}
    pressed={id:event.pointerId,x:event.clientX,y:event.clientY};hide();
  });
  // The renderer captures the pointer on the hero, so release is observed here too.
  hero.addEventListener('pointerup',event=>{
    if(!pressed||pressed.id!==event.pointerId)return;
    const moved=Math.hypot(event.clientX-pressed.x,event.clientY-pressed.y)>7;pressed=null;
    if(moved){hide();return;}
    const p=point(event);if(onGlobe(p))reveal(indexAt(p),p);
  });
  hero.addEventListener('pointercancel',()=>{pressed=null;hide();});
  hero.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch'&&!mobile.matches)hide();});
  document.addEventListener('pointerdown',event=>{if(!(event.target instanceof Element)||!event.target.closest('#p10x-motion-hero .pm-stage'))hide();});
  stage.addEventListener('keydown',event=>{
    if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End','Enter',' ','Escape'].includes(event.key))return;
    event.preventDefault();event.stopPropagation();
    if(event.key==='Escape'){hide();return;}
    let index=active<0?0:active;
    if(event.key==='Home')index=0;
    else if(event.key==='End')index=values.length-1;
    else if(active>=0)index=(index+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)+values.length)%values.length;
    const angle=index/values.length*Math.PI*2-Math.PI/2;
    reveal(index,{x:cx+Math.cos(angle)*radius*.72,y:cy+Math.sin(angle)*radius*.72},true);
  });
  stage.addEventListener('blur',hide);
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hide();});
  new ResizeObserver(()=>{geometry();hide();measureTitle();}).observe(hero);

  // Resize the word slot once per word, keeping the suffix steady while letters are typed.
  let timer=0,deadline=0,remaining=1500,phase='hold',index=-1,text=accent.textContent;
  const measureCanvas=document.createElement('canvas'),measure=measureCanvas.getContext('2d');
  function measureTitle() {
    if(!measure)return;
    const style=getComputedStyle(accent);
    measure.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const spacing=parseFloat(style.letterSpacing)||0;
    const target=index<0?'Professional':values[index].word;
    const width=measure.measureText(target).width+(target.length-1)*spacing;
    slot.style.setProperty('--pm-type-width',`${Math.ceil(width+parseFloat(style.fontSize)*.15)}px`);
  }
  function running(){return visible&&!document.hidden&&!reduced.matches&&pause?.getAttribute('aria-pressed')!=='true';}
  function schedule(delay){remaining=delay;if(!running())return;deadline=performance.now()+delay;timer=setTimeout(step,delay);}
  function step(){
    timer=0;if(!running())return;
    if(phase==='hold'){phase='erase';schedule(45);return;}
    if(phase==='erase'){
      text=text.slice(0,-1);accent.textContent=text;
      if(text.length)schedule(45);
      else{index=(index+1)%values.length;measureTitle();phase='type';schedule(280);}
    }else{
      text=values[index].word.slice(0,text.length+1);accent.textContent=text;
      if(text===values[index].word){phase='hold';hero.dataset.titleWord=text;schedule(2200);}
      else schedule(85);
    }
  }
  function syncTypewriter(){
    if(!running()){
      if(timer){remaining=Math.max(0,deadline-performance.now());clearTimeout(timer);timer=0;}
      if(reduced.matches){accent.textContent=values[0].word;text=values[0].word;index=0;phase='hold';remaining=2200;measureTitle();}
    }else if(!timer)schedule(remaining);
    hero.classList.toggle('is-type-paused',!running());
  }
  if(pause)new MutationObserver(syncTypewriter).observe(pause,{attributes:true,attributeFilter:['aria-pressed']});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)hide();syncTypewriter();},{threshold:.01}).observe(hero);
  document.addEventListener('visibilitychange',syncTypewriter);
  reduced.addEventListener('change',syncTypewriter);
  geometry();measureTitle();syncTypewriter();
  if(document.fonts?.ready)document.fonts.ready.then(measureTitle);
})();
