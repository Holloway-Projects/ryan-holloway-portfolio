import { tc } from '../lib/timecode';

/**
 * Sound section, mode two: sound design stems. Every channel is a decoded buffer on its own gain node,
 * mixed through a trim and a safety limiter. The picture is a muted video element slaved to the audio
 * clock. Mute and solo work like an NLE: any solo silences every channel that is not soloed, and mute
 * still wins inside the solo group. Click a waveform to seek. Buffers load when the mode is opened.
 */
export function initStems() {
  const panel = document.getElementById('snd-design');
  const video = document.getElementById('design-video') as HTMLVideoElement | null;
  if (!panel || !video) return;
  const vid: HTMLVideoElement = video;
  const rows = [...panel.querySelectorAll<HTMLElement>('.stem')];
  if (!rows.length) return;
  const $ = (id: string) => document.getElementById(id)!;
  const playB = $('d-play'), ico = $('d-ico'), tcEl = $('d-tc'), prog = $('d-prog') as HTMLElement, monitor = $('d-monitor');
  const trim = Number(panel.dataset.trim) || .4;

  type Ch = { row: HTMLElement; canvas: HTMLCanvasElement; src: string; gain: number; buf: AudioBuffer | null; peaks: Float32Array | null; g: GainNode | null; muted: boolean; solo: boolean; node: AudioBufferSourceNode | null };
  const chs: Ch[] = rows.map((row) => ({ row, canvas: row.querySelector('canvas')!, src: row.dataset.src!, gain: Number(row.dataset.gain) || 1, buf: null, peaks: null, g: null, muted: false, solo: false, node: null }));
  let ctx: AudioContext, out: GainNode, ready = false, loading = false, playing = false, offset = 0, startedAt = 0, duration = 0;

  function fit(c: HTMLCanvasElement) { const r = c.getBoundingClientRect(); const d = Math.min(2, devicePixelRatio || 1); c.width = r.width * d; c.height = r.height * d; c.getContext('2d')!.setTransform(d, 0, 0, d, 0, 0); return r; }
  const peaksOf = (b: AudioBuffer, N = 400) => { const ch = b.getChannelData(0); const o = new Float32Array(N); const step = Math.floor(ch.length / N); for (let i = 0; i < N; i++) { let m = 0; for (let j = 0; j < step; j += 4) { const v = Math.abs(ch[i * step + j]); if (v > m) m = v; } o[i] = m; } return o; };

  async function load() {
    if (ready || loading) return; loading = true;
    ctx = new AudioContext();
    const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -6; lim.knee.value = 4; lim.ratio.value = 12; lim.attack.value = .003; lim.release.value = .12;
    out = ctx.createGain(); out.gain.value = trim; out.connect(lim).connect(ctx.destination);
    await Promise.all(chs.map(async (c) => { const res = await fetch(c.src); c.buf = await ctx.decodeAudioData(await res.arrayBuffer()); c.peaks = peaksOf(c.buf); c.g = ctx.createGain(); c.g.connect(out); }));
    duration = Math.max(...chs.map((c) => c.buf!.duration)); ready = true; loading = false; applyGains(); drawAll();
  }
  function applyGains() {
    const anySolo = chs.some((c) => c.solo);
    for (const c of chs) {
      const on = !c.muted && (!anySolo || c.solo);
      c.row.classList.toggle('muted', !on); c.row.classList.toggle('solo', c.solo);
      c.row.querySelector('.mute')!.classList.toggle('on', c.muted); c.row.querySelector('.mute')!.setAttribute('aria-pressed', String(c.muted));
      c.row.querySelector('.solo')!.classList.toggle('on', c.solo); c.row.querySelector('.solo')!.setAttribute('aria-pressed', String(c.solo));
      if (c.g) c.g.gain.setTargetAtTime(on ? c.gain : 0, ctx.currentTime, .015);
    }
  }
  const pos = () => (playing ? (offset + ctx.currentTime - startedAt) % duration : offset);
  function kill() { for (const c of chs) { if (c.node) { c.node.onended = null; try { c.node.stop(); } catch {} c.node = null; } } }
  function start(at: number) {
    kill();
    for (const c of chs) { const n = ctx.createBufferSource(); n.buffer = c.buf; n.connect(c.g!); n.start(0, at); c.node = n; }
    const lead = chs[0].node!; lead.onended = () => { if (playing && chs[0].node === lead) start(0); };
    startedAt = ctx.currentTime; offset = at; playing = true;
    vid.currentTime = at; vid.play().catch(() => {});
    ico.innerHTML = '<path d="M2 1.5h3v9H2zM7 1.5h3v9H7z"/>';
  }
  function stop() { offset = pos(); playing = false; kill(); vid.pause(); ico.innerHTML = '<path d="M2 1.5v9l8-4.5z"/>'; }
  async function toggle() { if (!ready) { await load(); } ctx.resume(); if (playing) stop(); else start(offset >= duration ? 0 : offset); }
  function seek(t: number) { if (!ready) return; const was = playing; if (was) stop(); offset = Math.max(0, Math.min(duration, t)); vid.currentTime = offset; if (was) start(offset); else drawAll(); }

  playB.addEventListener('click', toggle);
  monitor.addEventListener('click', toggle);
  for (const c of chs) {
    c.row.querySelector('.mute')!.addEventListener('click', () => { c.muted = !c.muted; applyGains(); });
    c.row.querySelector('.solo')!.addEventListener('click', () => { c.solo = !c.solo; applyGains(); });
    c.canvas.addEventListener('click', (e) => { const r = c.canvas.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * duration); });
  }
  document.addEventListener('snd:mode', (e) => { const m = (e as CustomEvent).detail; if (m === 'design') { load(); requestAnimationFrame(drawAll); } else if (playing) stop(); });
  new IntersectionObserver(([en]) => { if (!en.isIntersecting && playing) stop(); }, { threshold: 0 }).observe(panel);
  addEventListener('resize', drawAll);

  function drawRow(c: Ch, p: number) {
    const r = fit(c.canvas); const w = r.width, h = r.height, x = c.canvas.getContext('2d')!;
    x.fillStyle = '#0c0c0c'; x.fillRect(0, 0, w, h);
    if (!c.peaks) return;
    const anySolo = chs.some((k) => k.solo); const on = !c.muted && (!anySolo || c.solo);
    const N = c.peaks.length, bw = w / N;
    for (let i = 0; i < N; i++) { const a = c.peaks[i] * h * .46; const played = i / N < p; x.fillStyle = !on ? (played ? '#2e2e2e' : '#222') : c.solo ? (played ? '#d9a55e' : '#5a4630') : played ? '#a3a3a0' : '#3a3a38'; x.fillRect(i * bw, h / 2 - a, Math.max(1, bw - .6), Math.max(1, a * 2)); }
    x.fillStyle = '#fff'; x.fillRect(p * w, 3, 1, h - 6);
  }
  function drawAll() { const p = duration ? pos() / duration : 0; for (const c of chs) drawRow(c, p); prog.style.width = p * 100 + '%'; tcEl.innerHTML = `${tc(duration ? pos() : 0)} <span>/ ${tc(duration)}</span>`; }
  function tick() {
    if (playing) { drawAll(); const t = pos(); if (Math.abs(vid.currentTime - t) > .12) vid.currentTime = t; }
    requestAnimationFrame(tick);
  }
  drawAll(); requestAnimationFrame(tick);
}
