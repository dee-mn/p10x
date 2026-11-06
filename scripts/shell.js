(() => {
  'use strict';
  const header=document.querySelector('.site-header'),menu=document.getElementById('site-menu'),toggle=document.querySelector('.menu-toggle');
  toggle.addEventListener('click',()=>{menu.showModal();document.documentElement.classList.add('menu-open');document.body.classList.add('p10x-menu-is-open');toggle.setAttribute('aria-expanded','true');});
  menu.querySelector('.menu-close').addEventListener('click',()=>menu.close());
  menu.addEventListener('close',()=>{document.documentElement.classList.remove('menu-open');document.body.classList.remove('p10x-menu-is-open');toggle.setAttribute('aria-expanded','false');toggle.focus({preventScroll:true});});
  menu.addEventListener('click',e=>{if(e.target.closest('a[href]'))menu.close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('details[open]').forEach(n=>n.open=false);});
  document.addEventListener('click',e=>document.querySelectorAll('.service-menu[open]').forEach(n=>{if(!n.contains(e.target))n.open=false;}));
  const back=document.querySelector('.back-top');let queued=false;
  function update(){queued=false;header.classList.toggle('is-scrolled',scrollY>40);back?.classList.toggle('is-visible',scrollY>innerHeight*.8);}
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});update();
  const form=document.getElementById('contact-form');if(!form)return;
  const status=form.querySelector('.form-status');
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const button=form.querySelector('button[type="submit"]');button.disabled=true;status.textContent='Sending your enquiry…';
    try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});const result=await response.json();status.textContent=result.message||'Unable to send. Please email info@p10x.my.';if(response.ok&&result.ok)form.reset();}
    catch(_){status.textContent='Unable to send right now. Please email info@p10x.my.';}
    finally{button.disabled=false;}
  });
})();
