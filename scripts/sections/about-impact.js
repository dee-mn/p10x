(function(){
function typewriter(section){
var purpose=section.querySelector('.ai-purpose'),stage=purpose.querySelector('.ai-typewriter'),word=stage.querySelector('.ai-type-word'),pause=stage.querySelector('.ai-type-toggle');
var values=Array.from(purpose.querySelectorAll('.ai-term-word'),function(el){return el.textContent.trim();});
var reduced=matchMedia('(prefers-reduced-motion: reduce)'),visible=!window.IntersectionObserver,timer=0,deadline=0,remaining=1500,index=0,text=values[0],phase='hold';
function running(){return visible&&!document.hidden&&!reduced.matches&&pause.getAttribute('aria-pressed')!=='true';}
function schedule(delay){remaining=delay;if(!running())return;deadline=performance.now()+delay;timer=setTimeout(step,delay);}
function render(){word.textContent=text;if(phase==='hold')purpose.dataset.titleWord=values[index];}
function step(){
timer=0;if(!running())return;
if(phase==='hold'){phase='erase';schedule(45);return;}
if(phase==='erase'){
text=text.slice(0,-1);render();
if(text.length)schedule(45);else{index=(index+1)%values.length;phase='type';schedule(280);}
}else{
text=values[index].slice(0,text.length+1);
if(text===values[index]){phase='hold';render();schedule(2200);}else{render();schedule(85);}
}
}
function sync(){
stage.hidden=reduced.matches;purpose.classList.toggle('is-typing',!reduced.matches);
if(!running()){
if(timer){remaining=Math.max(0,deadline-performance.now());clearTimeout(timer);timer=0;}
if(reduced.matches){index=0;text=values[0];phase='hold';remaining=2200;render();}
}else if(!timer)schedule(remaining);
purpose.classList.toggle('is-type-paused',!running());
}
pause.addEventListener('click',function(){
var paused=pause.getAttribute('aria-pressed')!=='true';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Resume word animation':'Pause word animation');
if(paused){if(timer)clearTimeout(timer);timer=0;text=values[index];phase='hold';remaining=2200;render();}sync();
});
if(window.IntersectionObserver)new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;sync();},{threshold:.01}).observe(purpose);
document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
window.addEventListener('pagehide',function(){if(timer)clearTimeout(timer);timer=0;});window.addEventListener('pageshow',sync);
render();sync();
}
function init(){
var section=document.querySelector('.ab-impact');if(!section||section.dataset.impactReady)return;
section.dataset.impactReady='true';
typewriter(section);
var gs=window.gsap,ST=window.ScrollTrigger;if(!gs||!ST)return;
gs.registerPlugin(ST);
var media=gs.matchMedia();
media.add('(prefers-reduced-motion: no-preference)',function(){
var context=gs.context(function(){
document.querySelectorAll('[data-impact-reveal]').forEach(function(el){gs.fromTo(el,{y:18,opacity:.45},{y:0,opacity:1,duration:.8,ease:'power2.out',clearProps:'transform,opacity',scrollTrigger:{trigger:el,start:'top 92%',once:true}});});
gs.to(section,{'--impact-progress':'100%',ease:'none',scrollTrigger:{trigger:section.querySelector('.ai-equation'),start:'top 90%',end:'top 35%',scrub:.6}});
},section);
return function(){context.revert();};
});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){ST.refresh();});
}
if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});
})();
