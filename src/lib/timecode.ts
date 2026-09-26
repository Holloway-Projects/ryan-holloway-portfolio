export const FPS = 24;

/** Seconds → HH:MM:SS:FF (or HH:MM:SS when frames=false). */
export function tc(s: number, frames = true): string {
  s = Number.isFinite(s) ? s : 0;
  const fr = Math.floor((s % 1) * FPS);
  const sec = Math.floor(s);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(sec / 3600))}:${p(Math.floor((sec % 3600) / 60))}:${p(sec % 60)}` + (frames ? `:${p(fr)}` : '');
}
