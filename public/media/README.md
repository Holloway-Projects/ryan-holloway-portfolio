# Media

Everything the site plays or shows. Keep files web-sized: total media should stay in the low hundreds of MB.

```
video/   hero.mp4, hero-720.mp4, hero-poster.jpg, grade-log.mp4, grade-709.mp4, grade-final.mp4, design.mp4, design-poster.jpg, <project>.mp4, <project>-poster.jpg
audio/   dialogue-raw.m4a, dialogue-mix.m4a, score.m4a, stems/dialogue.m4a, stems/sfx-1.m4a … sfx-6.m4a
images/  headshot.jpg, photo-01.jpg …
```

## Hero video

`hero.mp4` is Ryan's Resolve export untouched (4K, H.264 High, 6,000 Kb/s, AAC). Resolve does not write
the Rec.709 primaries/matrix flags, and browsers shift the colour when they are missing, so the flags are
rewritten in the bitstream without re-encoding a pixel:

```
ffmpeg -i Main-Edit.mp4 -map 0:v:0 -map 0:a:0 -c copy \
  -bsf:v "h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0" \
  -movflags +faststart hero.mp4
```

`hero-720.mp4` is the phone variant, downscaled from that file with the same flags set on the encoder:

```
ffmpeg -i Main-Edit.mp4 -map 0:v:0 -map 0:a:0 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow \
  -crf 22 -maxrate 3M -bufsize 6M -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -color_range tv -c:a aac -b:a 128k -movflags +faststart hero-720.mp4
```

Poster: `ffmpeg -ss 1.5 -i hero.mp4 -frames:v 1 -q:v 3 hero-poster.jpg`.

## Grading clips

Same 14.08 s excerpt exported three times from Resolve (S-Log3, Rec.709, final grade), 1080p, no audio, so the
three layers stay in sync and decode cheaply. Frame counts must match.

```
ffmpeg -i Main-Edit-Raw.mp4 -t 14.08 -vf "scale=1920:1080:flags=lanczos" -c:v libx264 -preset slow -crf 19 \
  -maxrate 6M -bufsize 12M -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -color_range tv -an -write_tmcd 0 -movflags +faststart grade-log.mp4
```

## Encoding recipe for everything else (ffmpeg)

Always add `-color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv` when re-encoding
Resolve output. 1080p, H.264, ~4 Mbps, faststart so it streams immediately, audio AAC 128k:

```
ffmpeg -i in.mov -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 22 -maxrate 4M -bufsize 8M \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k out.mp4
```

720p variant for phones (~2 Mbps):

```
ffmpeg -i in.mov -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 23 -maxrate 2M -bufsize 4M \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k out-720.mp4
```

Poster frame at 3 seconds:

```
ffmpeg -ss 3 -i out.mp4 -frames:v 1 -q:v 3 out-poster.jpg
```

Hover previews in the work grid use the same file as the case study, so no extra encode is needed.
Audio: Ryan exports 48 kHz 24-bit WAV; encode with `ffmpeg -i in.wav -c:a aac -b:a 192k -movflags +faststart out.m4a`.
Raw, mix and score must be the same range and length so the crossfade and ducking line up. Check a WAV is not
silent before encoding (`ffmpeg -i in.wav -af astats -f null -` should show a finite peak level).
