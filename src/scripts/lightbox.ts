/** Photography lightbox with previous / next, keyboard, and click-outside to close. */
export function initLightbox() {
  const lb = document.getElementById('lb'); if (!lb) return;
  const img = document.getElementById('lb-img') as HTMLImageElement;
  const items = [...document.querySelectorAll<HTMLButtonElement>('.photos button')];
  let li = 0;
  function open(i: number) {
    li = (i + items.length) % items.length; const b = items[li];
    img.src = b.dataset.full!; img.alt = b.dataset.caption || '';
    document.getElementById('lb-cap')!.textContent = b.dataset.caption || ''; document.getElementById('lb-n')!.textContent = `${li + 1} / ${items.length}`;
    lb!.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function close() { lb!.classList.remove('open'); document.body.style.overflow = ''; }
  items.forEach((b, i) => b.addEventListener('click', () => open(i)));
  document.getElementById('lb-close')!.addEventListener('click', close);
  document.getElementById('lb-prev')!.addEventListener('click', () => open(li - 1));
  document.getElementById('lb-next')!.addEventListener('click', () => open(li + 1));
  lb.addEventListener('click', (e) => { const t = e.target as HTMLElement; if (t === lb || t.classList.contains('stage')) close(); });
  addEventListener('keydown', (e) => {
    if (!lb!.classList.contains('open')) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') open(li + 1); if (e.key === 'ArrowLeft') open(li - 1);
  });
}
