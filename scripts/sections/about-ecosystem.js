(function(){
function init(){
var root=document.querySelector('[data-ecosystem-explorer]');if(!root||root.dataset.enhanced)return;
var tabs=Array.from(root.querySelectorAll('.ae-tab')),scenes=Array.from(root.querySelectorAll('.ae-scene')),list=root.querySelector('.ae-tabs'),stage=root.querySelector('.ae-stage'),counter=root.querySelector('.ae-counter b'),status=root.querySelector('.ae-announcement'),active=0,hoverTimer,swipe=null;
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function choose(index,announce){
active=(index+tabs.length)%tabs.length;
tabs.forEach(function(tab,i){tab.setAttribute('aria-selected',String(i===active));tab.tabIndex=i===active?0:-1;});
scenes.forEach(function(scene,i){scene.classList.toggle('is-active',i===active);scene.setAttribute('aria-hidden',String(i!==active));scene.inert=i!==active;scene.tabIndex=i===active?0:-1;});
counter.textContent=String(active+1).padStart(2,'0');
if(announce)status.textContent=tabs[active].querySelector('.ae-tab-label').firstChild.textContent+'. Pillar '+(active+1)+' of '+tabs.length+'.';
if(window.matchMedia('(max-width:767px)').matches){var tab=tabs[active],left=tab.offsetLeft-list.offsetLeft;if(left<list.scrollLeft)list.scrollTo({left:left-3,behavior:reduced.matches?'auto':'smooth'});else if(left+tab.offsetWidth>list.scrollLeft+list.clientWidth)list.scrollTo({left:left+tab.offsetWidth-list.clientWidth+3,behavior:reduced.matches?'auto':'smooth'});}
}
function clearHover(){window.clearTimeout(hoverTimer);}
tabs.forEach(function(tab,i){
tab.addEventListener('click',function(){clearHover();choose(i,true);});
tab.addEventListener('pointerenter',function(e){if(e.pointerType!=='mouse'||!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;clearHover();hoverTimer=window.setTimeout(function(){choose(i,false);},140);});
tab.addEventListener('pointerleave',clearHover);
tab.addEventListener('keydown',function(e){var next=i;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=i+1;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=i-1;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();clearHover();choose(next,true);tabs[active].focus({preventScroll:true});});
});
root.querySelector('.ae-prev').addEventListener('click',function(){clearHover();choose(active-1,true);});
root.querySelector('.ae-next').addEventListener('click',function(){clearHover();choose(active+1,true);});
stage.addEventListener('pointerdown',function(e){if(e.pointerType==='touch')swipe={x:e.clientX,y:e.clientY,id:e.pointerId};});
stage.addEventListener('pointerup',function(e){if(!swipe||e.pointerId!==swipe.id)return;var dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)choose(active+(dx<0?1:-1),true);});
stage.addEventListener('pointercancel',function(){swipe=null;});
function orientation(){list.setAttribute('aria-orientation',window.matchMedia('(max-width:767px)').matches?'horizontal':'vertical');}
scenes.forEach(function(scene){scene.setAttribute('role','tabpanel');});
choose(0,false);root.dataset.enhanced='true';root.querySelector('.ae-selector').hidden=false;root.querySelector('.ae-stage-footer').hidden=false;orientation();window.addEventListener('resize',orientation,{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
