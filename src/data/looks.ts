import { video } from './media';

export interface Look { name: string; video: string; grade: string }

/** Color grading examples: each is a different clip with its own grade. `grade` is a CSS filter applied to the graded side. */
export const looks: Look[] = [
  { name: 'Example one', video: video.swiss, grade: 'contrast(1.12) saturate(.9) sepia(.1) hue-rotate(-14deg) brightness(.96)' },
  { name: 'Example two', video: video.car, grade: 'sepia(.38) saturate(1.05) contrast(1.04) brightness(1.03)' },
];
