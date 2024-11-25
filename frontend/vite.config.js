import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({   //Will send the request to the backend server
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // This matches any request starting with `/api`
        target: 'http://127.0.0.1:8000', // Your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})