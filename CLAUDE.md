# Ryan Holloway portfolio

Personal portfolio for Ryan Holloway: video editor, cinematographer, motion designer, Denver. Kyle (his brother) drives the build; Ryan reviews and supplies media. The site's job is to land senior, somewhat corporate editing roles while still showing character.

## Stack

- Astro (static output), TypeScript, vanilla client scripts. No UI framework, no CMS.
- Hosted on Vercel Hobby with a custom domain. All media lives in the repo under `public/media/`. Hobby allows 100 GB/month of static transfer; if that ever bites, case-study films move to Vimeo embeds and only the hero and grading clips stay self-hosted.
- One page (`src/pages/index.astro`). Case studies and the photo lightbox are overlays on that page, not routes.

## Layout of the code

- `src/components/` one component per section: Hero, Work, Process (Grading + Sound), Photography, About, plus CaseStudy and Lightbox overlays, Header, Icon.
- `src/scripts/` client behaviour, one module per component, all wired in `main.ts`. Data reaches scripts through `data-*` attributes or `<script type="application/json">` blocks, never globals.
- `src/data/` all content: `projects.ts`, `photos.ts`, `looks.ts` (grading examples), `site.ts` (copy, nav, links, gear), `media.ts` (URLs).
- `src/styles/global.css` every style, organised by section. Tokens at the top.
- `src/layouts/Base.astro` head: title, description, canonical, Open Graph, Twitter card, JSON-LD Person. Copy comes from `src/data/site.ts`.
- `public/media/README.md` has the ffmpeg encoding recipe. Keep total media in the low hundreds of MB.
- `docs/` plans. `docs/interactive-timeline.md` is the next big feature.
- `public/og.jpg` is the share image, generated from a styled HTML page at 1200×630. Regenerate it if the name, tagline or palette changes.

## Design rules that were decided on purpose

- Dark, near-black (`#0e0e0e`) with animated film grain and faint grey radial gradients. Not pure black.
- Instrument Sans for everything, Fraunces only for the about lede and the contact heading, JetBrains Mono only for real timecodes and technical labels.
- Copy is minimal. Section titles are two words ("The Work", "The Process"). No supporting paragraphs next to headings unless Ryan asks. No eyebrow labels, no all-caps.
- Right-hand text in two-column headers is right-aligned, not floating.
- Header is absolute over the hero and fades out on scroll. It is not sticky.
- Square zero-gap grids for button groups (social icons, hero play/mute, grading toggle).
- No footer. About is the last thing on the page.
- No scroll-triggered entrance animations. Motion only where it shows something: the wipe, the timeline, the audio panel.

## Section behaviour

- Hero fills the viewport: video, then a fixed-height timeline strip with a pinned ruler that scrolls vertically inside itself. Play/mute buttons sit on the video. Drag on the timeline to scrub. The timeline drawing is a placeholder until `docs/interactive-timeline.md` is built from Ryan's real sequence.
- Work grid: hover plays the film on devices with a pointer, click opens the case study overlay.
- Case study: title, meta, film with a scrubber and amber note markers, notes on the right that seek the film and highlight as it plays. Back button, Escape, arrow keys between projects.
- Color Grading: drag wipe between camera original and final grade. Two examples, each a different clip and grade.
- Sound Design: Web Audio crossfade between a simulated raw and a processed mix, a synthesized score bed with ducking, live spectrum and EQ curve. Everything here is placeholder until raw + mix files exist.
- Photography: six-column grid, lightbox with arrows and keyboard.

## Placeholders still in place

Project names, clients, copy, all footage (Wikimedia Commons), all stills (picsum), the interview audio, the headshot, the social links, the email. Replace via `src/data/` and `public/media/`.

## Working conventions

- Verify visually in a browser after changes; the hero timeline and audio panel are canvas and Web Audio, and break silently.
- Keep placeholder media remote until Ryan's files arrive, then switch `src/data/media.ts` to `/media/...` paths.
- Prefer editing `src/data/` for content changes and `global.css` for style changes. Only touch scripts for behaviour.
