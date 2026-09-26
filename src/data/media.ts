/**
 * Media URLs. Placeholders are open-licensed clips from Wikimedia Commons.
 * When Ryan's files land in public/media/, swap these for local paths like "/media/video/hero.mp4".
 */
const C = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/';

export const video = {
  hero: '/media/video/hero.mp4',
  hero720: '/media/video/hero-720.mp4',
  heroPoster: '/media/video/hero-poster.jpg',
  swiss: C + 'c/c4/Timelapse_of_Swiss_mountains.webm/Timelapse_of_Swiss_mountains.webm.480p.vp9.webm',
  fish: C + '3/3c/Timelapse_video-_Fish_Lake_Campground%2C_Steens_Mountain_%2828956669637%29.webm/Timelapse_video-_Fish_Lake_Campground%2C_Steens_Mountain_%2828956669637%29.webm.480p.vp9.webm',
  times: C + 'c/cd/WP25_Times_Square_billboard.webm/WP25_Times_Square_billboard.webm.480p.vp9.webm',
  tears: C + 'c/cb/Tears_of_Steel_1080p.webm/Tears_of_Steel_1080p.webm.480p.vp9.webm',
  car: C + 'e/ea/Aerial_views_of_a_car_driving_in_snow_through_a_forest.webm/Aerial_views_of_a_car_driving_in_snow_through_a_forest.webm.480p.vp9.webm',
  wiki: C + 'c/c1/Wikipedia_-_25_years_of_humanity_at_its_best.webm/Wikipedia_-_25_years_of_humanity_at_its_best.webm.480p.vp9.webm',
};

export const audio = {
  /** One placeholder clip; the raw side is simulated in the browser until real raw + mix files exist. */
  dialogue: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Section_1_of_Alex_Interview-Wikimedia_Version.ogg',
};

/** Placeholder stills. Replace with "/media/images/…" paths. */
export const img = (seed: string, w = 900, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
