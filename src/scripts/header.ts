/**
 * Header states:
 *  intro  — visible over the hero on load, fades out after a beat so the film is all you see
 *  hidden — while the hero is on screen
 *  peek   — hidden, but the pointer is at the top edge
 *  stuck  — from the first section after the hero onward: glass, sticky, stays for the rest of the page
 */
export function initHeader() {
  const hdr = document.querySelector<HTMLElement>('header.site');
  const first = document.getElementById('reel')?.nextElementSibling as HTMLElement | null;
  if (!hdr || !first) return;
  const menu = hdr.querySelector<HTMLButtonElement>('.menu-toggle');
  const closeMenu = () => {
    hdr.dataset.menuOpen = 'false';
    menu?.setAttribute('aria-expanded', 'false');
  };
  menu?.addEventListener('click', () => {
    const open = hdr.dataset.menuOpen !== 'true';
    hdr.dataset.menuOpen = String(open);
    menu.setAttribute('aria-expanded', String(open));
  });
  hdr.querySelector('nav')?.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) closeMenu();
  });
  let introDone = false, peek = false, peekTimer = 0;
  const set = (s: string) => { if (hdr.dataset.state !== s) hdr.dataset.state = s; };
  const update = () => {
    const stuckAt = first.getBoundingClientRect().top + scrollY - 120;
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
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
  update();
}
