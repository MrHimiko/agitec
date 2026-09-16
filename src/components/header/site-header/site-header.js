const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const OPEN_DELAY = 120;
const CLOSE_DELAY = 220;

function initHeader(header) {
  const scrim = document.querySelector('[data-scrim]');
  const triggers = [...header.querySelectorAll('[data-mega-trigger]')];
  const panels = new Map([...header.querySelectorAll('[data-mega-panel]')].map((p) => [p.dataset.megaPanel, p]));
  const desktop = window.matchMedia('(min-width: 75.0625rem)');
  const burger = header.querySelector('[data-burger]');
  const mobileMenu = header.querySelector('[data-mobile-menu]');

  let current = null;
  let pinned = false;
  let openTimer;
  let closeTimer;

  const clearTimers = () => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
  };

  function setMega(id) {
    id = id || null;
    if (id === current) return;
    const switching = Boolean(current && id);

    panels.forEach((panel, key) => {
      panel.classList.toggle('is-instant', switching);
      panel.classList.toggle('is-open', key === id);
    });
    if (switching) {
      requestAnimationFrame(() => requestAnimationFrame(() => panels.forEach((p) => p.classList.remove('is-instant'))));
    }

    triggers.forEach((t) => t.setAttribute('aria-expanded', String(t.dataset.megaTrigger === id)));
    header.classList.toggle('is-mega-open', Boolean(id));
    scrim?.classList.toggle('is-visible', Boolean(id));
    current = id;
    if (!id) pinned = false;
    if (id) closeDropdowns();
  }

  const closeMega = () => {
    clearTimers();
    setMega(null);
  };

  const scheduleClose = () => {
    if (pinned || !current) return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => setMega(null), CLOSE_DELAY);
  };

  const focusablesIn = (el) => [...el.querySelectorAll(FOCUSABLE)].filter((n) => !n.closest('[hidden]'));

  triggers.forEach((trigger, index) => {
    const id = trigger.dataset.megaTrigger;

    trigger.addEventListener('mouseenter', () => {
      if (!desktop.matches) return;
      clearTimers();
      openTimer = setTimeout(() => setMega(id), current ? 0 : OPEN_DELAY);
    });

    trigger.addEventListener('mouseleave', () => {
      if (current !== id) clearTimeout(openTimer);
    });

    trigger.addEventListener('click', () => {
      clearTimers();
      if (current === id && pinned) {
        setMega(null);
      } else {
        setMega(id);
        pinned = true;
      }
    });

    trigger.addEventListener('keydown', (e) => {
      const panel = panels.get(id);
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey && current === id)) {
        e.preventDefault();
        setMega(id);
        pinned = true;
        focusablesIn(panel)[0]?.focus();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = triggers[(index + (e.key === 'ArrowRight' ? 1 : -1) + triggers.length) % triggers.length];
        next.focus();
        if (current) setMega(next.dataset.megaTrigger);
      }
    });
  });

  panels.forEach((panel, id) => {
    panel.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const items = focusablesIn(panel);
      const trigger = triggers.find((t) => t.dataset.megaTrigger === id);
      const nextTrigger = triggers[triggers.indexOf(trigger) + 1];
      if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
        e.preventDefault();
        closeMega();
        (nextTrigger || trigger).focus();
      } else if (e.shiftKey && document.activeElement === items[0]) {
        e.preventDefault();
        trigger.focus();
      }
    });
  });

  header.querySelectorAll('[data-mega-close], .topbar, .logo').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (!pinned) closeMega();
    });
  });

  header.addEventListener('mouseenter', () => clearTimeout(closeTimer));
  header.addEventListener('mouseleave', scheduleClose);
  scrim?.addEventListener('click', closeMega);

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      if (current) closeMega();
      closeDropdowns();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (current) {
      const trigger = triggers.find((t) => t.dataset.megaTrigger === current);
      closeMega();
      trigger?.focus();
    }
    closeDropdowns(true);
    if (mobileMenu?.classList.contains('is-open')) {
      setMobile(false);
      burger?.focus();
    }
  });

  /* Applications: left list switches the right panel */
  header.querySelectorAll('[data-apps]').forEach((apps) => {
    const tabs = [...apps.querySelectorAll('[data-apps-tab]')];
    const appPanels = [...apps.querySelectorAll('[data-apps-panel]')];

    const activate = (tab) => {
      const key = tab.dataset.appsTab;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      appPanels.forEach((p) => {
        const on = p.dataset.appsPanel === key;
        p.hidden = !on;
        p.classList.toggle('is-active', on);
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener('mouseenter', () => {
        if (!tab.classList.contains('is-active')) activate(tab);
      });
      tab.addEventListener('focus', () => {
        if (!tab.classList.contains('is-active')) activate(tab);
      });
      tab.addEventListener('click', (e) => {
        if (!tab.classList.contains('is-active')) {
          e.preventDefault();
          activate(tab);
        }
      });
    });
  });

  /* Small dropdowns: AGI-Gruppe + language */
  const dropdowns = [
    ...[...header.querySelectorAll('[data-group]')].map((root) => ({ root, trigger: root.querySelector('[data-group-trigger]') })),
    ...[...header.querySelectorAll('[data-lang]')].map((root) => ({ root, trigger: root.querySelector('[data-lang-trigger]') })),
  ];

  function closeDropdowns(returnFocus = false) {
    dropdowns.forEach(({ root, trigger }) => {
      if (!root.classList.contains('is-open')) return;
      root.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus && root.contains(document.activeElement)) trigger.focus();
    });
  }

  dropdowns.forEach(({ root, trigger }) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !root.classList.contains('is-open');
      closeDropdowns();
      if (open) {
        closeMega();
        root.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
    root.addEventListener('focusout', (e) => {
      if (!root.contains(e.relatedTarget)) {
        root.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  header.addEventListener('click', (e) => {
    if (!e.target.closest('[data-group], [data-lang]')) closeDropdowns();
  });

  /* Mobile menu */
  function setMobile(open) {
    if (!mobileMenu || !burger) return;
    header.style.setProperty('--header-offset', `${header.getBoundingClientRect().bottom}px`);
    mobileMenu.classList.toggle('is-open', open);
    header.classList.toggle('is-menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
    document.body.classList.toggle('is-locked', open);
  }

  burger?.addEventListener('click', () => setMobile(!mobileMenu.classList.contains('is-open')));

  mobileMenu?.querySelectorAll('[data-acc]').forEach((item, _, all) => {
    const trigger = item.querySelector('[data-acc-trigger]');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      all.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('[data-acc-trigger]')?.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  desktop.addEventListener('change', () => {
    closeMega();
    closeDropdowns();
    setMobile(false);
  });

  document.addEventListener('drawer:open', () => {
    closeMega();
    closeDropdowns();
    setMobile(false);
  });

  /* Scrolled state */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

const header = document.querySelector('[data-header]');
if (header) initHeader(header);
