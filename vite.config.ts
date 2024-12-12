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
          const url = new URL(path, 'http://dummy.com');
          const targetUrl = url.searchParams.get('url');
          if (targetUrl) {
            return targetUrl.replace('https://service.unece.org', '');
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
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  define: {
    'process.env': {},
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'import.meta.env.VITE_MAPBOX_TOKEN': JSON.stringify(process.env.VITE_MAPBOX_TOKEN)
  }
});