
(function(){
function initAbout(){
var hero=document.querySelector('.p10x-about.ab-hero');
if(!hero||hero.dataset.motionReady)return;
hero.dataset.motionReady='1';
var gs=window.gsap, ST=window.ScrollTrigger;
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
var desktop=window.matchMedia('(min-width:1025px) and (min-height:700px)');
var fine=window.matchMedia('(hover:hover) and (pointer:fine)');
var section=document.querySelector('.p10x-about.ab-journey');
var layout=section.querySelector('.ab-journey-layout');
var intro=section.querySelector('.ab-journey-intro');
var cards=Array.from(section.querySelectorAll('.ab-milestone'));
var orbit=document.createElement('div');
orbit.className='ab-hero-orbit';orbit.setAttribute('aria-hidden','true');
orbit.innerHTML='<i></i><i></i><i></i>';hero.querySelector('.ab-shell').appendChild(orbit);
var team=document.querySelector('.p10x-about.ab-team');
var track=team.querySelector('.ab-team-track');
var people=Array.from(track.querySelectorAll('.ab-person'));
var nav=team.querySelector('.ab-team-navigation');
var links=Array.from(nav.querySelectorAll('a[href^="#leader-"]'));
track.tabIndex=0;track.setAttribute('role','region');track.setAttribute('aria-label','P10X leadership gallery. Use left and right arrow keys to browse.');
var hint=document.createElement('p');hint.className='ab-drag-hint';
hint.textContent='Drag to explore / use the numbered controls';
nav.insertAdjacentElement('afterend',hint);
people.forEach(function(p){p.tabIndex=0;p.setAttribute('aria-label',p.querySelector('.ab-person-name').textContent.trim());});
function personOffset(p){return p.getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft;}
function markPerson(i){people.forEach(function(p,j){p.classList.toggle('ab-selected',j===i);});links.forEach(function(a,j){if(j===i)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
function goPerson(i){i=Math.max(0,Math.min(people.length-1,i));track.scrollTo({left:personOffset(people[i]),behavior:reduced.matches?'auto':'smooth'});markPerson(i);}
nav.addEventListener('click',function(e){var a=e.target.closest('a[href^="#leader-"]');if(!a)return;e.preventDefault();e.stopImmediatePropagation();goPerson(links.indexOf(a));},true);
track.addEventListener('keydown',function(e){if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();var i=people.findIndex(function(p){return p.classList.contains('ab-selected');});goPerson(e.key==='Home'?0:e.key==='End'?people.length-1:i+(e.key==='ArrowRight'?1:-1));});
people.forEach(function(p,i){p.addEventListener('focus',function(){goPerson(i);});});
var scrollTick=false;
track.addEventListener('scroll',function(){if(scrollTick)return;scrollTick=true;requestAnimationFrame(function(){scrollTick=false;var max=track.scrollWidth-track.clientWidth;if(track.scrollLeft>=max-5){markPerson(people.length-1);return;}var closest=0,d=Infinity;people.forEach(function(p,i){var n=Math.abs(personOffset(p)-track.scrollLeft);if(n<d){d=n;closest=i;}});markPerson(closest);});},{passive:true});
var drag=null, suppressClick=false;
track.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('a,button'))return;drag={x:e.clientX,y:e.clientY,left:track.scrollLeft,id:e.pointerId,moved:false};});
track.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-drag.x;if(!drag.moved&&Math.abs(dx)>6&&Math.abs(dx)>Math.abs(e.clientY-drag.y)){drag.moved=true;track.classList.add('ab-dragging');track.setPointerCapture(e.pointerId);}if(drag.moved){e.preventDefault();track.scrollLeft=drag.left-dx;}});
function endDrag(){if(!drag)return;var moved=drag.moved;drag=null;track.classList.remove('ab-dragging');if(moved){suppressClick=true;var closest=0,d=Infinity;people.forEach(function(p,i){var n=Math.abs(personOffset(p)-track.scrollLeft);if(n<d){d=n;closest=i;}});goPerson(closest);setTimeout(function(){suppressClick=false;},100);}}
track.addEventListener('pointerup',endDrag);track.addEventListener('pointercancel',endDrag);
track.addEventListener('click',function(e){if(suppressClick){e.preventDefault();e.stopImmediatePropagation();}},true);
track.addEventListener('dragstart',function(e){e.preventDefault();});
markPerson(0);
if(!gs||!ST)return;
gs.registerPlugin(ST);
var triggers=[],tweens=[],cleanups=[],active=-1,storyTrigger=null,storyNav=null;
function addTween(t){tweens.push(t);if(t.scrollTrigger)triggers.push(t.scrollTrigger);return t;}
function addTrigger(t){triggers.push(t);return t;}
function clearMotion(){gs.killTweensOf(cards);gs.killTweensOf(people);gs.set(document.querySelectorAll('.p10x-about .ab-hero-image,.p10x-about .ab-hero-orbit,.p10x-about .ab-standard'),{clearProps:'transform'});
triggers.forEach(function(t){t.kill();});triggers=[];tweens.forEach(function(t){t.kill();});tweens=[];
cleanups.forEach(function(fn){fn();});cleanups=[];storyTrigger=null;active=-1;
if(storyNav){storyNav.remove();storyNav=null;}
intro.querySelectorAll('.ab-story-progress,.ab-story-hint').forEach(function(n){n.remove();});
section.classList.remove('ab-story-live');
cards.forEach(function(c){c.removeAttribute('aria-hidden');c.inert=false;});
gs.set(cards,{clearProps:'transform,opacity,visibility'});
}
function buildMotion(){
clearMotion();if(reduced.matches)return;
addTween(gs.to(orbit,{rotation:55,y:100,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1.2}}));
var heroImage=hero.querySelector('.ab-hero-image img');
addTween(gs.fromTo(heroImage,{scale:1.04,yPercent:0},{scale:1.12,yPercent:5,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1.6}}));
if(desktop.matches){
section.classList.add('ab-story-live');
storyNav=document.createElement('div');storyNav.className='ab-story-nav';storyNav.setAttribute('role','navigation');storyNav.setAttribute('aria-label','Journey milestones');
cards.forEach(function(c,i){var b=document.createElement('button');b.type='button';b.textContent=c.querySelector('.ab-year').textContent.trim();b.setAttribute('aria-label',b.textContent+': '+c.querySelector('.ab-card-title').textContent.trim());b.addEventListener('click',function(){if(!storyTrigger)return;var y=storyTrigger.start+(storyTrigger.end-storyTrigger.start)*i/(cards.length-1)+1;window.scrollTo({top:y,behavior:'smooth'});});storyNav.appendChild(b);});
intro.appendChild(storyNav);
var progress=document.createElement('div');progress.className='ab-story-progress';progress.setAttribute('aria-hidden','true');progress.innerHTML='<span></span>';intro.appendChild(progress);
var storyHint=document.createElement('div');storyHint.className='ab-story-hint';storyHint.textContent='SCROLL THROUGH THE YEARS / OR SELECT A MILESTONE';intro.appendChild(storyHint);
function showCard(index,instant){
if(index===active)return;var prev=active;active=index;
cards.forEach(function(c,i){gs.killTweensOf(c);c.setAttribute('aria-hidden',i===index?'false':'true');c.inert=i!==index;if(i!==index&&i!==prev)gs.set(c,{autoAlpha:0});});
Array.from(storyNav.children).forEach(function(b,i){if(i===index)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
var direction=index>prev?1:-1;
if(prev>=0&&!instant)gs.to(cards[prev],{autoAlpha:0,x:-direction*35,rotationY:-direction*9,scale:.94,duration:.38,ease:'power2.inOut'});
else if(prev>=0)gs.set(cards[prev],{autoAlpha:0});
if(instant)gs.set(cards[index],{autoAlpha:1,x:0,y:0,rotationY:0,scale:1});
else gs.fromTo(cards[index],{autoAlpha:0,x:direction*55,rotationY:direction*12,scale:.95},{autoAlpha:1,x:0,rotationY:0,scale:1,duration:.6,ease:'power3.out'});
}
gs.set(cards,{autoAlpha:0});
showCard(0,true);
storyTrigger=addTrigger(ST.create({trigger:layout,start:'top 105px',end:function(){return '+='+Math.max(6000,(cards.length-1)*window.innerHeight*1.25);},pin:layout,pinSpacing:true,invalidateOnRefresh:true,anticipatePin:1,onUpdate:function(self){progress.style.setProperty('--story-progress',String(self.progress));showCard(Math.round(self.progress*(cards.length-1)),false);},onRefresh:function(self){progress.style.setProperty('--story-progress',String(self.progress));showCard(Math.round(self.progress*(cards.length-1)),true);}}));
}else{
cards.forEach(function(c){addTween(gs.fromTo(c,{y:28},{y:0,ease:'none',scrollTrigger:{trigger:c,start:'top 90%',end:'top 50%',scrub:1}}));});
}
document.querySelectorAll('.p10x-about .ab-value').forEach(function(row){addTrigger(ST.create({trigger:row,start:'top 88%',end:'top 40%',scrub:true,onUpdate:function(self){row.style.setProperty('--value-progress',String(self.progress));}}));});
document.querySelectorAll('.p10x-about .ab-standard').forEach(function(card,i){addTween(gs.fromTo(card,{y:32,rotation:0},{y:0,rotation:0,ease:'none',scrollTrigger:{trigger:card,start:'top 95%',end:'top 48%',scrub:1}}));});
if(fine.matches){
people.forEach(function(card){
function move(e){if(drag&&drag.moved)return;var r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--pointer-x',x*100+'%');card.style.setProperty('--pointer-y',y*100+'%');gs.to(card,{rotationY:(x-.5)*10,rotationX:(.5-y)*7,y:-5,duration:.35,ease:'power2.out',overwrite:'auto'});}
function leave(){gs.to(card,{rotationY:0,rotationX:0,y:0,duration:.5,ease:'power3.out',overwrite:'auto'});}
card.addEventListener('pointermove',move);card.addEventListener('pointerleave',leave);
cleanups.push(function(){card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);gs.killTweensOf(card);gs.set(card,{clearProps:'transform'});});
});
}
ST.refresh();
}
var tabs=document.querySelector('.ab-pillar-tabs');
tabs.addEventListener('click',function(e){if(reduced.matches||!e.target.closest('[role="tab"]'))return;requestAnimationFrame(function(){var panel=tabs.querySelector('.elementor-tab-content.elementor-active');if(panel)gs.fromTo(panel,{opacity:.35,x:25,rotationY:5},{opacity:1,x:0,rotationY:0,duration:.55,ease:'power3.out',clearProps:'transform,opacity',overwrite:true});});});
buildMotion();
function motionChange(){buildMotion();}
if(reduced.addEventListener){reduced.addEventListener('change',motionChange);desktop.addEventListener('change',motionChange);fine.addEventListener('change',motionChange);}
else{reduced.addListener(motionChange);desktop.addListener(motionChange);fine.addListener(motionChange);}
document.querySelectorAll('.p10x-about img').forEach(function(img){if(!img.complete)img.addEventListener('load',function(){ST.refresh();},{once:true});});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){ST.refresh();});
}
if(document.readyState==='complete')initAbout();else window.addEventListener('load',initAbout,{once:true});
})();
