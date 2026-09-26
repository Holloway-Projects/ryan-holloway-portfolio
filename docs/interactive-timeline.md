# Interactive timeline for the hero

Status: planned, waiting on files from Ryan.
Scope: one-off, for the single video used in the hero.

## Idea

Replace the drawn placeholder timeline under the hero video with a real, data-driven
reconstruction of Ryan's actual sequence for that film. Because it is data rendered on
canvas rather than a screen recording, it can behave like his editor:

- Plain scroll moves through the track stack (already works today).
- Option + scroll zooms time horizontally around the cursor. Ruler re-labels itself as
  tick spacing changes, the way Premiere and Resolve do.
- Shift + scroll changes track height. Below a threshold clips draw as flat colored bars
  with a name. Above it, video clips show a thumbnail strip and audio clips show waveforms.
- Playhead stays in sync with the hero video. Scrubbing the transport scrubs both.

## How it gets built

1. Timeline as data. Transcribe the sequence into `data/hero-timeline.json`: tracks,
   clip names, in and out points, label colors, which clips carry thumbnails, audio clip
   levels. Same shape as an EDL or FCP XML export.
2. Canvas renderer reads that data. Zoom and track height are parameters. Static layer
   is re-rasterized on zoom or resize; playhead redraws every frame.
3. Thumbnails come from the hero video itself. Seek to each clip's in point, grab a frame
   to a small offscreen canvas, tile it across the clip. In filmstrip mode, repeat frames at
   intervals as zoom increases. Render bars first, fill frames in as they arrive.
4. Waveforms come from decoding the hero video's audio with the Web Audio API and
   drawing real peaks per audio clip. If stems exist, each track gets its own peaks;
   otherwise all audio clips draw from the mixed track with per-clip gain.

## Files needed from Ryan

1. Screenshots of the full sequence at a zoom where every clip name is legible, tiled
   left to right, with overlap between screenshots.
2. One screenshot fully zoomed out, showing total track count and overall shape.
3. Preferred: the sequence exported as FCP XML or EDL. Gives exact in and out points and
   removes the pixel-reading step.
   - Premiere: File > Export > Final Cut Pro XML
   - Resolve: File > Export > Timeline > FCP XML
4. The hero video file and its frame rate.
5. Optional: audio stems (dialogue, music, effects) if separate tracks should have
   distinct waveforms.

## Caveats

- Accuracy is faithful, not frame-perfect, unless XML is provided.
- Thumbnail extraction runs in the browser on load. First paint of filmstrips takes a
  second or two; bars show immediately.
- Safari seeks video more slowly than Chrome, so filmstrips fill in later there.
- Keyboard modifiers on scroll need a touch fallback on mobile (pinch to zoom time,
  two-finger drag for height, or just fixed sensible defaults).

## Where it plugs in

`index.html`, hero section: the `.capture` block holds `#tl-ruler` and `#tl` canvases
inside `#tl-scroll`. The current `drawStatic` and `drawRuler` functions are the
placeholder to replace. Transport, playhead sync and wheel handoff stay as they are.
