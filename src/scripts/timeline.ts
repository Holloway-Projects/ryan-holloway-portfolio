import { tc } from '../lib/timecode';
import { buildSequence, type Track, type Clip } from '../data/timeline';

/**
 * Data-driven timeline renderer synced to the hero video.
 *  - Option/Alt (or pinch) + scroll: zoom time around the cursor
 *  - Shift + scroll: track height (clips collapse to bars, or grow thumbnails and waveforms)
 *  - Horizontal scroll: pan time. Vertical scroll: move through the track stack.
 *  - Drag on the ruler or tracks: scrub the film. View follows the playhead during playback.
 */
const L = 64;                       // track header column width
const HEAD = 15;                    // clip name band height
const BASE: Record<string, number> = { video: 54, title: 34, audio: 46 };
const COL: Record<string, { body: string; head: string; line: string }> = {
  video:     { body: '#3a4657', head: '#2b3543', line: 'rgba(255,255,255,.10)' },
  interview: { body: '#3c5648', head: '#2c4136', line: 'rgba(255,255,255,.10)' },
  broll:     { body: '#4a4058', head: '#372f42', line: 'rgba(255,255,255,.10)' },
  title:     { body: '#5a4a2a', head: '#42361d', line: 'rgba(255,255,255,.12)' },
  dialogue:  { body: '#2c4a3a', head: '#21372c', line: 'rgba(255,255,255,.08)' },
  music:     { body: '#2d3d55', head: '#212d3f', line: 'rgba(255,255,255,.08)' },
  sfx:       { body: '#4a3e34', head: '#362d26', line: 'rgba(255,255,255,.08)' },
  amb:       { body: '#33403c', head: '#26302d', line: 'rgba(255,255,255,.08)' },
};
const WAVE = 'rgba(190,225,200,.55)';

const fract = (x: number) => x - Math.floor(x);
const hash = (i: number, s: number) => fract(Math.sin(i * 12.9898 + s * 78.233) * 43758.5453);
function noise(s: number, x: number) { const i = Math.floor(x), f = x - i; const a = hash(i, s), b = hash(i + 1, s); const u = f * f * (3 - 2 * f); return a + (b - a) * u; }
function seedOf(id: string) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 9973; return h; }

/** Fake but stable amplitude 0..1 for a clip at local time t, by kind. */
function amp(c: Clip, t: number) {
  const s = seedOf(c.id), n = noise(s, t * 28);
  switch (c.kind) {
    case 'dialogue': { const gate = noise(s + 7, t * 1.6) > 0.38 ? 1 : 0.07; const syl = 0.55 + 0.45 * Math.abs(Math.sin(t * 9 + s)); return (0.3 + 0.7 * n) * gate * syl; }
    case 'music': { const swell = 0.55 + 0.45 * Math.sin(t * 0.35 + s) * Math.sin(t * 0.11); return (0.45 + 0.55 * n) * (0.6 + 0.4 * swell); }
    case 'sfx': return Math.exp(-t * 2.2) * (0.6 + 0.4 * n) + 0.04;
    case 'amb': return 0.14 + 0.14 * n;
    default: return 0.3 * n;
  }
}

export interface Timeline { setDirty(): void; resize(): void; }

