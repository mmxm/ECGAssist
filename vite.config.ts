import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'ECGAssist - Aide à l\'interprétation d\'ECG',
        short_name: 'ECGAssist',
        description: 'Outil clinique d\'aide à l\'interprétation méthodique des ECG et générateur de compte-rendu',
        theme_color: '#0284c7',
        background_color: '#f8fafc',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
