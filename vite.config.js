import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':   ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui':     ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-redux':   ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'vendor-firebase':['firebase/app', 'firebase/storage', 'firebase/auth'],
          'vendor-maps':    ['@react-google-maps/api'],
        },
      },
    },
  },
});