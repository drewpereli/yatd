import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';
import vitePluginFaviconsInject from 'vite-plugin-favicons-inject';

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        short_name: 'YATD',
        name: 'Yet Another Todo List',
        theme_color: '#ffffff',
        start_url: '/',
        icons: [
          {
            src: 'images/logo_192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'images/logo_512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    // @ts-expect-error vite-plugin-favicons-inject is not typed, and the inferred type isn't compatible with what vite expects from plugins
    vitePluginFaviconsInject('./public/images/logo.png'),
    {
      name: 'remove-favicons-manifest',
      transformIndexHtml(html) {
        return html.replace(
          '<link rel="manifest" href="/assets/manifest.webmanifest">',
          ''
        );
      },
    },
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
