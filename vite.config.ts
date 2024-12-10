import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3001,
    host: true,
    hmr: {
      clientPort: 3001
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
