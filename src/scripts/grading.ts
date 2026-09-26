/**
 * Color grading slider. One full-height bar in the frame. Left of the bar is the log image, right of it
 * the Rec.709 conversion, and once the bar is left of the middle the final grade grows in from the right
 * edge (its seam sits at 2x the bar position), so the frame always reads log, Rec.709, final grade left
 * to right and at the far left it is all final grade, at the far right all log. The legend under the frame
 * follows the bands. With two stages there is a single seam at the bar.
 */
export function initGrading() {
  const root = document.getElementById('grader');
  if (!root) return;
  const wipe = root.querySelector<HTMLElement>('.wipe')!;
  const legend = root.querySelector<HTMLElement>('.legend')!;
  const vids = [...wipe.querySelectorAll('video')];
  const layers = [...wipe.querySelectorAll<HTMLElement>('.layer')];
  const bands = [...legend.querySelectorAll<HTMLElement>('.band')];
  const seam = wipe.querySelector<HTMLElement>('.seam')!;
  const three = layers.length > 1;
  let x = Number(root.dataset.start) || 0.3;

  function apply() {
    const g = three ? Math.min(1, 2 * x) : 1;
    root!.style.setProperty('--x', x * 100 + '%');
    root!.style.setProperty('--g', g * 100 + '%');
    layers[0].style.clipPath = `inset(0 0 0 ${x * 100}%)`;
    if (three) layers[1].style.clipPath = `inset(0 0 0 ${g * 100}%)`;
    seam.style.opacity = three && g < 0.996 && g - x > 0.004 ? '1' : '0';
    const spans = three ? [[0, x], [x, g], [g, 1]] : [[0, x], [x, 1]];
    const w = wipe.clientWidth;
    bands.forEach((b, i) => {
      const [s0, s1] = spans[i];
      b.style.left = s0 * 100 + '%'; b.style.width = (s1 - s0) * 100 + '%';
      b.style.opacity = (s1 - s0) * w > 90 ? '1' : '0';
    });
    wipe.setAttribute('aria-valuenow', String(Math.round(x * 100)));
  }
  const set = (cx: number) => { const r = wipe.getBoundingClientRect(); x = Math.max(0, Math.min(1, (cx - r.left) / r.width)); apply(); };
  let d = false;
  for (const el of [wipe, legend]) {
    el.addEventListener('pointerdown', (e) => { d = true; try { el.setPointerCapture(e.pointerId); } catch {} set(e.clientX); });
    el.addEventListener('pointermove', (e) => { if (d) set(e.clientX); });
    el.addEventListener('pointerup', () => (d = false)); el.addEventListener('pointercancel', () => (d = false));
  }
  wipe.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (e.key === 'ArrowRight') { x = Math.min(1, x + step); apply(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { x = Math.max(0, x - step); apply(); e.preventDefault(); }
    if (e.key === 'Home') { x = 0; apply(); e.preventDefault(); }
    if (e.key === 'End') { x = 1; apply(); e.preventDefault(); }
  });
  addEventListener('resize', apply);

  // keep every layer on the same frame as the base
  const master = vids[0];
  master.addEventListener('timeupdate', () => { for (const v of vids.slice(1)) if (Math.abs(v.currentTime - master.currentTime) > 0.12) v.currentTime = master.currentTime; });
  // three 1080p decodes are not free: only run them while the slider is on screen
  new IntersectionObserver(([en]) => { for (const v of vids) { if (en.isIntersecting) v.play().catch(() => {}); else v.pause(); } }, { threshold: 0.05 }).observe(wipe);
  apply();
}
