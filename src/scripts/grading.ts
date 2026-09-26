import type { Look } from '../data/looks';

/** Draggable camera-original / final-grade wipe, plus the example toggle that swaps clip and grade. */
export function initGrading() {
  const el = document.getElementById('wipe');
  const list = document.getElementById('look-list');
  if (!el || !list) return;
  const looks: Look[] = JSON.parse(document.getElementById('looks-json')!.textContent || '[]');
  const vids = el.querySelectorAll('video');

  const set = (x: number) => { const r = el.getBoundingClientRect(); el.style.setProperty('--x', Math.max(2, Math.min(98, ((x - r.left) / r.width) * 100)) + '%'); };
  let d = false;
  el.addEventListener('pointerdown', (e) => { d = true; el.setPointerCapture(e.pointerId); set(e.clientX); });
  el.addEventListener('pointermove', (e) => { if (d) set(e.clientX); });
  el.addEventListener('pointerup', () => (d = false)); el.addEventListener('pointercancel', () => (d = false));
  vids[0].addEventListener('timeupdate', () => { if (Math.abs(vids[0].currentTime - vids[1].currentTime) > .15) vids[1].currentTime = vids[0].currentTime; });

  const buttons = [...list.querySelectorAll('button')];
  function setLook(i: number) {
    const l = looks[i];
    el!.style.setProperty('--grade', l.grade); el!.style.setProperty('--x', '55%');
    vids.forEach((v) => { if (v.getAttribute('src') !== l.video) { v.src = l.video; v.play().catch(() => {}); } });
    buttons.forEach((b, k) => b.classList.toggle('on', k === i));
  }
  buttons.forEach((b, i) => b.addEventListener('click', () => setLook(i)));
  setLook(0);
}
