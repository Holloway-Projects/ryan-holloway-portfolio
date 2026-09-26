import { tc } from '../lib/timecode';

/**
 * Sound section, mode one: dialogue A/B. Ryan's mix and score bed are real buffers. The raw side is the
 * real location file when `data-raw` is set; until then it is simulated from the mix (band-limited, a dip
 * where the mix has its presence lift, a little hiss) so the crossfade still demonstrates the idea.
 * Equal-power crossfade raw <-> mix, score bed ducks under dialogue by following the mix's envelope.
 * The rack draws a live spectrum of what is playing and the measured mix-vs-raw response curve from data.
 * Mode two (sound design stems) is wired in `stems.ts`.
 */
export function initAudio() {
  const panel = document.getElementById('snd-dialogue');
  const wave = document.getElementById('wave') as HTMLCanvasElement | null;
  const spec = document.getElementById('spec') as HTMLCanvasElement | null;
  if (!panel || !wave || !spec) return;
  const URLS = { raw: panel.dataset.raw || '', mix: panel.dataset.mix!, score: panel.dataset.score! };
  const response: [number, number][] = JSON.parse(document.getElementById('response-json')?.textContent || '[]');
  const wctx = wave.getContext('2d')!, sctx = spec.getContext('2d')!;
  const $ = (id: string) => document.getElementById(id)!;
  const playB = $('a-play'), ico = $('a-ico'), tcEl = $('a-tc'), status = $('a-status'), xf = $('xfade') as HTMLInputElement;
  const scOff = $('sc-off'), scOn = $('sc-on'), vol = $('vol') as HTMLInputElement, duck = $('duck'), rackSrc = $('rack-src');

  let ctx: AudioContext, mixBuf: AudioBuffer, rawBuf: AudioBuffer | null = null, scoreBuf: AudioBuffer | null = null;
  let peaks: { raw: Float32Array; mix: Float32Array } | null = null;
  let srcs: AudioBufferSourceNode[] = [], noiseBuf: AudioBuffer | null = null, noiseIn: AudioNode | null = null;
  let rawG: GainNode, mixG: GainNode, scoreG: GainNode, master: GainNode, out: GainNode, an: AnalyserNode, dlgAn: AnalyserNode, rawIn: AudioNode;
  let playing = false, offset = 0, startedAt = 0, ready = false, loading = false, scoreOn = false, scoreBase = Number(panel.dataset.level) || .6;
  const simulated = !URLS.raw;

  const volCurve = () => Math.pow(Number(vol.value) / 100, 1.6);
  function fit(c: HTMLCanvasElement) { const r = c.getBoundingClientRect(); const d = Math.min(2, devicePixelRatio || 1); c.width = r.width * d; c.height = r.height * d; c.getContext('2d')!.setTransform(d, 0, 0, d, 0, 0); return r; }

  function build() {
    ctx = new AudioContext();
    rawG = ctx.createGain(); mixG = ctx.createGain(); scoreG = ctx.createGain(); scoreG.gain.value = 0; master = ctx.createGain(); out = ctx.createGain(); out.gain.value = volCurve();
    an = ctx.createAnalyser(); an.fftSize = 2048; an.smoothingTimeConstant = .82;
    dlgAn = ctx.createAnalyser(); dlgAn.fftSize = 1024;
    rawG.connect(master); mixG.connect(master); master.connect(dlgAn); master.connect(out); scoreG.connect(out); out.connect(an).connect(ctx.destination);
    if (simulated) {
      // undo the mix, roughly: no low end below 100 Hz is put back with a shelf, the 6 k lift is dipped, the top is rolled off, a little hiss
      const shelf = ctx.createBiquadFilter(); shelf.type = 'lowshelf'; shelf.frequency.value = 120; shelf.gain.value = 5;
      const dip = ctx.createBiquadFilter(); dip.type = 'peaking'; dip.frequency.value = 6300; dip.Q.value = 1.2; dip.gain.value = -5;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200; lp.Q.value = .5;
      const trim = ctx.createGain(); trim.gain.value = .55;
      shelf.connect(dip).connect(lp).connect(trim).connect(rawG); rawIn = shelf;
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const dd = noiseBuf.getChannelData(0); for (let i = 0; i < dd.length; i++) dd[i] = Math.random() * 2 - 1;
      const nbp = ctx.createBiquadFilter(); nbp.type = 'bandpass'; nbp.frequency.value = 2500; nbp.Q.value = .4; const ng = ctx.createGain(); ng.gain.value = .0045;
      nbp.connect(ng).connect(rawG); noiseIn = nbp;
    } else rawIn = rawG;
    setFade(Number(xf.value) / 100);
  }
  function setFade(x: number) {
    $('xf-raw').classList.toggle('on', x < .5); $('xf-mix').classList.toggle('on', x >= .5);
    document.querySelectorAll('#chain span').forEach((s) => s.classList.toggle('on', x >= .5));
    rackSrc.textContent = x >= .5 ? 'mix' : simulated ? 'raw (simulated)' : 'raw';
    if (!rawG) return; const t = ctx.currentTime; rawG.gain.setTargetAtTime(Math.cos(x * Math.PI / 2), t, .03); mixG.gain.setTargetAtTime(Math.sin(x * Math.PI / 2), t, .03);
  }
  xf.addEventListener('input', () => { setFade(Number(xf.value) / 100); if (!playing) draw(); });
  function setScore(on: boolean) { scoreOn = on; scOff.classList.toggle('on', !on); scOn.classList.toggle('on', on); if (ctx && !playing && on) start(offset >= mixBuf.duration ? 0 : offset); }
  scOff.addEventListener('click', () => setScore(false));
  scOn.addEventListener('click', () => { if (!ctx) { load().then(() => setScore(true)); return; } setScore(true); });
  vol.addEventListener('input', () => { if (out) out.gain.setTargetAtTime(volCurve(), ctx.currentTime, .02); });

  const peaksOf = (b: AudioBuffer, N = 600) => { const ch = b.getChannelData(0); const out = new Float32Array(N); const step = Math.floor(ch.length / N); for (let i = 0; i < N; i++) { let m = 0; for (let j = 0; j < step; j += 8) { const v = Math.abs(ch[i * step + j]); if (v > m) m = v; } out[i] = m; } return out; };
  async function fetchBuf(url: string) { const res = await fetch(url); return ctx.decodeAudioData(await res.arrayBuffer()); }
  async function load() {
    if (loading) return; loading = true; status.textContent = 'Loading…';
    try {
      build();
      const [m, s, r] = await Promise.all([fetchBuf(URLS.mix), fetchBuf(URLS.score).catch(() => null), URLS.raw ? fetchBuf(URLS.raw).catch(() => null) : Promise.resolve(null)]);
      mixBuf = m; scoreBuf = s; rawBuf = r; ready = true;
      const mp = peaksOf(mixBuf); const rp = rawBuf ? peaksOf(rawBuf) : mp.map((v) => v * .62) as Float32Array; peaks = { raw: rp, mix: mp };
      status.textContent = simulated ? 'Raw side simulated from the mix until the location file lands.' : '';
      draw(); start(0);
    } catch { status.textContent = "Couldn't load the audio in this browser."; loading = false; }
  }
  const pos = () => (playing ? offset + ctx.currentTime - startedAt : offset);
  function tickScore() {
    if (!scoreG) return; let lvl = 0;
    const td = new Float32Array(dlgAn.fftSize); dlgAn.getFloatTimeDomainData(td); let s2 = 0; for (let i = 0; i < td.length; i++) s2 += td[i] * td[i]; lvl = Math.min(1, Math.sqrt(s2 / td.length) * 5);
    const target = scoreOn && playing ? scoreBase * (1 - .6 * lvl) : 0;
    scoreG.gain.setTargetAtTime(target, ctx.currentTime, .08); duck.classList.toggle('on', scoreOn && playing && lvl > .3);
  }
  function kill() { for (const s of srcs) { s.onended = null; try { s.stop(); } catch {} } srcs = []; }
  function start(at: number) {
    kill();
    if (noiseBuf && noiseIn) { const n = ctx.createBufferSource(); n.buffer = noiseBuf; n.loop = true; n.connect(noiseIn); n.start(); srcs.push(n); }
    const mk = (b: AudioBuffer, dest: AudioNode) => { const s = ctx.createBufferSource(); s.buffer = b; s.connect(dest); s.start(0, at); srcs.push(s); return s; };
    const lead = mk(mixBuf, mixG); mk(rawBuf || mixBuf, rawIn); if (scoreBuf) mk(scoreBuf, scoreG);
    startedAt = ctx.currentTime; offset = at; playing = true; lead.onended = () => { if (playing && srcs.includes(lead)) start(0); };
    ico.innerHTML = '<path d="M2 1.5h3v9H2zM7 1.5h3v9H7z"/>';
  }
  function stop() { offset = pos(); playing = false; kill(); ico.innerHTML = '<path d="M2 1.5v9l8-4.5z"/>'; }
  playB.addEventListener('click', () => { if (!ctx) { load(); return; } if (!ready) return; ctx.resume(); if (playing) stop(); else start(offset >= mixBuf.duration ? 0 : offset); });
  wave.addEventListener('click', (e) => { if (!ready) return; const r = wave.getBoundingClientRect(); const t = ((e.clientX - r.left) / r.width) * mixBuf.duration; const was = playing; if (was) stop(); offset = t; if (was) start(t); draw(); });
  document.addEventListener('snd:mode', (e) => { if ((e as CustomEvent).detail !== 'dialogue' && playing) stop(); });

  function draw() {
    const r = fit(wave!); const w = r.width, h = r.height; wctx.fillStyle = '#0c0c0c'; wctx.fillRect(0, 0, w, h);
    if (!peaks) { wctx.fillStyle = '#3a3a3a'; wctx.font = '12px JetBrains Mono, monospace'; wctx.fillText('press play', 16, h / 2 + 4); return; }
    const x = Number(xf.value) / 100, p = pos() / mixBuf.duration, N = peaks.mix.length, bw = w / N;
    for (let i = 0; i < N; i++) { const amp = (peaks.raw[i] * (1 - x) + peaks.mix[i] * x) * (h * .42); const px = i * bw; const played = i / N < p; wctx.fillStyle = played ? (x >= .5 ? '#d9a55e' : '#8a8a88') : (x >= .5 ? '#4d3f2a' : '#2c2c2c'); wctx.fillRect(px, h / 2 - amp, Math.max(1, bw - 1), Math.max(1, amp * 2)); }
    wctx.fillStyle = '#fff'; wctx.fillRect(p * w, 8, 1, h - 16);
  }
  const fx = (f: number, w: number) => (Math.log10(f / 20) / 3) * w;
  function drawSpec() {
    const r = fit(spec!); const w = r.width, h = r.height; sctx.fillStyle = '#0c0c0c'; sctx.fillRect(0, 0, w, h);
    sctx.strokeStyle = '#1e1e1e';
    [100, 1000, 10000].forEach((f) => { const x = fx(f, w); sctx.beginPath(); sctx.moveTo(x, 0); sctx.lineTo(x, h); sctx.stroke(); sctx.fillStyle = '#4a4a4a'; sctx.font = '10px JetBrains Mono, monospace'; sctx.fillText(f >= 1000 ? f / 1000 + 'k' : String(f), x + 4, h - 6); });
    if (an) {
      const data = new Uint8Array(an.frequencyBinCount); an.getByteFrequencyData(data); const nyq = ctx.sampleRate / 2; sctx.fillStyle = 'rgba(160,160,158,.35)';
      for (let px = 0; px < w; px += 3) { const f = 20 * Math.pow(1000, px / w); const bin = Math.min(data.length - 1, Math.round((f / nyq) * data.length)); const v = data[bin] / 255; sctx.fillRect(px, h - v * h * .9, 2, v * h * .9); }
      const td = new Float32Array(an.fftSize); an.getFloatTimeDomainData(td); let s2 = 0; for (let i = 0; i < td.length; i++) s2 += td[i] * td[i]; const rms = Math.sqrt(s2 / td.length); const lvl = Math.min(100, Math.max(0, ((20 * Math.log10(rms + 1e-6) + 48) / 48) * 100));
      $('m-l').style.width = lvl + '%'; $('m-r').style.width = lvl * .94 + '%';
    }
    // measured response of the mix relative to the raw: flat when the fader is on raw, full curve on mix
    if (response.length) {
      const x = Number(xf.value) / 100; sctx.beginPath();
      response.forEach(([f, db], i) => { const y = h / 2 - db * x * (h / 28); i ? sctx.lineTo(fx(f, w), y) : sctx.moveTo(fx(f, w), y); });
      sctx.strokeStyle = x >= .5 ? '#d9a55e' : '#5a5a58'; sctx.lineWidth = 1.5; sctx.stroke();
    }
    if (ready) { tcEl.innerHTML = `${tc(pos())} <span>/ ${tc(mixBuf.duration)}</span>`; if (playing) draw(); }
    tickScore(); requestAnimationFrame(drawSpec);
  }
  draw(); requestAnimationFrame(drawSpec); addEventListener('resize', draw);
}
