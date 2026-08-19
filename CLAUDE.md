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

## The canvas: 1080×1350, and `--px`

Fixed 4:5. The frame is a **known file size**, not a phone screen, which is the
whole reason this repo's units differ from its siblings':

```css
.xx-thing {
  font-size: calc(64 * var(--px));   /* 64px on the 1080×1350 canvas */
  width: calc(560 * var(--px));
}
```

`--px` is one design pixel, defined on `.pf-stage` in `App.css` out of
container query units. Author every dimension as `calc(<n> * var(--px))` with
`<n>` read straight off the canvas.

- **Never write `vw`/`vh` inside a poster.** Those track the preview window, so
  the artwork would change shape between the screen and the exported file.
- **Never write a bare `px`** except for something that must stay a hairline at
  every export scale (`max(1px, calc(3 * var(--px)))`).
- The stage is sized with container queries rather than scaled with a
  `transform` on purpose: a transform resamples the whole poster through one
  matrix and softens type and hairlines. Under cq units the browser lays out at
  real size and renders natively, which is what makes `SCALE=2` a genuine 2×
  render rather than an upscale.

Every poster's root element carries `className="pf-stage <prefix>"` and sits
inside the `.pf-frame` in `App.js`.

## Exporting

```bash
npm start                # one shell, from the repo root
npm run shot             # → ~/Downloads/poster.png, 1080×1350
OUT=~/Desktop/camp.png npm run shot
SCALE=2 npm run shot     # 2160×2700 for print or a retina crop
```

`tools/shoot.js` drives the Chrome already on the machine — no puppeteer, so
nothing downloads a browser on install. It asserts the PNG's dimensions
afterwards and warns if the file compresses like a flat frame, because an
off-size or blank export is the failure that hides for weeks and then gets
blamed on the artwork.

**A build log proves nothing here — these are visual deliverables.** Take the
shot and look at it before reporting anything as done.

If port 3000 is busy it is probably a sibling repo's dev server; use
`PORT=3001 npm start` and `URL=http://localhost:3001 npm run shot` rather than
killing it, since the user may be recording in it.

## Composition

**Centre the content, with clear space on all four sides.** The export is exact
so there is no crop to defend against, but the rule holds: one block of content
concentrated in the middle, margins around it. Sparse beats full-bleed.

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

## Nothing on a poster moves

No `usePhases`, no keyframes, no transitions — the siblings' phase machine has
no job in a still. If a stylesheet gets copied in from a sibling repo, strip
its animation rather than relying on the exporter's `--force-prefers-reduced-motion`
to pin it, since that only holds for effects that declared a rest state.

## Workflow

Commit and push after each change, straight to `master`, no side branches, per
user preference. **There is no deploy step and no hosted URL** — this repo's
output is a file, so a poster is delivered when the PNG is in `~/Downloads` and
the user has seen it, not when the commit lands.
