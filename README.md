# Partners in Play — Hatch Play Kits

A static React + Vite app implementing the Hatch Final Prototype. Mobile-first, desktop-friendly, built to deploy as plain static files (cPanel `public_html`).

## Stack

- **React 18 + Vite** — static build, no server
- **HashRouter** — survives any static host (cPanel, S3, GitHub Pages) without rewrites
- **Cloudinary** — direct browser uploads for gallery photos (free unsigned preset)
- **Google Apps Script + Sheet** — submission queue + admin review (free, no infra)

## Project layout

```
src/
  pages/                 # one component per Figma frame
  components/            # Header, Decoration (SVG shapes), BackButton
  lib/                   # api.js (Cloudinary + Apps Script), tags.js, prompts.js
  assets/                # photos pulled from the Figma file
  styles/index.css       # design tokens + base styles
server/gallery.gs        # paste into Apps Script (see below)
```

## Local dev

```sh
npm install
cp .env.example .env       # fill in Cloudinary + Apps Script values
npm run dev
```

Open the printed `http://localhost:5173/` URL.

## Build & deploy to cPanel

```sh
npm run build
```

This produces `dist/`. Upload its **contents** (not the `dist` folder itself) to cPanel `public_html`. That is the only deploy step — there is no Node/PHP runtime to configure.

## Gallery backend setup (10 min, free)

The gallery upload form posts an image to Cloudinary, then sends metadata to a Google Apps Script Web App that appends a row to a Google Sheet. Approving a post is a one-cell edit in the sheet.

### 1. Cloudinary (image hosting)

1. Sign up at https://cloudinary.com (free).
2. Settings → Upload → **Add upload preset**:
    - Signing Mode: **Unsigned**
    - Folder: `partners-in-play` (optional)
    - Save.
3. Copy your **Cloud name** (top of the dashboard) and the **Upload preset name**.
4. Put them in `.env`:
    ```
    VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
    VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset
    ```

### 2. Google Sheet + Apps Script (review queue)

1. Create a new Google Sheet. Rename a tab to `posts`.
2. In row 1 add these headers exactly: `timestamp` `imageUrl` `description` `tags` `name` `status` `id`
3. Extensions → Apps Script. Replace the default `Code.gs` with the contents of `server/gallery.gs`.
4. (Optional) Set `ADMIN_EMAIL` at the top to get an email per submission.
5. Deploy → New deployment → **Web app**:
    - Execute as: **Me**
    - Who has access: **Anyone**
6. Copy the `/exec` URL into `.env`:
    ```
    VITE_GALLERY_API=https://script.google.com/macros/s/.../exec
    ```
7. Re-run `npm run build` and re-upload `dist/`.

### 3. Approving posts

Open the sheet. Submissions land with `status = pending`. To publish, change the `status` cell to `approved`. The community gallery page only fetches approved rows.

## Routes (HashRouter)

| Path                   | Frame                |
| ---------------------- | -------------------- |
| `/`                    | landing page         |
| `/bag/intro`           | Bag 1 (shake the bag) |
| `/bag/contents`        | Bag 2 (item key)     |
| `/bag/sparks`          | Bag 3 (Sparks)       |
| `/bag/shapables`       | Bag 4 (Shapables)    |
| `/bag/symbols`         | Bag 5 (Symbols)      |
| `/before-play`         | Before Play Intro    |
| `/timer`               | Camera 1/2 (timer)   |
| `/parents`             | Parents 1/2          |
| `/educators`           | Educator 1           |
| `/prompts`             | Prompt 2–5           |
| `/gallery`             | Comm Gallery 1/2     |
| `/gallery/upload`      | Gallery Upload       |

## Without backend

If `.env` values are missing, the Gallery Upload page shows a hint, the upload button is blocked at submit time with a clear message, and the Community Gallery falls back to two sample posts so the rest of the site is still browseable.

## Notes

- The `Hatch Final Prototype` Figma file (`KI4Hh0Hq1JbEW5jeugKEj0`) was the source of truth for screens, copy, tag colors, and asset photos.
- Decorative organic shapes (asterisks, half-moons, arcs, bursts) are inline SVG components in `src/components/Decoration.jsx`, not bitmap assets — keeps the bundle small and lets us recolour without re-exporting.
- HashRouter is intentional for cPanel: no server rewrite rules needed; deep links survive hard refresh.
