import { audio } from './media';

export interface Stem { id: string; name: string; src: string }

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
    /** Dialogue-free clip for the stems view. Empty until Ryan's clip lands. */
    video: '',
    /** One per channel, in the order they should stack. Empty until Ryan's stems land. */
    stems: [] as Stem[],
  },
};
