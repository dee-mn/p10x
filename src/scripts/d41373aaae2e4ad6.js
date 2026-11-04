
(function(){
function init(){return;
var team=document.querySelector('.p10x-about.ab-team');
if(!team||team.dataset.galleryReady)return;
team.dataset.galleryReady='1';
var track=team.querySelector('.ab-team-track'), nav=team.querySelector('.ab-team-navigation');
if(!track||!nav)return;
track.setAttribute('tabindex','0');track.setAttribute('role','region');track.setAttribute('aria-label','P10X leadership gallery');
var links=Array.from(nav.querySelectorAll('a[href^="#leader-"]'));
nav.addEventListener('click',function(ev){
var link=ev.target.closest('a[href^="#leader-"]');if(!link)return;
var card=team.querySelector(link.getAttribute('href'));if(!card)return;
ev.preventDefault();ev.stopPropagation();
var x=track.scrollLeft+card.getBoundingClientRect().left-track.getBoundingClientRect().left;
track.scrollTo({left:x,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
links.forEach(function(a){a.removeAttribute('aria-current')});link.setAttribute('aria-current','true');
team.querySelectorAll('.ab-person').forEach(function(c){c.classList.toggle('ab-selected',c===card)});
},true);
track.addEventListener('keydown',function(ev){
if(ev.target!==track||!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key))return;
ev.preventDefault();
var first=track.querySelector('.ab-person'),step=first.getBoundingClientRect().width+18;
var left=ev.key==='Home'?0:ev.key==='End'?track.scrollWidth:track.scrollLeft+(ev.key==='ArrowRight'?step:-step);
track.scrollTo({left:left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
