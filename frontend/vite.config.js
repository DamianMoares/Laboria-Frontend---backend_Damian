import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      globals: true,
    },
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api/jcyl': {
          target: 'https://data.opendatasoft.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/jcyl/, ''),
        },
        '/api/serpapi': {
          target: 'https://serpapi.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/serpapi/, ''),
        },
        '/api/jobicy': {
          target: 'https://jobicy.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/jobicy/, ''),
        },
        '/api/himalayas': {
          target: 'https://himalayas.app',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/himalayas/, ''),
        },
        '/api/remotive': {
          target: 'https://remotive.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/remotive/, ''),
        },
        '/api/arbeitnow': {
          target: 'https://www.arbeitnow.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/arbeitnow/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor';
            if (id.includes('node_modules/react-router')) return 'vendor';
            if (id.includes('node_modules/react-hot-toast')) return 'ui';
          },
        },
      },
    },
    // Base path: Vercel y local usan '/', GitHub Pages necesita VITE_BASE_PATH
    base: env.VITE_BASE_PATH || '/',
  };
});
