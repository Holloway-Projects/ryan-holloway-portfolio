import type { Track } from './timeline';

/**
 * Ryan's actual sequence for "The Team You Wish You Had" teaser, transcribed from Resolve screenshots.
 * Times are seconds, read off a 33.3 px/s ruler, so accuracy is about ±0.15 s. Names are as shown,
 * truncated ones completed sensibly. Replace with an XML/EDL export when available for frame accuracy.
 */
const c = (id: string, name: string, i: number, o: number, kind: Track['clips'][number]['kind'], gain?: number) => ({ id, name, in: i, out: o, kind, gain });

export const heroSequence: Track[] = [
  { id: 'V5', name: 'V5', type: 'video', clips: [
    c('v5-1', 'flash', 20.5, 20.7, 'video'), c('v5-2', 'flash', 22.5, 23.0, 'video'), c('v5-3', 'flash', 27.8, 27.95, 'video'),
  ]},
  { id: 'V4', name: 'V4', type: 'video', clips: [
    c('v4-1', 'film_leader', 16.4, 17.5, 'broll'),
    c('v4-2', 'frame', 17.8, 18.0, 'broll'), c('v4-3', 'frame', 18.1, 18.4, 'broll'), c('v4-4', 'frame', 18.5, 18.8, 'broll'), c('v4-5', 'frame', 18.9, 19.2, 'broll'),
    c('v4-6', 'frame', 19.3, 19.6, 'broll'), c('v4-7', 'frame', 19.7, 20.0, 'broll'), c('v4-8', 'frame', 20.1, 20.5, 'broll'),
    c('v4-9', '6_black', 20.5, 21.9, 'broll'), c('v4-10', 'leader_2', 23.0, 23.8, 'broll'), c('v4-11', 'leader_3', 23.9, 25.1, 'broll'), c('v4-12', 'leader_4', 26.6, 27.8, 'broll'),
  ]},
  { id: 'V3', name: 'V3', type: 'video', clips: [
    c('v3-1', 'insert', 15.3, 16.4, 'broll'), c('v3-2', 'insert', 17.3, 17.7, 'broll'), c('v3-3', 'INTRO title', 30.5, 34.3, 'title'),
  ]},
  { id: 'V2', name: 'V2', type: 'video', clips: [
    c('v2-1', 'B-roll 01', 13.8, 15.3, 'broll'), c('v2-2', 'B-roll 02', 17.6, 18.0, 'broll'), c('v2-3', 'B-roll 03', 18.7, 20.0, 'broll'),
    c('v2-4', 'B-roll 04', 21.5, 22.6, 'broll'), c('v2-5', 'B-roll 05', 22.7, 23.8, 'broll'), c('v2-6', 'B-roll 06', 23.9, 25.1, 'broll'), c('v2-7', '525_night', 27.8, 29.8, 'broll'),
  ]},
  { id: 'V1', name: 'V1', type: 'video', clips: [
    c('v1-1', 'Josh Angle 1', 0, 3.6, 'interview'), c('v1-2', 'Josh Angle 2', 3.75, 5.7, 'interview'), c('v1-3', 'Josh Angle 2', 5.9, 7.3, 'interview'),
    c('v1-4', 'Josh Angle 1', 7.3, 10.1, 'interview'), c('v1-5', 'Josh Angle 2', 10.3, 11.7, 'interview'), c('v1-6', 'Josh Angle 1', 11.9, 13.7, 'interview'),
    c('v1-7', '2067', 14.5, 16.4, 'video'), c('v1-8', '20670301', 16.5, 19.4, 'video'), c('v1-9', '2067', 20.0, 22.6, 'video'),
    c('v1-10', 'montage', 22.7, 23.8, 'video'), c('v1-11', 'montage', 23.9, 25.1, 'video'), c('v1-12', 'montage', 25.2, 26.6, 'video'), c('v1-13', 'montage', 26.7, 28.1, 'video'),
    c('v1-14', 'Josh Angle 2', 34.0, 38.5, 'interview'), c('v1-15', 'Josh Angle 1', 38.6, 41.8, 'interview'), c('v1-16', 'Chad Angle 1', 41.9, 45.2, 'interview'),
    c('v1-17', 'Chad Angle 2', 45.4, 49.0, 'interview'), c('v1-18', 'Chad Angle 2', 49.1, 53.8, 'interview'), c('v1-19', 'Johnny Angle 1', 53.9, 60, 'interview'),
  ]},
  { id: 'A1', name: 'A1', type: 'audio', clips: [
    c('a1-1', 'josh-audio-esv2-62p', 0.5, 5.6, 'dialogue', -1), c('a1-2', 'josh-audio-esv2-62p', 5.9, 12.7, 'dialogue', -1), c('a1-3', 'josh-audio-esv2-62p', 12.8, 13.7, 'dialogue', -1),
    c('a1-4', 'josh-audio-esv2-62p-bg', 34.0, 41.6, 'dialogue', -1), c('a1-5', 'chad-audio-esv2-62p-b', 41.8, 49.0, 'dialogue', -1),
    c('a1-6', 'chad-audio-esv2', 49.1, 53.8, 'dialogue', -1), c('a1-7', 'Johnny-audio-esv2-62p', 53.9, 60, 'dialogue', -1),
  ]},
  { id: 'A2', name: 'A2', type: 'audio', clips: [
    c('a2-1', 'uncovered-joseph-william-morgan', 0, 5.0, 'music', -8), c('a2-2', 'uncovered-joseph-william-morgan', 5.2, 10.6, 'music', -8),
    c('a2-3', 'stinger', 10.9, 11.2, 'sfx', -6), c('a2-4', 'stinger', 11.9, 12.4, 'sfx', -6), c('a2-5', 'stinger', 12.5, 13.1, 'sfx', -6),
    c('a2-6', 'Space', 13.6, 16.3, 'sfx', -6), c('a2-7', "'One s", 16.5, 19.3, 'dialogue', -3), c('a2-8', "'One s", 19.6, 22.3, 'dialogue', -3),
    c('a2-9', 'hit', 22.5, 23.8, 'sfx', -6), c('a2-10', 'hit', 23.9, 25.2, 'sfx', -6), c('a2-11', 'hit', 25.3, 26.6, 'sfx', -6), c('a2-12', 'hit', 26.7, 27.6, 'sfx', -6), c('a2-13', 'hit', 27.8, 29.9, 'sfx', -6),
    c('a2-14', 'uncovered-joseph-william-morgan-musicbed.mp3', 32.3, 60, 'music', -9),
  ]},
  { id: 'A3', name: 'A3', type: 'audio', clips: [
    c('a3-1', 'DSGNMorph_SLOW MOTION-In', 10.9, 20.6, 'sfx', -10),
    c('a3-2', 'tick', 22.5, 22.65, 'sfx', -8), c('a3-3', 'tick', 23.9, 24.05, 'sfx', -8), c('a3-4', 'tick', 25.1, 25.25, 'sfx', -8), c('a3-5', 'tick', 26.5, 26.65, 'sfx', -8),
    c('a3-6', 'MOrph', 27.8, 29.8, 'sfx', -8), c('a3-7', 'INTRO', 30.5, 34.3, 'sfx', -8),
  ]},
  { id: 'A4', name: 'A4', type: 'audio', clips: [
    c('a4-1', 'hit', 13.2, 13.6, 'sfx', -10), c('a4-2', 'whoosh', 23.0, 23.8, 'sfx', -10), c('a4-3', 'whoosh', 23.9, 25.1, 'sfx', -10),
    c('a4-4', 'whoosh', 26.6, 27.7, 'sfx', -10), c('a4-5', 'DSGN', 27.8, 29.8, 'sfx', -10), c('a4-6', 'tick', 29.9, 30.05, 'sfx', -10),
  ]},
  { id: 'A5', name: 'A5', type: 'audio', clips: [ c('a5-1', 'DSGNRise_RISER-Excitement Seeker', 23.2, 34.3, 'sfx', -12) ]},
  { id: 'A6', name: 'A6', type: 'audio', clips: [ c('a6-1', 'hit', 16.4, 17.5, 'sfx', -12), c('a6-2', 'DSGNBoom_BOOM-Dist', 29.8, 37.4, 'sfx', -10) ]},
  { id: 'A7', name: 'A7', type: 'audio', clips: [ c('a7-1', 'DSGNBoom_BOOM-Dist', 13.7, 21.3, 'sfx', -12), c('a7-2', 'AMBSea_CLIFFTOPS', 23.9, 30.4, 'amb', -18) ]},
  { id: 'A8', name: 'A8', type: 'audio', clips: [
    c('a8-1', 'Space', 15.3, 18.2, 'sfx', -12), c('a8-2', 'bed', 22.1, 23.0, 'sfx', -12), c('a8-3', 'uncovered-joseph', 23.9, 29.6, 'music', -14), c('a8-4', 'tail', 29.9, 31.1, 'sfx', -14),
  ]},
  { id: 'A9', name: 'A9', type: 'audio', clips: [ c('a9-1', 'MUSCPerc_PERCUSSION-Buckets Loopable_Ocular_Pe', 13.8, 29.8, 'music', -12) ]},
];
