import { video, images } from './media';

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
  available?: boolean;
  notes: Note[];
}

/** The first five projects are Ryan’s completed work; the last entry is a placeholder pending its final film. */
export const projects: Project[] = [
  {
    id: 'making-the-impossible-possible', name: 'Making the Impossible Possible', kind: 'Brand film',
    client: 'Radius Consulting', year: '2026', runtime: '1:40', dur: 99.561333,
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
    client: 'Obvious', year: '2026', runtime: '1:10', dur: 70.028292,
    role: 'Editor', lede: '', notes: [
      { t: 8, text: 'At the client’s request, I cut this section in the fast, rhythmic style of contemporary Shorts and Reels to keep the pace immediate.' },
      { t: 23, text: 'I introduced this animation to break up the talking-head format while clearly illustrating the product feature being discussed.' },
    ],
    video: video.obvious, preview: video.obviousPreview, poster: images.obvious,
  },
  {
    id: 'che-story', name: 'Colorado Homeschool Enrichment', kind: 'Story video',
    client: 'Colorado Homeschool Enrichment', year: '2026', runtime: '3:55', dur: 235.369333,
    role: 'Interviewer, directing, editing, cinematography, color, motion graphics, sound', lede: '', notes: [
      { t: 26, text: 'With limited B-Roll and supporting assets, we used a slider on the B-Cam to introduce movement and visual interest.' },
      { t: 46, text: 'We chose a warmer, more inviting grade with a subtly feminine tone to complement both the subject matter and the conversation.' },
      { t: 137, text: 'Because we filmed in front of two large windows, I used a Lens Node effect to guide the viewer’s eye back to the subject at the center of the frame.' },
    ],
    video: video.che, preview: video.chePreview, poster: images.che,
  },
  {
    id: 'who-is-cypher', name: 'Who Is Cypher?', kind: 'Training video',
    client: 'Cypher', year: '2026', runtime: '2:06', dur: 126.014667,
    role: 'Directing, editing, cinematography, color, motion graphics, sound', lede: '', notes: [
      { t: 7, text: 'I pushed a deliberate amount of cyan into the grade to bring the image closer to Cypher’s brand palette.' },
      { t: 17, text: 'I placed him in the front third of the frame to preserve the light behind him and lean into the orange-and-teal palette.' },
    ],
    video: video.cypher, preview: video.cypherPreview, poster: images.cypher,
  },
  {
    id: 'radius-explainer', name: 'Radius Explainer', kind: 'Explainer video',
    client: 'Radius', year: '2025', runtime: '1:26', dur: 86.461375,
    role: 'Scriptwriting, directing, editing, color, motion graphics, sound', lede: '', notes: [
      { t: 7, text: 'I built this animation in After Effects to create visual energy and keep the piece engaging.' },
      { t: 63, text: 'During this 3D camera move in After Effects, I added depth of field to give the animation a more cinematic sense of space.' },
    ],
    video: video.radiusExplainer, preview: video.radiusExplainerPreview, poster: images.radiusExplainer,
  },
  {
    id: 'archway-social-promo', name: 'Archway', kind: 'Social media promo', client: 'Archway', year: '', runtime: '', dur: 0,
    role: '', video: '', poster: '/media/images/archway-logo.svg', available: false, lede: '', notes: [],
  },
];
