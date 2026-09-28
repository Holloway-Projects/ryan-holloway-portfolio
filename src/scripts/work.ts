import { openCase } from './casestudy';

/** Work grid: hover to preview the film (desktop only), click to open the case study. */
export function initWork() {
  const canHover = matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLButtonElement>('.work').forEach((b) => {
    const i = Number(b.dataset.index), v = b.querySelector('video')!;
    if (canHover) {
      b.addEventListener('mouseenter', () => { if (!v.src) { v.src = b.dataset.video!; v.addEventListener('playing', () => v.classList.add('ready'), { once: true }); } v.play().catch(() => {}); });
      b.addEventListener('mouseleave', () => v.pause());
    }
    b.addEventListener('click', () => { v.pause(); openCase(i); });
  });
}
