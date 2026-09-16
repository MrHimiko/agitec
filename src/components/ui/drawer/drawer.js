const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

const drawers = new Map([...document.querySelectorAll('[data-drawer]')].map((el) => [el.dataset.drawer, el]));
let current = null;
let lastFocus = null;

function lockScroll(lock) {
  const sbw = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.setProperty('--sbw', lock ? `${sbw}px` : '0px');
  document.body.classList.toggle('is-drawer-locked', lock);
}

function open(id, trigger) {
  const drawer = drawers.get(id);
  if (!drawer) return;
  if (current && current !== id) close({ restoreFocus: false, keepLock: true });
  lastFocus = trigger || document.activeElement;
  current = id;
  drawer.inert = false;
  drawer.classList.add('is-open');
  lockScroll(true);
  document.querySelectorAll(`[data-drawer-open="${id}"]`).forEach((t) => t.setAttribute('aria-expanded', 'true'));
  document.dispatchEvent(new CustomEvent('drawer:open', { detail: { id, drawer } }));
  const autofocus = drawer.querySelector('[data-drawer-autofocus]') || drawer.querySelector('.drawer-close');
  setTimeout(() => autofocus?.focus({ preventScroll: true }), 80);
}

function close({ restoreFocus = true, keepLock = false } = {}) {
  if (!current) return;
  const id = current;
  const drawer = drawers.get(id);
  drawer.classList.remove('is-open');
  drawer.inert = true;
  current = null;
  if (!keepLock) lockScroll(false);
  document.querySelectorAll(`[data-drawer-open="${id}"]`).forEach((t) => t.setAttribute('aria-expanded', 'false'));
  document.dispatchEvent(new CustomEvent('drawer:close', { detail: { id, drawer } }));
  if (restoreFocus) lastFocus?.focus?.({ preventScroll: true });
}

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-drawer-open]');
  if (trigger) {
    e.preventDefault();
    const id = trigger.dataset.drawerOpen;
    if (current === id) close();
    else open(id, trigger);
    return;
  }
  if (e.target.closest('[data-drawer-close]') && current) {
    e.preventDefault();
    close();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && current) {
    e.stopPropagation();
    close();
    return;
  }
  if (e.key === 'Tab' && current) {
    const items = [...drawers.get(current).querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  const typing = e.target.closest?.('input, textarea, [contenteditable="true"]');
  if (!typing && !current && (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) {
    e.preventDefault();
    open('search');
  }
}, true);

window.agitecDrawer = { open, close };
