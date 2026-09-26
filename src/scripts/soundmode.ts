/** Sound section mode toggle: Dialogue (A/B + score) or Sound design (stems). */
export function initSoundMode() {
  const grid = document.getElementById('snd-mode');
  if (!grid) return;
  const panels: Record<string, HTMLElement | null> = { dialogue: document.getElementById('snd-dialogue'), design: document.getElementById('snd-design') };
  const buttons = [...grid.querySelectorAll<HTMLButtonElement>('button')];
  function set(mode: string) {
    buttons.forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
    for (const k in panels) panels[k]?.toggleAttribute('hidden', k !== mode);
    document.dispatchEvent(new CustomEvent('snd:mode', { detail: mode }));
  }
  buttons.forEach((b) => b.addEventListener('click', () => set(b.dataset.mode!)));
}
