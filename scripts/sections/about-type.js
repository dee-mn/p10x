
(function(){
var records=[],running=false;
function capture(){
document.querySelectorAll('.p10x-about .heading-title,.p10x-about .ab-pillar-tabs h3').forEach(function(el){
if(records.some(function(r){return r.el===el;}))return;
records.push({el:el,html:el.innerHTML,label:el.getAttribute('aria-label'),split:null,tween:null});
el.classList.add('ui-slip-text-color','is-splitted');
});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',capture,{once:true});else capture();
function start(){
if(running)return;running=true;capture();
var gs=window.gsap,ST=window.ScrollTrigger,Split=window.SplitText;
if(!gs||!ST||!Split)return;
gs.registerPlugin(ST,Split);
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
var animations=[],observers=[],entrances=[],width=window.innerWidth;
function clear(){
observers.forEach(function(o){o.disconnect();});observers=[];
animations.forEach(function(a){if(a.scrollTrigger)a.scrollTrigger.kill();a.kill();});animations=[];
records.forEach(function(r){if(r.tween)r.tween.kill();if(r.split){r.split.revert();r.split=null;}r.el.innerHTML=r.html;r.el.classList.add('is-splitted');if(r.label===null)r.el.removeAttribute('aria-label');else r.el.setAttribute('aria-label',r.label);r.played=false;});
entrances.forEach(function(el){gs.set(el,{clearProps:'transform,opacity,visibility'});});entrances=[];
}
function split(r){
if(r.split)return r.split.chars;
r.el.setAttribute('aria-label',r.el.textContent.trim());
r.split=new Split(r.el,{type:'words,chars',wordsClass:'ab-title-word',charsClass:'ui-char'});
r.split.words.forEach(function(w){w.setAttribute('aria-hidden','true');});
gs.set(r.split.chars,{color:'var(--ui-title-color-start)'});
return r.split.chars;
}
function play(r,again){
if(r.played&&!again)return;
r.played=true;
var chars=split(r);if(r.tween)r.tween.kill();
r.tween=gs.fromTo(chars,{color:'var(--ui-title-color-start)'},{color:'var(--ui-title-color-end)',duration:.7,stagger:{amount:.5},ease:'none',overwrite:true});
}
function build(){
clear();if(reduced.matches){ST.refresh();return;}
records.forEach(function(r){
var el=r.el,card=el.closest('.ab-milestone'),panel=el.closest('.surface-tab-content'),person=el.closest('.ab-person');
if(card&&card.closest('.ab-story-live')){
split(r);
var mo=new MutationObserver(function(){if(card.getAttribute('aria-hidden')==='false')play(r,true);});
mo.observe(card,{attributes:true,attributeFilter:['aria-hidden']});observers.push(mo);
var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting&&card.getAttribute('aria-hidden')==='false')play(r,false);});},{threshold:.15});io.observe(card);observers.push(io);
}else if(panel){
var mo=new MutationObserver(function(){if(panel.classList.contains('is-active'))requestAnimationFrame(function(){play(r,true);});});
mo.observe(panel,{attributes:true,attributeFilter:['class']});observers.push(mo);
var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting&&panel.classList.contains('is-active'))play(r,false);});},{threshold:.1});io.observe(panel);observers.push(io);
}else if(person){
split(r);
var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)play(r,false);});},{threshold:.35});io.observe(person);observers.push(io);
}else if(el.closest('.ab-hero')){split(r);animations.push(gs.fromTo(r.split.words,{yPercent:65,rotationX:-35,autoAlpha:0},{yPercent:0,rotationX:0,autoAlpha:1,duration:1.15,stagger:.075,delay:.12,ease:'power3.out',clearProps:'transform,opacity,visibility'}));
play(r,false);
}else{
var chars=split(r);
var tween=gs.to(chars,{color:'var(--ui-title-color-end)',stagger:.04,ease:'none',scrollTrigger:{trigger:el,start:'top 90%',end:'bottom 62%',scrub:.65,invalidateOnRefresh:true}});
animations.push(tween);
}
});
var selector='.p10x-about .ab-reason>.surface-widget-pxl_text_editor,.p10x-about .ab-shell>.ab-eyebrow,.p10x-about .ab-shell>.ab-lead,.p10x-about .ab-shell>.ab-caption,.p10x-about .ab-hero-foot>.component,.p10x-about .ab-journey-intro>.surface-widget-pxl_text_editor,.p10x-about .ab-value>.surface-widget-pxl_text_editor,.p10x-about .ab-standards-heading>.surface-widget-pxl_text_editor,.p10x-about .ab-standard-image,.p10x-about .ab-team-image,.p10x-about .ab-team-navigation,.p10x-about .ab-team-end';
entrances=Array.from(document.querySelectorAll(selector));
entrances.forEach(function(el,i){
var image=el.matches('.ab-team-image,.ab-standard-image'),hero=el.closest('.ab-hero');
var options={autoAlpha:1,y:0,duration:image?1:.75,ease:'power2.out',clearProps:'transform,opacity,visibility'};
if(hero)options.delay=.15+(i%3)*.08;
else options.scrollTrigger={trigger:el,start:'top 92%',toggleActions:'play none none none',once:true};
animations.push(gs.fromTo(el,{autoAlpha:.25,y:image?30:18},options));
});
ST.refresh();
}
var timer;
window.addEventListener('resize',function(){if(Math.abs(window.innerWidth-width)<2)return;width=window.innerWidth;clearTimeout(timer);timer=setTimeout(build,220);});
if(reduced.addEventListener)reduced.addEventListener('change',build);else reduced.addListener(build);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){requestAnimationFrame(build);});else requestAnimationFrame(build);
}
if(document.readyState==='complete')start();else window.addEventListener('load',start,{once:true});
})();
