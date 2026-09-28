# Ryan Holloway portfolio

Personal portfolio for Ryan Holloway: video editor, cinematographer, motion designer, Denver. The site's job is
to land senior, somewhat corporate editing roles while still showing character.

This file is the single source of truth for every coding agent (Codex reads it directly, Claude Code imports it
from `CLAUDE.md`). Keep it current: when a decision changes, update it here in the same commit.

## Who you are working with

Two people prompt agents in this repo. Work out which one before doing anything.

- **Ryan** (the default on this Mac, home folder `/Users/ryanholloway`). The client and the designer. He vibe
  codes: he describes what he wants to see and hear, and judges the result by looking at it. He does not know
  git, does not read code, and will not review it. Follow the **Ryan procedure** below exactly.
- **Kyle**, Ryan's brother, a software engineer who set the project up. If the person says they are Kyle, or
  talks like an engineer about code, branches or tooling, treat them as Kyle: normal engineering collaboration,
  no hand-holding, explain in technical terms. Still pull `main` at the start of a session. Commit and push
  after each accepted round, as before, unless Kyle says otherwise.

If unsure, assume Ryan.

## Ryan procedure

The goal is a Base44-style experience: Ryan opens a session, the site is already on screen, he says what he
wants, and it changes in front of him. He only ever sees the site and your plain-English replies. Git, the
build, tests, media encoding and code quality are entirely your job. The git history on `main` will contain
trial and error; Kyle has accepted that as the price of Ryan never touching git.

### 1. Start of every session, before any change

Do all of this on your own at the start of the session, even if Ryan's first message is just "hi" or a
change request. Do not ask permission and do not narrate the steps.

1. `git status`. If there are uncommitted changes left from an earlier session, do not discard them. Run
   `npm run check && npm run build`; if both pass, commit them as
   `Leftover changes from an earlier session` and push. If they fail, save them with
   `git stash push -u -m "leftover <date>"` and tell Ryan in one sentence that some unfinished work from last
   time was set aside.
2. Make sure you are on `main` (`git switch main`). Ryan works on `main` only: no branches, no pull requests.
3. `git pull --rebase origin main`, so you are never working on a stale copy. If it conflicts, resolve it
   yourself (Ryan cannot), then `npm run check && npm run build`. Never ask Ryan to resolve anything in git.
4. If `package-lock.json` changed in the pull, or `node_modules` is missing, run `npm install`.
5. `npm run check && npm run build` to confirm the fresh copy is healthy. If `main` itself is broken, fix it
   first (and commit and push the fix) before taking requests.
