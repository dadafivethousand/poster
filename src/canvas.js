/**
 * The poster's output size.
 *
 * A poster is a file, so its dimensions are a real decision rather than
 * whatever the window happens to be — an Instagram post, a square, a sheet of
 * letter paper. **The default is `ig` and stays the default**; the others are
 * named when a job asks for them.
 *
 * These numbers are PHYSICAL — the pixel size of the exported PNG. They are
 * not the numbers a poster is authored in. Everything inside a poster is
 * written in `--px`, which is always 1/1080th of the canvas WIDTH whatever the
 * canvas is (see App.css), so a composition sized for `ig` doesn't turn into a
 * row of ants when the same poster is exported at letter. Changing the preset
 * changes the paper; it does not change the type scale.
 *
 * Print sizes are at 300dpi, which is what a commercial printer wants and what
 * makes 8.5×11 come out as 2550×3300.
 *
 * A size can be given three ways, and all three work everywhere a canvas is
 * accepted — the `canvas` prop on <Frame>, the `?canvas=` query param, and
 * `npm run shot -- <size>`:
 *
 *   "letter"           a preset name
 *   "1200x1600"        literal pixels
 *   "8.5x11in"         real-world units (in / mm / cm) at 300dpi, or "@150" for another
 *   "3.5x2in+0.125in"  the same, with bleed
 *   { w, h, bleed }    an object, from JSX
 *
 * BLEED IS ADDED OUTSIDE THE TRIM, NEVER CARVED OUT OF IT. "3.5x2in+0.125in"
 * is a 3.5×2in card whose file is 3.75×2.25in, because the guillotine that cuts
 * a stack of cards does not land on the same line twice and a card trimmed a
 * hair wide would otherwise show a white sliver of paper down one edge. So the
 * artwork runs 0.125in past the cut on every side and that margin is thrown
 * away. `w`/`h` are the FILE; `trimW`/`trimH` are what survives the cut; and
 * `bleed` is the difference, which <Frame> hands to the layout so the design
 * still measures its margins from the trim rather than from the paper's edge.
 *
 * A commercial printer asks for this, and a card supplied at exact trim size
 * gets scaled up into their bleed template — which is what turns a pixel-exact
 * 300dpi file into a "low resolution" warning at upload.
 *
 * A size given in real-world units, or a print preset, also carries its `dpi`.
 * That travels through <Frame> onto the page as `data-canvas-dpi` and ends up
 * in the exported PNG's pHYs chunk, so the file states its own physical size.
 * WITHOUT IT A 1050×600 CARD OPENS AS 14.58×8.33 INCHES, because every reader
 * assumes 72dpi when a PNG says nothing — and a printer would either scale it
 * to fit or print it at fourteen inches wide. Pixel-correct is not size-correct.
 *
 * This file is loaded by BOTH the app and `tools/shoot.js`, which is why it is
 * CommonJS — webpack reads it fine, and the exporter needs it without a build
 * step. Keep it dependency-free.
 */

const CANVASES = {
  // --- social ---
  ig: { w: 1080, h: 1350, label: "Instagram post (4:5)" },
  square: { w: 1080, h: 1080, label: "Square (1:1)" },
  story: { w: 1080, h: 1920, label: "Story / Reel (9:16)" },

  // --- print, 300dpi ---
  // `dpi` is not decoration either: it is what `npm run shot` stamps into the
  // PNG so the file knows its own physical size. A social preset has none,
  // because pixels on a feed have no inches.
  "half-letter": { w: 1650, h: 2550, dpi: 300, label: 'Half-letter 5.5×8.5" flyer' },
  letter: { w: 2550, h: 3300, dpi: 300, label: 'Letter 8.5×11" portrait' },
  "letter-landscape": { w: 3300, h: 2550, dpi: 300, label: 'Letter 11×8.5" landscape' },
  a4: { w: 2480, h: 3508, dpi: 300, label: "A4 portrait" },
  tabloid: { w: 3300, h: 5100, dpi: 300, label: 'Tabloid 11×17" portrait' },
};

const DEFAULT = "ig";

const DEFAULT_DPI = 300;
const PER_INCH = { in: 1, mm: 1 / 25.4, cm: 1 / 2.54 };

/** "1200x1600" · "8.5x11in" · "3.5x2in+0.125in" · "210x297mm@150" */
const SIZE_RE =
  /^\s*([\d.]+)\s*[x×]\s*([\d.]+)\s*(px|in|mm|cm)?\s*(?:\+\s*([\d.]+)\s*(px|in|mm|cm)?)?\s*(?:@\s*([\d.]+))?\s*$/i;

/**
 * Resolve any of the accepted size forms into { w, h, label } in pixels.
 *
 * Throws on anything it can't parse rather than silently falling back —
 * exporting a poster at the wrong size is the one mistake this repo's tooling
 * exists to make impossible, and a size nobody can read is more likely a typo
 * than an intention.
 */
