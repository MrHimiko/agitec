import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://agitec.ch',
  devToolbar: { enabled: false },
  server: { port: 4321, host: true },
});
