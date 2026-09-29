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

/** The first four projects are Ryan’s work; remaining entries are placeholders pending his uploads. */
export const projects: Project[] = [
  {
    id: 'making-the-impossible-possible', name: 'Making the Impossible Possible', kind: 'Brand film',
    client: 'Radius Consulting', year: '', runtime: '1:40', dur: 99.561333,
    role: '', lede: '', notes: [],
    video: video.impossible, preview: video.impossiblePreview, poster: images.impossible,
  },
  {
    id: 'who-is-cypher', name: 'Who Is Cypher?', kind: 'Training video',
    client: 'Cypher', year: '', runtime: '2:06', dur: 126.014667,
    role: '', lede: '', notes: [],
    video: video.cypher, preview: video.cypherPreview, poster: images.cypher,
  },
  {
    id: 'che-story', name: 'Colorado Homeschool Enrichment', kind: 'Story video',
    client: 'Colorado Homeschool Enrichment', year: '', runtime: '3:55', dur: 235.369333,
    role: '', lede: '', notes: [],
    video: video.che, preview: video.chePreview, poster: images.che,
  },
  {
    id: 'obvious-mentions', name: 'Obvious — Mentions', kind: 'Product feature video',
    client: 'Obvious', year: '', runtime: '1:10', dur: 70.028292,
    role: 'Editor', lede: '', notes: [],
    video: video.obvious, preview: video.obviousPreview, poster: images.obvious,
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
