import { audio, video } from './media';

export interface Stem { id: string; name: string; src: string; /** Channel trim, 1 = unity. */ gain?: number }

/**
 * Sound section. Mode one is the dialogue A/B: raw location audio against Ryan's mix, with his score bed
 * under it. Mode two is sound design: isolated stems for a dialogue-free clip, mute/solo per channel.
 *
 * `chain` and `response` describe what the mix did to the raw. They were measured from Edited-Dialogue.wav
 * (third-octave levels, EBU R128): a steep roll-off below 100 Hz, a presence lift around 6.3 kHz, a loudness
 * range of 2 LU (heavy compression) and peaks held at -1 dBFS, integrated -16.4 LUFS. When a non-silent
 * Raw-Dialogue.wav exists, re-measure raw vs mix and replace `response` with the true difference curve.
 */
export const sound = {
  dialogue: {
    label: 'Interview · location audio vs final mix',
    raw: audio.dialogueRaw,
    mix: audio.dialogueMix,
    score: audio.score,
    /** Score bed level under the dialogue, 0 to 1. The on-page slider is master volume, not this. */
    scoreLevel: 0.6,
    chain: [
      ['HPF', '100 Hz'], ['Presence', '+4 dB @ 6.3k'], ['Comp', 'LRA 2 LU'], ['Limiter', '-1 dBFS'], ['Loudness', '-16 LUFS'],
    ] as [string, string][],
    /** [Hz, dB] of mix relative to raw; drawn as the EQ curve. Inferred from the mix until the raw file lands. */
    response: [
      [20, -30], [40, -24], [63, -14], [80, -7], [100, -2.5], [125, -0.8], [160, 0], [250, 0], [400, 0], [630, 0], [1000, 0], [1600, 0.5],
      [2500, 1], [4000, 2], [5000, 3.5], [6300, 4.2], [8000, 3], [10000, 1.2], [12500, 0], [16000, -1], [20000, -2],
    ] as [number, number][],
  },
  design: {
    label: 'Seven channels · 16 s',
    video: video.design,
    poster: video.designPoster,
    /** Every stem peaks near full scale, so the sum is trimmed here and a limiter catches the rest. */
    trim: 0.4,
    /** One per channel, top to bottom. Rename freely; set `gain` to rebalance a channel. */
    stems: [
      { id: 'dialogue', name: 'Dialogue', src: audio.stems('dialogue') },
      { id: 'sfx-1', name: 'SFX 1', src: audio.stems('sfx-1') },
      { id: 'sfx-2', name: 'SFX 2', src: audio.stems('sfx-2') },
      { id: 'sfx-3', name: 'SFX 3', src: audio.stems('sfx-3') },
      { id: 'sfx-4', name: 'SFX 4', src: audio.stems('sfx-4') },
      { id: 'sfx-5', name: 'SFX 5', src: audio.stems('sfx-5') },
      { id: 'sfx-6', name: 'SFX 6', src: audio.stems('sfx-6') },
    ] as Stem[],
  },
};
