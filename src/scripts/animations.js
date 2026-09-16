import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fontsReady = () =>
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);

function splitLines(el) {
  return SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
}

function heroIntro() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const q = (key) => hero.querySelector(`[data-anim-hero="${key}"]`);
  const media = q('media');
  const eyebrow = q('eyebrow');
  const title = q('title');
  const desc = q('desc');
  const buttons = q('buttons');
  const line = q('line');
  const hotspot = q('hotspot');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  if (media) {
    tl.fromTo(
      media,
      { autoAlpha: 0, scale: 1.14 },
      { autoAlpha: 1, scale: 1, duration: 2.4, ease: 'power3.out', clearProps: 'transform' },
      0
    );
  }
  if (eyebrow) tl.from(eyebrow, { autoAlpha: 0, x: -16, duration: 1.1 }, 0.35);
  if (title) {
    const split = splitLines(title);
    gsap.set(title, { autoAlpha: 1 });
    tl.from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.1, onComplete: () => split.revert() }, 0.45);
  }
  if (desc) tl.from(desc, { autoAlpha: 0, y: 24, duration: 1.1 }, 0.85);
  if (buttons) {
    gsap.set(buttons, { autoAlpha: 1 });
    tl.from(buttons.children, { autoAlpha: 0, y: 18, duration: 1, stagger: 0.09 }, 0.95);
  }
  if (line) {
    gsap.set(line, { autoAlpha: 1 });
    tl.fromTo(
      line,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut', clearProps: 'clipPath' },
      1.05
    );
  }
  if (hotspot) tl.from(hotspot, { autoAlpha: 0, scale: 0, duration: 0.9, ease: 'back.out(2.4)' }, 2.2);
  const tabs = q('tabs');
  if (tabs) tl.from(tabs, { autoAlpha: 0, yPercent: 100, duration: 1.2 }, 1.2);
}

function scrollReveals() {
  const once = (trigger, start = 'top 85%') => ({ trigger, start, once: true });

  document.querySelectorAll('[data-anim="fade-up"]').forEach((el) => {
    gsap.from(el, { autoAlpha: 0, y: 24, duration: 1, ease: 'expo.out', scrollTrigger: once(el) });
  });

  document.querySelectorAll('[data-anim="split"]').forEach((el) => {
    const split = splitLines(el);
    gsap.set(el, { autoAlpha: 1 });
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 1.25,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: once(el),
      onComplete: () => split.revert(),
    });
  });

  document.querySelectorAll('[data-anim="line"]').forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 1, scaleX: 0 },
      { scaleX: 1, duration: 1.4, ease: 'power3.inOut', scrollTrigger: once(el, 'top 90%') }
    );
  });

  document.querySelectorAll('[data-anim="stagger"]').forEach((group) => {
    gsap.from(group.querySelectorAll('[data-anim-item]'), {
      autoAlpha: 0,
      y: 32,
      duration: 1.1,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: once(group, 'top 90%'),
    });
  });

  document.querySelectorAll('[data-anim="cards"]').forEach((group) => {
    const items = [...group.querySelectorAll('[data-anim-item]')];
    const media = items.map((item) => item.querySelector('.media'));
    const images = items.map((item) => item.querySelector('.media img'));
    const tl = gsap.timeline({ scrollTrigger: once(group, 'top 82%') });
    tl.from(items, { autoAlpha: 0, y: 60, duration: 1.2, stagger: 0.12, ease: 'expo.out' }, 0)
      .fromTo(
        media,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, stagger: 0.12, ease: 'expo.inOut', clearProps: 'clipPath' },
        0
      )
      .from(images, { scale: 1.25, duration: 1.8, stagger: 0.12, ease: 'expo.out', clearProps: 'transform' }, 0.1);
  });
}

function tabPanels() {
  document.addEventListener('tabs:change', (e) => {
    const panel = e.detail?.panel;
    if (!panel) return;
    const items = panel.querySelectorAll(':scope > ul > li');
    gsap.killTweensOf(items);
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 36 },
      { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out', clearProps: 'transform' }
    );
    ScrollTrigger.refresh();
  });
}

async function init() {
  if (reduced) {
    root.classList.remove('has-anim');
    return;
  }
  root.classList.add('anim-ready');
  await fontsReady();
  heroIntro();
  scrollReveals();
  tabPanels();
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

init();
