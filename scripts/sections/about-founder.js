(function(){
function init(){
var card=document.querySelector('.ab-founder'),body=document.querySelector('#founder-story');if(!card||!body)return;
var track=card.closest('.ab-team-track'),team=card.closest('.ab-team'),toggle=card.querySelector('.founder-story-toggle'),title=body.querySelector('#founder-story-title'),label=toggle.querySelector('.fs-toggle-label'),returnButton=body.querySelector('.fs-return'),expanded=false;
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function refresh(){if(window.ScrollTrigger)window.ScrollTrigger.refresh();}
function change(open,focus){
expanded=open;track.classList.toggle('is-founder-expanded',open);card.classList.toggle('is-expanded',open);body.hidden=!open;
toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close William Lee’s founder story':'Read William Lee’s founder story');label.textContent=open?'Close story':'Read founder’s story';
track.setAttribute('aria-label',open?'William Lee founder story':'P10X leadership gallery. Use left and right arrow keys to browse.');
track.scrollLeft=0;
if(open){Array.from(track.querySelectorAll('.ab-person')).forEach(function(person){person.classList.toggle('ab-selected',person===card);});Array.from(team.querySelectorAll('.ab-team-navigation a[href^="#leader-"]')).forEach(function(link,i){if(i===0)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});}
requestAnimationFrame(function(){refresh();if(focus){if(open){title.focus({preventScroll:true});card.scrollIntoView({block:'start',behavior:reduced.matches?'auto':'smooth'});}else{toggle.focus({preventScroll:true});card.scrollIntoView({block:'start',behavior:reduced.matches?'auto':'smooth'});}}});
}
toggle.addEventListener('click',function(e){e.stopPropagation();change(!expanded,true);});
returnButton.addEventListener('click',function(){change(false,true);});
card.addEventListener('keydown',function(e){if(e.key==='Escape'&&expanded){e.preventDefault();e.stopPropagation();change(false,true);}});
team.addEventListener('click',function(e){if(expanded&&e.target.closest('.ab-team-navigation a[href^="#leader-"]'))change(false,false);},true);
body.addEventListener('animationend',refresh);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
