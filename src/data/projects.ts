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

/** The first five projects are Ryan’s work; the last entry is a placeholder pending his upload. */
export const projects: Project[] = [
  {
    id: 'making-the-impossible-possible', name: 'Making the Impossible Possible', kind: 'Brand film',
    client: 'Radius Consulting', year: '', runtime: '1:40', dur: 99.561333,
    role: 'Scriptwriting, directing, editing, cinematography, color, motion graphics, sound', lede: '',
    notes: [
      { t: 0, text: 'I chose intense music to grab the viewer’s attention within the first three seconds.' },
    ],
    video: video.impossible, preview: video.impossiblePreview, poster: images.impossible,
  },
  {
    id: 'obvious-mentions', name: 'Obvious — Mentions', kind: 'Product feature video',
    client: 'Obvious', year: '', runtime: '1:10', dur: 70.028292,
    role: 'Editor', lede: '', notes: [],
    video: video.obvious, preview: video.obviousPreview, poster: images.obvious,
  },
  {
    id: 'che-story', name: 'Colorado Homeschool Enrichment', kind: 'Story video',
    client: 'Colorado Homeschool Enrichment', year: '', runtime: '3:55', dur: 235.369333,
    role: 'Scriptwriting, directing, editing, cinematography, color, motion graphics, sound', lede: '', notes: [],
    video: video.che, preview: video.chePreview, poster: images.che,
  },
  {
    id: 'who-is-cypher', name: 'Who Is Cypher?', kind: 'Training video',
    client: 'Cypher', year: '', runtime: '2:06', dur: 126.014667,
    role: 'Scriptwriting, directing, editing, cinematography, color, motion graphics, sound', lede: '', notes: [],
    video: video.cypher, preview: video.cypherPreview, poster: images.cypher,
  },
  {
    id: 'radius-explainer', name: 'Radius Explainer', kind: 'Explainer video',
    client: 'Radius', year: '', runtime: '1:26', dur: 86.461375,
    role: 'Scriptwriting, directing, editing, color, motion graphics, sound', lede: '', notes: [],
    video: video.radiusExplainer, preview: video.radiusExplainerPreview, poster: images.radiusExplainer,
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
