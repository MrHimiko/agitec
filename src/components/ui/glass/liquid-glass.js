// Liquid glass refraction (kube.io technique), ported from the Divhunt site kit.
// A displacement map built from a rounded-rect distance field is applied as
// backdrop-filter: url(#id). Chromium only; other browsers keep the CSS blur fallback.

const NS = 'http://www.w3.org/2000/svg';
let svgRoot = null;
let seq = 0;

const profiles = {
  squircle: (x) => Math.pow(1 - Math.pow(1 - x, 4), 1 / 4),
  circle: (x) => Math.sqrt(1 - Math.pow(1 - x, 2)),
};

function curve1D(thickness, bezel, fn, ior, samples = 128) {
  const eta = 1 / ior;
  const refract = (nx, ny) => {
    const k = 1 - eta * eta * (1 - ny * ny);
    if (k < 0) return null;
    const ks = Math.sqrt(k);
    return [-(eta * ny + ks) * nx, eta - (eta * ny + ks) * ny];
  };
  const out = [];
  for (let i = 0; i < samples; i++) {
    const x = i / samples;
    const y = fn(x);
    const dx = x < 1 ? 0.0001 : -0.0001;
    const der = (fn(Math.max(0, Math.min(1, x + dx))) - y) / dx;
    const mag = Math.sqrt(der * der + 1);
    const r = refract(-der / mag, -1 / mag);
    out.push(r ? r[0] * ((y * bezel + thickness) / r[1]) : 0);
  }
  return out;
}

function sdf(px, py, hw, hh, rad) {
  const qx = Math.abs(px) - (hw - rad);
  const qy = Math.abs(py) - (hh - rad);
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - rad;
}

function paint(w, h, pixel) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) pixel(x, y, img.data, (y * w + x) * 4);
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

function normalAt(px, py, hw, hh, rad) {
  const nx = sdf(px + 1, py, hw, hh, rad) - sdf(px - 1, py, hw, hh, rad);
  const ny = sdf(px, py + 1, hw, hh, rad) - sdf(px, py - 1, hw, hh, rad);
  const len = Math.hypot(nx, ny) || 1;
  return [nx / len, ny / len];
}

const edgeDistance = (edges, x, y, w, h, hw, hh, rad) =>
  edges === 'top' ? -(y + 0.5) : sdf(x + 0.5 - hw, y + 0.5 - hh, hw, hh, rad);

const edgeNormal = (edges, px, py, hw, hh, rad) => (edges === 'top' ? [0, -1] : normalAt(px, py, hw, hh, rad));

function displacementMap(w, h, rad, bezel, curve, maxDisp, edges) {
  const hw = w / 2;
  const hh = h / 2;
  return paint(w, h, (x, y, data, i) => {
    const px = x + 0.5 - hw;
    const py = y + 0.5 - hh;
    const d = edgeDistance(edges, x, y, w, h, hw, hh, rad);
    let r = 128;
    let g = 128;
    if (d < 1 && -d < bezel) {
      const aa = d < 0 ? 1 : 1 - d;
      const ratio = Math.max(0, Math.min(1, Math.max(0, -d) / bezel));
      const dist = curve[Math.min(curve.length - 1, Math.floor(ratio * curve.length))] || 0;
      const [nx, ny] = edgeNormal(edges, px, py, hw, hh, rad);
      r = Math.max(0, Math.min(255, 128 + ((-nx * dist) / maxDisp) * 127 * aa));
      g = Math.max(0, Math.min(255, 128 + ((-ny * dist) / maxDisp) * 127 * aa));
    }
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = 0;
    data[i + 3] = 255;
  });
}

