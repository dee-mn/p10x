/* P10X native controls. No CMS or page-builder runtime is required. */
// Split homepage text shortly before it enters the viewport. Unsplit text is readable at every scroll position.
function p10xPrepareHeadings(headings, prepare) {
  if (!document.body.classList.contains('home') || !window.IntersectionObserver) {
    headings.forEach(prepare);
    return () => {};
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      prepare(entry.target);
    }
  }, { rootMargin: '180px 0px' });
  headings.forEach(el => observer.observe(el));
  return () => observer.disconnect();
}

(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let refreshFrame;
  function refresh() {
    if (refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      ScrollTrigger.refresh();
    });
  }
  // Shared header switches from the original transparent layout to its floating capsule.
  let scheduled = false;
  function onScroll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const y = scrollY;
      $$('.px-header--is-fixed').forEach((x) =>
        x.classList.toggle('is-fixed', y > 0)
      );
      $$('.ui-header-elementor-sticky').forEach((x) =>
        x.classList.toggle('ui-header-fixed', y > 100)
      );
      $('#ui-header-mobile')?.classList.toggle(
        'ui-header-mobile-fixed',
        y > 100
      );
      $$('.ui-scroll-top').forEach((x) => {
        x.classList.toggle('ui-on', y > innerHeight);
        x.classList.toggle('ui-off', y <= innerHeight);
      });
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  $$('.ui-scroll-top').forEach((x) =>
    x.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
    })
  );
  // Accordion state is shared with the authored accessible question controls.
  $$('.ui-accordion').forEach((root) => {
    const items = $$('.ui--item', root);
    items.forEach((item) => {
      const title = $('.ui-accordion--title', item),
        content = $('.ui-accordion--content', item);
      if (!title || !content) return;
      const sync = () => {
        content.style.display = item.classList.contains('active')
          ? 'block'
          : 'none';
        title
          .querySelector('button')
          ?.setAttribute(
            'aria-expanded',
            String(item.classList.contains('active'))
          );
      };
      sync();
      title.addEventListener('click', () => {
        const open = !item.classList.contains('active');
        items.forEach((other) => {
          other.classList.toggle('active', other === item && open);
          const c = $('.ui-accordion--content', other);
          if (c) c.style.display = other === item && open ? 'block' : 'none';
        });
        refresh();
      });
    });
  });
  $$('.surface-tabs').forEach((root) => {
    const titles = $$('.surface-tab-title', root),
      panels = $$('.surface-tab-content', root);
    function choose(tab) {
      const id = tab.dataset.tab;
      titles.forEach((t) => {
        const on = t.dataset.tab === id;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p) => {
        const on = p.dataset.tab === id;
        p.classList.toggle('is-active', on);
        p.style.display = on ? 'block' : 'none';
      });
      refresh();
    }
    titles.forEach((t, i) => {
      t.setAttribute('role', 'tab');
      t.tabIndex = t.classList.contains('is-active') ? 0 : -1;
      t.addEventListener('click', () => choose(t));
      t.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
          e.preventDefault();
          let n =
            e.key === 'Home'
              ? 0
              : e.key === 'End'
                ? titles.length - 1
                : (i + (e.key === 'ArrowRight' ? 1 : -1) + titles.length) %
                  titles.length;
          titles[n].focus();
          choose(titles[n]);
        }
      });
    });
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') $('.native-lightbox')?.remove();
  });
  // Local photo viewer replaces the old media popup endpoint.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (!/^\/assets\/.*\.(jpg|jpeg|png|webp)$/i.test(href)) return;
    e.preventDefault();
    const box = document.createElement('div');
    box.className = 'native-lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML =
      '<button type="button" aria-label="Close photo">×</button><img alt="">';
    $('img', box).src = href;
    document.body.append(box);
    $('button', box).focus();
    box.addEventListener('click', (ev) => {
      if (ev.target === box || ev.target.closest('button')) box.remove();
    });
  });
  // Theme-independent card sliders preserve the original three/two/one-column breakpoints.
  $$('.ui-swiper-container:not([data-home-insights])').forEach((root) => {
    root.classList.add('native-carousel');
    const track = $('.ui-swiper-wrapper', root);
    if (!track) return;
    const slides = $$('.ui-swiper-slide', track);
    let index = 0;
    const host = root.closest('.ui-swiper-slider') || root;
    function move(n) {
      const shown = innerWidth < 768 ? 1 : innerWidth < 992 ? 2 : 3;
      index = Math.max(0, Math.min(n, slides.length - shown));
      const step = (slides[0]?.getBoundingClientRect().width || 0) + 30;
      track.style.transform = `translateX(${-index * step}px)`;
    }
    $$('.ui-swiper-arrow-next,.ui-swiper-button-next', host).forEach((x) =>
      x.addEventListener('click', () => move(index + 1))
    );
    $$('.ui-swiper-arrow-prev,.ui-swiper-button-prev', host).forEach((x) =>
      x.addEventListener('click', () => move(index - 1))
    );
    let start = 0;
    root.addEventListener('pointerdown', (e) => (start = e.clientX));
    root.addEventListener('pointerup', (e) => {
      if (Math.abs(e.clientX - start) > 40)
        move(index + (e.clientX < start ? 1 : -1));
    });
    addEventListener('resize', () => move(index));
  });
  // Preserve the visitor's training interest when continuing to the contact page.
  if (new URLSearchParams(location.search).get('service') === 'training') {
    const message = document.querySelector('form[data-enquiry] textarea');
    if (message && !message.value)
      message.value =
        'I am interested in P10X Academy training.\n\nMy experience: \nLearning area of interest: \nMy training goals: ';
  }
  function initMotion() {
    // Circular five-pillar names use the same radius, arc and rotation as the reference.
    const slider = $('.ui-icon-list1 .ui-inner-content');
    if (slider)
      gsap.matchMedia().add('(min-width:1025px)', () => {
        const items = $$('.ui--item-circular', slider);
        function position() {
          const r = slider.offsetWidth / 2,
            arc = (0.52 * Math.PI) / items.length;
          items.forEach((x, i) => {
            const a = i * arc;
            gsap.set(x, {
              x: r * Math.sin(a) + r,
              y: -r * Math.cos(a) + r,
              xPercent: -50,
              yPercent: -50,
              rotation: a + 'rad'
            });
          });
        }
        position();
        addEventListener('resize', position);
        return () => removeEventListener('resize', position);
      });
    // Preserve authored heading reveals outside sections with their own timeline controller.
    if (!reduced)
      $$('.heading-title')
        .filter(
          (x) =>
            !x.closest(
              '.p10x-about,.p10x-ppf,.p10x-tint,.p10x-detail,.p10x-wrap,.p10x-window,.p10x-faq,#p10x-motion-hero'
            )
        )
        .forEach((el) => {
          if (el.closest('header,footer') || el.textContent.trim().length < 3)
            return;
          if (
            el.closest('.ui-text-gradient') ||
            el.dataset.settings?.includes('split')
          )
            gsap.fromTo(
              el,
              { color: '#777' },
              {
                color: 'inherit',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 90%',
                  end: 'top 60%',
                  scrub: true
                }
              }
            );
        });
    refresh();
  }
  if (document.readyState === 'complete') initMotion();
  else addEventListener('load', initMotion, { once: true });
  document.fonts.ready.then(refresh);
  $$('img').forEach((im) => {
    if (!im.complete && !(im.hasAttribute('width') && im.hasAttribute('height')))
      im.addEventListener('load', refresh, { once: true });
  });
})();
(() => {
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  function start() {
    $$('.ui-tabs-slip.style-1').forEach((root) => {
      const breakpoint = root.closest('.block-559aab1b') ? 1025 : 992;
      gsap.matchMedia().add('(min-width:' + breakpoint + 'px)', () => {
        const items = $$('.ui-item--content', root),
          end = $('.ui-tabs--content', root);
        items.forEach((item, i) => {
          if (i < items.length - 1)
            ScrollTrigger.create({
              trigger: item,
              start: 'top top',
              end: 'bottom bottom+=150',
              endTrigger: end,
              pin: true,
              pinSpacing: false,
              scrub: true
            });
        });
      });
    });
    // The same small-to-full-screen video expansion, with local media and local timing.
    gsap.matchMedia().add('(min-width:1281px)', () => {
      $$('.ui-video-sticky1').forEach((section) => {
        const frame = $('.ui-item--bg', section),
          video = $('video', section),
          inner = $('.ui-video-inner', section),
          toggle = $('.ui-video-toggle', section);
        if (!frame || !video || !inner) return;
        const loaded = () => frame.classList.add('video-loaded');
        video.addEventListener('loadeddata', loaded);
        if (video.readyState >= 2) loaded();
        gsap.set(inner, { position: 'sticky' });
        gsap.set(frame, {
          position: 'absolute',
          top: '50%',
          left: '50%',
          xPercent: -50,
          yPercent: -50,
          willChange: 'width,height,transform'
        });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            invalidateOnRefresh: true
          }
        });
        tl.to(
          frame,
          {
            width: 1180,
            height: 600,
            xPercent: -51.2,
            duration: 70,
            ease: 'none'
          },
          0
        )
          .to(frame, {
            width: 1300,
            xPercent: -51.55,
            duration: 30,
            ease: 'none'
          })
          .to(frame, { height: 753, duration: 20, ease: 'none' });
        if (toggle) {
          toggle.addEventListener('click', () => {
            if (video.paused) video.play().catch(() => {});
            else video.pause();
          });
        }
      });
    });
    // Restore the reference's per-character scroll colour transitions.
    if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
      const headings = $$('.ui-slip-text-color:not(.is-splitted)')
        .filter(el => !el.closest('.p10x-about,[data-home-reveal]'));
      p10xPrepareHeadings(headings, el => {
        el.classList.add('is-splitted');
        const label = el.textContent.trim();
        el.setAttribute('aria-label', label);
        const lines = new SplitText(el, {
          type: 'lines',
          linesClass: 'ui-line'
        }).lines;
        lines.forEach((line) => {
          const chars = new SplitText(line, {
            type: 'chars',
            charsClass: 'ui-char'
          }).chars;
          chars.forEach((x) => x.setAttribute('aria-hidden', 'true'));
          gsap.set(chars, { color: 'var(--ui-title-color-start)' });
          gsap.to(chars, {
            color: 'var(--ui-title-color-end)',
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: line,
              start: 'top center',
              end: 'bottom center',
              scrub: 0.3
            }
          });
        });
      });
    }
    ScrollTrigger.refresh();
  }
  if (document.readyState === 'complete') start();
  else addEventListener('load', start, { once: true });
  // Keep all articles readable without JavaScript. Enhance the archive after load.
  if (location.pathname === '/insights/') {
    const query = (new URLSearchParams(location.search).get('s') || '').trim();
    const field = $('#archive-query');
    if (field) field.value = query;
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const cards = $$('.ui-grid-item');
    const more = $('.ui-load-more');
    cards.forEach(card => {
      card.hidden = words.length
        ? !words.every(word => card.textContent.toLowerCase().includes(word))
        : card.hasAttribute('data-more-article');
    });
    const empty = $('[data-no-insights]');
    if (empty) empty.hidden = !words.length || cards.some(card => !card.hidden);
    if (more && !words.length) {
      more.hidden = false;
      more.querySelector('button')?.addEventListener('click', () => {
        cards.forEach(card => { card.hidden = false; });
        more.hidden = true;
        refresh();
      });
    }
  }
  // Both mail handlers return { ok, message }; the article handler also needs its page URL.
  $$('form[data-enquiry], form[data-comment]').forEach((form) => {
    const isComment = form.hasAttribute('data-comment');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      let status = $('[role=status]', form);
      if (!status) {
        status = document.createElement('p');
        status.setAttribute('role', 'status');
        if (!isComment) status.className = 'native-form-status';
        form.append(status);
      }
      const button = isComment ? null : $('[type=submit]', form);
      if (button) button.disabled = true;
      status.textContent = isComment ? 'Sending your comment…' : 'Sending your enquiry…';
      try {
        const body = new FormData(form);
        if (isComment) body.set('page', location.pathname);
        const response = await fetch(form.action, { method: 'POST', body });
        const result = await response.json();
        status.textContent = result.message;
        if (result.ok) form.reset();
      } catch {
        status.textContent = 'Unable to send. Please email info@p10x.my.';
      } finally {
        if (button) button.disabled = false;
      }
    });
  });
})();

