import { tc } from '../lib/timecode';

/**
 * Hero: program monitor + drawn timeline placeholder, kept in sync.
 * The timeline is a stand-in until the interactive rebuild (see docs/interactive-timeline.md).
 */
const L = 54; // track label gutter

function seeded(n: number) { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); }

export function initHero() {
  const hero = document.getElementById('hero') as HTMLVideoElement | null;
  const cvs = document.getElementById('tl') as HTMLCanvasElement | null;
  const rcv = document.getElementById('tl-ruler') as HTMLCanvasElement | null;
  if (!hero || !cvs || !rcv) return;
  const ctx = cvs.getContext('2d')!, rctx = rcv.getContext('2d')!;
  const playBtn = document.getElementById('play')!, playIco = document.getElementById('play-ico')!;
  const muteBtn = document.getElementById('mute')!, muteIco = document.getElementById('mute-ico')!;
  let staticLayer: HTMLCanvasElement | null = null, rulerLayer: HTMLCanvasElement | null = null;

  function drawRuler(w: number, h: number) {
    const off = document.createElement('canvas'); off.width = w; off.height = h; const c = off.getContext('2d')!;
    c.fillStyle = '#141414'; c.fillRect(0, 0, w, h); c.fillStyle = '#0f0f0f'; c.fillRect(0, 0, L, h);
    c.strokeStyle = '#33332f'; c.lineWidth = 1; c.font = '10px JetBrains Mono, monospace'; c.fillStyle = '#6c6a64';
    const dur = hero!.duration || 60;
    for (let i = 0; i <= 40; i++) {
      const x = L + (w - L) * i / 40;
      c.beginPath(); c.moveTo(x + .5, i % 5 ? 16 : 9); c.lineTo(x + .5, h); c.stroke();
      if (i % 5 === 0 && i < 40) c.fillText(tc(dur * i / 40, false).slice(3), x + 4, 12);
    }
    c.fillStyle = '#2a2a2a'; c.fillRect(0, h - 1, w, 1);
    return off;
  }

  function drawStatic(w: number, h: number) {
    const off = document.createElement('canvas'); off.width = w; off.height = h; const c = off.getContext('2d')!;
    c.fillStyle = '#111'; c.fillRect(0, 0, w, h);
    const tracks: [string, number, 'gfx' | 'vid' | 'aud'][] = [['V6', 34, 'gfx'], ['V5', 34, 'gfx'], ['V4', 44, 'vid'], ['V3', 44, 'vid'], ['V2', 48, 'vid'], ['V1', 56, 'vid'], ['A1', 40, 'aud'], ['A2', 40, 'aud'], ['A3', 36, 'aud'], ['A4', 36, 'aud']];
    let y = 2;
    tracks.forEach(([name, th, type], ti) => {
      c.fillStyle = '#161616'; c.fillRect(L, y, w - L, th); c.fillStyle = '#0f0f0f'; c.fillRect(0, y, L, th);
      c.fillStyle = '#8a877f'; c.font = '10px JetBrains Mono, monospace'; c.fillText(name, 10, y + th / 2 + 4);
      let x = L + 4, k = 0;
      const density = type === 'gfx' ? .55 : (ti === 5 || ti === 6 ? .05 : .3);
      while (x < w - 8) {
        const gap = seeded(ti * 31 + k * 7) < density ? 8 + seeded(ti * 13 + k) * 90 : 3;
        const cw = type === 'gfx' ? 30 + seeded(ti + k * 3) * 80 : 40 + seeded(ti * 5 + k * 11) * 150;
        if (type === 'gfx' && seeded(ti * 17 + k * 5) > .5) { x += cw + gap; k++; continue; }
        const r = Math.min(cw, w - 4 - x); if (r < 8) break;
        c.fillStyle = type === 'vid' ? (ti === 5 ? '#2f3b46' : ti === 4 ? '#3a3140' : '#33383d') : type === 'aud' ? (ti < 8 ? '#24352d' : '#2c3230') : '#4a3d24';
        c.fillRect(x, y + 3, r, th - 6);
        c.strokeStyle = 'rgba(255,255,255,.08)'; c.strokeRect(x + .5, y + 3.5, r - 1, th - 7);
        if (type === 'vid') { c.fillStyle = 'rgba(255,255,255,.06)'; for (let t = x + 2; t < x + r - 14; t += 16) c.fillRect(t, y + 13, 12, th - 18); }
        if (type === 'aud') { c.strokeStyle = 'rgba(180,220,190,.35)'; c.beginPath(); for (let t = x + 2; t < x + r - 2; t += 2) { const a = (seeded(t * 3 + ti) * .8 + .2) * (th - 10) / 2; c.moveTo(t, y + th / 2 - a); c.lineTo(t, y + th / 2 + a); } c.stroke(); }
        c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '9px JetBrains Mono, monospace';
        if (r > 46) c.fillText((type === 'aud' ? 'A' : 'C') + String(1000 + ti * 40 + k).slice(1) + (type === 'gfx' ? ' title' : ''), x + 5, y + 12);
        x += r + gap; k++;
      }
      y += th + 2;
    });
    return off;
  }

  function sizeCanvas() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const r = cvs!.getBoundingClientRect(); cvs!.width = Math.floor(r.width * dpr); cvs!.height = Math.floor(r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); staticLayer = drawStatic(Math.floor(r.width), Math.floor(r.height));
    const rr = rcv!.getBoundingClientRect(); rcv!.width = Math.floor(rr.width * dpr); rcv!.height = Math.floor(rr.height * dpr); rctx.setTransform(dpr, 0, 0, dpr, 0, 0); rulerLayer = drawRuler(Math.floor(rr.width), Math.floor(rr.height));
  }
  function drawTimeline() {
    if (!staticLayer || !rulerLayer) return;
    const p = hero!.duration ? hero!.currentTime / hero!.duration : 0;
    ctx.drawImage(staticLayer, 0, 0); const x = L + (staticLayer.width - L) * p; ctx.fillStyle = '#ff3b30'; ctx.fillRect(x - .5, 0, 1.5, staticLayer.height);
    rctx.drawImage(rulerLayer, 0, 0); const rx = L + (rulerLayer.width - L) * p; rctx.fillStyle = '#ff3b30'; rctx.fillRect(rx - .5, 0, 1.5, rulerLayer.height);
    rctx.beginPath(); rctx.moveTo(rx - 6, 0); rctx.lineTo(rx + 6, 0); rctx.lineTo(rx, 9); rctx.closePath(); rctx.fill();
  }
  function tick() { drawTimeline(); requestAnimationFrame(tick); }

  hero.addEventListener('loadedmetadata', sizeCanvas); addEventListener('resize', sizeCanvas); sizeCanvas(); requestAnimationFrame(tick);

  // wheel scrolls the track stack until it hits an end, then hands off to the page
  document.getElementById('tl-scroll')!.addEventListener('wheel', (e) => {
    const el = e.currentTarget as HTMLElement;
    const atTop = el.scrollTop === 0 && e.deltaY < 0, atBot = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight && e.deltaY > 0;
    if (!atTop && !atBot) e.stopPropagation();
  }, { passive: true });

  // transport
  const PLAY = '<path d="M2 1.5v9l8-4.5z"/>', PAUSE = '<path d="M2 1.5h3v9H2zM7 1.5h3v9H7z"/>';
  playBtn.addEventListener('click', () => { if (hero.paused) hero.play(); else hero.pause(); });
  hero.addEventListener('play', () => (playIco.innerHTML = PAUSE)); hero.addEventListener('pause', () => (playIco.innerHTML = PLAY));
  const MUTED = '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9l5 6M21 9l-5 6"/>', LOUD = '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>';
  const setMuteIco = () => (muteIco.innerHTML = hero.muted ? MUTED : LOUD);
  muteBtn.addEventListener('click', () => { hero.muted = !hero.muted; setMuteIco(); if (!hero.muted && hero.paused) hero.play().catch(() => {}); });
  setMuteIco();

  // scrub by dragging anywhere on the timeline or ruler
  const scrub = (el: HTMLElement, e: PointerEvent) => { const r = el.getBoundingClientRect(); const p = Math.max(0, Math.min(1, (e.clientX - r.left - L) / (r.width - L))); if (hero.duration) hero.currentTime = p * hero.duration; };
  [cvs, rcv].forEach((el) => {
    let d = false;
    el.addEventListener('pointerdown', (e) => { d = true; el.setPointerCapture(e.pointerId); scrub(el, e); });
    el.addEventListener('pointermove', (e) => { if (d) scrub(el, e); });
    el.addEventListener('pointerup', () => (d = false)); el.addEventListener('pointercancel', () => (d = false));
  });
}
