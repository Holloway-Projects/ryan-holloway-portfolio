/**
 * Color grading slider. The rail under the frame is the control: its stops are the stages, left to right
 * (log, Rec.709, final grade). At a stop the whole frame is that stage. Between two stops the later stage
 * sweeps in from the right edge, so the earlier stage is always on the left of the seam and the frame
 * reads in the same order as the rail. Dragging anywhere over the frame or the rail sets the position.
 */
export function initGrading() {
  const root = document.getElementById('grader');
  if (!root) return;
  const wipe = root.querySelector<HTMLElement>('.wipe')!;
  const rail = root.querySelector<HTMLElement>('.rail')!;
  const vids = [...wipe.querySelectorAll('video')];
  const layers = [...wipe.querySelectorAll<HTMLElement>('.layer')];
  const bands = [...wipe.querySelectorAll<HTMLElement>('.band')];
  const stops = [...rail.querySelectorAll<HTMLElement>('.stop')];
  const seam = wipe.querySelector<HTMLElement>('.seam')!;
  const pairs = Math.max(1, vids.length - 1);
  let p = Number(root.dataset.start) || 0.75;

  function apply() {
    const t = p * pairs;
    const k = Math.min(pairs - 1, Math.floor(t));   // active pair: stage k on the left, k+1 sweeping in
    const frac = t - k;                              // how far stage k+1 has swept in
    const s = 1 - frac;                              // seam position across the frame
    root!.style.setProperty('--p', p * 100 + '%');
    root!.style.setProperty('--s', s * 100 + '%');
    layers.forEach((l, i) => { const j = i + 1; l.style.clipPath = j <= k ? 'inset(0)' : j === k + 1 ? `inset(0 0 0 ${s * 100}%)` : 'inset(0 0 0 100%)'; });
    seam.style.opacity = frac > 0.004 && frac < 0.996 ? '1' : '0';
    const w = wipe.clientWidth;
    bands.forEach((b, i) => {
      const span = i === k ? [0, s] : i === k + 1 ? [s, 1] : null;
      if (!span) { b.style.opacity = '0'; return; }
      b.style.left = span[0] * 100 + '%'; b.style.width = (span[1] - span[0]) * 100 + '%';
      b.style.opacity = (span[1] - span[0]) * w > 96 ? '1' : '0';
    });
    stops.forEach((st, i) => st.classList.toggle('on', Math.abs(t - i) < 0.5 + 0.001));
    rail.setAttribute('aria-valuenow', String(Math.round(p * 100)));
  }
  const set = (cx: number) => { const r = wipe.getBoundingClientRect(); p = Math.max(0, Math.min(1, (cx - r.left) / r.width)); apply(); };
  let d = false;
  for (const el of [wipe, rail]) {
    el.addEventListener('pointerdown', (e) => { d = true; try { el.setPointerCapture(e.pointerId); } catch {} set(e.clientX); });
    el.addEventListener('pointermove', (e) => { if (d) set(e.clientX); });
    el.addEventListener('pointerup', () => (d = false)); el.addEventListener('pointercancel', () => (d = false));
  }
  rail.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (e.key === 'ArrowRight') { p = Math.min(1, p + step); apply(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { p = Math.max(0, p - step); apply(); e.preventDefault(); }
    if (e.key === 'Home') { p = 0; apply(); e.preventDefault(); }
    if (e.key === 'End') { p = 1; apply(); e.preventDefault(); }
  });
  addEventListener('resize', apply);

  // keep every layer on the same frame as the base
  const master = vids[0];
  master.addEventListener('timeupdate', () => { for (const v of vids.slice(1)) if (Math.abs(v.currentTime - master.currentTime) > 0.12) v.currentTime = master.currentTime; });
  // three 1080p decodes are not free: only run them while the slider is on screen
  new IntersectionObserver(([en]) => { for (const v of vids) { if (en.isIntersecting) v.play().catch(() => {}); else v.pause(); } }, { threshold: 0.05 }).observe(wipe);
  apply();
}
