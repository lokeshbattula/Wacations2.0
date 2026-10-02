import { defineConfig } from 'vite';

// Three.js is only reached through dynamic import() calls (src/main.js, src/components/tastes.js),
// so Vite splits it into lazily-loaded chunks automatically.
export default defineConfig({
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 700, // the lazy three.js chunk is expected to be large
  },
  server: { port: 5173 },
});
