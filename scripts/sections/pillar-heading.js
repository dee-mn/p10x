(()=>{
const root=document.querySelector('.view-20 .block-559aab1b');if(!root)return;
function mount(){
const panel=root.querySelector('.view-6793')?.parentElement;
const videoLayer=root.querySelector('.surface-background-video-container');
if(panel&&videoLayer){videoLayer.classList.add('p10x-pillar-video');panel.prepend(videoLayer);}
const widget=root.querySelector('.block-7b197f1');if(!widget||widget.querySelector('.p10x-pillar-heading'))return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const names=['Academy','Retail','Distribution','Media','Car Check'];
const descriptions=['Developing the people behind great workmanship.','Thoughtful car care, delivered by skilled hands.','Trusted film solutions for automotive businesses.','Telling automotive stories with a human touch.','A closer look, for greater peace of mind.'];
const section=document.createElement('section');section.className='p10x-pillar-heading';section.setAttribute('aria-label','Powered by five strong pillars');
section.innerHTML='<p class="p10x-powered"><span class="p10x-powered-mark" aria-hidden="true"><i style="--h:10px"></i><i style="--h:17px"></i><i style="--h:25px"></i><i style="--h:17px"></i><i style="--h:10px"></i></span>Powered by</p><h2>Five strong pillars.</h2><div class="p10x-pillar-nav" aria-label="Explore our five divisions"></div><p class="p10x-pillar-caption" aria-live="polite">Different strengths. One shared standard.</p>';
const nav=section.querySelector('.p10x-pillar-nav'),caption=section.querySelector('.p10x-pillar-caption');
names.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.setAttribute('aria-pressed','false');b.setAttribute('aria-controls','p10x-pillar-caption');function choose(){nav.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));if(caption.textContent===descriptions[i])return;caption.textContent=descriptions[i];if(!reduced.matches&&window.gsap)gsap.fromTo(caption,{y:5},{y:0,duration:.35,ease:'power2.out',overwrite:true});}b.addEventListener('pointerenter',choose);b.addEventListener('focus',choose);b.addEventListener('click',choose);nav.appendChild(b);});caption.id='p10x-pillar-caption';
widget.appendChild(section);widget.classList.add('p10x-heading-ready');
if(!reduced.matches&&window.gsap&&window.SplitText&&window.ScrollTrigger){
const title=section.querySelector('h2');gsap.registerPlugin(SplitText,ScrollTrigger);const split=new SplitText(title,{type:'lines,words,chars',linesClass:'split-line'});title.setAttribute('aria-label','Five strong pillars.');split.chars.forEach(c=>c.setAttribute('aria-hidden','true'));
split.revert();title.classList.add('ui-slip-text-color','is-splitted');title.style.setProperty('--ui-title-color-start','#ffffff33');title.style.setProperty('--ui-title-color-end','#ffffff');
const lines=new SplitText(title,{type:'lines',linesClass:'ui-line'}).lines;
lines.forEach(line=>{const chars=new SplitText(line,{type:'chars',charsClass:'ui-char'}).chars;chars.forEach(c=>c.setAttribute('aria-hidden','true'));gsap.set(chars,{color:'var(--ui-title-color-start)',willChange:'color'});gsap.timeline({scrollTrigger:{trigger:line,start:'top center',end:'bottom center',scrub:.3}}).to(chars,{color:'var(--ui-title-color-end)',stagger:.1,ease:'none'});});
}
}
if(document.readyState==='complete')mount();else window.addEventListener('load',mount,{once:true});
})();