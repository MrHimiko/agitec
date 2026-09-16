# AGITEC – Website

Static site built with [Astro](https://astro.build), plain CSS, no framework runtime.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:4321 (homepage) and http://localhost:4321/styleguide.

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serves dist/ locally
```

Vercel detects Astro automatically (build command `npm run build`, output `dist`).

## Structure

```
src/
  assets/            images (2x sources from Figma) and brand SVG
  components/
    header/          site-header, group-switcher, mega-menu, mobile-menu
    hero/            hero-slider
    sections/        usp-bar, solution-finder
    ui/              button, eyebrow, icon, tabs, brand-mark
  data/              navigation.js (menu content), home.js (page content)
  layouts/           Default.astro
  pages/             index.astro, styleguide.astro
  styles/            tokens, reset, base, utilities
```

Every component lives in its own folder with its `.astro`, `.css` and (if needed) `.js` file.

## Class naming

- `c-` components: `.c-site-header`, `.c-btn`, `.c-mega` (inner elements use short classes scoped through the root, e.g. `.c-mega .row-link`)
- `c-block--modifier` variants: `.c-btn--primary`, `.c-eyebrow--sm`
- `l-` layouts, `p-` pages with BEM sections: `.p-home__hero`
- `is-` / `has-` states: `.is-open`, `.is-active`, `.has-mega`
- utilities: `.fs-48`, `.fw-500`, `.mb-24`, `.text-muted`, `.font-heading`

## Breakpoints (desktop first)

1360 · 1280 · 1200 (burger menu) · 991 · 767 · 480