function specularMap(w, h, rad, opacity, angle, edges) {
  const hw = w / 2;
  const hh = h / 2;
  const L = [Math.cos(angle), Math.sin(angle)];
  const thick = 1.5;
  return paint(w, h, (x, y, data, i) => {
    const px = x + 0.5 - hw;
    const py = y + 0.5 - hh;
    const d = edgeDistance(edges, x, y, w, h, hw, hh, rad);
    if (!(d < 1 && -d < thick + 1)) return;
    const aa = d < 0 ? 1 : 1 - d;
    const [nx, ny] = edgeNormal(edges, px, py, hw, hh, rad);
    const dot = Math.abs(nx * L[0] - ny * L[1]);
    const edge = Math.max(0, Math.min(1, Math.max(0, -d) / thick));
    const coef = dot * Math.sqrt(1 - (1 - edge) * (1 - edge));
    const col = Math.min(255, 255 * coef);
    data[i] = col;
    data[i + 1] = col;
    data[i + 2] = col;
    data[i + 3] = Math.min(255, col * coef * aa * opacity);
  });
}

export function liquidGlass(el, opts = {}) {
  if (!el || !window.CSS?.supports?.('backdrop-filter', 'url(#a)')) return null;

  if (!svgRoot) {
    svgRoot = document.createElementNS(NS, 'svg');
    svgRoot.setAttribute('width', '0');
    svgRoot.setAttribute('height', '0');
    svgRoot.setAttribute('aria-hidden', 'true');
    svgRoot.style.position = 'absolute';
    document.body.appendChild(svgRoot);
  }

  seq += 1;
  const id = `liquid-glass-${seq}`;
  const state = { w: 0, h: 0, filter: null };

  const build = () => {
    const w = Math.max(2, Math.round(el.offsetWidth));
    const h = Math.max(2, Math.round(el.offsetHeight));
    if (w === state.w && h === state.h && state.filter) return;
    state.w = w;
    state.h = h;

    const radius = opts.radius ?? Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, h / 2);
    const bezel = Math.min(opts.bezel ?? 24, opts.edges === 'top' ? h : h / 2);
    const curve = curve1D(opts.thickness ?? 90, bezel, profiles[opts.profile] || profiles.squircle, opts.ior ?? 1.5);
    const maxDisp = Math.max(1, ...curve.map(Math.abs));
    const edges = opts.edges || 'all';
    const map = displacementMap(w, h, radius, bezel, curve, maxDisp, edges);
    const spec = specularMap(w, h, radius, opts.spec ?? 0.35, opts.specAngle ?? Math.PI / 3, edges);

    state.filter?.remove();
    const f = document.createElementNS(NS, 'filter');
    f.setAttribute('id', id);
    f.setAttribute('x', '0');
    f.setAttribute('y', '0');
    f.setAttribute('width', String(w));
    f.setAttribute('height', String(h));
    f.setAttribute('filterUnits', 'userSpaceOnUse');
    f.setAttribute('primitiveUnits', 'userSpaceOnUse');
    f.setAttribute('color-interpolation-filters', 'sRGB');
    f.innerHTML = `
      <feGaussianBlur in="SourceGraphic" stdDeviation="${opts.blur ?? 1.5}" result="b"/>
      <feColorMatrix in="b" type="saturate" values="${opts.saturate ?? 1.35}" result="s"/>
      <feImage href="${map}" x="0" y="0" width="${w}" height="${h}" result="map"/>
      <feDisplacementMap in="s" in2="map" scale="${maxDisp * (opts.refraction ?? 1)}" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feImage href="${spec}" x="0" y="0" width="${w}" height="${h}" result="spec"/>
      <feMerge><feMergeNode in="d"/><feMergeNode in="spec"/></feMerge>`;
    svgRoot.appendChild(f);
    state.filter = f;
    el.style.webkitBackdropFilter = `url(#${id})`;
    el.style.backdropFilter = `url(#${id})`;
    el.classList.add('is-live');
  };

  let t;
  const schedule = () => {
    clearTimeout(t);
    t = setTimeout(build, 120);
  };

  build();
  new ResizeObserver(schedule).observe(el);
  document.fonts?.ready.then(schedule);
  return { rebuild: build };
}

export function initGlass(root = document) {
  root.querySelectorAll('[data-glass]').forEach((el) => {
    const opts = el.dataset.glass ? JSON.parse(el.dataset.glass) : {};
    liquidGlass(el, opts);
  });
}