export function createTimeline(video: HTMLVideoElement, ruler: HTMLCanvasElement, canvas: HTMLCanvasElement, scrollEl: HTMLElement, capture: HTMLElement): Timeline {
  const rctx = ruler.getContext('2d')!, ctx = canvas.getContext('2d')!;
  let tracks: Track[] = [], duration = 0;
  let width = 0, rulerH = 22, dpr = 1;
  let pps = 1, scrollX = 0, hScale = 1;         // pixels per second, horizontal offset in px, track height scale
  let layer: HTMLCanvasElement | null = null, dirty = true, layerH = 0;
  let follow = true;

  const trackH = (t: Track) => Math.max(8, Math.round(BASE[t.type === 'audio' ? 'audio' : t.id === 'V3' ? 'title' : 'video'] * hScale));
  const totalH = () => tracks.reduce((a, t) => a + trackH(t) + 2, 2);
  const fitPps = () => (duration ? (width - L) / duration : 1);
  const timeAt = (clientX: number) => { const r = canvas.getBoundingClientRect(); return Math.max(0, Math.min(duration, (clientX - r.left - L + scrollX) / pps)); };
  const clampScroll = () => { const max = Math.max(0, duration * pps - (width - L)); scrollX = Math.max(0, Math.min(max, scrollX)); };

  function load() {
    duration = video.duration || 60;
    tracks = buildSequence(duration);
    pps = fitPps(); scrollX = 0; dirty = true; sizeCanvas();
  }

  function sizeCanvas() {
    dpr = Math.min(2, devicePixelRatio || 1);
    const rr = ruler.getBoundingClientRect(); width = Math.floor(rr.width); rulerH = Math.floor(rr.height);
    ruler.width = width * dpr; ruler.height = rulerH * dpr; rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const h = totalH(); canvas.style.height = h + 'px'; canvas.width = width * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const minP = fitPps(); if (pps < minP) pps = minP; clampScroll(); dirty = true;
  }

  // ---------- ruler ----------
  function tickStep() {
    const steps = [1 / 24, 0.25, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 1200];
    return steps.find((s) => s * pps >= 84) ?? 1200;
  }
  function label(t: number, step: number) {
    const s = tc(t, step < 1);
    return duration < 3600 ? s.slice(3) : s;
  }
  function drawRuler() {
    rctx.fillStyle = '#141414'; rctx.fillRect(0, 0, width, rulerH);
    rctx.fillStyle = '#0f0f0f'; rctx.fillRect(0, 0, L, rulerH);
    const step = tickStep(), minor = step / 5;
    const s = tc(video.currentTime); rctx.font = '11px JetBrains Mono, monospace'; const tw = rctx.measureText(s).width; const readoutX = width - tw - 14;
    const k0 = Math.floor(scrollX / pps / minor), k1 = Math.ceil((scrollX + width - L) / pps / minor);
    rctx.strokeStyle = '#33332f'; rctx.lineWidth = 1; rctx.font = '10px JetBrains Mono, monospace'; rctx.fillStyle = '#7a7873';
    for (let k = k0; k <= k1; k++) {
      const t = k * minor; const x = Math.round(L + t * pps - scrollX) + .5; if (x < L) continue;
      const major = k % 5 === 0;
      rctx.beginPath(); rctx.moveTo(x, major ? 9 : 16); rctx.lineTo(x, rulerH); rctx.stroke();
      if (major) { const lb = label(t, step); if (x + 4 + rctx.measureText(lb).width < readoutX - 8) rctx.fillText(lb, x + 4, 12); }
    }
    rctx.fillStyle = '#2a2a2a'; rctx.fillRect(0, rulerH - 1, width, 1);
    // current timecode, right corner
    rctx.font = '11px JetBrains Mono, monospace'; rctx.fillStyle = '#141414'; rctx.fillRect(readoutX, 0, tw + 14, rulerH - 1); rctx.fillStyle = '#c9c7c0'; rctx.fillText(s, width - tw - 7, 14);
    // playhead
    const px = L + video.currentTime * pps - scrollX;
    if (px >= L && px <= width) { rctx.fillStyle = '#ff3b30'; rctx.fillRect(px - .5, 0, 1.5, rulerH); rctx.beginPath(); rctx.moveTo(px - 6, 0); rctx.lineTo(px + 6, 0); rctx.lineTo(px, 9); rctx.closePath(); rctx.fill(); }
  }

  // ---------- tracks (static layer) ----------
  function drawClip(c: HTMLCanvasRenderingContext2D, clip: Clip, y: number, th: number) {
    const x0 = L + clip.in * pps - scrollX, x1 = L + clip.out * pps - scrollX;
    if (x1 < L || x0 > width) return;
    const col = COL[clip.kind]; const vx0 = Math.max(L, x0), vx1 = Math.min(width, x1); const w = vx1 - vx0; if (w < 1) return;
    const showHead = th >= 28, bodyY = y + (showHead ? HEAD : 0), bodyH = th - (showHead ? HEAD : 0);
    c.fillStyle = col.body; c.fillRect(vx0, y, w, th);
    if (showHead) { c.fillStyle = col.head; c.fillRect(vx0, y, w, HEAD); }
    // content
    c.save(); c.beginPath(); c.rect(vx0, bodyY, w, bodyH); c.clip();
    const isVideo = clip.kind === 'video' || clip.kind === 'interview' || clip.kind === 'broll';
    const fh = bodyH - 6, fw = Math.max(18, Math.round(fh * 16 / 9)), gap = 3;
    if (isVideo && bodyH >= 22 && (x1 - x0) >= fw * 1.4) {
      // wireframe filmstrip: frames anchored to the clip start, spaced by frame width
      const s = seedOf(clip.id);
      const first = Math.max(0, Math.floor((vx0 - x0) / (fw + gap)));
      for (let k = first; ; k++) { const fx = x0 + k * (fw + gap); if (fx > vx1) break; if (fx + fw < vx0) continue;
        const shade = 0.05 + 0.07 * hash(k, s); c.fillStyle = `rgba(255,255,255,${shade})`; c.fillRect(fx, bodyY + 3, fw, fh);
        c.strokeStyle = 'rgba(255,255,255,.14)'; c.lineWidth = 1; c.strokeRect(fx + .5, bodyY + 3.5, fw - 1, fh - 1);
        c.beginPath(); c.moveTo(fx, bodyY + 3); c.lineTo(fx + fw, bodyY + 3 + fh); c.moveTo(fx + fw, bodyY + 3); c.lineTo(fx, bodyY + 3 + fh); c.strokeStyle = 'rgba(255,255,255,.07)'; c.stroke();
        // a horizon line so frames read as shots rather than boxes
        const hz = bodyY + 3 + fh * (0.35 + 0.4 * hash(k + 99, s)); c.fillStyle = 'rgba(255,255,255,.10)'; c.fillRect(fx + 2, hz, fw - 4, 1);
      }
    } else if (clip.kind === 'title' && bodyH >= 14) {
      c.fillStyle = 'rgba(255,255,255,.12)'; const tw = Math.min(w - 12, 60); c.fillRect(vx0 + 6, bodyY + bodyH / 2 - 2, tw, 3); c.fillRect(vx0 + 6, bodyY + bodyH / 2 + 4, tw * 0.6, 2);
    } else if (!isVideo && clip.kind !== 'title' && bodyH >= 12) {
      // waveform, one column per pixel, stable across zoom because it samples clip-local time
      const mid = bodyY + bodyH / 2, half = (bodyH - 4) / 2; c.fillStyle = WAVE;
      for (let px = Math.floor(vx0); px < vx1; px++) { const t = (px - x0) / pps; const a = amp(clip, t) * half; c.fillRect(px, mid - a, 1, Math.max(1, a * 2)); }
      if (clip.gain !== undefined && bodyH >= 24) { const gy = bodyY + bodyH * (0.5 - clip.gain / 48); c.fillStyle = 'rgba(255,220,120,.55)'; c.fillRect(vx0, gy, w, 1); }
    }
    c.restore();
    c.strokeStyle = col.line; c.lineWidth = 1; c.strokeRect(vx0 + .5, y + .5, w - 1, th - 1);
    // name
    if (showHead && w > 30) { c.fillStyle = 'rgba(255,255,255,.72)'; c.font = '9.5px JetBrains Mono, monospace'; c.save(); c.beginPath(); c.rect(vx0, y, w - 4, HEAD); c.clip(); c.fillText(clip.name, vx0 + 5, y + 11); c.restore(); }
    else if (!showHead && th >= 14 && w > 40) { c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '9px JetBrains Mono, monospace'; c.save(); c.beginPath(); c.rect(vx0, y, w - 4, th); c.clip(); c.fillText(clip.name, vx0 + 5, y + th / 2 + 3); c.restore(); }
  }

  function renderLayer() {
    const h = totalH();
    if (!layer || layer.width !== width * dpr || layerH !== h) { layer = document.createElement('canvas'); layer.width = width * dpr; layer.height = h * dpr; layerH = h; }
    const c = layer.getContext('2d')!; c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = '#111'; c.fillRect(0, 0, width, h);
    let y = 2;
    for (const t of tracks) {
      const th = trackH(t);
      c.fillStyle = '#161616'; c.fillRect(L, y, width - L, th);
      c.fillStyle = '#0f0f0f'; c.fillRect(0, y, L, th);
      c.fillStyle = '#8a877f'; c.font = '10px JetBrains Mono, monospace'; c.fillText(t.name, 10, y + Math.min(th / 2 + 4, 14));
      if (t.type === 'audio' && th >= 26) { ['M', 'S'].forEach((k, i) => { const bx = 34 + i * 13; c.strokeStyle = '#2e2e2c'; c.strokeRect(bx + .5, y + 4.5, 10, 10); c.fillStyle = '#55534e'; c.font = '8px JetBrains Mono, monospace'; c.fillText(k, bx + 2.5, y + 12); }); }
      for (const clip of t.clips) drawClip(c, clip, y + 2, th - 4);
      y += th + 2;
    }
    // second ticks faint through tracks at high zoom
    if (pps > 60) { c.fillStyle = 'rgba(255,255,255,.035)'; const t0 = Math.floor(scrollX / pps); for (let s = t0; s * pps - scrollX < width; s++) c.fillRect(Math.round(L + s * pps - scrollX), 0, 1, h); }
    dirty = false;
  }

  function draw() {
    requestAnimationFrame(draw);
    if (!tracks.length) return;
    if (follow && !video.paused) { const px = L + video.currentTime * pps - scrollX; if (px > width - 24 || px < L) { scrollX = video.currentTime * pps - (width - L) * 0.12; clampScroll(); dirty = true; } }
    if (dirty || !layer) renderLayer();
    ctx.drawImage(layer!, 0, 0, layer!.width, layer!.height, 0, 0, width, layerH);
    const px = L + video.currentTime * pps - scrollX;
    if (px >= L && px <= width) { ctx.fillStyle = '#ff3b30'; ctx.fillRect(px - .5, 0, 1.5, layerH); }
    drawRuler();
  }

  // ---------- interaction ----------
  function zoomAt(clientX: number, factor: number) {
    const t = timeAt(clientX); const r = canvas.getBoundingClientRect(); const cx = clientX - r.left - L;
    pps = Math.max(fitPps(), Math.min(600, pps * factor)); scrollX = t * pps - cx; clampScroll(); dirty = true; follow = false;
  }
  function setScale(v: number) { hScale = Math.max(0.3, Math.min(2.4, v)); sizeCanvas(); }
  capture.addEventListener('wheel', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) { e.preventDefault(); zoomAt(e.clientX, Math.exp(-e.deltaY * 0.0022)); return; }
    if (e.shiftKey) { e.preventDefault(); const d = e.deltaY || e.deltaX; setScale(hScale * Math.exp(-d * 0.0018)); return; }
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && duration * pps > width - L) { e.preventDefault(); scrollX += e.deltaX; clampScroll(); dirty = true; follow = false; }
  }, { passive: false });

  let dragging = false;
  const scrubTo = (e: PointerEvent) => { video.currentTime = timeAt(e.clientX); };
  [ruler, canvas].forEach((el) => {
    el.addEventListener('pointerdown', (e) => { dragging = true; el.setPointerCapture(e.pointerId); scrubTo(e); });
    el.addEventListener('pointermove', (e) => { if (dragging) scrubTo(e); });
    const end = () => { dragging = false; follow = true; };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  });
  video.addEventListener('play', () => (follow = true));

  if (video.readyState >= 1) load(); else video.addEventListener('loadedmetadata', load, { once: true });
  // streamed files can report a short duration first and correct it later; rebuild when that happens
  video.addEventListener('durationchange', () => { if (Number.isFinite(video.duration) && Math.abs(video.duration - duration) > 0.5) load(); });
  addEventListener('resize', sizeCanvas); sizeCanvas(); requestAnimationFrame(draw);

  return { setDirty: () => (dirty = true), resize: sizeCanvas };
}
