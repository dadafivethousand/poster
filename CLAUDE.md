# poster — still images, built to order

Third sibling to `../animations` and `../logoanimations`, and deliberately the
same shape: a React (Create React App) project of self-contained full-frame
compositions, **one rendered at a time out of `src/App.js`**, one component in
`src/Components/` plus one namespaced stylesheet in `src/Stylesheets/`.

The difference is that nothing here moves. **The deliverable is a PNG file**,
not a screen recording, and it comes out of `npm run shot`.

## How this repo is used

The user gives a **description**, an **image**, or both, and a poster gets
built for it. "A poster for the March break camp." "Make one out of this
photo." One poster = one component + one stylesheet, added on demand. No
registries, no picker UI, no gallery. Copy `Feature` and go.

**Only edit the poster currently in `src/App.js`.** If a defect turns out to be
shared with the others, fix it in the one being worked on and *say* the others
have it too. A wide diff buries the actual change, and the user may have
another session open on a sibling repo.

## The two things a submitted image can be

`npm run source` imports it (newest image in `~/Downloads`, or a path). Then
`src/Utils/useSource.js` publishes it in two independent halves, and **each
poster chooses which it wants** — that is what the `withSource` prop on
`Feature` is demonstrating:

| | what it publishes | used by |
|---|---|---|
| the picture | `--source`, `--source-aspect` | posters where the photo IS the artwork |
| the palette | `--source-1`…`--source-5`, `--source-paper`, `--source-ink`, `--source-accent` | posters built by hand *in the colours of* the reference |

A style-reference poster never renders the file and still comes out belonging
to it, because the colour story was taken off it. Don't hard-code a palette
into a new poster without a reason — that throws away half the hook.

**The three role variables are only published when the image can actually fill
that role** (`--source-accent` needs real saturation, `--source-paper` real
lightness, `--source-ink` real darkness). An unqualified one falls through to
the poster's own fallback. This is not fussiness: the dojo placeholder is a
desaturated interior whose most-saturated colour is a warm grey, and using it as
the accent rendered the rule under the caption invisible. Always write
`var(--source-accent, #e4002b)` with a fallback, never a bare `var(--source-accent)`.

## The canvas: say any size you want, defaulting to an Instagram post

**Assume `ig` unless the job says otherwise** — don't ask which size for a
poster that is obviously going on the feed. But the size is never baked in:
it can be given at export time, in the browser, or in the JSX, and all three
take the same forms.

```bash
npm run shot                       # what App.js asks for (default: IG post)
npm run shot -- square
npm run shot -- letter
npm run shot -- 8.5x11in           # or 1200x1600, or 210x297mm@150
```

```
localhost:3000/?canvas=letter      # preview any size in the browser
```

```jsx
<Frame canvas="letter"><Feature /></Frame>      // the poster's own default
<Frame canvas={{ w: 1200, h: 1600 }}>…</Frame>
```

Accepted forms, everywhere a size is taken:

| | |
|---|---|
| `ig` `square` `story` `letter` `letter-landscape` `a4` `tabloid` | presets in `src/canvas.js`; print ones are 300dpi |
| `1200x1600` | literal pixels |
| `8.5x11in` · `210x297mm@150` | real-world units at 300dpi, or `@<dpi>` |
| `{ w, h }` | from JSX |

Anything unparseable throws with the list of presets rather than falling back,
because exporting at the wrong size is the one mistake this repo's tooling
exists to prevent. In the browser a bad `?canvas=` renders the message on the
page instead of white-screening.

**The size goes into the PAGE, not the window.** `?canvas=` is the mechanism —
the aspect has to change inside the layout, since resizing only the export
window would letterbox a poster still laid out at its old shape. `shot` then
reads `data-canvas` back off the rendered page to size the window and fails if
it doesn't match what was asked for, so the picture is always taken at what the
page actually laid out.

## `--px`, and why it is not tied to the canvas

The frame is a **known file size**, not a phone screen, which is the whole
reason this repo's units differ from its siblings':

```css
.xx-thing {
  font-size: calc(64 * var(--px));   /* 64px on the 1080×1350 canvas */
  width: calc(560 * var(--px));
}
```

