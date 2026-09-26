/** Header sits over the hero and fades out during the first ~220px of scroll. */
export function initHeader() {
  const hdr = document.querySelector<HTMLElement>('header.site');
  if (!hdr) return;
  const onScroll = () => {
    hdr.style.opacity = String(Math.max(0, 1 - scrollY / 220));
    hdr.style.pointerEvents = scrollY > 220 ? 'none' : '';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
