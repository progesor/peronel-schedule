import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/peronel-schedule/', // GitHub Pages'deki alt dizin adınız
  plugins: [react()],
});