`--px` is one design pixel, defined on `.pf-stage` in `App.css` out of
container query units. Author every dimension as `calc(<n> * var(--px))`.

**`--px` is always 1/1080th of the canvas width, whatever the canvas is** — the
1080 is a constant, deliberately not `--canvas-w`. This is what makes the size
switchable at all: one poster re-exports at square, letter or A4 without being
re-laid-out. Posters are authored on a
nominal **1080-wide sheet** and the preset decides how many real pixels that
sheet is printed at. Tying the unit to the export size instead would mean a
composition sized for an Instagram post came out as a row of ants the moment it
was exported at letter, where the canvas is 2550px across.

So `<n>` is read off a 1080-wide sheet, not off the export. Changing the preset
changes the paper and the aspect; it never changes the type scale.

- **Never write `vw`/`vh` inside a poster.** Those track the preview window, so
  the artwork would change shape between the screen and the exported file.
- **Never write a bare `px`** except for something that must stay a hairline at
  every export scale (`max(1px, calc(3 * var(--px)))`).
- The stage is sized with container queries rather than scaled with a
  `transform` on purpose: a transform resamples the whole poster through one
  matrix and softens type and hairlines. Under cq units the browser lays out at
  real size and renders natively, which is what makes `SCALE=2` a genuine 2×
  render rather than an upscale.

Every poster's root element carries `className="pf-stage <prefix>"` and is
rendered inside `<Frame>` in `App.js`.

## Exporting

```bash
npm start                          # one shell, from the repo root
npm run shot                       # → ~/Downloads/poster.png
npm run shot -- letter             # any size — see the canvas section
OUT=~/Desktop/camp.png npm run shot -- square
SCALE=2 npm run shot               # a genuine 2× render of a social size
```

`tools/shoot.js` drives the Chrome already on the machine — no puppeteer, so
nothing downloads a browser on install. It launches twice: once with
`--dump-dom` to read the canvas off the page, once to take the picture at
exactly that size. It then asserts the PNG's dimensions and warns if the file
compresses like a flat frame, because an off-size or blank export is the
failure that hides for weeks and then gets blamed on the artwork.

**Pixel-correct is not size-correct.** Chrome writes no `pHYs` chunk, and a PNG
without one is read as 72dpi by every application that opens it — so the
business card, exactly 1050×600 for 3.5×2in at 300dpi, arrived at the printer
claiming to be 14.58×8.33 inches. A canvas given in real-world units, or a print
preset, therefore carries a `dpi`; `Frame` publishes it as `data-canvas-dpi`
beside `data-canvas`; and the exporter stamps `dpi × SCALE` into the file before
finishing. Same principle as the size itself — read off the page, never assumed
by the tool. Social sizes are left unstamped, since a feed post has no inches.

Print presets are already 300dpi, so `SCALE` is only for social sizes. The size
argument and `SCALE` are different knobs: the argument changes the paper,
`SCALE` renders the same paper at a higher pixel density.

**A build log proves nothing here — these are visual deliverables.** Take the
shot and look at it before reporting anything as done.

If port 3000 is busy it is probably a sibling repo's dev server; use
`PORT=3001 npm start` and `URL=http://localhost:3001 npm run shot` rather than
killing it, since the user may be recording in it.

## Composition

**Centre the content, with clear space on all four sides.** The export is exact
so there is no crop to defend against, but the rule holds: one block of content
concentrated in the middle, margins around it. Sparse beats full-bleed. It is
also what lets one poster survive being re-exported at a different aspect —
a centred block reflows onto a square or a sheet of letter; a composition
pinned to the edges does not.

```css
.xx-card {
  position: absolute;
  inset: var(--margin-y) var(--margin-x);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;    /* the whole group, centred together */
  gap: <a fixed value>;
}
```

**Anti-pattern:** giving one flex child `flex: 1`. That justifies its siblings
out to both edges and the leftover room ends up *inside* the composition as a
stretched gap instead of *around* it as margin.

## The mark is NOT one shape

`src/Images/logo.png` is a three-tone lockup and the alpha channel carries none
of that distinction — it says only "ink here":

