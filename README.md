# QR Code Generator

Create, customize and export QR codes — fully client-side, no server, no tracking.
Deploys as a static site to GitHub Pages.

## Features

- **Payload presets** — URL, Custom text, WiFi, Contact (vCard), Email, SMS,
  Location, Calendar event, 2FA (TOTP), Crypto address. The generated string is
  always inspectable and copyable.
- **Styling** — 6 dot styles, corner styles, solid or gradient module/background
  colors, quiet-zone margin, error-correction level (L/M/Q/H).
- **Badge & caption** — center the QR with an uploaded image or a rendered text
  wordmark (forces EC level H), and an optional caption line below the code
  that is included in exports.
- **Exports** — PNG download, SVG download, copy SVG to clipboard. Live byte
  counter surfaces capacity overflow before the code fails to generate.
- **Adaptive theme** — follows the OS theme by default, with a light / dark /
  system toggle persisted in `localStorage`. Fully mobile responsive.

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