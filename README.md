# Ryan Holloway — portfolio

Static Astro site. No CMS. Content is hard-coded in `src/data/`, media lives in `public/media/`.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Where things live

- `src/pages/index.astro` — the one page, assembling sections in order
- `src/components/` — one component per section, plus the case study and lightbox overlays
- `src/scripts/` — client behaviour (timeline, grade wipe, audio, case study, lightbox)
- `src/data/` — projects, photos, grading examples, site copy, media URLs
- `src/styles/global.css` — tokens, grain, all section styles
- `public/media/` — video, audio and images (see `public/media/README.md` for encoding)
- `docs/` — plans and notes

## Deploy

Push to GitHub, import on Vercel. Astro is auto-detected; no config needed. Hobby plan is fine for a personal portfolio.
