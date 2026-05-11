import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
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
      sourcemap: true
    },
    // Base path dinámico según plataforma:
    // - GitHub Pages: VITE_BASE_PATH=/Proyect-Laboria-Damian/
    // - Netlify: VITE_BASE_PATH=/
    // - Local: usa '/' por defecto
    base: env.VITE_BASE_PATH || '/',
  };
});
