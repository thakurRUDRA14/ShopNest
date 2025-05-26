import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Do not use import.meta.env in vite.config.js.
// Always use loadEnv() to load environment variables in vite.config.js.

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd());
  const backendURL = env.VITE_BACKEND_URL;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: backendURL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
          onError: (err) => {
            console.error('Proxy error:', err);
          },
        },
      },
    },
  };
});
