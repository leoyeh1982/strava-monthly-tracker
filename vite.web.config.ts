import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-web',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/web/index.html'),
      },
    },
    minify: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});