import { images } from './media';

export const site = {
  name: 'Ryan Holloway',
  title: 'Ryan Holloway — Editor, Cinematographer, Motion Designer',
  description: 'Editor, cinematographer and motion designer in Denver. Brand films, commercials, documentary and music video, shot, cut and graded by one person.',
  email: 'mail.ryanholloway@gmail.com',
  contactHeading: 'for inquiries email',
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Photography', href: '#photo' },
    { label: 'About', href: '#about' },
  ],
  about: {
    headshot: images.headshot,
    lede: "I'm a visual creator specializing in animation, videography, and photography. My work combines technical precision with creative storytelling to bring ideas to life.",
    experience: [
      { role: 'Director of Radius Studio', company: 'Radius Group', dates: '2025–Present' },
      { role: 'Videographer', company: 'World Challenge', dates: '2023–2025' },
      { role: 'Creative Director', company: 'Springs Church', dates: '2020–2023' },
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
    { label: 'Instagram', href: 'https://www.instagram.com/mail.ryanholloway/', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ryan-holloway-014420283/', icon: 'linkedin' },
    { label: 'Download CV', href: '#', icon: 'download' },
  ],
  soundChain: [
    ['HPF', '80 Hz'], ['De-noise', '-12 dB'], ['EQ', '+3 dB @ 3k'], ['Shelf', '+2 dB @ 8k'], ['Comp', '3:1'], ['Limiter', '-1 dB'],
  ] as [string, string][],
};
