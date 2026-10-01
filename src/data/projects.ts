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
      { t: 1, text: 'I chose intense music to grab the viewer’s attention within the first three seconds.' },
      { t: 14, text: 'I adjusted the music’s intensity to shape the pacing and create a deliberate shift in energy.' },
      { t: 17, text: 'With limited B-Roll and supporting assets, I built this grid animation to turn the available footage into a more engaging visual moment.' },
      { t: 35, text: 'As he realizes he’s unfulfilled in his career and ready for change, I increased the drama in the score to underscore that emotional pivot.' },
      { t: 57, text: 'I contrasted turbulent ocean swells and dark clouds with peaceful fields, flowers, and still water—moving from life’s challenges to the clarity, momentum, and calm his teams find together.' },
    ],
    video: video.impossible, preview: video.impossiblePreview, poster: images.impossible,
  },
  {
    id: 'obvious-mentions', name: 'Obvious — Mentions', kind: 'Product feature video',
    client: 'Obvious', year: '', runtime: '1:10', dur: 70.028292,
    role: 'Editor', lede: '', notes: [
      { t: 8, text: 'At the client’s request, I cut this section in the fast, rhythmic style of contemporary Shorts and Reels to keep the pace immediate.' },
      { t: 23, text: 'I introduced this animation to break up the talking-head format while clearly illustrating the product feature being discussed.' },
    ],
    video: video.obvious, preview: video.obviousPreview, poster: images.obvious,
  },
  {
    id: 'che-story', name: 'Colorado Homeschool Enrichment', kind: 'Story video',
    client: 'Colorado Homeschool Enrichment', year: '', runtime: '3:55', dur: 235.369333,
    role: 'Interviewer, directing, editing, cinematography, color, motion graphics, sound', lede: '', notes: [
      { t: 26, text: 'With limited B-Roll and supporting assets, we used a slider on the B-Cam to introduce movement and visual interest.' },
      { t: 46, text: 'We chose a warmer, more inviting grade with a subtly feminine tone to complement both the subject matter and the conversation.' },
      { t: 137, text: 'Because we filmed in front of two large windows, I used a Lens Node effect to guide the viewer’s eye back to the subject at the center of the frame.' },
    ],
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
