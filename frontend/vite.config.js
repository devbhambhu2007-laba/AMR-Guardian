import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/assess': 'http://localhost:8000',
      '/guideline': 'http://localhost:8000',
      '/explain': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    }
  }
})
