import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH is set by the GitHub Pages workflow to "/<repo-name>/".
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
  server: {
    // During local development, calls to /api go to the FastAPI server.
    proxy: { '/api': 'http://localhost:8000' },
  },
});
