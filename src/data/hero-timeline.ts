import type { Track, ClipKind } from './timeline';
import imported from './hero-timeline.json';

/** Resolve placement at 24000/1001 fps, starting at zero and trimmed to the reel. */
export const heroFps = imported.fpsNumerator / imported.fpsDenominator;
export const heroDuration = imported.endFrame / heroFps;
export const heroFilmstrip = imported.filmstrip;
export const heroThumbnailClips = new Map<string, { thumbnailFrames: number[]; thumbnailIndices: number[] }>();
for (const track of imported.tracks) {
  for (const clip of track.clips) {
    if ('thumbnailFrames' in clip && 'thumbnailIndices' in clip) {
      heroThumbnailClips.set(clip.id, { thumbnailFrames: clip.thumbnailFrames, thumbnailIndices: clip.thumbnailIndices });
    }
  }
}
export const heroSequence: Track[] = imported.tracks.map(track => ({
  id: track.id,
  name: track.name,
  type: track.type as Track['type'],
  clips: track.clips.map(clip => ({
    id: clip.id,
    name: clip.name,
    in: clip.startFrame / heroFps,
    out: clip.endFrame / heroFps,
    kind: clip.kind as ClipKind,
  })),
}));
