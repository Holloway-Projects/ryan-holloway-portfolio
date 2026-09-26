import { video } from './media';

export interface Stage { id: string; name: string; src: string }

/**
 * Color grading slider. The rail's stops are these stages, left to right; at a stop the whole frame is that
 * stage, between stops the later one sweeps in from the right. Order matters. Rename freely: the names show
 * on the rail and inside the frame. A stage with an empty `src` is skipped.
 */
export const grade = {
  stages: [
    { id: 'log', name: 'S-Log3', src: video.gradeLog },
    { id: 'rec709', name: 'Rec.709', src: video.grade709 },
    { id: 'final', name: 'Final grade', src: video.gradeFinal },
  ] as Stage[],
  /** Handle position on load, 0 to 1. */
  start: 0.8,
};
