import { video } from './media';

export interface Stage { id: string; name: string; src: string }

/**
 * Color grading slider. One bar in the frame: the first stage left of it, the second right of it, and the
 * third grows in from the right edge once the bar is left of the middle. Order matters. Rename freely: the
 * names show in the legend under the frame. A stage with an empty `src` is skipped.
 */
export const grade = {
  stages: [
    { id: 'log', name: 'S-Log3', src: video.gradeLog },
    { id: 'rec709', name: 'Rec.709', src: video.grade709 },
    { id: 'final', name: 'Final grade', src: video.gradeFinal },
  ] as Stage[],
  /** Bar position on load, 0 to 1. At 0.3 all three stages are on screen. */
  start: 0.3,
};
