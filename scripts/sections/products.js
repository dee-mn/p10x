/* Shared desktop product dialog. */
(() => {
  'use strict';
  const panel = document.querySelector('.ui-hidden-panel-popup'),
    root = panel?.querySelector('.view-6523');
  if (!panel || !root) return;
  if (panel.dataset.productDialogReady) return;
  panel.dataset.productDialogReady = 'true';
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const triggers = [...document.querySelectorAll('.ui-anchor-button')],
    content = panel.querySelector('.ui-popup--conent'),
    backdrop = panel.querySelector('.ui-popup--overlay');
  let closeButton = panel.querySelector('.ui-close-button');
  if (closeButton && closeButton.tagName !== 'BUTTON') {
    const button = document.createElement('button');
    button.className = closeButton.className;
    button.type = 'button';
    button.setAttribute('aria-label', 'Close products');
    while (closeButton.firstChild) button.append(closeButton.firstChild);
    closeButton.replaceWith(button);
    closeButton = button;
  }
  panel.classList.add('product-dialog');
  panel.classList.remove('active');
  panel.hidden = true;
  panel.id = 'p10x-product-dialog';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Products');
  panel.setAttribute('aria-hidden', 'true');
  panel.inert = true;
  let opened = false,
    lastFocus = null,
    overflow = '',
    animations = [],
    inertNodes = [];
  const stop = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
  };
  function animate(element, frames, options) {
    if (!element) return;
    animations.push(element.animate(frames, options));
  }
  function setTriggers(value) {
    triggers.forEach((trigger) =>
      trigger.setAttribute('aria-expanded', String(value))
    );
  }
  function lockPage() {
    overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let branch = panel;
    while (branch.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (
          sibling !== branch &&
          !sibling.inert &&
          !['SCRIPT', 'STYLE', 'LINK'].includes(sibling.tagName)
        ) {
          sibling.inert = true;
          inertNodes.push(sibling);
        }
      }
      branch = branch.parentElement;
      if (branch === document.body) break;
    }
  }
  function unlockPage() {
    inertNodes.forEach((node) => (node.inert = false));
    inertNodes = [];
    document.body.style.overflow = overflow;
  }
  function open(trigger) {
    if (opened) {
      close();
      return;
    }
    opened = true;
    stop();
    lastFocus = trigger || document.activeElement;
    lockPage();
    panel.hidden = false;
    panel.inert = false;
    panel.classList.add('active');
    panel.setAttribute('aria-hidden', 'false');
    panel.style.visibility = 'visible';
    setTriggers(true);
    if (!reduced.matches) {
      animate(
        content,
        [
          { opacity: 0, transform: 'translate3d(0,-20px,0)' },
          { opacity: 1, transform: 'translate3d(0,0,0)' }
        ],
        { duration: 320, easing: 'cubic-bezier(.16,1,.3,1)' }
      );
      animate(backdrop, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 220,
        easing: 'ease-out'
      });
    }
    closeButton?.focus({ preventScroll: true });
  }
  function close({ restoreFocus = true } = {}) {
    if (!opened && panel.hidden) return;
    opened = false;
    stop();
    panel.hidden = true;
    panel.inert = true;
    panel.classList.remove('active');
    panel.style.visibility = 'hidden';
    panel.setAttribute('aria-hidden', 'true');
    setTriggers(false);
    unlockPage();
    if (restoreFocus && lastFocus?.isConnected)
      lastFocus.focus({ preventScroll: true });
  }
  triggers.forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.tabIndex = 0;
    const title = trigger.querySelector('.ui-anchor-title')?.textContent.trim();
    trigger.setAttribute('aria-label', title || 'Products');
    trigger.setAttribute('aria-controls', panel.id);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      open(trigger);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(trigger);
      }
    });
  });
  panel.addEventListener('click', (event) => {
    if (
      event.target.closest(
        '.ui-close-button,.ui-close-popup,.ui-popup--overlay'
      )
    ) {
      event.preventDefault();
      close();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (!opened) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab') {
      const controls = [
        ...panel.querySelectorAll('a[href],button,[tabindex="0"]')
      ].filter(
        (element) =>
          !element.closest('[hidden]') &&
          element.getClientRects().length &&
          !element.disabled
      );
      const first = controls[0],
        last = controls[controls.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
  addEventListener('pagehide', () => close({ restoreFocus: false }));
  matchMedia('(max-width:1200px)').addEventListener('change', (event) => {
    if (event.matches) close();
  });
})();
