"""Import this site's Resolve timeline; the DRT and source media stay outside git.

Usage: python3 scripts/import-hero-timeline.py /path/to/Main-Edit.drt CONTAINER_UUID
Requires ffmpeg/ffprobe. Frame zero must match the beginning of hero.mp4.
Only clip placement is imported, not Resolve effects or source-media playback.
"""
import json
import math
from pathlib import Path
import struct
import subprocess
import sys
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def frames(value):
    """Resolve stores subframe audio positions as integer|little-endian double."""
    whole, *fraction = value.split('|')
    return int(whole) + (struct.unpack('<d', bytes.fromhex(fraction[0]))[0] if fraction else 0)


def read_xml(archive, name):
    return ET.fromstring(archive.read(name).replace(b'::', b'__'))


def kind_for(name, video):
    name = name.lower()
    if video:
        return 'interview' if 'multicam' in name else 'title' if 'intro title' in name else 'broll'
    if 'josh-audio' in name or 'countdown' in name or 'one small step' in name:
        return 'dialogue'
    if 'musicbed' in name or 'muscperc' in name:
        return 'music'
    return 'amb' if name.startswith('amb') else 'sfx'


def main():
    hero = ROOT / 'public/media/video/hero.mp4'
    probe = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
        'stream=r_frame_rate,nb_frames', '-of', 'json', str(hero)]))['streams'][0]
    numerator, denominator = map(int, probe['r_frame_rate'].split('/'))
    fps = numerator / denominator
    end_frame = int(probe['nb_frames'])
    with zipfile.ZipFile(sys.argv[1]) as archive:
        root = read_xml(archive, f'SeqContainer/{sys.argv[2]}.xml')
        sequence_id = root.findtext('./VideoTrackVec/Element/Sm2TiTrack/Sequence')
        pool = read_xml(archive, 'MediaPool/Master/MpFolder.xml')
        sequence = pool.find(f'.//Sm2Sequence[@DbId="{sequence_id}"]')
        if sequence is None:
            raise ValueError('Sequence metadata missing')
        timeline_fps = struct.unpack('<d', bytes.fromhex(sequence.findtext('FrameRate'))[:8])[0]
        if abs(timeline_fps - fps) > 0.000001:
            raise ValueError('Timeline and hero frame rates differ; inspect before importing')
        tracks = []
        for media_type in ['Video', 'Audio']:
            group = []
            for index, track in enumerate(root.findall(f'./{media_type}TrackVec/Element/Sm2TiTrack'), 1):
                track_id = f'{media_type[0]}{index}'
                clips = []
                for element in track.findall('./Items/Element'):
                    item = element[0]
                    if item.tag != f'Sm2Ti{media_type}Clip':
                        continue  # Transitions overlap clips, not additional media blocks.
                    start = frames(item.findtext('Start'))
                    end = min(end_frame, start + frames(item.findtext('Duration')))
                    start = max(0, start)
                    if end <= start:
                        continue
                    name = item.findtext('Name') or 'Untitled'
                    clips.append(dict(id=f'{track_id.lower()}-{len(clips) + 1}', name=name,
                                      startFrame=start, endFrame=end, kind=kind_for(name, media_type == 'Video')))
                group.append(dict(id=track_id, name=track_id, type=media_type.lower(), clips=clips))
            tracks.extend(reversed(group) if media_type == 'Video' else group)

    # Each clip gets samples inside its own boundaries, including short overlays.
    # These are final-composite frames, not isolated source footage for each layer.
    sampled = set()
    for track in tracks:
        if track['type'] == 'video':
            for clip in track['clips']:
                samples = list(range(math.ceil(clip['startFrame']), math.ceil(clip['endFrame']), 12))
                clip['thumbnailFrames'] = samples
                sampled.update(samples)
    sampled = sorted(sampled)
    width, height, columns = 160, 90, 10
    expressions = [f'eq(n,{frame})' for frame in sampled]
    while len(expressions) > 1:
        expressions = ['(' + '+'.join(expressions[i:i + 2]) + ')' for i in range(0, len(expressions), 2)]
    select = expressions[0]
    atlas = ROOT / 'public/media/images/hero-filmstrip.jpg'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(hero),
                    '-vf', f"select='{select}',scale={width}:{height},tile={columns}x{math.ceil(len(sampled) / columns)}",
                    '-frames:v', '1', '-q:v', '4', '-update', '1', str(atlas)], check=True)
    for track in tracks:
        for clip in track['clips']:
            if 'thumbnailFrames' in clip:
                clip['thumbnailIndices'] = [sampled.index(f) for f in clip['thumbnailFrames']]
    data = dict(fpsNumerator=numerator, fpsDenominator=denominator, endFrame=end_frame,
                filmstrip=dict(width=width, height=height, columns=columns), tracks=tracks)
    (ROOT / 'src/data/hero-timeline.json').write_text(json.dumps(data, indent=2) + '\n')
    print(f'Imported {len(tracks)} tracks, trimmed to {end_frame} frames ({end_frame / fps:.6f}s).')
    print(f'{len(sampled)} composite thumbnails, {atlas.stat().st_size // 1024} KB.')


if __name__ == '__main__':
    main()
