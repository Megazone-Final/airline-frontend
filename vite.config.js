import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // 로컬 개발 시 '/api'로 시작하는 요청을 백엔드 도메인으로 전달
      '/api': {
        target: 'https://izones.cloud', 
        changeOrigin: true,
        secure: false, // SSL 인증서 문제 방지
        rewrite: (path) => path.replace(/^\/api/, '/api') // 경로 유지
      },
    },
  },
});