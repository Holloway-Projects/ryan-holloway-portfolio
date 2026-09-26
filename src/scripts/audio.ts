import { tc } from '../lib/timecode';

/**
 * Sound design panel. One source buffer feeds two chains (simulated raw, processed mix) with an
 * equal-power crossfade, plus a synthesized score bed that ducks under dialogue.
 * When real raw + mix files exist, load two buffers and drop the simulated raw chain.
 */
export function initAudio() {
  const wave = document.getElementById('wave') as HTMLCanvasElement | null;
  const spec = document.getElementById('spec') as HTMLCanvasElement | null;
  if (!wave || !spec) return;
  const AUDIO_URL = wave.dataset.src!;
  const wctx = wave.getContext('2d')!, sctx = spec.getContext('2d')!;
  const $ = (id: string) => document.getElementById(id)!;
  const playB = $('a-play'), ico = $('a-ico'), tcEl = $('a-tc'), status = $('a-status'), xf = $('xfade') as HTMLInputElement;
  const scOff = $('sc-off'), scOn = $('sc-on'), scLvl = $('sc-lvl') as HTMLInputElement, duck = $('duck');

  let ctx: AudioContext, buffer: AudioBuffer, peaks: Float32Array | null = null, src: AudioBufferSourceNode | null = null, noise: AudioBufferSourceNode;
  let rawG: GainNode, mixG: GainNode, master: GainNode, an: AnalyserNode, dlgAn: AnalyserNode, padG: GainNode;
  const filters: Record<string, BiquadFilterNode> = {}; let comp: DynamicsCompressorNode;
  let playing = false, offset = 0, startedAt = 0, ready = false, loading = false, noiseOn = false, scoreOn = false, padBase = .45;

  function fit(c: HTMLCanvasElement) { const r = c.getBoundingClientRect(); const d = Math.min(2, devicePixelRatio || 1); c.width = r.width * d; c.height = r.height * d; c.getContext('2d')!.setTransform(d, 0, 0, d, 0, 0); return r; }

  function build() {
    ctx = new AudioContext();
    rawG = ctx.createGain(); mixG = ctx.createGain(); master = ctx.createGain(); an = ctx.createAnalyser(); an.fftSize = 2048; an.smoothingTimeConstant = .82;
    filters.rawLP = ctx.createBiquadFilter(); filters.rawLP.type = 'lowpass'; filters.rawLP.frequency.value = 3400; filters.rawLP.Q.value = .6;
    const rawTrim = ctx.createGain(); rawTrim.gain.value = .7; filters.rawLP.connect(rawTrim).connect(rawG);
    filters.hp = ctx.createBiquadFilter(); filters.hp.type = 'highpass'; filters.hp.frequency.value = 80;
    filters.pk = ctx.createBiquadFilter(); filters.pk.type = 'peaking'; filters.pk.frequency.value = 3000; filters.pk.Q.value = 1; filters.pk.gain.value = 3;
    filters.sh = ctx.createBiquadFilter(); filters.sh.type = 'highshelf'; filters.sh.frequency.value = 8000; filters.sh.gain.value = 2;
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -24; comp.ratio.value = 3; comp.attack.value = .005; comp.release.value = .15;
    const makeup = ctx.createGain(); makeup.gain.value = 1.25;
    filters.hp.connect(filters.pk).connect(filters.sh).connect(comp).connect(makeup).connect(mixG);
    rawG.connect(master); mixG.connect(master); master.connect(an).connect(ctx.destination);
    dlgAn = ctx.createAnalyser(); dlgAn.fftSize = 1024; master.connect(dlgAn);
    // score bed placeholder: detuned triangles through a slow-moving lowpass
    padG = ctx.createGain(); padG.gain.value = 0; const padLP = ctx.createBiquadFilter(); padLP.type = 'lowpass'; padLP.frequency.value = 900; padLP.Q.value = .5;
    ([[110, 0], [164.8, 3], [220, -4], [329.6, 2]] as [number, number][]).forEach(([f, det]) => { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = det; const g = ctx.createGain(); g.gain.value = .05; o.connect(g).connect(padLP); o.start(); });
    const lfo = ctx.createOscillator(); lfo.frequency.value = .08; const lg = ctx.createGain(); lg.gain.value = 350; lfo.connect(lg).connect(padLP.frequency); lfo.start();
    padLP.connect(padG).connect(an);
    // hiss bed for the simulated raw side
    const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const dd = nb.getChannelData(0); for (let i = 0; i < dd.length; i++) dd[i] = Math.random() * 2 - 1;
    noise = ctx.createBufferSource(); noise.buffer = nb; noise.loop = true; const nbp = ctx.createBiquadFilter(); nbp.type = 'bandpass'; nbp.frequency.value = 2500; nbp.Q.value = .4; const ng = ctx.createGain(); ng.gain.value = .018;
    noise.connect(nbp).connect(ng).connect(rawG);
    setFade(Number(xf.value) / 100);
  }
  function setFade(x: number) {
    $('xf-raw').classList.toggle('on', x < .5); $('xf-mix').classList.toggle('on', x >= .5);
    document.querySelectorAll('#chain span').forEach((s) => s.classList.toggle('on', x >= .5));
    if (!rawG) return; const t = ctx.currentTime; rawG.gain.setTargetAtTime(Math.cos(x * Math.PI / 2), t, .03); mixG.gain.setTargetAtTime(Math.sin(x * Math.PI / 2), t, .03);
  }
  xf.addEventListener('input', () => { setFade(Number(xf.value) / 100); if (!playing) draw(); });
  function setScore(on: boolean) { scoreOn = on; scOff.classList.toggle('on', !on); scOn.classList.toggle('on', on); if (!ctx) return; if (!playing && on) start(offset >= buffer.duration ? 0 : offset); }
  scOff.addEventListener('click', () => setScore(false));
  scOn.addEventListener('click', () => { if (!ctx) { load().then(() => setScore(true)); return; } setScore(true); });
  scLvl.addEventListener('input', () => (padBase = Number(scLvl.value) / 100));

  async function load() {
    if (loading) return; loading = true; status.textContent = 'Loading placeholder audio…';
    try {
      build(); const res = await fetch(AUDIO_URL); const ab = await res.arrayBuffer(); buffer = await ctx.decodeAudioData(ab); ready = true;
      const ch = buffer.getChannelData(0); const N = 600; peaks = new Float32Array(N); const step = Math.floor(ch.length / N);
      for (let i = 0; i < N; i++) { let m = 0; for (let j = 0; j < step; j += 8) { const v = Math.abs(ch[i * step + j]); if (v > m) m = v; } peaks[i] = m; }
      status.textContent = "Placeholder: an open-licensed interview clip. The raw side is simulated from the same file. Ryan's location audio and final mix drop in here.";
      draw(); start(0);
    } catch { status.textContent = "Couldn't load the placeholder audio in this browser. Real files will replace it."; loading = false; }
  }
  const pos = () => (playing ? offset + ctx.currentTime - startedAt : offset);
  function tickScore() {
    if (!padG) return; let lvl = 0;
    if (dlgAn) { const td = new Float32Array(dlgAn.fftSize); dlgAn.getFloatTimeDomainData(td); let s2 = 0; for (let i = 0; i < td.length; i++) s2 += td[i] * td[i]; lvl = Math.min(1, Math.sqrt(s2 / td.length) * 6); }
    const target = scoreOn && playing ? padBase * .6 * (1 - .65 * lvl) : 0;
    padG.gain.setTargetAtTime(target, ctx.currentTime, .08); duck.classList.toggle('on', scoreOn && playing && lvl > .25);
  }
  function start(at: number) {
    if (!noiseOn) { noise.start(); noiseOn = true; }
    src = ctx.createBufferSource(); src.buffer = buffer; src.connect(filters.rawLP); src.connect(filters.hp); src.start(0, at);
    startedAt = ctx.currentTime; offset = at; playing = true; const me = src; me.onended = () => { if (playing && src === me) start(0); };
    ico.innerHTML = '<path d="M2 1.5h3v9H2zM7 1.5h3v9H7z"/>';
  }
  function stop() { offset = pos(); playing = false; if (src) { src.onended = null; try { src.stop(); } catch {} } ico.innerHTML = '<path d="M2 1.5v9l8-4.5z"/>'; }
  playB.addEventListener('click', () => { if (!ctx) { load(); return; } if (!ready) return; ctx.resume(); if (playing) stop(); else start(offset >= buffer.duration ? 0 : offset); });
  wave.addEventListener('click', (e) => { if (!ready) return; const r = wave.getBoundingClientRect(); const t = ((e.clientX - r.left) / r.width) * buffer.duration; const was = playing; if (was) stop(); offset = t; if (was) start(t); draw(); });

  function draw() {
    const r = fit(wave!); const w = r.width, h = r.height; wctx.fillStyle = '#0c0c0c'; wctx.fillRect(0, 0, w, h);
    if (!peaks) { wctx.fillStyle = '#3a3a3a'; wctx.font = '12px JetBrains Mono, monospace'; wctx.fillText('press play to load', 16, h / 2 + 4); return; }
    const x = Number(xf.value) / 100, p = pos() / buffer.duration, N = peaks.length, bw = w / N;
    for (let i = 0; i < N; i++) { const amp = peaks[i] * (0.55 + 0.45 * x) * (h * .42); const px = i * bw; const played = i / N < p; wctx.fillStyle = played ? (x >= .5 ? '#d9a55e' : '#8a8a88') : (x >= .5 ? '#4d3f2a' : '#2c2c2c'); wctx.fillRect(px, h / 2 - amp, Math.max(1, bw - 1), Math.max(1, amp * 2)); }
    wctx.fillStyle = '#fff'; wctx.fillRect(p * w, 8, 1, h - 16);
  }
  function drawSpec() {
    const r = fit(spec!); const w = r.width, h = r.height; sctx.fillStyle = '#0c0c0c'; sctx.fillRect(0, 0, w, h);
    sctx.strokeStyle = '#1e1e1e';
    [100, 1000, 10000].forEach((f) => { const x = (Math.log10(f / 20) / Math.log10(1000)) * w; sctx.beginPath(); sctx.moveTo(x, 0); sctx.lineTo(x, h); sctx.stroke(); sctx.fillStyle = '#4a4a4a'; sctx.font = '10px JetBrains Mono, monospace'; sctx.fillText(f >= 1000 ? f / 1000 + 'k' : String(f), x + 4, h - 6); });
    if (an) {
      const data = new Uint8Array(an.frequencyBinCount); an.getByteFrequencyData(data); const nyq = ctx.sampleRate / 2; sctx.fillStyle = 'rgba(160,160,158,.35)';
      for (let px = 0; px < w; px += 3) { const f = 20 * Math.pow(1000, px / w); const bin = Math.min(data.length - 1, Math.round((f / nyq) * data.length)); const v = data[bin] / 255; sctx.fillRect(px, h - v * h * .9, 2, v * h * .9); }
      const x = Number(xf.value) / 100; const n = 160, freqs = new Float32Array(n); for (let i = 0; i < n; i++) freqs[i] = 20 * Math.pow(1000, i / (n - 1));
      const mag = new Float32Array(n), ph = new Float32Array(n), total = new Float32Array(n).fill(1);
      [filters.hp, filters.pk, filters.sh].forEach((f) => { f.getFrequencyResponse(freqs, mag, ph); for (let i = 0; i < n; i++) total[i] *= mag[i]; });
      sctx.beginPath(); for (let i = 0; i < n; i++) { const db = 20 * Math.log10(Math.max(1e-4, total[i])) * x; const y = h / 2 - db * (h / 28); i ? sctx.lineTo((i / (n - 1)) * w, y) : sctx.moveTo(0, y); }
      sctx.strokeStyle = x >= .5 ? '#d9a55e' : '#5a5a58'; sctx.lineWidth = 1.5; sctx.stroke();
      const td = new Float32Array(an.fftSize); an.getFloatTimeDomainData(td); let s2 = 0; for (let i = 0; i < td.length; i++) s2 += td[i] * td[i]; const rms = Math.sqrt(s2 / td.length); const lvl = Math.min(100, Math.max(0, ((20 * Math.log10(rms + 1e-6) + 48) / 48) * 100));
      $('m-l').style.width = lvl + '%'; $('m-r').style.width = lvl * .94 + '%';
    } else { sctx.strokeStyle = '#3a3a3a'; sctx.beginPath(); sctx.moveTo(0, h / 2); sctx.lineTo(w, h / 2); sctx.stroke(); }
    if (ready) { tcEl.innerHTML = `${tc(pos())} <span>/ ${tc(buffer.duration)}</span>`; if (playing) draw(); }
    tickScore(); requestAnimationFrame(drawSpec);
  }
  draw(); requestAnimationFrame(drawSpec); addEventListener('resize', draw);
}
