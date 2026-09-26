# Ryan Holloway portfolio

Personal portfolio for Ryan Holloway: video editor, cinematographer, motion designer, Denver. Kyle (his brother) drives the build; Ryan reviews and supplies media. The site's job is to land senior, somewhat corporate editing roles while still showing character.

## Stack

- Astro (static output), TypeScript, vanilla client scripts. No UI framework, no CMS.
- Hosted on Vercel Hobby with a custom domain. All media lives in the repo under `public/media/`. Hobby allows 100 GB/month of static transfer; if that ever bites, case-study films move to Vimeo embeds and only the hero and grading clips stay self-hosted.
- One page (`src/pages/index.astro`). Case studies and the photo lightbox are overlays on that page, not routes.

## Layout of the code

- `src/components/` one component per section, in page order: Hero, Process (Grading + Sound), Work, Photography, About, plus CaseStudy and Lightbox overlays, Header, Icon.
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
- Header shows over the hero on load, fades out after ~3 s (a slow 1.8 s fade with a slight blur) so the film is all you see, and returns as a sticky glass bar (translucent, blurred, saturated, hairline highlight) from the first section after the hero onward (the script reads the hero's next sibling, so reordering sections is safe). Moving the pointer to the top edge while hidden peeks it. States live in `data-state` on `header.site` (intro, hidden, peek, stuck).
- The header is Ryan's "rh" monogram only, no name text. `public/logo.png` is the dark-background version (the grey r lifted to off-white, the tan h untouched). The original two-tone file is `public/media/images/logo-source.png`; `logo-dark-text.png` is the trimmed original for light backgrounds.
- Square zero-gap grids for button groups (social icons, hero play/mute).
- No footer. About is the last thing on the page.
- No scroll-triggered entrance animations. Motion only where it shows something: the wipe, the timeline, the audio panel.

## Section behaviour

- Hero fills the viewport: video, then a fixed-height timeline strip with a pinned ruler that scrolls vertically inside itself. Play/mute buttons sit on the video. Drag on the timeline to scrub. Option + scroll zooms time, Shift + scroll changes track height, horizontal scroll pans. The renderer is `src/scripts/timeline.ts`; the sequence is Ryan's real teaser cut transcribed in `src/data/hero-timeline.ts` (generator in `src/data/timeline.ts` is the fallback). Hero video is `public/media/video/hero.mp4` (Ryan's 4K export) with `hero-720.mp4` for small screens, chosen by an inline script before fetch.
- Work grid: hover plays the film on devices with a pointer, click opens the case study overlay.
- Case study: title, meta, film with a scrubber and amber note markers, notes on the right that seek the film and highlight as it plays. Back button, Escape, arrow keys between projects.
- Color Grading: one slider, no toggles. The same 14 s of the teaser exported at every stage (S-Log3,
  Rec.709, final grade) stacked as synced 1080p videos. The rail under the frame is the control and its
  stops are the stages left to right. At a stop the whole frame is that stage; between two stops the later
  stage sweeps in from the right edge, so the earlier stage is always on the left and the frame reads in
  the same order as the rail. Drag on the frame or the rail, arrow keys on the rail. Stage names and order
  live in `src/data/grade.ts`; a stage with an empty src is skipped.
- Sound Design: Web Audio crossfade between a simulated raw and a processed mix, a synthesized score bed with ducking, live spectrum and EQ curve. Everything here is placeholder until raw + mix files exist.
- Photography: six-column grid, lightbox with arrows and keyboard.

## Placeholders still in place

Project names, clients, copy, project footage (Wikimedia Commons), all stills (picsum), the interview audio, the headshot, the social links, the email. The hero video, its timeline and the three grading clips are real. Replace via `src/data/` and `public/media/`.

## Working conventions

- Do not add `-webkit-backdrop-filter` next to `backdrop-filter`. The CSS minifier collapses the pair into the prefixed one only and Chrome then ignores it. Write the unprefixed property alone; the build handles prefixes.

- Verify visually in a browser after changes; the hero timeline and audio panel are canvas and Web Audio, and break silently.
- Keep placeholder media remote until Ryan's files arrive, then switch `src/data/media.ts` to `/media/...` paths.
- Prefer editing `src/data/` for content changes and `global.css` for style changes. Only touch scripts for behaviour.

## Where things stand (updated 2026-09-25, end of first build session)

Kyle and Ryan review together, section by section, top of page down. Verified in Chrome after every
change, committed and pushed to `main` after each accepted round. Header, hero and timeline are
considered done for now; The Work is the next section to refine. Page order is Hero, The Process, The Work,
Photography, About: the hero film feeds straight into the grading and sound sections, so they sit first.

Decisions made in review that are not obvious from the code:
- Hero copy, transport bar, timecode readout and the timeline caption were all removed on request.
  The hero is video plus timeline plus two square buttons only.
- Motion section, footer, contact section, clients line, palette strip and look descriptions were all
  cut. Don't reintroduce supporting copy or a footer.
- Header: logo mark only (no name). Intro fade timer starts on page load, not first frame; flagged to
  Kyle as a judgement call, not yet changed.
- Timeline commands are the ones Ryan asked for: Option+scroll zoom, Shift+scroll track height,
  horizontal pan, drag to scrub. A hover-only hint sits bottom-right of the strip; can be removed.
- Video lives in the repo on purpose (Vercel Hobby, 100 GB/month static transfer). Vercel Blob was
  rejected (10 GB/month cap). Plan B if bandwidth bites: Vimeo embeds for case-study films only.
- Hero video is Ryan's own Resolve export, served untouched at 4K (33 MB, 41.9 s). Ryan signed off on
  the colour of his file, so do not re-encode it. The earlier colour shift was the missing Rec.709
  primaries/matrix flags; they are rewritten in the bitstream with an ffmpeg bitstream filter (recipe in
  `public/media/README.md`). `hero-720.mp4` is a downscale for phones only. To swap in a new export:
  remux with the filter, re-encode the 720, re-cut `hero-poster.jpg`, rebuild, verify, commit.
  `git config http.postBuffer` is already raised for pushes.
- Hero timeline data is transcribed from Ryan's Resolve screenshots (±0.15 s). The 2026-09-25 export trimmed
  the last 7.5 s (49.4 s to 41.9 s); frame alignment confirmed everything before that is unchanged, so the
  transcription still syncs. Open questions for Ryan: the sequence runs to ~60 s but the export is 41.9 s; an FCP XML export
  would give frame accuracy. Real filmstrip frames from the video are the next timeline step and
  need nothing from Ryan; real per-track waveforms need audio stems.
- Verification habit: use the Chrome DevTools MCP against `npx astro preview` on port 4321, check
  console for errors, screenshot the affected section. Reload with a fresh query string
  (`/?v=N`) to defeat cache; avoid `#hash` URLs when testing the header, they distort scroll tests.
- Git identity is Kyle's; commits end with the Claude co-author line.

Remaining sections to review in order: The Work (grid + case study), The Process (grading examples
with Ryan's clips, sound design with real raw/mix files and a plugin capture), Photography (real
stills), About (headshot, copy, gear, real links), then the share image with the real logo.
