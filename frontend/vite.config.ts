import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for Connect Intelligence frontend.
 *
 * Environment variables (optional — create a .env file):
 *   VITE_API_BASE=https://your-backend-url.onrender.com
 *
 * If VITE_API_BASE is not set:
 *   - Development build → http://127.0.0.1:8000
 *   - Production build  → https://connectintelligence.onrender.com  (see config.ts)
 */
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
