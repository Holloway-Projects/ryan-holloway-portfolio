import { img } from './media';

export interface Photo { src: string; full: string; caption: string }

const seeds: [string, string][] = [
  ['harbour1', 'Harbour Light, Oregon coast'], ['ridge-s1', 'Ridgeline, day two'], ['salt-s2', 'Salt and Ash, the pans at dawn'],
  ['mercy-s1', 'Night shift, 7am'], ['way-s3', 'Wayfinder, where the pavement ends'], ['harbour2', 'Harbour Light'],
  ['sixty-s1', 'Sixty Frames, the room'], ['salt-s3', 'Salt and Ash'], ['ridge-s2', 'Ridgeline, the cab'],
  ['harbour3', 'Harbour Light'], ['lumen-s1', 'Lumen, studio'], ['way-s2', 'Wayfinder, chase car'],
];

/** Placeholder stills. Replace src/full with "/media/images/…" paths. */
export const photos: Photo[] = seeds.map(([seed, caption]) => ({ src: img(seed, 900, 600), full: img(seed, 1800, 1200), caption }));
