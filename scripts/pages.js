(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const smooth=()=>reduced.matches?'instant':'smooth';
  document.querySelector('.p10x-wrap')?.classList.add('wr-enhanced');
  document.querySelector('.p10x-detail')?.classList.add('dt-enhanced');
  document.querySelector('.p10x-window')?.classList.add('wf-enhanced');
  document.querySelectorAll('[role="tablist"]').forEach(list=>{
    const tabs=[...list.querySelectorAll('[role="tab"]')];
    const panels=tabs.map(tab=>document.getElementById(tab.getAttribute('aria-controls')));
    if(!tabs.length||panels.some(p=>!p))return;
    function choose(i,focus=false){tabs.forEach((tab,n)=>{tab.setAttribute('aria-selected',String(i===n));tab.tabIndex=i===n?0:-1;tab.classList.toggle('is-active',i===n);panels[n].hidden=i!==n;panels[n].classList.toggle('is-active',i===n);});if(focus)tabs[i].focus({preventScroll:true});}
    tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>choose(i));tab.addEventListener('keydown',e=>{const next={ArrowRight:(i+1)%tabs.length,ArrowLeft:(i+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1};if(!(e.key in next))return;e.preventDefault();choose(next[e.key],true);});});
    choose(Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true')));
  });
  document.querySelectorAll('.wf-space-toggle').forEach(button=>{
    const panel=document.getElementById(button.getAttribute('aria-controls'));if(!panel)return;
    function set(open){button.setAttribute('aria-expanded',String(open));panel.hidden=!open;button.closest('.wf-space')?.classList.toggle('is-open',open);}
    button.addEventListener('click',()=>set(button.getAttribute('aria-expanded')!=='true'));set(button.getAttribute('aria-expanded')==='true');
  });
  const thumbs=[...document.querySelectorAll('.dt-thumb')],detailPanels=[...document.querySelectorAll('.dt-panel')];
  if(thumbs.length&&thumbs.length===detailPanels.length){
    function choose(i){thumbs.forEach((t,n)=>{t.classList.toggle('is-active',n===i);t.setAttribute('aria-pressed',String(n===i));detailPanels[n].classList.toggle('is-active',n===i);detailPanels[n].hidden=n!==i;});}
    thumbs.forEach((t,i)=>{t.setAttribute('role','button');t.tabIndex=0;t.setAttribute('aria-label',t.textContent.trim()||`View detail ${i+1}`);t.addEventListener('click',()=>choose(i));t.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(i);}else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=(i+(e.key==='ArrowRight'?1:-1)+thumbs.length)%thumbs.length;choose(n);thumbs[n].focus({preventScroll:true});}});});choose(0);
  }
  const tracks=[['.pp-track','.pp-gallery-prev','.pp-gallery-next'],['.wr-look-track','.wr-gallery-prev','.wr-gallery-next'],['.ab-team-track','.ab-team-prev','.ab-team-next']];
  tracks.forEach(([trackSelector,previous,next])=>{
    const track=document.querySelector(trackSelector);if(!track)return;
    const move=direction=>{const card=track.firstElementChild;track.scrollBy({left:direction*((card?.getBoundingClientRect().width||track.clientWidth)*.95),behavior:smooth()});};
    document.querySelector(previous)?.addEventListener('click',e=>{e.preventDefault();move(-1);});document.querySelector(next)?.addEventListener('click',e=>{e.preventDefault();move(1);});
    track.addEventListener('scroll',()=>{const status=document.querySelector('.pp-gallery-status');if(!status)return;const n=Math.min(track.children.length,Math.round(track.scrollLeft/Math.max(1,track.scrollWidth/track.children.length))+1);status.textContent=`${String(n).padStart(2,'0')} / ${String(track.children.length).padStart(2,'0')}`;},{passive:true});
  });
  document.querySelectorAll('.ab-team-navigation a').forEach(a=>a.addEventListener('click',e=>{const href=a.getAttribute('href');if(!href?.startsWith('#'))return;const card=document.getElementById(href.slice(1));const track=document.querySelector('.ab-team-track');if(!card||!track)return;e.preventDefault();track.scrollTo({left:card.offsetLeft-track.offsetLeft,behavior:smooth()});a.parentElement.querySelectorAll('a').forEach(x=>x.setAttribute('aria-current',String(x===a)));}));
  const steps=[...document.querySelectorAll('.pp-step')],stage=document.querySelector('.pp-stage-image img');
  if(steps.length&&stage){
    stage.closest('.pp-stage-image')?.classList.add('is-active');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const i=steps.indexOf(entry.target),image=entry.target.querySelector('img');if(image){stage.src=image.src;stage.alt=image.alt;}document.querySelectorAll('.pp-stage-tabs a').forEach((a,n)=>a.classList.toggle('is-active',i===n));const count=document.querySelector('.pp-stage-count');if(count)count.textContent=`0${i+1} / 0${steps.length}`;}),{rootMargin:'-20% 0px -40% 0px'});
    steps.forEach(step=>observer.observe(step));
  }

  const videoObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){if(!target.src){target.src=target.dataset.src;target.load();}if(!reduced.matches&&!document.hidden)target.play().catch(()=>{});}else target.pause();}),{rootMargin:'150px',threshold:.05});
  document.querySelectorAll('.page-video').forEach(v=>videoObserver.observe(v));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)document.querySelectorAll('video').forEach(v=>v.pause());});

  function searchable({inputSelector,itemSelector,moreSelector,statusSelector,emptySelector,size,filters}){
    const input=document.querySelector(inputSelector);if(!input)return;
    const items=[...document.querySelectorAll(itemSelector)],more=document.querySelector(moreSelector),status=document.querySelector(statusSelector),empty=document.querySelector(emptySelector);
    const searchable=items.map(item=>item.textContent.toLocaleLowerCase());let category='all',limit=size;
    function update(){const query=input.value.trim().toLocaleLowerCase();let count=0,shown=0;items.forEach((item,i)=>{const matches=(!query||searchable[i].includes(query))&&(category==='all'||item.dataset.category===category);if(matches)count++;const visible=matches&&shown<limit;item.hidden=!visible;if(visible)shown++;if(!visible&&item.tagName==='DETAILS')item.open=false;});more.hidden=shown>=count;empty.hidden=count!==0;status.textContent=`Showing ${shown} of ${count} ${itemSelector==='[data-article]'?'articles':'questions'}`;}
    input.addEventListener('input',()=>{limit=size;update();});more.addEventListener('click',()=>{limit+=size;update();});
    document.querySelector('[data-clear-search]')?.addEventListener('click',()=>{input.value='';limit=size;update();input.focus();});
    document.querySelector('[data-reset-questions]')?.addEventListener('click',()=>{input.value='';category='all';limit=size;document.querySelectorAll('[data-category-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.categoryFilter==='all')));update();});
    if(filters)document.querySelectorAll('[data-category-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.categoryFilter;limit=size;document.querySelectorAll('[data-category-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update();}));update();
  }
  searchable({inputSelector:'#question-search',itemSelector:'.question',moreSelector:'.question-more',statusSelector:'.question-status',emptySelector:'.question-empty',size:12,filters:true});
  searchable({inputSelector:'#article-search',itemSelector:'[data-article]',moreSelector:'.article-more',statusSelector:'.article-status',emptySelector:'.article-empty',size:6});

  const inspect=[...document.querySelectorAll('.pp-gallery-photo img,.wr-look-photo img,.dt-view-photo img,.ti-detail-photo img')];
  document.querySelectorAll('a[href^="/assets/images/"]').forEach(a=>{const image=a.querySelector('img');if(image&&!inspect.includes(image))inspect.push(image);});
  if(inspect.length){
    const dialog=document.createElement('dialog');dialog.className='image-dialog';dialog.innerHTML='<button type="button" aria-label="Close photograph"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><img alt=""><p></p>';document.body.append(dialog);dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    inspect.forEach(image=>{const control=image.closest('a')||image;if(control===image){control.tabIndex=0;control.setAttribute('role','button');control.setAttribute('aria-label',`View photograph: ${image.alt||'P10X workmanship'}`);}function open(e){e.preventDefault();const full=dialog.querySelector('img');full.src=image.src;full.alt=image.alt;dialog.querySelector('p').textContent=image.alt;dialog.showModal();}control.addEventListener('click',open);if(control===image)control.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')open(e);});});
  }
  if(!reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.animate([{opacity:.4,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:1000,easing:'cubic-bezier(.16,1,.3,1)'});observer.unobserve(entry.target);}),{threshold:.2});document.querySelectorAll('.ab-section-title,.pp-section-head,.wr-section-head,.ti-section-head,.dt-section-head,.wf-section-head').forEach(n=>observer.observe(n));}
})();
