import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@docusaurus/useDocusaurusContext': '/workspace/docusaurus-poc/src/theme/__tests__/mocks/docusaurusContext.ts',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    env: {
      CHAT_ENDPOINT: 'https://chat-api.example.com',
    },
  },
});
