import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // all frontend calls to /api/* will go to your backend at 4000 in dev
      '/api': {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
})
