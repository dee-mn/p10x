(function () {
  'use strict';
  function init() {
    const root = document.querySelector('.p10x-window');
    if (!root || root.dataset.wfReady) return;
    root.dataset.wfReady = 'true';
    const hero = root.querySelector('.wf-hero'),
      heroPlayer = root.querySelector('.wf-hero-video iframe');
    function coverHero() {
      if (!heroPlayer || !hero) return;
      const ratio = 16 / 9,
        width = Math.max(hero.clientWidth, hero.clientHeight * ratio);
      heroPlayer.style.width = width + 'px';
      heroPlayer.style.height = width / ratio + 'px';
    }
    coverHero();
    if (window.ResizeObserver && hero)
      new ResizeObserver(coverHero).observe(hero);
    const reduced = matchMedia('(prefers-reduced-motion:reduce)'),
      fine = matchMedia('(hover:hover) and (pointer:fine)');
    const cover = hero.querySelector('.wf-video-cover');
    const playButton = hero.querySelector('.hero-video-play');
    const playerOrigin = new URL(heroPlayer.dataset.src).origin;
    function send(method, value) {
      heroPlayer.contentWindow?.postMessage({ method, value }, playerOrigin);
    }
    function startPlayer() {
      if (heroPlayer.hasAttribute('src')) send('play');
      else heroPlayer.src = heroPlayer.dataset.src;
    }
    function syncPlayer() {
      cover.hidden = false;
      playButton.hidden = !reduced.matches;
      if (reduced.matches) heroPlayer.removeAttribute('src');
      else startPlayer();
    }
    window.addEventListener('message', event => {
      if (event.origin !== playerOrigin || event.source !== heroPlayer.contentWindow ||
          !heroPlayer.hasAttribute('src')) return;
      let message = event.data;
      if (typeof message === 'string') {
        try { message = JSON.parse(message); } catch { return; }
      }
      if (message?.event === 'ready' || message?.method === 'ping') {
        send('addEventListener', 'timeupdate');
        send('addEventListener', 'error');
        send('play');
      } else if (message?.event === 'timeupdate' && message.data?.seconds > 0) {
        cover.hidden = true;
        playButton.hidden = true;
      } else if (message?.event === 'error') {
        cover.hidden = false;
        playButton.hidden = message.data?.method !== 'play';
      }
    });
    heroPlayer.addEventListener('load', () => send('ping'));
    playButton.addEventListener('click', startPlayer);
    reduced.addEventListener('change', syncPlayer);
    syncPlayer();

    const deck = root.querySelector('.wf-space-deck'),
      spaces = Array.from(root.querySelectorAll('.wf-space')),
      buttons = spaces.map((x) => x.querySelector('.wf-space-toggle'));
    const count = root.querySelector('.wf-space-count .text-block p');
    let active = 0,
      hoverTimer;
    function select(index, focus) {
      active = index;
      deck.style.setProperty('--wf-active', index);
      spaces.forEach((card, i) => {
        const selected = i === index,
          body = card.querySelector('.wf-space-body');
        card.classList.toggle('is-active', selected);
        buttons[i].setAttribute('aria-expanded', selected ? 'true' : 'false');
        body.setAttribute('aria-hidden', selected ? 'false' : 'true');
        body.inert = !selected;
      });
      count.textContent = String(index + 1).padStart(2, '0') + ' / 03';
      if (focus) buttons[index].focus({ preventScroll: true });
    }
    spaces.forEach((card, i) => {
      const body = card.querySelector('.wf-space-body');
      body.setAttribute('role', 'region');
      body.setAttribute('aria-labelledby', buttons[i].id);
      buttons[i].addEventListener('click', () => {
        clearTimeout(hoverTimer);
        select(i, false);
      });
      buttons[i].addEventListener('keydown', (event) => {
        let next = active;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
          next = (i + 1) % spaces.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
          next = (i + spaces.length - 1) % spaces.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = spaces.length - 1;
        else return;
        event.preventDefault();
        clearTimeout(hoverTimer);
        select(next, true);
      });
      card.addEventListener('pointerenter', () => {
        if (
          fine.matches &&
          !reduced.matches &&
          !deck.contains(document.activeElement)
        ) {
          clearTimeout(hoverTimer);
          hoverTimer = setTimeout(() => select(i, false), 180);
        }
      });
      card.addEventListener('pointerleave', () => clearTimeout(hoverTimer));
    });
    root.classList.add('wf-enhanced');
    count.parentElement.setAttribute('aria-live', 'polite');
    count.parentElement.setAttribute('aria-atomic', 'true');
    select(0, false);
    root.querySelectorAll('.heading-title').forEach((el) => {
      if (!el.hasAttribute('aria-label'))
        el.setAttribute('aria-label', el.innerText.replace(/\s+/g, ' ').trim());
    });
    const steps = Array.from(root.querySelectorAll('.wf-process-step'));
    function updateSteps() {
      let index = 0;
      steps.forEach((el, i) => {
        if (el.getBoundingClientRect().top < innerHeight * 0.62) index = i;
      });
      steps.forEach((el, i) => el.classList.toggle('is-current', i === index));
    }
    let tick;
    window.addEventListener(
      'scroll',
      () => {
        if (!tick)
          tick = requestAnimationFrame(() => {
            tick = 0;
            updateSteps();
          });
      },
      { passive: true }
    );
    updateSteps();
    if (window.gsap) {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion:no-preference)', () => {
        gsap.from(root.querySelector('.wf-hero-title'), {
          y: 28,
          opacity: 0,
          duration: 1.15,
          delay: 0.15,
          ease: 'power3.out'
        });
        gsap.from(root.querySelectorAll('.wf-hero-top, .wf-hero .wf-kicker'), {
          y: 16,
          opacity: 0,
          duration: 0.85,
          delay: 0.1
        });
        gsap.from(root.querySelector('.wf-hero-aside'), {
          y: 22,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out'
        });
        if (window.ScrollTrigger) {
          gsap.from(root.querySelectorAll('.wf-need'), {
            y: 35,
            opacity: 0,
            duration: 1,
            stagger: 0.13,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root.querySelector('.wf-needs'),
              start: 'top 88%',
              once: true
            }
          });
          gsap.from(spaces, {
            y: 45,
            opacity: 0,
            duration: 1.15,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: deck, start: 'top 88%', once: true }
          });
        }
      });
      media.add(
        '(min-width:1025px) and (prefers-reduced-motion:no-preference)',
        () => {
          if (!window.ScrollTrigger) return;
          const heroPhoto = root.querySelector('.wf-hero-photo img');
          if (heroPhoto)
            gsap.fromTo(
              heroPhoto,
              { scale: 1.04, yPercent: 0 },
              {
                scale: 1.12,
                yPercent: 5,
                ease: 'none',
                scrollTrigger: {
                  trigger: root.querySelector('.wf-hero'),
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 1.7
                }
              }
            );
          gsap.fromTo(
            root.querySelector('.wf-process'),
            { '--wf-progress': 0 },
            {
              '--wf-progress': 1,
              ease: 'none',
              scrollTrigger: {
                trigger: root.querySelector('.wf-process'),
                start: 'top 68%',
                end: 'bottom 65%',
                scrub: 1.35
              }
            }
          );
        }
      );
    }
    if (!fine.matches || reduced.matches)
      root.querySelectorAll('.ui-image-tilt').forEach((el) => {
        if (el.vanillaTilt) el.vanillaTilt.destroy();
      });
    function refresh() {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      updateSteps();
    }
    let deckRefresh;
    deck.addEventListener('transitionend', (event) => {
      if (
        event.propertyName === 'height' &&
        event.target.classList.contains('wf-space')
      ) {
        clearTimeout(deckRefresh);
        deckRefresh = setTimeout(refresh, 80);
      }
    });
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(refresh);
    else refresh();
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refresh, 180);
    });
  }
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init, { once: true });
})();
