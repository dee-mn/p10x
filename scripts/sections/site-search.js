/* The native dialog handles modal focus and makes the rest of the page inert. */
(() => {
  const dialog = document.getElementById('site-search');
  if (!dialog) return;
  document.body.append(dialog);
  const triggers = [...document.querySelectorAll('.site-search-trigger')];
  const input = dialog.querySelector('input');
  const form = dialog.querySelector('form');
  const clear = dialog.querySelector('.search-clear');
  const browse = dialog.querySelector('.search-browse');
  const list = dialog.querySelector('.search-results');
  const status = dialog.querySelector('.search-status');
  const more = dialog.querySelector('.search-more');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opener, engine, timer, revision = 0, matches = [];

  function loadEngine() {
    if (!engine) {
      engine = import('/pagefind/pagefind.js').then(async (api) => {
        await api.options({ excerptLength: 22 });
        await api.init();
        return api;
      }).catch((error) => {
        engine = undefined;
        throw error;
      });
    }
    return engine;
  }

  function resultRow(result) {
    const row = document.createElement('li');
    const link = document.createElement('a');
    link.href = result.url;
    const title = document.createElement('span');
    title.className = 'result-title';
    title.textContent = result.meta.title || result.url;
    const arrow = document.createElement('span');
    arrow.className = 'result-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    const excerpt = document.createElement('span');
    excerpt.className = 'result-excerpt';
    // Keep only Pagefind's match highlights. All indexed text stays text.
    const fragment = new DOMParser().parseFromString(result.excerpt, 'text/html');
    for (const node of fragment.body.childNodes) {
      if (node.nodeName === 'MARK') {
        const mark = document.createElement('mark');
        mark.textContent = node.textContent;
        excerpt.append(mark);
      } else excerpt.append(node.textContent);
    }
    link.append(title, arrow, excerpt);
    row.append(link);
    return row;
  }

  async function renderPage(version, focusFirst = false) {
    const offset = list.children.length;
    more.disabled = true;
    try {
      const page = await Promise.all(matches.slice(offset, offset + 8).map(hit => hit.data()));
      if (version !== revision) return;
      list.append(...page.map(resultRow));
      more.hidden = list.children.length >= matches.length;
      if (focusFirst) list.children[offset]?.firstElementChild.focus();
    } finally {
      if (version === revision) more.disabled = false;
    }
  }

  function reportError(version) {
    if (version !== revision) return;
    status.textContent = 'Search could not load. Press Enter to retry.';
    more.hidden = true;
  }

  function search(immediate = false) {
    clearTimeout(timer);
    const version = ++revision;
    const query = input.value.trim();
    matches = [];
    list.replaceChildren();
    clear.hidden = !input.value;
    browse.hidden = Boolean(query);
    more.hidden = true;
    status.textContent = query ? 'Searching…' : '';
    if (!query) return;
    timer = setTimeout(async () => {
      try {
        const api = await loadEngine();
        if (version !== revision) return;
        const response = await api.search(query);
        if (version !== revision) return;
        matches = response.results;
        await renderPage(version);
        if (version !== revision) return;
        status.textContent = matches.length
          ? matches.length + (matches.length === 1 ? ' result' : ' results')
          : 'No results. Try a different word.';
      } catch {
        reportError(version);
      }
    }, immediate ? 0 : 140);
  }

  function open(trigger) {
    if (dialog.open) return;
    opener = trigger;
    input.value = '';
    search();
    for (const photo of browse.querySelectorAll('[data-search-photo]:empty')) {
      const img = document.createElement('img');
      img.alt = '';
      img.decoding = 'async';
      img.src = photo.dataset.searchPhoto;
      photo.append(img);
    }
    dialog.showModal();
    document.documentElement.classList.add('site-search-open');
    input.focus({ preventScroll: true });
    dialog.scrollTop = 0;
  }

  async function close() {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    clearTimeout(timer);
    revision++;
    if (!reduced.matches) {
      dialog.classList.add('is-closing');
      await Promise.allSettled(dialog.getAnimations().map(animation => animation.finished));
    }
    dialog.close();
    dialog.classList.remove('is-closing');
    document.documentElement.classList.remove('site-search-open');
    (opener?.getClientRects().length ? opener : triggers.find(el => el.getClientRects().length))?.focus({ preventScroll: true });
  }

  window.addEventListener('pagehide', () => {
    if (!dialog.open) return;
    clearTimeout(timer);
    revision++;
    dialog.close();
    dialog.classList.remove('is-closing');
    document.documentElement.classList.remove('site-search-open');
  });

  triggers.forEach(trigger => trigger.addEventListener('click', () => open(trigger)));
  dialog.querySelector('.search-close').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  input.addEventListener('input', event => { if (!event.isComposing) search(); });
  input.addEventListener('compositionend', () => search());
  form.addEventListener('submit', event => { event.preventDefault(); search(true); });
  clear.addEventListener('click', () => { input.value = ''; search(); input.focus(); });
  more.addEventListener('click', () => {
    const version = revision;
    renderPage(version, true).catch(() => reportError(version));
  });
  dialog.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (!['ArrowDown','ArrowUp'].includes(event.key)) return;
    const links = [...list.querySelectorAll('a')];
    if (!links.length || (event.target !== input && !links.includes(event.target))) return;
    event.preventDefault();
    const next = links.indexOf(event.target) + (event.key === 'ArrowDown' ? 1 : -1);
    (next < 0 ? input : links[Math.min(next, links.length - 1)]).focus();
  });
})();
