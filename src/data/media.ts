/**
 * Media URLs. Placeholders are open-licensed clips from Wikimedia Commons.
 * When Ryan's files land in public/media/, swap these for local paths like "/media/video/hero.mp4".
 */
const C = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/';

export const video = {
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
  swiss: C + 'c/c4/Timelapse_of_Swiss_mountains.webm/Timelapse_of_Swiss_mountains.webm.480p.vp9.webm',
  fish: C + '3/3c/Timelapse_video-_Fish_Lake_Campground%2C_Steens_Mountain_%2828956669637%29.webm/Timelapse_video-_Fish_Lake_Campground%2C_Steens_Mountain_%2828956669637%29.webm.480p.vp9.webm',
  times: C + 'c/cd/WP25_Times_Square_billboard.webm/WP25_Times_Square_billboard.webm.480p.vp9.webm',
  tears: C + 'c/cb/Tears_of_Steel_1080p.webm/Tears_of_Steel_1080p.webm.480p.vp9.webm',
  car: C + 'e/ea/Aerial_views_of_a_car_driving_in_snow_through_a_forest.webm/Aerial_views_of_a_car_driving_in_snow_through_a_forest.webm.480p.vp9.webm',
  wiki: C + 'c/c1/Wikipedia_-_25_years_of_humanity_at_its_best.webm/Wikipedia_-_25_years_of_humanity_at_its_best.webm.480p.vp9.webm',
};

export const audio = {
  /** Dialogue A/B. Raw is empty until a non-silent export lands; the raw side is then simulated from the mix. */
  dialogueRaw: '',
  dialogueMix: '/media/audio/dialogue-mix.m4a',
  score: '/media/audio/score.m4a',
  /** Sound design stems, one per channel, same 16 s range as video.design. */
  stems: (n: string) => `/media/audio/stems/${n}.m4a`,
};

/** Placeholder stills. Replace with "/media/images/…" paths. */
export const img = (seed: string, w = 900, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const images = {
  obvious: '/media/images/obvious-mentions.jpg',
  che: '/media/images/che-story.jpg',
  cypher: '/media/images/who-is-cypher.jpg',
  impossible: '/media/images/making-the-impossible-possible.jpg',
  headshot: '/media/images/ryan-headshot.jpg',
};
