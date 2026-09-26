import { createTimeline } from './timeline';

/** Hero: program monitor with play/mute, and the data-driven timeline underneath. */
export function initHero() {
  const hero = document.getElementById('hero') as HTMLVideoElement | null;
  const cvs = document.getElementById('tl') as HTMLCanvasElement | null;
  const rcv = document.getElementById('tl-ruler') as HTMLCanvasElement | null;
  const scrollEl = document.getElementById('tl-scroll'), capture = document.querySelector<HTMLElement>('.capture');
  if (!hero || !cvs || !rcv || !scrollEl || !capture) return;

  createTimeline(hero, rcv, cvs, scrollEl, capture);

  const playBtn = document.getElementById('play')!, playIco = document.getElementById('play-ico')!;
  const muteBtn = document.getElementById('mute')!, muteIco = document.getElementById('mute-ico')!;
  const PLAY = '<path d="M2 1.5v9l8-4.5z"/>', PAUSE = '<path d="M2 1.5h3v9H2zM7 1.5h3v9H7z"/>';
  playBtn.addEventListener('click', () => { if (hero.paused) hero.play(); else hero.pause(); });
  hero.addEventListener('play', () => (playIco.innerHTML = PAUSE)); hero.addEventListener('pause', () => (playIco.innerHTML = PLAY));
  const MUTED = '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9l5 6M21 9l-5 6"/>', LOUD = '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>';
  const setMuteIco = () => (muteIco.innerHTML = hero.muted ? MUTED : LOUD);
  muteBtn.addEventListener('click', () => { hero.muted = !hero.muted; setMuteIco(); if (!hero.muted && hero.paused) hero.play().catch(() => {}); });
  setMuteIco();
}
