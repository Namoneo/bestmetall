# Project photos — drop-in guide

The portfolio cards auto-detect photos. **Just add the files below** and they
appear (covering the CAD placeholder) and become clickable → lightbox. No code
changes needed.

## Expected files

| File                | Card                                   | Best aspect ratio |
|---------------------|----------------------------------------|-------------------|
| `prj-001.webp`      | Vintli zinapoya (Namangan)             | 16:7 (wide)       |
| `prj-002.webp`      | Savdo markazi panjaralari (Farg'ona)   | 16:10             |
| `prj-003.webp`      | LOFT ofis mebeli (Toshkent)            | 16:10             |
| `prj-004.webp`      | Avtomatik darvozalar (Namangan)        | 16:10             |
| `prj-005.webp`      | Ombor yuk karkasi (Andijon)            | 16:7 (wide)       |

## Tips

- **Format:** WebP preferred (smaller). To keep the `.webp` filename with a JPG,
  convert first: `cwebp input.jpg -q 82 -o prj-001.webp` (or any online converter).
- **Size:** ~1600px wide is plenty; the lightbox shows up to ~1100px.
- The card crops to the aspect ratio above (`object-fit: cover`), so keep the
  subject centered.
- Missing a file? That card simply keeps its blueprint placeholder — safe to add
  photos one at a time.

To change which file a card looks for, edit the `data-photo="..."` attribute on
the matching `.photo-slot` in `index.html`.