| region | colour in the artwork | mask |
|---|---|---|
| hood + "NINJAS" + **the eye slits** | black `#000` | `--logo-dark` |
| the band across the eyes | skin `#d7c19b` | `--logo-light` |
| "CODE" | blue `#3490bf` | `--logo-accent` |

`useLogo` segments the opaque pixels by tone and publishes a mask per region.
Masking by `--logo` alone flattens all three into one material and the ninja
loses his eyes.

**And note which region the eye SLITS are in.** They are drawn in the same
near-black as the hood, so no mask separates them. This cost a pass: to make
the hood read on a dark photograph the dark region was inverted to the
palette's lightest tone, and it worked — except the slits inverted with it, so
his angry eyes came out as two pale smudges on a tan band and the whole mark
read as a blank white disc.

**So light the mark, don't recolour it.** `Feature` puts a heavily blurred pool
of `--source-paper` behind the lockup (`.ft-pool`) and lets the artwork keep
the three colours it was drawn in. A photograph is an arbitrary field of tones
and no fixed logo colour survives all of them; lighting the ground wins on
every image instead of being tuned per photo.

Corollary: **the palette does not get a vote on his face.** An earlier pass
warmed the eye band toward `--source-accent`, which is fine while the accent
comes off a photograph and disastrous the moment it falls back to brand red —
the ninja's face turns pink and it is the first thing anyone looks at.

## How a material gets painted

The mark is **never an `<img>` you tint.** Paint the material on a full-size
layer and mask it through the logo's alpha:

```css
.xx-layer {
  position: absolute; inset: 0;
  -webkit-mask-image: var(--logo-dark); mask-image: var(--logo-dark);
  -webkit-mask-size: contain; mask-size: contain;
  mask-repeat: no-repeat; mask-position: center;
}
```

Size the mark box with `aspect-ratio: var(--logo-aspect)` — never a hard-coded
ratio, or the next logo lands stretched. The techniques that make these read as
real materials, and the traps that waste an hour, are written up at length in
`../logoanimations/CLAUDE.md` and apply here unchanged: `drop-shadow` bevel
chains on a wrapper, `feTurbulence` for organic edges, `@property` for
animatable angles, `text-shadow` painting above a `background-clip: text` fill,
a CSS transform replacing an SVG `transform` attribute. Read that file before
inventing a technique.

## The caption is welded to the mark

```jsx
<div className="xx-markwrap">     {/* centres the whole lockup */}
  <div className="xx-markbox">    {/* relative: mark + its glows */}
    <div className="xx-mark"> …material layers… </div>
  </div>
  <div className="xx-caption">WOODBRIDGE</div>   {/* in flow, margin-top only */}
</div>
```

The caption is a **flow sibling inside the mark wrapper**, never positioned
independently. Absolutely positioning it at some `top: %` drifts it the moment
anything else on the poster changes size.

## Copy

The logo supplies "CODE NINJAS", so the base poster renders exactly one word:
**WOODBRIDGE**. Anything beyond that is a claim, and this is public-facing
marketing — **confirm the wording with the user before treating it as final.**
That is why `Feature`'s `headline` prop defaults to `null` and renders nothing
rather than shipping placeholder copy that could go out as real.

Offers, prices, ages, dates and session names are never invented here.

`StaplesFlyer` is the sharp end of that rule: it carries a partner's offer, a
promo code, an expiry and a legal footer. Every one of those is a prop with the
real value as its default, so changing one is a deliberate edit at the call
site rather than a stray keystroke in the markup. Do not reword the fine print.

## Nothing on a poster moves

No `usePhases`, no keyframes, no transitions — the siblings' phase machine has
no job in a still. If a stylesheet gets copied in from a sibling repo, strip
its animation rather than relying on the exporter's `--force-prefers-reduced-motion`
to pin it, since that only holds for effects that declared a rest state.

## Workflow

Commit and push after each change, straight to `master`, no side branches, per
user preference. The remote is `git@github.com:dadafivethousand/poster.git` —
SSH, because the machine's stored HTTPS credential for GitHub 403s on push.
**There is no deploy step and no hosted URL** — this repo's
output is a file, so a poster is delivered when the PNG is in `~/Downloads` and
the user has seen it, not when the commit lands.
