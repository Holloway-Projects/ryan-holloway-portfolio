import { tc } from '../lib/timecode';
import type { Project } from '../data/projects';

/** Case study overlay: film, scrubber with note markers, and notes that seek the film. */
let projects: Project[] = [];
let cur = 0;
let els: { root: HTMLElement; video: HTMLVideoElement; scrub: HTMLElement; fill: HTMLElement } | null = null;

export function openCase(i: number) {
  if (!els) return;
  cur = i; const p = projects[i];
  (document.getElementById('hero') as HTMLVideoElement | null)?.pause();
  const $ = (id: string) => document.getElementById(id)!;
  $('c-name').textContent = p.name; $('c-kind').textContent = p.kind; $('c-title').textContent = p.name; $('c-lede').textContent = p.lede;
  $('c-meta').innerHTML = ([['Client', p.client], ['Role', p.role], ['Year', p.year], ['Runtime', p.runtime]] as [string, string][]).map(([k, v]) => `<div><b>${k}</b>${v}</div>`).join('');
  $('c-dur').textContent = tc(p.dur);
  els.video.src = p.video; els.video.play().catch(() => {});
  els.scrub.querySelectorAll('.m').forEach((m) => m.remove());
  const nn = $('c-notes'); nn.innerHTML = '';
  p.notes.forEach((n, k) => {
    const m = document.createElement('div'); m.className = 'm'; m.style.left = (n.t / p.dur) * 100 + '%'; els!.scrub.appendChild(m);
    const b = document.createElement('button'); b.className = 'note'; b.innerHTML = `<small>${tc(n.t)}</small><span>${n.text}</span>`;
    b.addEventListener('click', () => { els!.video.currentTime = n.t; els!.video.play().catch(() => {}); mark(k); }); nn.appendChild(b);
  });
  els.root.classList.add('open'); els.root.scrollTop = 0; document.body.style.overflow = 'hidden'; history.replaceState(null, '', '#' + p.id);
}
export function closeCase() {
  if (!els) return;
  els.root.classList.remove('open'); els.video.pause(); els.video.removeAttribute('src'); document.body.style.overflow = ''; history.replaceState(null, '', '#work');
}
function mark(k: number) {
  document.querySelectorAll('#c-notes .note').forEach((b, i) => b.classList.toggle('on', i === k));
  document.querySelectorAll('#scrub .m').forEach((m, i) => m.classList.toggle('on', i === k));
}

export function initCaseStudy() {
  const root = document.getElementById('case'); if (!root) return;
  projects = JSON.parse(document.getElementById('projects-json')!.textContent || '[]');
  const video = document.getElementById('c-video') as HTMLVideoElement, scrub = document.getElementById('scrub')!, fill = document.getElementById('fill')!;
  els = { root, video, scrub, fill };
  video.addEventListener('timeupdate', () => {
    const p = projects[cur]; fill.style.width = Math.min(100, (video.currentTime / p.dur) * 100) + '%';
    document.getElementById('c-cur')!.textContent = tc(video.currentTime);
    let k = -1; p.notes.forEach((n, i) => { if (video.currentTime >= n.t) k = i; }); mark(k);
  });
  const scrubTo = (e: PointerEvent) => { const r = scrub.getBoundingClientRect(); const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); if (video.duration) video.currentTime = p * video.duration; };
  let d = false;
  scrub.addEventListener('pointerdown', (e) => { d = true; scrub.setPointerCapture(e.pointerId); scrubTo(e); });
  scrub.addEventListener('pointermove', (e) => { if (d) scrubTo(e); }); scrub.addEventListener('pointerup', () => (d = false));
  document.getElementById('c-close')!.addEventListener('click', closeCase);
  addEventListener('keydown', (e) => {
    if (!root.classList.contains('open') || document.getElementById('lb')?.classList.contains('open')) return;
    if (e.key === 'Escape') closeCase();
    if (e.key === 'ArrowRight') openCase((cur + 1) % projects.length);
    if (e.key === 'ArrowLeft') openCase((cur + projects.length - 1) % projects.length);
  });
  const idx = projects.findIndex((p) => p.id === location.hash.slice(1)); if (idx > -1) openCase(idx);
}
