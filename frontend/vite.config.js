import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/tyradex': {
        target: 'https://tyradex.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tyradex/, ''),
      },
    },
  },
});
