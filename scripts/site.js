/* Standalone enhancements; no WordPress API or image-upload dependency. */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.pxl-scroll-top').forEach(control => {
    control.setAttribute('aria-label', 'Back to top');
    control.setAttribute('title', 'Back to top');
    control.querySelector('i')?.remove();
    control.insertAdjacentHTML('afterbegin', '<svg class="p10x-top-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="5 12 12 5 19 12"/><line x1="12" y1="5" x2="12" y2="20"/></svg>');
  });
  document.querySelectorAll('[aria-required="true"]').forEach(field => {
    field.required = true;
    if (!field.getAttribute('aria-label')) field.setAttribute('aria-label', field.placeholder || field.name);
  });
  document.querySelectorAll('[data-p10x-contact]').forEach(form => {
    form.removeAttribute('novalidate');
    const status = form.querySelector('.wpcf7-response-output');
    if (status) { status.setAttribute('role','status');status.removeAttribute('aria-hidden'); }
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type="submit"]');
      if (button.disabled) return;
      button.disabled = true;
      if(status){status.style.display='block';status.textContent='Sending your enquiry…';}
      const data = new FormData();
      for(const field of form.querySelectorAll('input,textarea')) {
        const key=field.type==='email'?'email':field.type==='tel'?'phone':field.tagName==='TEXTAREA'?'message':field.name==='website'?'website':field.type==='text'?'name':null;
        if(key) data.set(key,field.value);
      }
      try {
        const response = await fetch('/contact.php',{method:'POST',body:data,headers:{'Accept':'application/json'}});
        const result = await response.json();
        if(!response.ok || !result.ok) throw new Error(result.message || 'Unable to send. Please email info@p10x.my.');
        if(status)status.textContent='Thank you. Your enquiry has been sent.';
        form.reset();
      } catch(error) {
        if(status){status.replaceChildren(document.createTextNode(error.message+' '));const link=document.createElement('a');link.href='mailto:info@p10x.my';link.textContent='Email P10X';status.append(link);}
      } finally {button.disabled=false;}
    });
  });
  // Resolve old brochure links to the migrated routes.
  document.querySelectorAll('a[href="/category/p10x-insights/"]').forEach(a=>a.href='/insights/');
  const query = new URLSearchParams(location.search).get('s');
  const news = document.querySelector('[data-p10x-news]');
  if(news) {
    const cards = [...news.querySelectorAll('.pxl-grid-item')];
    const more = news.querySelector('[data-p10x-load-more]');
    const status = news.querySelector('[data-p10x-news-status]');
    if(query && query.trim()) {
      const words = query.toLowerCase().trim().split(/\s+/);
      let count = 0;
      cards.forEach(card => {
        card.hidden = !words.every(word => card.textContent.toLowerCase().includes(word));
        if(!card.hidden) count++;
      });
      if(more) more.hidden = true;
      if(status) status.textContent = `${count} ${count === 1 ? 'article' : 'articles'} found for “${query}”.`;
    } else {
      cards.forEach(card => {card.hidden = card.hasAttribute('data-p10x-more');});
      if(more) {
        more.hidden = !cards.some(card => card.hidden);
        more.addEventListener('click', () => {
          cards.forEach(card => {card.hidden = false;});
          more.hidden = true;
          if(status) status.textContent = `Showing all ${cards.length} articles.`;
        });
      }
    }
  }
  if(query && location.pathname.startsWith('/insights')) {
    const input=document.querySelector('input[type="search"],input[placeholder*="Search"]');
    if(input){input.value=query;input.dispatchEvent(new Event('input',{bubbles:true}));}
  }
});