6. **Put the site on screen for Ryan.** Start the dev server in the background so it keeps running for the
   whole session: `npm run dev` (http://localhost:4321, reloads by itself on every save). Open it where Ryan
   can see it: your built-in browser pane if you have one (Claude Code: the `dev` entry in
   `.claude/launch.json`), otherwise `open http://localhost:4321` to open it in his normal browser. If port
   4321 is taken by an old server from a previous session, stop that one first.
7. Greet him in one or two lines: the site is open and up to date, what would he like to change. If
   **Where things stand** lists something unfinished from last time, mention it in one line.

### 2. For every request

1. **Understand it visually.** Ryan talks about what he sees ("the grid feels cramped", "make the fade
   slower"). Translate that into the change yourself. If a request is ambiguous and cheap to try, make your
   best reading and show it. Ask only when two readings would lead to very different results, and ask in
   visual terms, never code terms.
2. **Make the change** following the conventions in this file.
3. **Test your own work. Never hand Ryan something unverified.**
   - `npm run check` (0 errors) and `npm run build` must both pass.
   - Look at the section you changed in the browser on the dev server, and point Ryan's view at it (scroll
     there) so he sees the result without hunting. Check the console for errors. Exercise the interaction you
     touched (click, drag, hover, keys).
   - If you changed scripts, media or the page head, also check the production build:
     `npx astro preview --port 4322` (4321 is Ryan's dev server), then stop it.
   - Check at desktop width and at phone width (375 px): no horizontal scroll, nothing overlapping.
   - The hero timeline, grading bar and audio panel are canvas and Web Audio and break silently; if you touched
     their scripts or data, test them even if they look fine.
   - Some browser tools screenshot `<video>` as black. That is the tool, not the site; confirm playback from
     script (`readyState`, `currentTime`) instead of assuming it is broken.
   - Leave Ryan's dev server and his tab running; that is his view of the site for the whole session. Close
     any extra tabs or servers you opened for your own testing. The hero plays with sound on, so a forgotten
     tab keeps playing audio at him.
4. **Commit and push, every time something works.** Do not wait to be asked, and do not batch a whole session
   into one commit.
   - `git status` first. Never commit `dist/`, `node_modules/`, `.env` or any secret, or a media file that has
     not been encoded per `public/media/README.md`.
   - `git add -A && git commit` with a short plain-English message describing what changed on the page
     (for example `Work grid: bigger gaps between films`). End it with the agent attribution line.
   - `git pull --rebase origin main`, then `git push origin main`.
   - If the push fails, pull and retry once. If it still fails, tell Ryan in one sentence that the change is
     saved on this computer and will go up next session, and put the error in the reply so Kyle can see it.
   - Nothing broken gets pushed.
   - One commit per working change, with a message that says what changed on the page. Never mix unrelated
     changes in one commit.
5. **Reply to Ryan** in plain language: what changed, where on the page to look, anything that did not work.
   No git terms, no code, no file paths unless he asks. Keep it short and friendly; suggest one natural next
   tweak if there is an obvious one.

### Adding new assets (videos, audio, photos, logos)

Ryan will hand over files by dragging them into the chat or by saying where they are ("it's in Downloads",
"the file on my desktop called ..."). Handle the rest:

1. Find the file. If you cannot, ask him where he saved it, in plain terms. Never ask for a path format.
2. Inspect it (`ffprobe` for video and audio: resolution, duration, codec, colour flags; size for images).
3. Encode it into `public/media/` per `public/media/README.md`, with a clear lowercase name. Never commit the
   raw export. Video and audio need `ffmpeg`; if it is missing, install it with `brew install ffmpeg`.
   Images: resize to what the layout needs and compress (`sips` is built into macOS).
4. Wire it up through `src/data/` (usually `media.ts`), replacing the placeholder it stands in for. If it is
   unclear where it goes, show him the likely spot and ask in visual terms.
5. Show him it on the page, then verify, commit and push as usual. Mention the file size if it is large.
6. Keep total media in the low hundreds of MB. If a file would push past that, tell him in one sentence and
   suggest a shorter or smaller version before adding it.

### 3. When Ryan wants to undo

"Undo that", "go back to how it was", "I liked the old one better": find the commit(s) by message and
`git revert` them (a new commit), then build, verify and push as usual. Never `git reset` or rewrite pushed
history.

### 4. End of a session

When Ryan signs off or a round of work clearly ends, update **Where things stand** below with anything a
future session needs to know (decisions made, open questions, what is half-done), commit and push. Make sure
every change is pushed, then stop the dev server and close the site tab.

### Never, for Ryan

- Force push, `git reset --hard` on pushed work, rebase pushed commits, delete branches, or create branches or
  PRs.
- Change GitHub, Vercel, DNS or domain settings.
- Add a dependency without a strong reason; if you do, say why in the commit message so Kyle sees it.
- Re-encode `hero.mp4` (see the hero notes below).
- Ask Ryan to run commands, read code, or make a technical choice he cannot judge.

## Code quality: it is on you

Ryan will not look at the code, and Kyle will only occasionally. You are the only reviewer, so hold the bar
yourself on every change:

- Follow the structure in "Layout of the code": content in `src/data/`, styles in `global.css` in the right
  section using the tokens at the top, behaviour in the matching `src/scripts/` module.
- Leave no debris. When an experiment is reverted or replaced, remove its CSS, data and script leftovers too.
  No commented-out code, no unused tokens, no duplicate rules, no `!important` or inline-style patches.
- Keep TypeScript types honest; no `any` to silence the checker.
- Keep it accessible: keyboard works, buttons have labels, focus is visible, `prefers-reduced-motion` respected
  where motion is decorative.
- Keep it fast: no unencoded media, no large new libraries, total media in the low hundreds of MB.
- Ryan's word overrides the design rules below (he is the client). If a request cuts against the brief (senior,
  somewhat corporate roles) or an earlier decision, say so once in plain terms, then do what he asks and update
  this file.

## Stack

- Astro (static output), TypeScript, vanilla client scripts. No UI framework, no CMS.
- Hosted on Vercel Hobby with a custom domain. All media lives in the repo under `public/media/`. Hobby allows
  100 GB/month of static transfer; if that ever bites, case-study films move to Vimeo embeds and only the hero
  and grading clips stay self-hosted.
- One page (`src/pages/index.astro`). Case studies and the photo lightbox are overlays on that page, not routes.
- Commands: `npm run dev` (live reload, port 4321), `npm run check` (types), `npm run build`,
  `npx astro preview` (serves the built `dist/`). Kyle is setting up Vercel and the domain separately.

## Layout of the code

- `src/components/` one component per section, in page order: Hero, Process (Grading + Sound), Work, Photography,
  About, plus CaseStudy and Lightbox overlays, Header, Icon.
- `src/scripts/` client behaviour, one module per component, all wired in `main.ts`. Data reaches scripts
  through `data-*` attributes or `<script type="application/json">` blocks, never globals.
- `src/data/` all content: `projects.ts`, `photos.ts`, `looks.ts` (grading examples), `site.ts` (copy, nav,
  links, gear), `media.ts` (URLs).
- `src/styles/global.css` every style, organised by section. Tokens at the top.
- `src/layouts/Base.astro` head: title, description, canonical, Open Graph, Twitter card, JSON-LD Person. Copy
  comes from `src/data/site.ts`.
- `public/media/README.md` has the ffmpeg encoding recipe. Keep total media in the low hundreds of MB.
- `docs/` plans. `docs/interactive-timeline.md` is the next big feature.
- `public/og.jpg` is the share image, generated from a styled HTML page at 1200×630. Regenerate it if the name,
  tagline or palette changes.

## Design rules that were decided on purpose

- Dark, near-black (`#0e0e0e`) with animated film grain and faint grey radial gradients. Not pure black.
- Instrument Sans for everything, Fraunces only for the about lede and the contact heading, JetBrains Mono only
  for real timecodes and technical labels.
- Copy is minimal. Section titles are two words ("The Work", "The Process"). No supporting paragraphs next to
  headings unless Ryan asks. No eyebrow labels, no all-caps.
- Right-hand text in two-column headers is right-aligned, not floating.
- Header shows over the hero on load, fades out after ~3 s (a slow 1.8 s fade with a slight blur) so the film is
  all you see, and returns as a sticky glass bar (translucent, blurred, saturated, hairline highlight) from the
  first section after the hero onward (the script reads the hero's next sibling, so reordering sections is
  safe). Moving the pointer to the top edge while hidden peeks it. States live in `data-state` on `header.site`
  (intro, hidden, peek, stuck).
- The header is Ryan's "rh" monogram only, no name text. `public/logo.png` is the dark-background version (the
  grey r lifted to off-white, the tan h untouched). The original two-tone file is
  `public/media/images/logo-source.png`; `logo-dark-text.png` is the trimmed original for light backgrounds.
