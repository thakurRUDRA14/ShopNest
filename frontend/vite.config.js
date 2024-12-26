import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'), // rewrite path if i dont want to use /v1/
      },
    },
  },
})
