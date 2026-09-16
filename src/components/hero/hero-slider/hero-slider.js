import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const AUTOPLAY = 7;
const START_DELAY = 2600;
const HOTSPOT_HALF = 16.5;
const LINE_DROP = 114;
const SLOPE = 1.7325;

function initHero(root) {
  const slides = [...root.querySelectorAll('[data-hero-slide]')];
  const tabs = [...root.querySelectorAll('[data-hero-tab]')];
  const tabsBar = root.querySelector('.tabs-bar');
  const decor = root.querySelector('.decor');
  const hotspot = root.querySelector('[data-hero-hotspot]');
  const lineH = root.querySelector('[data-line-h]');
  const lineD = root.querySelector('[data-line-d]');
  const gradient = root.querySelector('[data-hero-gradient]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const part = (slide, name) => slide.querySelector(`[data-hero-part="${name}"]`);
  const descOpacity = parseFloat(getComputedStyle(part(slides[0], 'desc')).opacity) || 1;

  const state = { index: 0, hx: 0, hy: 0 };
  let busy = false;
  let progress = null;
  let hoverPause = false;

  const anchorOf = (slide) => {
    const a = JSON.parse(slide.dataset.anchor);
    return {
      x: (a.x[0] / 100) * decor.clientWidth + a.x[1],
      y: (a.y[0] / 100) * decor.clientHeight + a.y[1],
    };
  };

  const textBounds = () => {
    const slide = slides[state.index];
    const content = slide.querySelector('.content');
    const head = slide.querySelector('[data-hero-head]');
    const foot = slide.querySelector('[data-hero-foot]');
    return {
      edge: content.offsetLeft + head.offsetLeft + 1,
      top: content.offsetTop + head.offsetTop + head.offsetHeight + 24,
      bottom: content.offsetTop + foot.offsetTop - 24,
    };
  };

  function draw() {
    if (!decor.offsetParent && getComputedStyle(decor).display === 'none') return;
    hotspot.style.left = `${state.hx - HOTSPOT_HALF}px`;
    hotspot.style.top = `${state.hy - HOTSPOT_HALF}px`;

    const b = textBounds();
    const ex = state.hx - 7.5;
    const ey = state.hy + 3;
    if (b.bottom - b.top < 16) {
      lineH.setAttribute('d', '');
      lineD.setAttribute('d', '');
      return;
    }
    let ly = Math.min(Math.max(ey + LINE_DROP, b.top), b.bottom);
    if (Math.abs(ly - ey) < 1) ly = ey + 1;
    const bx = Math.max(b.edge + 40, ex - Math.abs(ly - ey) * SLOPE);
    lineH.setAttribute('d', `M${b.edge} ${ly}H${bx}`);
    lineD.setAttribute('d', `M${bx} ${ly}L${ex} ${ey}`);
    const up = ey < ly;
    gradient.setAttribute('y1', up ? '1' : '0');
    gradient.setAttribute('y2', up ? '0' : '1');
  }

  const place = () => {
    if (busy) return;
    const a = anchorOf(slides[state.index]);
    state.hx = a.x;
    state.hy = a.y;
    draw();
  };

  place();
  document.fonts?.ready.then(place);
  new ResizeObserver(place).observe(root);

  if (slides.length < 2) return;

  gsap.set(slides.slice(1), { autoAlpha: 0 });

  function setTabs(index) {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', String(on));
      if (on) tab.removeAttribute('tabindex');
      else tab.setAttribute('tabindex', '-1');
    });
    slides.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle('is-active', on);
      if (on) slide.removeAttribute('aria-hidden');
      else slide.setAttribute('aria-hidden', 'true');
      slide.querySelectorAll('a, button').forEach((el) => (on ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', '-1')));
    });
  }

  function resetFills() {
    tabs.forEach((tab) => {
      const fill = tab.querySelector('.fill');
      if (gsap.getProperty(fill, 'scaleX') > 0) {
        gsap.to(fill, { scaleX: 0, duration: 0.6, ease: 'power3.inOut', transformOrigin: '100% 50%' });
      }
    });
  }

  function startProgress() {
    progress?.kill();
    if (reduced) return;
    const fill = tabs[state.index].querySelector('.fill');
    gsap.killTweensOf(fill);
    gsap.set(fill, { scaleX: 0, transformOrigin: '0% 50%' });
    progress = gsap.to(fill, {
      scaleX: 1,
      duration: AUTOPLAY,
      ease: 'none',
      onComplete: () => goTo((state.index + 1) % slides.length),
    });
    if (hoverPause || document.hidden) progress.pause();
  }

  async function goTo(next) {
    if (busy || next === state.index) return;
    busy = true;
    progress?.kill();
    resetFills();

    const from = slides[state.index];
    const to = slides[next];
    const dir = next > state.index ? 1 : -1;
    const toImg = to.querySelector('[data-hero-img]');
    const fromImg = from.querySelector('[data-hero-img]');

    if (!toImg.complete) {
      toImg.loading = 'eager';
      await toImg.decode().catch(() => {});
    }

    setTabs(next);
    state.index = next;
    const target = anchorOf(to);

    const toTitle = part(to, 'title');
    const toParts = { eyebrow: part(to, 'eyebrow'), desc: part(to, 'desc'), buttons: part(to, 'buttons') };
    const fromParts = ['eyebrow', 'title', 'desc', 'buttons'].map((n) => part(from, n));

    gsap.set(to, { autoAlpha: 1, zIndex: 2 });
    gsap.set(from, { zIndex: 1 });
    gsap.set([toParts.eyebrow, toParts.desc], { autoAlpha: 0, y: 24 });
    gsap.set(toParts.buttons, { autoAlpha: 1, y: 0 });
    gsap.set(toParts.buttons.children, { autoAlpha: 0, y: 18 });
    gsap.set(toTitle, { autoAlpha: 1, y: 0 });
    const split = SplitText.create(toTitle, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.set(split.lines, { yPercent: 110 });

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        gsap.set(from, { autoAlpha: 0, zIndex: 0 });
        gsap.set(fromImg, { clearProps: 'transform' });
        split.revert();
        busy = false;
        startProgress();
      },
    });

    tl.to(fromParts, { autoAlpha: 0, y: -20, duration: 0.45, stagger: 0.04, ease: 'power2.in' }, 0)
      .fromTo(
        to.querySelector('.media'),
        { clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: 'expo.inOut', clearProps: 'clipPath' },
        0.05
      )
      .fromTo(toImg, { scale: 1.2, xPercent: 4 * dir }, { scale: 1, xPercent: 0, duration: 2.2, clearProps: 'transform' }, 0.05)
      .to(fromImg, { scale: 1.08, xPercent: -5 * dir, duration: 1.35, ease: 'expo.inOut' }, 0.05)
      .to(hotspot, { scale: 0.55, duration: 0.35, ease: 'power2.in' }, 0)
      .to(state, { hx: target.x, hy: target.y, duration: 1.35, ease: 'expo.inOut', onUpdate: draw }, 0.05)
      .to(hotspot, { scale: 1, duration: 0.9, ease: 'back.out(2.6)' }, 1.15)
      .to(toParts.eyebrow, { autoAlpha: 1, y: 0, duration: 1 }, 0.75)
      .to(split.lines, { yPercent: 0, duration: 1.2, stagger: 0.09 }, 0.82)
      .to(toParts.desc, { autoAlpha: descOpacity, y: 0, duration: 1 }, 1.0)
      .to(toParts.buttons.children, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 1.08);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => goTo(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      goTo(next);
    });
  });

  tabsBar?.addEventListener('mouseenter', () => {
    hoverPause = true;
    progress?.pause();
  });
  tabsBar?.addEventListener('mouseleave', () => {
    hoverPause = false;
    progress?.resume();
  });
  root.addEventListener('focusin', (e) => {
    if (e.target.closest('[data-hero-tab]')) progress?.pause();
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? progress?.pause() : !hoverPause && progress?.resume()));

  setTimeout(() => {
    slides.forEach((slide) => {
      const img = slide.querySelector('[data-hero-img]');
      if (img) img.loading = 'eager';
    });
    startProgress();
  }, reduced ? 0 : START_DELAY);
}

document.querySelectorAll('[data-hero]').forEach(initHero);
