import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://limitcode-pro.pages.dev',
  server: {
    host: true,
    port: 4321,
  },
  vite: {
    server: {
      host: '127.0.0.1',
    },
  },
});
