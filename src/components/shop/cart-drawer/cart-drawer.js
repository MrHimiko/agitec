const format = (value) =>
  `CHF ${new Intl.NumberFormat('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;

function initCart(root) {
  const list = root.querySelector('[data-cart-list]');
  const empty = root.querySelector('[data-cart-empty]');
  const rec = root.querySelector('[data-cart-rec]');
  const template = root.querySelector('[data-cart-template]');
  const drawer = root.closest('[data-drawer]');
  const subtotalEl = drawer.querySelector('[data-cart-subtotal]');
  const summary = drawer.querySelector('[data-cart-summary]');

  const bump = (el) => {
    el.classList.remove('is-bump');
    void el.offsetWidth;
    el.classList.add('is-bump');
  };

  function update({ animate = true } = {}) {
    const items = [...list.querySelectorAll('[data-cart-item]:not(.is-removing)')];
    let count = 0;
    let subtotal = 0;

    items.forEach((item) => {
      const input = item.querySelector('[data-qty-input]');
      const qty = Math.max(1, Math.min(999, parseInt(input.value, 10) || 1));
      const price = parseFloat(item.dataset.price);
      input.value = qty;
      item.querySelector('[data-qty-step="-1"]').disabled = qty <= 1;
      item.querySelector('[data-line-total]').textContent = format(price * qty);
      item.querySelector('[data-unit-price]').textContent = qty > 1 ? `${format(price)} / Stk.` : '';
      count += qty;
      subtotal += price * qty;
    });

    subtotalEl.textContent = format(subtotal);
    summary.classList.toggle('is-disabled', count === 0);
    empty.hidden = count > 0;
    if (count === 0) rec.classList.add('is-hidden');

    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      const changed = el.textContent !== String(count);
      el.textContent = count;
      el.hidden = count === 0;
      if (changed && animate) bump(el);
    });
  }

  root.addEventListener('click', (e) => {
    const step = e.target.closest('[data-qty-step]');
    if (step) {
      const input = step.closest('[data-cart-item]').querySelector('[data-qty-input]');
      input.value = (parseInt(input.value, 10) || 1) + Number(step.dataset.qtyStep);
      update();
      return;
    }

    const remove = e.target.closest('[data-cart-remove]');
    if (remove) {
      const item = remove.closest('[data-cart-item]');
      item.classList.add('is-removing');
      update();
      item.addEventListener('transitionend', () => item.remove(), { once: true });
      setTimeout(() => item.remove(), 600);
      return;
    }

    if (e.target.closest('[data-cart-add]') && template) {
      const item = template.content.firstElementChild.cloneNode(true);
      item.removeAttribute('data-drawer-item');
      item.classList.add('is-new');
      list.append(item);
      rec.classList.add('is-hidden');
      update();
    }
  });

  root.addEventListener('change', (e) => {
    if (e.target.matches('[data-qty-input]')) update();
  });

  root.addEventListener('keydown', (e) => {
    if (e.target.matches('[data-qty-input]') && e.key === 'Enter') {
      e.preventDefault();
      update();
    }
  });

  update({ animate: false });
}

document.querySelectorAll('[data-cart]').forEach(initCart);
