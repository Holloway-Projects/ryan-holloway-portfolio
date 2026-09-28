# Interactive hero timeline

The canvas timeline uses clip placement from Ryan's Main-Edit.drt Resolve export,
starting at frame zero. It is trimmed to the existing hero picture: 1,004 frames at
24000/1001 fps (41.875167 seconds). The MP4 audio/container runs about 22 ms longer;
the timeline ends at the last picture boundary. The hero media is unchanged.

## Importing a revised edit

Run `python3 scripts/import-hero-timeline.py /path/to/Main-Edit.drt CONTAINER_UUID`.
For the September 28 export, the main container is
`a06ea3b0-671c-4877-a653-71fc862f47c7`; the other containers are nested multicam
sequences. Inspect a new export before selecting its container. The importer checks
its frame rate against the hero and reads subframe audio positions. It excludes
transition objects (they overlap clips) and preserves genuine empty track ranges.
This is a placement importer for this export, not a general Resolve interchange tool.

The importer writes `src/data/hero-timeline.json` and a 160×90 JPEG thumbnail atlas
at `public/media/images/hero-filmstrip.jpg`. The DRT, original source footage and
absolute source paths are not published. Never re-encode hero.mp4 to update thumbnails.

## Rendering and verification

`src/data/hero-timeline.ts` converts frame boundaries to seconds. The renderer uses
the hero video's playback clock for the playhead and seeks that same video on drag.
Option-scroll zooms, Shift-scroll changes track height, horizontal scroll pans,
and ordinary vertical scroll moves through the track stack.

Thumbnails sample the **finished composite** every 12 frames inside each video clip,
including the first frame of short clips. They do not represent isolated source media
beneath an overlay. The atlas is loaded once and redrawn into the cached canvas layer.
Audio waveforms are still generated illustrations; real per-track peaks need stems.

Spot checks of frames 94/95, 144/145 and 335/336 in the current hero match the DRT cuts.
On any revised export, verify frame zero, several cuts and the endpoint against the
finished video before publishing. Check desktop/phone layout, playback and scrubbing.
