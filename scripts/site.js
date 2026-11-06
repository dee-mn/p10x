(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767px)');
  const header = document.querySelector('.site-header');
  const menu = document.getElementById('site-menu');
  const toggle = document.querySelector('.menu-toggle');
  function closeMenu() { menu.close(); }
  toggle.addEventListener('click', () => {
    menu.showModal();
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('p10x-menu-is-open');
    toggle.setAttribute('aria-expanded', 'true');
  });
  menu.querySelector('.menu-close').addEventListener('click', closeMenu);
  menu.addEventListener('close', () => {
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('p10x-menu-is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus({preventScroll: true});
  });
  menu.addEventListener('click', e => {
    if (e.target.closest('a[href]')) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('details[open]').forEach(el => el.removeAttribute('open'));
  });
  document.addEventListener('click', e => {
    document.querySelectorAll('details[open]').forEach(el => {
      if (!el.contains(e.target)) el.removeAttribute('open');
    });
  });

  function tabList(root, onSelect) {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    function select(i, focus = false) {
      tabs.forEach((tab, n) => {
        tab.setAttribute('aria-selected', String(n === i));
        tab.tabIndex = n === i ? 0 : -1;
      });
      onSelect(tabs[i], i);
      if (focus) tabs[i].focus({preventScroll: true});
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', e => {
        const actions = {ArrowRight:(i + 1) % tabs.length, ArrowLeft:(i + tabs.length - 1) % tabs.length, Home:0, End:tabs.length - 1};
        if (!(e.key in actions)) return;
        e.preventDefault(); select(actions[e.key], true);
      });
    });
  }
  const detail = document.getElementById('division-detail');
  tabList(document.querySelector('.division-tabs'), tab => {
    detail.textContent = tab.dataset.detail;
    detail.setAttribute('aria-labelledby', tab.id);
    if (!reduced.matches) detail.animate([{opacity:.3,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}], {duration:550,easing:'cubic-bezier(.16,1,.3,1)'});
  });

  const news = document.querySelector('.news-track');
  document.querySelectorAll('[data-news]').forEach(button => button.addEventListener('click', () => {
    const card = news.querySelector('.news-card');
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(news).gap);
    let left = news.scrollLeft + Number(button.dataset.news) * step;
    if (left > news.scrollWidth - news.clientWidth + 10) left = 0;
    if (left < -10) left = news.scrollWidth;
    news.scrollTo({left, behavior:reduced.matches?'instant':'smooth'});
  }));

  const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      if (!video.getAttribute('src')) { video.src = video.dataset.src; video.load(); }
      if (!reduced.matches && !document.hidden) video.play().catch(() => {});
    } else video.pause();
  }), {threshold:.05,rootMargin:'150px'});
  document.querySelectorAll('.lazy-video').forEach(video => videoObserver.observe(video));
  document.addEventListener('visibilitychange', () => {
    document.querySelectorAll('.lazy-video').forEach(video => {
      if (document.hidden) video.pause();
      else {
        const b = video.getBoundingClientRect();
        if (b.bottom > 0 && b.top < innerHeight && video.src && !reduced.matches) video.play().catch(() => {});
      }
    });
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) document.querySelectorAll('video').forEach(video => video.pause());
    requestTick();
  });

  const pillarSection = document.querySelector('.pillars');
  const pillarTrack = document.querySelector('.pillar-track');
  const pillarCards = [...document.querySelectorAll('.pillar-card')];
  const pillarButtons = [...document.querySelectorAll('[data-pillar]')];
  pillarButtons.forEach((button, i) => button.addEventListener('click', () => {
    if (mobile.matches || reduced.matches) pillarTrack.scrollTo({left:pillarCards[i].offsetLeft - (innerWidth - pillarCards[i].offsetWidth) / 2,behavior:reduced.matches?'instant':'smooth'});
    else {
      const b = pillarSection.getBoundingClientRect();
      window.scrollTo({top:scrollY + b.top + (pillarSection.offsetHeight - innerHeight) * (i / 4),behavior:'smooth'});
    }
  }));
  pillarTrack.addEventListener('scroll', () => {
    if (!mobile.matches) return;
    const center = pillarTrack.scrollLeft + pillarTrack.clientWidth / 2;
    let nearest = 0, distance = Infinity;
    pillarCards.forEach((card, i) => { const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center); if (d < distance) { distance = d; nearest = i; } });
    pillarButtons.forEach((button, i) => button.setAttribute('aria-current', String(i === nearest)));
  },{passive:true});

  const services = document.querySelector('.services');
  const serviceTrack = document.querySelector('.service-track');
  const film = document.querySelector('.film-section');
  const backTop = document.querySelector('.back-top');
  const marquee = document.querySelector('.service-marquee');
  const clamp = (v, min=0, max=1) => Math.min(max,Math.max(min,v));
  const revealTitles = [...document.querySelectorAll('[data-reveal]')].map(title => {
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const nodes = []; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(word => {
        if (!word.trim()) { fragment.append(word); return; }
        const span = document.createElement('span');span.className='reveal-word';span.textContent=word;fragment.append(span);
      });
      node.replaceWith(fragment);
    });
    return {title, words:[...title.querySelectorAll('.reveal-word')]};
  });
  let queued = false;
  function update() {
    queued = false;
    header.classList.toggle('is-scrolled',scrollY > 40);
    backTop.classList.toggle('is-visible',scrollY > innerHeight * .8);
    if (!reduced.matches) {
      revealTitles.forEach(({title,words}) => {
        const b = title.getBoundingClientRect();
        if (b.bottom < 0 || b.top > innerHeight) return;
        const progress = clamp((innerHeight * .86 - b.top) / (innerHeight * .48));
        words.forEach((word,i) => word.style.setProperty('--word-opacity',String(.2 + .8 * clamp(progress * (words.length + 3) - i,0,1))));
      });
      if (!mobile.matches) {
        const p = clamp(-pillarSection.getBoundingClientRect().top / Math.max(1,pillarSection.offsetHeight - innerHeight));
        const step = pillarCards[0].offsetWidth + parseFloat(getComputedStyle(pillarTrack).gap);
        pillarTrack.style.transform = `translateX(${-p * step * 4}px)`;
        pillarCards.forEach((card,i) => {
          const d = i - p * 4;
          card.style.setProperty('--angle',`${clamp(d,-2,2)*10}deg`);
          card.style.setProperty('--drop',`${Math.abs(d)*35}px`);
        });
        pillarButtons.forEach((button,i) => button.setAttribute('aria-current',String(i === Math.round(p * 4))));
        const sp = clamp(-services.getBoundingClientRect().top / Math.max(1,services.offsetHeight - innerHeight));
        const gutter = parseFloat(getComputedStyle(document.querySelector('.service-intro')).left) || 0;
        const overflow = Math.max(0,serviceTrack.scrollWidth - (innerWidth - 2 * gutter));
        serviceTrack.style.transform = `translateX(${-sp * overflow}px)`;
        const fp = clamp(-film.getBoundingClientRect().top / (innerHeight * .45));
        film.style.setProperty('--film-scale',String(.88 + fp * .12));
        film.style.setProperty('--film-radius',`${20 * (1-fp)}px`);
      }
      const m = marquee.getBoundingClientRect();
      if(m.bottom > 0 && m.top < innerHeight) marquee.style.setProperty('--marquee',`${-(innerHeight-m.top)*.12}px`);
    }
  }
  function requestTick() { if(!queued){queued=true;requestAnimationFrame(update);} }
  window.addEventListener('scroll',requestTick,{passive:true});
  window.addEventListener('resize',requestTick,{passive:true});
  document.fonts.ready.then(requestTick);
  requestTick();

  const form = document.getElementById('contact-form');
  const status = form.querySelector('.form-status');
  form.addEventListener('submit',async e => {
    e.preventDefault();
    if(!form.reportValidity())return;
    const button = form.querySelector('button[type="submit"]');button.disabled=true;status.textContent='Sending your enquiry…';
    try {
      const response = await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      const result = await response.json();
      status.textContent=result.message || 'Unable to send. Please email info@p10x.my.';
      if(response.ok && result.ok)form.reset();
    } catch (_) { status.textContent='Unable to send right now. Please email info@p10x.my.'; }
    finally {button.disabled=false;}
  });
})();
