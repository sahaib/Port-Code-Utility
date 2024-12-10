import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'import.meta.env.VITE_MAPBOX_TOKEN': JSON.stringify(process.env.VITE_MAPBOX_TOKEN)
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
          // Extract country code from the URL
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
    // Ensure index.html is processed
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
