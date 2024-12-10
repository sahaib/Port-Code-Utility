import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3001,
    host: true,
    watch: {
      usePolling: true
    },
    hmr: {
      clientPort: 3001
    },
    proxy: {
      '/api/proxy': {
        target: 'https://service.unece.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          const match = path.match(/\/api\/proxy\/([a-z]{2})\.htm$/i);
          if (match) {
            return `/trade/locode/${match[1].toLowerCase()}.htm`;
          }
          return path;
        },
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    modulePreload: {
      polyfill: true
    }
  }
});