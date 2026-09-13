# QR Code Generator

Create, customize and export QR codes — fully client-side, no server, no tracking.
Deploys as a static site to GitHub Pages.

## Features

- **Payload presets** — URL, Custom text, WiFi, Contact (vCard),
  Business card (MeCard), Email, SMS, WhatsApp, Telegram, Signal, Phone
  call, Location, Calendar event, 2FA (TOTP), Crypto address (with
  BIP21 amount/label/message). The generated string is always inspectable
  and copyable.
- **Styling** — 6 dot styles, corner styles, solid or gradient module/background
  colors, a live color picker for every stop, quiet-zone margin,
  error-correction level (L/M/Q/H). QR **version** control (auto, or forced
  1–40 with a live grid preview) tunes the code's density and capacity.
- **Scan-check** — the preview is decoded client-side (`jsQR`) so you get an
  immediate "Scans OK" confirmation that styling and logos haven't broken
  scannability before you export.
- **Badge & caption** — center the QR with an uploaded image or a rendered text
  wordmark (forces EC level H), and an optional caption line below the code
  that is included in exports.
- **Exports** — one Export menu with PNG download, SVG download, and copy SVG
  to clipboard. Live byte counter surfaces capacity overflow before the code
  fails to generate.
- **Adaptive theme** — follows the OS theme by default, with a light / dark /
  system toggle persisted in `localStorage`. Fully mobile responsive.
- **Installable PWA** — service worker with offline caching, install prompt,
  app icons, and Open Graph / Twitter cards.

## Local development

```bash
npm install
npm run dev       # develop at the printed localhost URL
npm run build     # production build into dist/
npm run preview   # serve the production build
npm run lint      # eslint
```

## Deploy to GitHub Pages

1. Push this repository to GitHub:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```

2. In the repo: **Settings → Pages → Source: GitHub Actions** (no branch
   selection needed).

3. The included `.github/workflows/deploy.yml` builds the app and publishes
   `dist/` on every push to `main` (or manually via **Actions → Deploy to
   GitHub Pages → Run workflow**).

The `base: "./"` setting in `vite.config.js` makes the build work under any
sub-path (`/`, `/repo-name/`, or a custom domain).

## Tech

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) for
  rendering and export