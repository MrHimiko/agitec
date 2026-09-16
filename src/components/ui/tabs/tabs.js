function initTabs(list) {
  const group = list.dataset.tabs;
  const tabs = [...list.querySelectorAll('[data-tab]')];
  const indicator = list.querySelector('.indicator');

  const moveIndicator = (tab) => {
    if (!indicator || !tab) return;
    indicator.style.setProperty('--indicator-x', `${tab.offsetLeft}px`);
    indicator.style.setProperty('--indicator-w', `${tab.offsetWidth}px`);
  };

  const select = (tab, focus = false) => {
    if (tab.classList.contains('is-active')) return;
    let activePanel = null;
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      if (on) t.removeAttribute('tabindex');
      else t.setAttribute('tabindex', '-1');
      const panel = document.getElementById(`${group}-panel-${t.dataset.tab}`);
      if (panel) {
        panel.hidden = !on;
        panel.classList.toggle('is-active', on);
        if (on) activePanel = panel;
      }
    });
    moveIndicator(tab);
    if (focus) tab.focus();
    list.dispatchEvent(new CustomEvent('tabs:change', { bubbles: true, detail: { panel: activePanel } }));
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      select(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
    });
  });

  const sync = () => moveIndicator(list.querySelector('[data-tab].is-active'));
  sync();
  document.fonts?.ready.then(sync);
  new ResizeObserver(sync).observe(list);
  requestAnimationFrame(() => list.classList.add('is-ready'));
}

document.querySelectorAll('[data-tabs]').forEach(initTabs);
