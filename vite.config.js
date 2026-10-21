import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the React app runs on :5173 and proxies /api to Spring Boot on :8080 (same origin, no CORS needed).
export default defineConfig({
  plugins: [react()],
  base: '/emi_studio/',
  server: { port: 5173, proxy: { '/api': 'http://localhost:8080' } }
});
