import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/uploads": {
        target: "https://production-api.billbro.info",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Hashed filenames — WebView + browser long-term cache karta hai
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Vendor aur app code alag chunks — vendor rarely change hota hai
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          animation: ['framer-motion'],
          slider: ['swiper'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})