(function(){
 'use strict';
 function init(){
  const root=document.querySelector('.p10x-faq');if(!root||root.dataset.fqReady)return;
  const accordion=root.querySelector('.fq-accordion .ui-accordion');if(!accordion)return;
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
  const input=root.querySelector('#fq-search'),clear=root.querySelector('.fq-clear'),filters=Array.from(root.querySelectorAll('[data-fq-topic]'));
  const heading=root.querySelector('#fq-results-title'),status=root.querySelector('.fq-status'),more=root.querySelector('.fq-more'),empty=root.querySelector('.fq-empty');
  const items=Array.from(accordion.querySelectorAll('.ui--item'));let topic='all',limit=12,matches=[];
  const normalize=s=>s.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const buttons=items.map((item,i)=>{
   const title=item.querySelector('.ui-accordion--title'),panel=item.querySelector('.ui-accordion--content'),meta=panel.querySelector('[data-fq-category]');
   const category=meta.dataset.fqCategory;item.dataset.fqCategory=category;
   item.dataset.fqSearch=normalize(title.textContent+' '+panel.textContent+' '+category+(category==='ppf'?' paint protection film':''));
   const button=document.createElement('button');button.type='button';button.className='fq-toggle';button.id='fq-toggle-'+i;
   while(title.firstChild)button.append(title.firstChild);title.append(button);
   button.setAttribute('aria-controls',panel.id);button.setAttribute('aria-expanded','false');
   panel.setAttribute('aria-labelledby',button.id);
   const number=item.querySelector('.ui-item--number');if(number){number.setAttribute('aria-hidden','true');const label=document.createElement('span');label.className='fq-item-topic';label.textContent=category==='general'?'General':category==='ppf'?'PPF':category==='coating'?'Coating':'Tinting';number.append(label);}
   button.addEventListener('keydown',event=>{const visible=buttons.filter((b,n)=>!items[n].hidden);let n=visible.indexOf(button);if(event.key==='ArrowDown')n=(n+1)%visible.length;else if(event.key==='ArrowUp')n=(n+visible.length-1)%visible.length;else if(event.key==='Home')n=0;else if(event.key==='End')n=visible.length-1;else return;event.preventDefault();visible[n].focus();});
   panel.addEventListener('click',event=>event.stopPropagation());
   return button;
  });
  filters.forEach(filter=>{const count=filter.querySelector('.fq-filter-count');if(!count)return;const total=items.filter(item=>filter.dataset.fqTopic==='all'||item.dataset.fqCategory===filter.dataset.fqTopic).length;count.textContent=String(total);count.setAttribute('aria-label',total+' question'+(total===1?'':'s'));});
  function sync(){items.forEach((item,i)=>buttons[i].setAttribute('aria-expanded',String(item.classList.contains('active'))));}
  new MutationObserver(sync).observe(accordion,{attributes:true,subtree:true,attributeFilter:['class']});sync();
  accordion.addEventListener('click',()=>setTimeout(refresh,460));
  function refresh(){if(window.ScrollTrigger)window.ScrollTrigger.refresh();}
  function update(animate){
   const words=normalize(input.value).split(' ').filter(Boolean);
   matches=items.filter(item=>(topic==='all'||item.dataset.fqCategory===topic)&&words.every(word=>item.dataset.fqSearch.includes(word)));
   const visible=new Set(matches.slice(0,limit));items.forEach(item=>item.hidden=!visible.has(item));
   const labels={all:'All questions',general:'General',ppf:'Paint protection film',coating:'Coating',tinting:'Tinting'};
   heading.textContent=words.length?'Search results':labels[topic];
   filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.fqTopic===topic)));
   status.textContent=matches.length?'Showing '+Math.min(limit,matches.length)+' of '+matches.length+' question'+(matches.length===1?'':'s'):'No matching questions';
   clear.hidden=!input.value;empty.hidden=matches.length!==0;more.hidden=limit>=matches.length;accordion.hidden=matches.length===0;
   more.textContent='Show '+Math.min(12,Math.max(0,matches.length-limit))+' more questions';
   if(animate&&!reduced.matches&&window.gsap)gsap.fromTo(matches.slice(0,limit),{opacity:.45,y:8},{opacity:1,y:0,duration:.35,stagger:.018,overwrite:true,ease:'power2.out',clearProps:'opacity,transform'});
   requestAnimationFrame(refresh);
  }
  filters.forEach(button=>button.addEventListener('click',()=>{topic=button.dataset.fqTopic;limit=12;update(true);const head=root.querySelector('.fq-results-head');if(head.getBoundingClientRect().top<115)head.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});}));
  let searchTimer;input.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{limit=12;update(false);},120);});
  function reset(){clearTimeout(searchTimer);input.value='';topic='all';limit=12;update(false);input.focus({preventScroll:true});}
  clear.addEventListener('click',()=>{clearTimeout(searchTimer);input.value='';limit=12;update(false);input.focus({preventScroll:true});});
  input.addEventListener('keydown',event=>{if(event.key==='Escape'&&input.value){event.preventDefault();clear.click();}});
  root.querySelector('.fq-reset').addEventListener('click',reset);
  more.addEventListener('click',()=>{const previous=limit;limit+=12;update(false);const next=matches[previous];if(next){next.querySelector('.fq-toggle').focus({preventScroll:true});next.scrollIntoView({block:'nearest',behavior:reduced.matches?'instant':'smooth'});}});
  root.querySelectorAll('.heading-title').forEach(el=>{if(!el.hasAttribute('aria-label'))el.setAttribute('aria-label',el.innerText.replace(/\s+/g,' ').trim());});
  root.dataset.fqReady='true';update(false);
  if(window.gsap&&!reduced.matches){gsap.from(root.querySelector('.fq-intro-copy'),{opacity:0,y:22,duration:1,ease:'power3.out',delay:.15});if(window.ScrollTrigger)gsap.from(root.querySelector('.fq-tools'),{opacity:0,y:22,duration:.8,ease:'power3.out',scrollTrigger:{trigger:root.querySelector('.fq-tools'),start:'top 92%',once:true}});}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(refresh);
 }
 if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});
})();
