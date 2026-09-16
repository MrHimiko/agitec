import { icons } from '../../ui/icon/icons.js';

const LIMITS = { products: 6, applications: 5, downloads: 3 };

const icon = (name, size = 16) => {
  const { box, body } = icons[name];
  return `<svg class="c-icon" width="${size}" height="${size}" viewBox="${box}" fill="none" aria-hidden="true">${body}</svg>`;
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

function highlight(text, query) {
  const plain = normalize(text);
  const at = plain.indexOf(query);
  if (!query || at < 0) return escapeHtml(text);
  return (
    escapeHtml(text.slice(0, at)) +
    `<mark>${escapeHtml(text.slice(at, at + query.length))}</mark>` +
    escapeHtml(text.slice(at + query.length))
  );
}

function initSearch(root) {
  const data = JSON.parse(document.getElementById('search-index')?.textContent || '{}');
  const form = root.querySelector('[data-search-form]');
  const input = root.querySelector('[data-search-input]');
  const clear = root.querySelector('[data-search-clear]');
  const idle = root.querySelector('[data-search-idle]');
  const results = root.querySelector('[data-search-results]');
  let timer;

  const match = (list, q, fields) => list.filter((item) => fields.some((f) => normalize(item[f] || '').includes(q)));

  function render(raw) {
    const query = raw.trim();
    const q = normalize(query);
    clear.hidden = !query;

    if (q.length < 2) {
      idle.hidden = false;
      results.hidden = true;
      results.innerHTML = '';
      return;
    }

    const products = match(data.products, q, ['name', 'category', 'sku']);
    const applications = match(data.applications, q, ['name', 'meta']);
    const downloads = match(data.downloads, q, ['name']);
    const total = products.length + applications.length + downloads.length;
    let i = 0;
    let html = '';

    if (!total) {
      html = `
        <div class="search-empty" data-result>
          <span class="empty-icon">${icon('search', 22)}</span>
          <p class="empty-title">Keine Treffer für «${escapeHtml(query)}»</p>
          <p class="empty-text">Prüfen Sie die Schreibweise oder probieren Sie einen dieser Begriffe. Unsere Anwendungstechnik hilft Ihnen gerne weiter.</p>
          <ul class="chips empty-chips">
            ${['Aerogel', 'VIP', 'Brandschutz'].map((t) => `<li><button class="chip" type="button" data-search-term="${t}">${icon('search', 14)}${t}</button></li>`).join('')}
          </ul>
        </div>`;
    } else {
      html += `<p class="results-meta" data-result><strong>${total} Treffer</strong> für «${escapeHtml(query)}»</p>`;

      if (products.length) {
        html += `<section class="result-group">
          <p class="drawer-block-title" data-result style="--i:${i++}">Produkte <span class="count">${products.length}</span></p>
          <ul class="result-list">
            ${products
              .slice(0, LIMITS.products)
              .map(
                (p) => `<li data-result style="--i:${i++}">
                  <a class="result-product" href="#">
                    <span class="result-thumb"><img src="${p.thumb}" alt="" width="72" height="72" loading="lazy" /></span>
                    <span>
                      <span class="result-name">${highlight(p.name, q)}</span>
                      <span class="result-meta">${highlight(p.category, q)} · <span class="price">${escapeHtml(p.priceLabel)}</span></span>
                    </span>
                    <span class="result-arrow">${icon('chevron-right', 16)}</span>
                  </a>
                </li>`
              )
              .join('')}
          </ul>
        </section>`;
      }

      if (applications.length) {
        html += `<section class="result-group">
          <p class="drawer-block-title" data-result style="--i:${i++}">Anwendungen <span class="count">${applications.length}</span></p>
          <ul class="result-list">
            ${applications
              .slice(0, LIMITS.applications)
              .map(
                (a) => `<li data-result style="--i:${i++}">
                  <a class="result-row" href="#">
                    <span class="row-icon">${icon('layers', 18)}</span>
                    <span><span class="row-name">${highlight(a.name, q)}</span><span class="row-meta">${escapeHtml(a.meta)}</span></span>
                    <span class="result-arrow">${icon('arrow-right', 14)}</span>
                  </a>
                </li>`
              )
              .join('')}
          </ul>
        </section>`;
      }

      if (downloads.length) {
        html += `<section class="result-group">
          <p class="drawer-block-title" data-result style="--i:${i++}">Downloads <span class="count">${downloads.length}</span></p>
          <ul class="result-list">
            ${downloads
              .slice(0, LIMITS.downloads)
              .map(
                (d) => `<li data-result style="--i:${i++}">
                  <a class="result-row" href="#">
                    <span class="row-icon row-icon--file">PDF</span>
                    <span><span class="row-name">${highlight(d.name, q)}</span><span class="row-meta">${escapeHtml(d.meta)}</span></span>
                    <span class="result-arrow">${icon('download', 16)}</span>
                  </a>
                </li>`
              )
              .join('')}
          </ul>
        </section>`;
      }

      html += `<a class="c-btn c-btn--primary c-btn--sm c-btn--block results-all" href="#" data-result style="--i:${i++}">
        <span class="text">Alle ${total} Ergebnisse anzeigen</span>${icon('arrow-right', 16).replace('c-icon', 'c-icon btn-icon')}
      </a>`;
    }

    idle.hidden = true;
    results.hidden = false;
    results.innerHTML = html;
  }

  input.addEventListener('input', () => {
    clearTimeout(timer);
    form.classList.remove('is-searching');
    void form.offsetWidth;
    form.classList.add('is-searching');
    timer = setTimeout(() => render(input.value), 120);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    render(input.value);
  });

  clear.addEventListener('click', () => {
    input.value = '';
    render('');
    input.focus();
  });

  root.addEventListener('click', (e) => {
    const term = e.target.closest('[data-search-term]');
    if (!term) return;
    input.value = term.dataset.searchTerm;
    render(input.value);
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      const first = results.querySelector('a');
      if (first && !results.hidden) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  results.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const links = [...results.querySelectorAll('a')];
    const at = links.indexOf(document.activeElement);
    if (at < 0) return;
    e.preventDefault();
    if (e.key === 'ArrowUp' && at === 0) input.focus();
    else links[Math.min(links.length - 1, Math.max(0, at + (e.key === 'ArrowDown' ? 1 : -1)))].focus();
  });
}

document.querySelectorAll('[data-search]').forEach(initSearch);
