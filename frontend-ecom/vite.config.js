import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    "allowedHosts": ["ecomtest.squareshift.dev"],
    "host": true,
    "port": 5173
  },
  plugins: [react()],
})