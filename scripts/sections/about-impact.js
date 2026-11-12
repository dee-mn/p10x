(function(){
function init(){
var section=document.querySelector('.ab-impact');if(!section||section.dataset.impactReady)return;
section.dataset.impactReady='true';
var gs=window.gsap,ST=window.ScrollTrigger;if(!gs||!ST)return;
gs.registerPlugin(ST);
var media=gs.matchMedia();
media.add('(prefers-reduced-motion: no-preference)',function(){
var context=gs.context(function(){
document.querySelectorAll('[data-impact-reveal]').forEach(function(el){gs.fromTo(el,{y:18,opacity:.45},{y:0,opacity:1,duration:.8,ease:'power2.out',clearProps:'transform,opacity',scrollTrigger:{trigger:el,start:'top 92%',once:true}});});
var words=section.querySelectorAll('.ai-term-word');
gs.fromTo(words,{color:'#8a9695'},{color:'#222222',stagger:.055,ease:'none',scrollTrigger:{trigger:section.querySelector('.ai-terms'),start:'top 88%',end:'bottom 56%',scrub:.6}});
gs.to(section,{'--impact-progress':'100%',ease:'none',scrollTrigger:{trigger:section.querySelector('.ai-equation'),start:'top 90%',end:'top 35%',scrub:.6}});
},section);
return function(){context.revert();};
});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){ST.refresh();});
}
if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});
})();