function resolveCanvas(canvas = DEFAULT) {
  if (canvas === undefined || canvas === null || canvas === "") canvas = DEFAULT;

  if (typeof canvas === "object") {
    const w = Math.round(Number(canvas.w));
    const h = Math.round(Number(canvas.h));
    if (!(w > 0 && h > 0)) {
      throw new Error(
        `canvas {w, h} must be positive numbers, got ${JSON.stringify(canvas)}`
      );
    }
    const dpi = Number(canvas.dpi);
    // {w, h} are the TRIM here, same as the string form: a bleed is added
    // outside them, never carved out of them.
    const bleed = Math.max(0, Math.round(Number(canvas.bleed) || 0));
    return {
      w: w + bleed * 2,
      h: h + bleed * 2,
      trimW: w,
      trimH: h,
      bleed,
      ...(dpi > 0 ? { dpi } : null),
      label: `${w}×${h}${bleed ? ` + ${bleed}px bleed` : ""}`,
    };
  }

  const name = String(canvas).trim();
  if (CANVASES[name]) return CANVASES[name];
  if (CANVASES[name.toLowerCase()]) return CANVASES[name.toLowerCase()];

  const m = SIZE_RE.exec(name);
  if (m) {
    const [, rawW, rawH, unit, rawBleed, bleedUnit, rawDpi] = m;
    const dpi = rawDpi ? Number(rawDpi) : DEFAULT_DPI;
    const perInch = unit ? PER_INCH[unit.toLowerCase()] : null;

    // No unit, or an explicit "px": the numbers are already pixels and dpi is
    // meaningless. With a real-world unit they are inches/mm/cm at `dpi`.
    const trimW = perInch ? Math.round(Number(rawW) * perInch * dpi) : Math.round(Number(rawW));
    const trimH = perInch ? Math.round(Number(rawH) * perInch * dpi) : Math.round(Number(rawH));

    if (!(trimW > 0 && trimH > 0)) {
      throw new Error(`Canvas "${name}" resolves to ${trimW}×${trimH}`);
    }

    // The bleed defaults to the size's own unit, so "3.5x2in+0.125" is inches
    // like the rest of it. A bare pixel size takes a bare pixel bleed.
    const bleedPerInch = bleedUnit ? PER_INCH[bleedUnit.toLowerCase()] : perInch;
    const bleedPx = rawBleed
      ? Number(rawBleed) * (bleedPerInch ? bleedPerInch * dpi : 1)
      : 0;
    if (!(bleedPx >= 0)) throw new Error(`Canvas "${name}" has a negative bleed`);

    // THE SHEET IS ROUNDED, NOT THE BLEED. 0.125in at 300dpi is 37.5px, and
    // rounding that first puts the sheet at 1126×676 — a pixel over the
    // 1125×675 every printer's 3.5×2in template is cut for, and a pixel is
    // enough for an uploader to call the file the wrong size. Round the total
    // instead and let the bleed keep its half pixel; nothing downstream needs
    // it whole, since it reaches the layout as a ratio.
    const w = Math.round(trimW + bleedPx * 2);
    const h = Math.round(trimH + bleedPx * 2);

    return {
      // The CANVAS is trim plus bleed on all four sides — that is the file the
      // printer gets. `trimW`/`trimH` are what survives the guillotine, and
      // they are what the design lays out against.
      w,
      h,
      trimW,
      trimH,
      bleed: (w - trimW) / 2,
      // Only when the numbers were inches/mm/cm. "1200x1600" is a pixel count
      // and has no physical size to claim.
      ...(perInch ? { dpi } : null),
      label: perInch
        ? `${rawW}×${rawH}${unit}${bleedPx ? ` + ${rawBleed}${bleedUnit || unit} bleed` : ""}` +
          ` at ${dpi}dpi`
        : `${trimW}×${trimH}${bleedPx ? ` + ${bleedPx}px bleed` : ""}`,
    };
  }

  throw new Error(
    `Unknown canvas "${name}".\n` +
      `  Presets: ${Object.keys(CANVASES).join(", ")}\n` +
      `  Or a size: "1200x1600", "8.5x11in", "3.5x2in+0.125in", "210x297mm@150"`
  );
}

// Individual assignments rather than one `module.exports = {…}` object:
// webpack's named-export inference for a CommonJS module is a heuristic, and
// with the object form it stopped finding these once the file grew, so
// `import { resolveCanvas }` in Frame.js failed to compile while `require` in
// tools/shoot.js kept working. This form is detected reliably by both.
exports.CANVASES = CANVASES;
exports.DEFAULT = DEFAULT;
exports.DEFAULT_DPI = DEFAULT_DPI;
exports.resolveCanvas = resolveCanvas;
