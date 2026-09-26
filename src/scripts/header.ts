/**
 * Header states:
 *  intro  — visible over the hero on load, fades out after a beat so the film is all you see
 *  hidden — while the hero is on screen
 *  peek   — hidden, but the pointer is at the top edge
 *  stuck  — from The Work onward: solid, sticky, stays for the rest of the page
 */
export function initHeader() {
  const hdr = document.querySelector<HTMLElement>('header.site');
  const work = document.getElementById('work');
  if (!hdr || !work) return;
  let introDone = false, peek = false, peekTimer = 0;
  const set = (s: string) => { if (hdr.dataset.state !== s) hdr.dataset.state = s; };
  const update = () => {
    const stuckAt = work.getBoundingClientRect().top + scrollY - 120;
    if (scrollY >= stuckAt) { set('stuck'); return; }
    if (!introDone) { set('intro'); return; }
    set(peek ? 'peek' : 'hidden');
  };
  setTimeout(() => { introDone = true; update(); }, 3000);
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  addEventListener('mousemove', (e) => {
    if (hdr.dataset.state === 'stuck' || hdr.dataset.state === 'intro') return;
    if (e.clientY < 72) { peek = true; clearTimeout(peekTimer); update(); }
    else if (peek && e.clientY > 140) { peekTimer = window.setTimeout(() => { peek = false; update(); }, 600); }
  }, { passive: true });
  update();
}