(() => {
  const icon =
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg>';
  document
    .querySelectorAll('.search-submit,.content-search__button')
    .forEach((button) => {
      if (!button.querySelector('svg')) button.innerHTML = icon;
      button.setAttribute('aria-label', 'Search articles');
    });
  // Replace the menu's font-generated plus with a stable vector.
  document
    .querySelectorAll('.ui-menu-primary>.menu-item-has-children>a')
    .forEach((a) => {
      if (!a.querySelector('.menu-plus')) {
        const span = document.createElement('span');
        span.className = 'menu-plus';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = ' +';
        a.append(span);
      }
    });
})();
(() => {
  const grid = document.querySelector('body.page-id-7411 .ui-grid-inner');
  if (!grid) return;
  let width = 0;
  function layout() {
    const columns = innerWidth >= 1200 ? 3 : innerWidth >= 768 ? 2 : 1,
      w = grid.clientWidth / columns,
      heights = Array(columns).fill(0);
    grid.style.position = 'relative';
    grid.style.display = 'block';
    for (const item of grid.querySelectorAll('.ui-grid-item')) {
      if (item.hidden) continue;
      item.style.position = 'absolute';
      item.style.width = w + 'px';
      const col = heights.indexOf(Math.min(...heights));
      item.style.left = col * w + 'px';
      item.style.top = heights[col] + 'px';
      heights[col] += item.getBoundingClientRect().height;
    }
    grid.style.height = Math.max(...heights) + 'px';
    ScrollTrigger.refresh();
  }
  const observer = new ResizeObserver(() => {
    if (grid.clientWidth !== width) {
      width = grid.clientWidth;
      layout();
    }
  });
  observer.observe(grid);
  document.fonts.ready.then(layout);
  addEventListener('load', layout, { once: true });
  document.addEventListener(
    'click',
    (e) => {
      if (e.target.closest('.ui-load-more')) requestAnimationFrame(layout);
    },
    true
  );
})();
// Match the reference CTA's arrow/label exchange without its former runtime.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  document
    .querySelectorAll(
      '.btn.btn-default,.ui-button-video.style-button .ui-btn-video,.ui-pricing2 .ui-item--nav'
    )
    .forEach((button) => {
      const icon = button.querySelector('.ui-btn-icon,.ui-icon,.ui-nav-text'),
        label = button.querySelector(
          '.ui--btn-text,.ui-button--title,.ui-nav-icon'
        );
      if (!icon || !label || icon.classList.contains('icon-none')) return;
      function update() {
        const active =
          button.matches(':hover,:focus-visible') ||
          !!button.querySelector(':focus-visible');
        const direction = button.classList.contains('ui-icon--right') ? -1 : 1,
          gap = parseFloat(getComputedStyle(button).gap) || 0;
        icon.style.transform = active
          ? `translateX(${direction * (label.offsetWidth + gap)}px)`
          : 'translateX(0)';
        label.style.transform = active
          ? `translateX(${-direction * (icon.offsetWidth + gap)}px)`
          : 'translateX(0)';
        if (reduced.matches) {
          icon.style.transition = 'none';
          label.style.transition = 'none';
        }
      }
      ['pointerenter', 'pointerleave', 'focusin', 'focusout'].forEach((name) =>
        button.addEventListener(name, () => requestAnimationFrame(update))
      );
    });
})();
