# poster

Same idea as [`animations`](https://github.com/dadafivethousand/animations) and
[`logoanimations`](https://github.com/dadafivethousand/logoanimations) —
self-contained full-frame compositions, one rendered at a time — except these
don't move. **The deliverable is a PNG.**

Give a description, an image, or both; a poster gets built for it.

## Run it

```bash
npm install
npm run source      # imports the newest image from ~/Downloads as the reference
npm start           # http://localhost:3000
npm run shot        # → ~/Downloads/poster.png at 1080×1350
```

`npm run logo` imports a replacement Code Ninjas mark the same way. That one
**must be a PNG with a transparent background** — the mark is masked through
its alpha, so a logo flattened onto white renders as a styled rectangle. The
reference image has no such requirement; a photo is fine.

## The canvas

Set on the `<Frame>` in `src/App.js`. **Defaults to an Instagram post** —
1080×1350, the largest slot a feed gives a still — so most posters say nothing
about size at all.

```jsx
<Frame><Feature /></Frame>                      // Instagram post 1080×1350
<Frame canvas="square"><Feature /></Frame>      // 1080×1080
<Frame canvas="letter"><Feature /></Frame>      // 8.5×11" at 300dpi
<Frame canvas={{ w: 1200, h: 1600 }}>…</Frame>  // one-off
```

| preset | pixels | |
|---|---|---|
| `ig` *(default)* | 1080×1350 | Instagram post, 4:5 |
| `square` | 1080×1080 | 1:1 |
| `story` | 1080×1920 | Story / Reel, 9:16 |
| `letter` | 2550×3300 | 8.5×11" portrait, 300dpi |
| `letter-landscape` | 3300×2550 | 11×8.5" landscape |
| `a4` | 2480×3508 | A4 portrait |
| `tabloid` | 3300×5100 | 11×17" portrait |

**Changing the preset changes the paper, not the type scale.** Everything
inside a poster is authored in `calc(<n> * var(--px))`, and `--px` is always
1/1080th of the canvas width whatever the canvas is — posters are drawn on a
nominal 1080-wide sheet, and the preset decides how many real pixels that sheet
prints at. So a poster built for the feed re-exports at letter without turning
into a row of ants, and nothing is ever scaled through a transform.

`npm run shot` isn't told the size; it reads it off the rendered page, so the
canvas is written down once and the export can't disagree with the design.

```bash
OUT=~/Desktop/camp.png npm run shot
SCALE=2 npm run shot                       # a genuine 2× render of a social size
URL=http://localhost:3001 npm run shot     # if 3000 is a sibling repo's server
```

The exporter asserts the PNG's dimensions and warns if the file compresses like
a blank frame, so an off-size or empty export can't quietly land in Downloads
looking deliberate.

## What the submitted image is for

`src/Utils/useSource.js` gives a poster the image in two halves and lets it use
either, or both:

- **the picture** — `--source`, `--source-aspect`, for a poster where the photo
  is the artwork;
- **the palette** — five colours pulled off it, most-used first, plus
  `--source-paper`, `--source-ink` and `--source-accent`, for a poster built by
  hand *in the colours of* the reference, where the file itself never appears.

Roles are only published when the image can actually fill them, so a poster
always writes its own fallback: `var(--source-accent, #e4002b)`.

## Pick a poster

`src/App.js`:

```jsx
import Frame from "./Frame";
import Feature from "./Components/Feature";

function App() {
  return (
    <Frame>
      <Feature withSource={true} />
    </Frame>
  );
}
```

## Posters

**Feature** — the template. A photograph full bleed, graded and scrimmed, with
the mark and WOODBRIDGE welded together as one centred lockup standing in a
pool of light. `withSource={false}` switches it to the other half of the hook:
the photo disappears and the same lockup sits on a light page tinted with the
colours taken off it.

The placeholder reference shipped here is a dojo photo, which happens to have
the mark painted on the wall behind the students — so the poster shows it
twice until `npm run source` replaces it.

## Adding one

One poster = one component in `src/Components/` + one stylesheet in
`src/Stylesheets/`, classes namespaced with a short prefix, root element
`className="pf-stage <prefix>"`, rendered inside `<Frame>`. Copy `Feature` and
give it a composition of its own.

Nothing here animates — there is no phase machine, because a still has no
timeline.

`CLAUDE.md` has the rest: the `--px` unit and why it isn't `vw`, why the mark
is lit rather than recoloured (and what the eye slits did about it), and the
rule about never inventing marketing copy.
