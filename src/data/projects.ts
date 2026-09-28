import { video, img, images } from './media';

export interface Note { t: number; text: string }
export interface Project {
  id: string;
  name: string;
  kind: string;
  client: string;
  year: string;
  runtime: string;   // display, e.g. "1:07"
  dur: number;       // seconds, used for the scrubber and note markers
  role: string;
  lede: string;
  video: string;
  poster: string;
  preview?: string;
  notes: Note[];
}

/** The first project is Ryan’s film; remaining entries are placeholders pending his uploads. */
export const projects: Project[] = [
  {
    id: 'making-the-impossible-possible', name: 'Making the Impossible Possible', kind: 'Brand film',
    client: 'Radius Consulting', year: '', runtime: '1:40', dur: 99.561333,
    role: '', lede: '', notes: [],
    video: video.impossible, preview: video.impossiblePreview, poster: images.impossible,
  },
  {
    id: 'sixty-frames', name: 'Sixty Frames', kind: 'Music video', client: 'Fen Harbour', year: '2025', runtime: '0:31', dur: 31,
    role: 'Director, editor, motion designer', video: video.fish, poster: img('sixty', 1200, 675),
    lede: 'One room, one take per section, and enough trust in the cut and the type to make it feel like a world.',
    notes: [
      { t: 4, text: 'Every cut in the first verse lands on a snare. We stop doing that in the chorus so it can feel loose.' },
      { t: 14, text: 'The type here is hand-animated frame by frame. Sixty frames, which became the title.' },
      { t: 26, text: 'The last section is a single take. It only works because everything before it cut fast.' },
    ],
  },
  {
    id: 'lumen', name: 'Lumen', kind: 'Motion', client: 'Lumen', year: '2026', runtime: '0:30', dur: 30,
    role: 'Motion design, edit', video: video.times, poster: img('lumen', 1200, 675),
    lede: 'A launch piece for a product that is, essentially, light. Everything on screen is lit by the thing being sold.',
    notes: [
      { t: 3, text: 'Nothing eases in over twelve frames. Fast in, slow out, every time.' },
      { t: 12, text: 'The lamp is the only light source for the type. Rendered together, not composited after.' },
      { t: 26, text: 'End card holds for forty-eight frames. Long enough to read it twice.' },
    ],
  },
  {
    id: 'salt-and-ash', name: 'Salt and Ash', kind: 'Documentary short', client: 'Independent', year: '2025', runtime: '12:14', dur: 734,
    role: 'Cinematographer, editor', video: video.tears, poster: img('salt', 1200, 675),
    lede: 'A family salt works on its last season, shot over four visits and cut once, slowly.',
    notes: [
      { t: 30, text: 'The interview is off-axis on purpose. He talks to his daughter, not to us.' },
      { t: 240, text: 'The longest shot in the film. Nothing happens for forty seconds. Everything happens.' },
      { t: 500, text: 'We never show the last day. You know it happened.' },
    ],
  },
  {
    id: 'wayfinder', name: 'Wayfinder', kind: 'Commercial', client: 'Wayfinder Vehicles', year: '2026', runtime: '0:52', dur: 52,
    role: 'Director, cinematographer, editor', video: video.car, poster: img('way', 1200, 675),
    lede: "Fifty-two seconds, one road, one idea: it goes where the pavement doesn't.",
    notes: [
      { t: 3, text: "Open on the road ending. That's the whole spot in one frame." },
      { t: 22, text: 'Pavement to dirt on a single wheel rotation. The match cut hides the location change.' },
      { t: 46, text: 'The logo resolves out of the dust. Tracked into the plate rather than keyed over it.' },
    ],
  },
  {
    id: 'mercy', name: 'Mercy Health Foundation', kind: 'Campaign', client: 'Mercy Health Foundation', year: '2025', runtime: '3:55', dur: 235,
    role: 'Editor, colourist', video: video.wiki, poster: img('mercy', 1200, 675),
    lede: "An agency shoot handed over for the cut and grade. Sometimes the job is making other people's footage feel like a decision.",
    notes: [
      { t: 8, text: 'Four cameras, none matched. Graded to one look before making a single cut.' },
      { t: 40, text: 'The pace doubles here and stays doubled. No slowing down until the end card.' },
      { t: 118, text: 'The last line is delivered to the room, not the lens. We found it in an outtake.' },
    ],
  },
];
