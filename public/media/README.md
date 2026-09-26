# Media

Everything the site plays or shows. Keep files web-sized: total media should stay in the low hundreds of MB.

```
video/   hero.mp4, hero-720.mp4, hero-poster.jpg, <project>.mp4, <project>-poster.jpg, grade-1.mp4, grade-2.mp4
audio/   dialogue-raw.wav|.mp3, dialogue-mix.wav|.mp3, score.mp3
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
Audio: 48 kHz, 16-bit WAV or 192k MP3. Raw and mix should be the same take, same length, so the crossfade lines up.
