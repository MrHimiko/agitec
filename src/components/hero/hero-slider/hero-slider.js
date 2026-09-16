const AUTOPLAY_MS = 6500;

function initHero(root) {
  const slides = [...root.querySelectorAll('[data-hero-slide]')];
  const dots = [...root.querySelectorAll('[data-hero-dot]')];
  if (slides.length < 2) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer;

  const go = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle('is-active', on);
      slide.toggleAttribute('aria-hidden', !on);
      slide.querySelectorAll('a, button').forEach((el) => (on ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', '-1')));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', String(i === index));
    });
  };

  const stop = () => clearInterval(timer);
  const start = () => {
    if (reduced) return;
    stop();
    timer = setInterval(() => go(index + 1), AUTOPLAY_MS);
  };

  dots.forEach((dot, i) =>
    dot.addEventListener('click', () => {
      go(i);
      start();
    })
  );

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}

document.querySelectorAll('[data-hero]').forEach(initHero);
