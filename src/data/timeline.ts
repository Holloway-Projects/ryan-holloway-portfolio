/**
 * Hero timeline sequence. Generated to look like a real cut until Ryan's actual sequence is transcribed
 * (see docs/interactive-timeline.md). Replace `buildSequence` with a static export of real tracks when it lands.
 */
export type ClipKind = 'video' | 'interview' | 'broll' | 'title' | 'dialogue' | 'music' | 'sfx' | 'amb';
export interface Clip { id: string; name: string; in: number; out: number; kind: ClipKind; gain?: number }
export interface Track { id: string; name: string; type: 'video' | 'audio'; clips: Clip[] }

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/** Build a plausible sequence for a film of `duration` seconds. Deterministic for a given seed. */
export function buildSequence(duration: number, seed = 11): Track[] {
  const r = rng(seed);
  const pick = (a: number, b: number) => a + r() * (b - a);
  const reel = (roll: number, take: number) => `A${String(roll).padStart(3, '0')}_C${String(take).padStart(3, '0')}`;

  // V1: the spine. Continuous cuts, mostly 2–7 s, with occasional long holds and interview stretches.
  const v1: Clip[] = [];
  let t = 0, roll = 3, take = 12, id = 0;
  let mode: 'montage' | 'interview' = 'montage', modeLeft = pick(12, 30);
  while (t < duration) {
    let len: number;
    if (mode === 'interview') len = pick(4, 11); else len = r() < 0.12 ? pick(8, 14) : pick(1.6, 6.5);
    len = Math.min(len, duration - t);
    v1.push({ id: `v1-${id++}`, name: reel(roll, take), in: t, out: t + len, kind: mode === 'interview' ? 'interview' : 'video' });
    t += len; take += 1 + Math.floor(r() * 3); if (r() < 0.08) { roll++; take = 1 + Math.floor(r() * 9); }
    modeLeft -= len; if (modeLeft <= 0) { mode = mode === 'montage' ? 'interview' : 'montage'; modeLeft = mode === 'interview' ? pick(14, 34) : pick(18, 45); }
  }

  // V2: B-roll overlays in runs, about a third coverage.
  const v2: Clip[] = []; t = pick(3, 9); id = 0; let broll = 40;
  while (t < duration - 2) {
    const run = 1 + Math.floor(r() * 4);
    for (let k = 0; k < run && t < duration - 1; k++) { const len = Math.min(pick(1.2, 4.5), duration - t); v2.push({ id: `v2-${id++}`, name: `B${String(broll++).padStart(3, '0')}`, in: t, out: t + len, kind: 'broll' }); t += len + (r() < 0.5 ? 0 : pick(0.2, 1.5)); }
    t += pick(6, 22);
  }

  // V3: titles. Opening title, a few lower thirds, end card.
  const v3: Clip[] = [{ id: 'v3-0', name: 'Title_open', in: 2.5, out: 8.5, kind: 'title' }];
  const l3 = 2 + Math.floor(r() * 3); t = pick(14, 30);
  for (let k = 0; k < l3 && t < duration - 20; k++) { v3.push({ id: `v3-${k + 1}`, name: `Lower3rd_0${k + 1}`, in: t, out: t + pick(3.5, 5), kind: 'title' }); t += pick(25, 70); }
  v3.push({ id: 'v3-end', name: 'End_card', in: Math.max(0, duration - 7), out: duration, kind: 'title' });

  // A1: dialogue follows the interview stretches on V1, split into takes.
  const a1: Clip[] = []; id = 0; let dtake = 3;
  v1.filter((c) => c.kind === 'interview').forEach((c) => {
    let s = c.in + pick(0, 0.4); const e = c.out - pick(0, 0.3);
    while (s < e - 0.8) { const len = Math.min(pick(2.5, 9), e - s); a1.push({ id: `a1-${id++}`, name: `INT_T${String(dtake).padStart(2, '0')}`, in: s, out: s + len, kind: 'dialogue', gain: pick(-3, 2) }); s += len + (r() < 0.6 ? 0 : pick(0.3, 1.2)); if (r() < 0.3) dtake++; }
  });

  // A2: music, two or three long cues.
  const a2: Clip[] = []; t = 0; id = 0; const cues = duration > 200 ? 3 : 2;
  for (let k = 0; k < cues; k++) { const end = k === cues - 1 ? duration : t + duration / cues + pick(-8, 8); a2.push({ id: `a2-${id++}`, name: `score_v3_pt${k + 1}.wav`, in: t, out: Math.min(duration, end), kind: 'music', gain: -6 }); t = end + (k === cues - 1 ? 0 : pick(0.5, 3)); }

  // A3: sound effects, short hits scattered through, denser in montage.
  const a3: Clip[] = []; t = pick(1, 6); id = 0; const fx = ['whoosh', 'impact', 'riser', 'click', 'wind', 'door', 'engine', 'hit_lo'];
  while (t < duration - 1) { const len = pick(0.25, 1.6); a3.push({ id: `a3-${id++}`, name: `${fx[Math.floor(r() * fx.length)]}_0${1 + Math.floor(r() * 9)}`, in: t, out: t + len, kind: 'sfx', gain: pick(-12, -4) }); t += pick(2.5, 14); }

  // A4: ambience beds with gaps.
  const a4: Clip[] = []; t = 0; id = 0; const beds = ['amb_ridge_wind', 'amb_room_tone', 'amb_traffic_far', 'amb_river'];
  while (t < duration) { const len = Math.min(pick(15, 60), duration - t); a4.push({ id: `a4-${id++}`, name: `${beds[id % beds.length]}.wav`, in: t, out: t + len, kind: 'amb', gain: -18 }); t += len + (r() < 0.4 ? 0 : pick(1, 6)); }

  return [
    { id: 'V3', name: 'V3', type: 'video', clips: v3 },
    { id: 'V2', name: 'V2', type: 'video', clips: v2 },
    { id: 'V1', name: 'V1', type: 'video', clips: v1 },
    { id: 'A1', name: 'A1', type: 'audio', clips: a1 },
    { id: 'A2', name: 'A2', type: 'audio', clips: a2 },
    { id: 'A3', name: 'A3', type: 'audio', clips: a3 },
    { id: 'A4', name: 'A4', type: 'audio', clips: a4 },
  ];
}
