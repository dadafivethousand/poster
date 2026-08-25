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

**Defaults to an Instagram post** — 1080×1350, the largest slot a feed gives a
still — so most posters say nothing about size at all. When you want something
else, ask for it at export time; you don't have to edit anything.

```bash
npm run shot                       # the default
npm run shot -- square
npm run shot -- letter
npm run shot -- 8.5x11in           # or 1200x1600, or 210x297mm@150
```

Same sizes work in the browser, for looking before exporting:

```
localhost:3000/?canvas=letter
```

...and as a poster's own default, if it's built for one:

```jsx
<Frame canvas="letter"><Feature /></Frame>
<Frame canvas={{ w: 1200, h: 1600 }}>…</Frame>
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

Or skip the presets: `1200x1600` for literal pixels, `8.5x11in` / `210x297mm`
for real-world units at 300dpi, `@150` on the end for another density.

**Changing the preset changes the paper, not the type scale.** Everything
inside a poster is authored in `calc(<n> * var(--px))`, and `--px` is always
1/1080th of the canvas width whatever the canvas is — posters are drawn on a
nominal 1080-wide sheet, and the preset decides how many real pixels that sheet
prints at. So a poster built for the feed re-exports at letter without turning
into a row of ants, and nothing is ever scaled through a transform.

The size is handed to the *page*, which re-lays-out at the new aspect; the
export window is then sized from what the page reports back, and the shot fails
rather than exporting if the two disagree. So a bigger poster is a genuinely
different composition, never a letterboxed one.

```bash
OUT=~/Desktop/camp.png npm run shot -- square
SCALE=2 npm run shot                       # a genuine 2× render of a social size
URL=http://localhost:3001 npm run shot     # if 3000 is a sibling repo's server
```

The exporter asserts the PNG's dimensions and warns if the file compresses like
a blank frame, so an off-size or empty export can't quietly land in Downloads
looking deliberate.

**A print export also states its own physical size.** Chrome writes no density
into a PNG, and a PNG that carries none is read as 72dpi by everything that
opens it — so a 3.5×2in card, pixel-perfect at 1050×600, reaches the printer
claiming to be 14.58×8.33 inches. Any size given in real-world units, and every
print preset, is stamped at its real density (times `SCALE`), and `shot` prints
it back:

```
  ✓ ~/Downloads/card-front.png
    1050×600 at 300dpi — 3.5×2in, 621KB
```

A social size is left unstamped, because pixels on a feed have no inches.

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

**StaplesFlyer** — the Staples × Code Ninjas $50-off handout, rebuilt from a
PDF that had no source anywhere. Half-letter, 5.5×8.5", so it prints two-up.
The mascot is extracted out of that PDF and the palette is sampled from it;
every string is a prop, because the offer, the date, the promo code and the
legal footer are real and came from Staples.

**TechTalk** — Instagram post for the Staples × Code Ninjas Tech Talk, on the
`ig` canvas. Follows the "Connecting through coding" template: photograph swept
into an arc, headline in black and Staples red, the red bracket and base rule.
Adds what the template has no slot for — the event's substance as bullets, the
Tech Talk mark sat on the seam, and the two-mark partner lockup at the foot.

**MapleBackToSchool** — Maple Jiu Jitsu's back-to-school offer, on the `ig`
canvas. Deep navy, condensed display type, a bonus-value roundel and three
numbered offer cards. The gi and gloves are emoji rather than the original's
branded product shots, at the user's direction — no photography to re-license
or re-shoot when a value changes.

**BusinessCard** — Code Ninjas Woodbridge, 3.5×2in at 300dpi. Two sides via
`side="front" | "back"`; export each and send the printer both. No bleed — the
canvas is exactly the trim size. Most commercial printers want 3.75×2.25in with
0.125in of bleed, which is one change (`<Frame canvas="3.75x2.25in">`) and no
coordinate edits, because the field runs edge to edge and everything sits
inside a safe margin.

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
