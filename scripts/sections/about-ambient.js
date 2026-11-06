(function(){
function init(){
document.querySelectorAll('.p10x-about').forEach(function(section){
if(section.querySelector('.ab-atmosphere'))return;
var host=section.classList.contains('ab-hero')?section.querySelector('.ab-shell'):section.classList.contains('ab-journey')?section.querySelector('.ab-journey-layout'):section;
var layer=document.createElement('div');layer.className='ab-atmosphere';layer.setAttribute('aria-hidden','true');
layer.innerHTML='<i class="ab-ambient-glow"></i><i class="ab-contour"></i><i class="ab-ambient-grid"></i><i class="ab-grain"></i>';host.prepend(layer);
var visible=false;
function sync(){layer.classList.toggle('ab-ambient-visible',visible&&!document.hidden);}
if('IntersectionObserver' in window){var observer=new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;sync();},{rootMargin:'100px'});observer.observe(layer);}else{visible=true;sync();}
document.addEventListener('visibilitychange',sync);
});
}
if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});
})();