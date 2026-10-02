/** Sound section mode toggle: Dialogue Mix (A/B + score) or Sound Design (stems). */
export function initSoundMode() {
  const grid = document.getElementById('snd-mode');
  if (!grid) return;
  const title = document.getElementById('sound-title');
  const panels: Record<string, HTMLElement | null> = { dialogue: document.getElementById('snd-dialogue'), design: document.getElementById('snd-design') };
  const buttons = [...grid.querySelectorAll<HTMLButtonElement>('button')];
  const titles: Record<string, string> = { dialogue: 'Dialogue Mix', design: 'Sound Design' };
  function set(mode: string) {
    buttons.forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
    for (const k in panels) panels[k]?.toggleAttribute('hidden', k !== mode);
    if (title) title.textContent = titles[mode] ?? 'Sound';
    document.dispatchEvent(new CustomEvent('snd:mode', { detail: mode }));
  }
  buttons.forEach((b) => b.addEventListener('click', () => set(b.dataset.mode!)));
}