- Square zero-gap grids for button groups (social icons, hero play/mute).
- Compact centered contact footer after About: “For inquiries please email”, email, then square social buttons.
- No scroll-triggered entrance animations. Motion only where it shows something: the wipe, the timeline, the
  audio panel.

## Section behaviour

- Hero fills the viewport: video, then a fixed-height timeline strip with a pinned ruler that scrolls vertically
  inside itself. Play/mute buttons sit on the video. The video defaults to sound on; browsers that refuse unmuted
  autoplay leave it paused until Play is pressed. Never fall back to muted autoplay.
  Drag on the timeline to scrub. Option + scroll zooms time, Shift + scroll changes track height, horizontal
  scroll pans. The renderer is `src/scripts/timeline.ts`; the sequence is Ryan's real teaser cut imported from Resolve in
  `src/data/hero-timeline.ts` (generator in `src/data/timeline.ts` is the fallback). Hero video is
  `public/media/video/hero.mp4` (Ryan's 4K export) with `hero-720.mp4` for small screens, chosen by an inline
  script before fetch.
- Work grid: hover plays the film on devices with a pointer, click opens the case study overlay.
- Case study: title, meta, film with a scrubber and amber note markers, notes on the right that seek the film and
  highlight as it plays. Back button, Escape, arrow keys between projects.
- Color Grading: one full-height bar, no toggles. The same 14 s of the teaser exported at every stage (S-Log3,
  Rec.709, final grade) stacked as synced 1080p videos. Log is left of the bar, Rec.709 right of it, and once
  the bar is left of the midpoint the final grade grows in from the right edge (its seam is at twice the bar
  position), so the frame always reads log, Rec.709, final left to right; far left is all final, far right is
  all log. The legend under the frame follows the bands. Drag on the frame or the legend, arrow keys on the
  frame. Stage names and order live in `src/data/grade.ts`; a stage with an empty src is skipped.
- Sound Design: square-grid toggle with two modes. Dialogue: Ryan's mix (`dialogue-mix.m4a`) and score bed
  (`score.m4a`) as real Web Audio buffers, equal-power crossfade raw <-> mix, score ducks under the dialogue
  envelope; the rack shows a live spectrum, the measured mix response curve and the chain chips, all from
  `src/data/sound.ts`. The raw side is simulated from the mix until a non-silent Raw-Dialogue.wav arrives (the
  first export was digital silence); set `audio.dialogueRaw` in `media.ts` and the simulation drops out. Then
  re-measure raw vs mix and replace `response`/`chain` with the true difference. Sound design mode
  (`stems.ts`): seven of Ryan's stems (dialogue + SFX 1-6, 16 s) decoded into per-channel gains, summed through
  a trim and a safety limiter (each stem peaks near full scale, unity sum clips by 5 dB); the picture is
  `design.mp4`, muted, slaved to the audio clock. Mute/solo per channel like an NLE, click a waveform to seek,
  buffers load when the mode is opened. Channel names, order and per-channel gain live in `sound.design.stems`.
- Photography: seven real images in two rows: four taller portrait/motorcycle images above three documentary photos.
  Preserve original colors; stack on phones. Lightbox with arrows and keyboard.

## Placeholders still in place

Project names, clients, copy, project footage (Wikimedia Commons), project stills (picsum), the interview audio, and the
unconnected social links. The hero video, its timeline, the three grading clips, the mixed
dialogue, the score bed, the sound design clip and its seven stems are real. Replace via `src/data/` and
`public/media/`. When Ryan hands over a file, encode it per `public/media/README.md`, switch the entry in
`src/data/media.ts` to a `/media/...` path, and keep placeholders remote until then.

## Working conventions

- Do not add `-webkit-backdrop-filter` next to `backdrop-filter`. The CSS minifier collapses the pair into the
  prefixed one only and Chrome then ignores it. Write the unprefixed property alone; the build handles prefixes.
- Prefer editing `src/data/` for content changes and `global.css` for style changes. Only touch scripts for
  behaviour.
- When testing the header, reload with a fresh query string (`/?v=N`) to defeat cache, and avoid `#hash` URLs;
  they distort scroll tests.
- Git on Ryan's Mac commits as Ryan Holloway (`facemelter99` on GitHub, repo-local config) and pushes to
  `Holloway-Projects/ryan-holloway-portfolio` over HTTPS through the `gh` credential helper. `http.postBuffer` is raised for
  large media pushes. Commits end with the agent's co-author line.

## Where things stand (updated 2026-09-26)

Ryan now drives changes himself by prompting agents, following the Ryan procedure above; Kyle set this up and
steps in as the engineer. Page order is Hero, The Process, The Work, Photography, About: the hero film feeds
straight into the grading and sound sections, so they sit first. Header, hero and timeline are considered done
for now; The Work is the next section to refine.

Decisions made in review that are not obvious from the code:
- Photography (2026-09-28): seven supplied JPEGs replace all gallery placeholders. Optimized at their
  supplied 1024 px maximum dimension. Four equal, cropped tiles on top (motorcycle fills its tile with no bars),
  three uncropped documentary images below, with 12 px gaps. Ryan likes this for now; may revisit the layout.
- About portrait (2026-09-28): Ryan’s ryan.2025.jpg is now a centered 4:5 crop, 1200×1500 JPEG at
  /media/images/ryan-headshot.jpg. Preserve the supplied colors; no CSS color filter.
- Contact (2026-09-28): moved out of About into a compact footer. Email is mail.ryanholloway@gmail.com.
  LinkedIn (ryan-holloway-014420283) and Instagram (mail.ryanholloway) are connected. Vimeo awaits Ryan’s link.
  Social buttons appear only when real profile links are supplied; hide placeholder links and CV downloads.
- Hero sound (2026-09-28): Ryan wants unmuted by default. If the browser blocks sound-on autoplay, wait
  for Play with audio enabled instead of silently playing muted.
- Hero copy, transport bar, timecode readout and the timeline caption were all removed on request. The hero is
  video plus timeline plus two square buttons only.
- Motion section, footer, contact section, clients line, palette strip and look descriptions were all cut. Don't
  reintroduce supporting copy. Ryan requested a compact contact footer on 2026-09-28.
- Header: logo mark only (no name). Intro fade timer starts on page load, not first frame; flagged to Kyle as a
  judgement call, not yet changed.
- Timeline commands are the ones Ryan asked for: Option+scroll zoom, Shift+scroll track height, horizontal pan,
  drag to scrub. A hover-only hint sits bottom-right of the strip; can be removed.
- Video lives in the repo on purpose (Vercel Hobby, 100 GB/month static transfer). Vercel Blob was rejected
  (10 GB/month cap). Plan B if bandwidth bites: Vimeo embeds for case-study films only.
- Hero video is Ryan's own Resolve export, served untouched at 4K (33 MB, 41.9 s). Ryan signed off on the colour
  of his file, so do not re-encode it. The earlier colour shift was the missing Rec.709 primaries/matrix flags;
  they are rewritten in the bitstream with an ffmpeg bitstream filter (recipe in `public/media/README.md`).
  `hero-720.mp4` is a downscale for phones only. To swap in a new export: remux with the filter, re-encode the
  720, re-cut `hero-poster.jpg`, rebuild, verify, commit.
- Hero timeline (2026-09-28): imported from Ryan's Main-Edit.drt at 24000/1001 fps,
  starting at frame zero and trimmed to the existing hero's 1,004 picture frames (41.875167 s),
  as Ryan requested. Data is in hero-timeline.json with a typed adapter in hero-timeline.ts;
  scripts/import-hero-timeline.py regenerates it and the 279 KB thumbnail atlas. See
  docs/interactive-timeline.md for the container ID and workflow. Thumbnails show the finished
  composite, not isolated source footage per track. Audio waveforms remain illustrative;
  real per-track peaks still need stems. Hero video itself was not modified.
- Grading slider (2026-09-25, late): the concept is accepted (one bar, S-Log3 / Rec.709 / final grade in order)
  but Kyle and Ryan do not love how the bar transitions between the three stages. Needs a new solve; parked
  while the sound section is built. Don't polish the current mechanism further.
- Sound section (2026-09-25): square-grid toggle with two modes. Mode one is the raw dialogue to mix crossfade
  with the score bed layered under. Mode two is sound design: seven isolated stems for a dialogue-free clip,
  channel list with waveforms and mute/solo on the left, the matching video on the right, one clock.

Remaining sections to review in order: The Work (grid + case study), The Process (grading examples with Ryan's
clips, sound design with real raw/mix files and a plugin capture), Photography (real stills), About (headshot,
copy, gear, real links), then the share image with the real logo.
