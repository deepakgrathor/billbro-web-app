import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      "/uploads": {
        target: "https://production-api.billbuzz.info",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
