import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png", "icon.svg"],
      manifest: {
        name: "QR Code Generator",
        short_name: "QR Generator",
        description:
          "Create, customize and download QR codes — text, links, WiFi, contacts and more.",
        theme_color: "#f8f4ec",
        background_color: "#fffdf8",
        display: "standalone",
        start_url: "./",
        scope: "./",
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
        navigateFallback: "./index.html",
        navigateFallbackDenylist: [/^\/~/, /^\/api/],
      },
    }),
  ],
  base: "./",
});