import { img } from './media';

export const site = {
  name: 'Ryan Holloway',
  title: 'Ryan Holloway — Editor, Cinematographer, Motion Designer',
  description: 'Editor, cinematographer and motion designer in Denver. Brand films, commercials, documentary and music video, shot, cut and graded by one person.',
  email: 'mail.ryanholloway@gmail.com',
  contactHeading: 'Have a project in mind?',
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Photography', href: '#photo' },
    { label: 'About', href: '#about' },
  ],
  about: {
    headshot: img('rh-headshot', 900, 1125),
    lede: "I started as an editor, picked up a camera because I was tired of waiting for footage that didn't cut, and learned motion because titles kept being an afterthought.",
    paragraphs: [
      "Ten years in, I work with brands, agencies and documentary teams who need one person to own a film from the first call to the final export. I'm most useful on projects where the person holding the camera is also the one who has to cut it later.",
      'Based in Denver. I travel for shoots and work remotely for post.',
    ],
    facts: [
      ['Edit', 'Premiere Pro, DaVinci Resolve'],
      ['Motion', 'After Effects, Cinema 4D'],
      ['Camera', 'Sony FX6 and FX3, Sigma primes'],
      ['Grade', 'Resolve, calibrated reference'],
      ['Sound', 'Sennheiser MKH 416, Zoom F6'],
      ['Delivery', 'Broadcast, social, cinema DCP'],
    ] as [string, string][],
  },
  links: [
    { label: 'Vimeo', href: '#', icon: 'vimeo' },
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ryan-holloway-014420283/', icon: 'linkedin' },
    { label: 'Download CV', href: '#', icon: 'download' },
  ],
  soundChain: [
    ['HPF', '80 Hz'], ['De-noise', '-12 dB'], ['EQ', '+3 dB @ 3k'], ['Shelf', '+2 dB @ 8k'], ['Comp', '3:1'], ['Limiter', '-1 dB'],
  ] as [string, string][],
};
