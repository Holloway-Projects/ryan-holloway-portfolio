export const video = {
  radiusExplainer: '/media/video/radius-explainer.mp4',
  radiusExplainerPreview: '/media/video/radius-explainer-preview.mp4',
  obvious: '/media/video/obvious-mentions.mp4',
  obviousPreview: '/media/video/obvious-mentions-preview.mp4',
  che: '/media/video/che-story.mp4',
  chePreview: '/media/video/che-story-preview.mp4',
  cypher: '/media/video/who-is-cypher.mp4',
  cypherPreview: '/media/video/who-is-cypher-preview.mp4',
  impossible: '/media/video/making-the-impossible-possible.mp4',
  impossiblePreview: '/media/video/making-the-impossible-possible-preview.mp4',
  hero: '/media/video/hero.mp4',
  hero720: '/media/video/hero-720.mp4',
  heroPoster: '/media/video/hero-poster.jpg',
  heroFilmstrip: '/media/images/hero-filmstrip.jpg',
  /** Grading slider: the same 14 s excerpt of the teaser exported at each stage. */
  gradeLog: '/media/video/grade-log.mp4',
  grade709: '/media/video/grade-709.mp4',
  gradeFinal: '/media/video/grade-final.mp4',
  /** Sound design clip, picture only. */
  design: '/media/video/design.mp4',
  designPoster: '/media/video/design-poster.jpg',
};

export const audio = {
  /** Dialogue A/B. Raw is empty until a non-silent export lands; the raw side is then simulated from the mix. */
  dialogueRaw: '',
  dialogueMix: '/media/audio/dialogue-mix.m4a',
  score: '/media/audio/score.m4a',
  /** Sound design stems, one per channel, same 16 s range as video.design. */
  stems: (n: string) => `/media/audio/stems/${n}.m4a`,
};

export const images = {
  radiusExplainer: '/media/images/radius-explainer.jpg',
  obvious: '/media/images/obvious-mentions.jpg',
  che: '/media/images/che-story.jpg',
  cypher: '/media/images/who-is-cypher.jpg',
  impossible: '/media/images/making-the-impossible-possible.jpg',
  headshot: '/media/images/ryan-headshot.jpg',
};
