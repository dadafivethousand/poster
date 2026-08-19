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
 *   "letter"        a preset name
 *   "1200x1600"     literal pixels
 *   "8.5x11in"      real-world units (in / mm / cm) at 300dpi, or "@150" for another
 *   { w, h }        an object, from JSX
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
  "half-letter": { w: 1650, h: 2550, label: 'Half-letter 5.5×8.5" flyer' },
  letter: { w: 2550, h: 3300, label: 'Letter 8.5×11" portrait' },
  "letter-landscape": { w: 3300, h: 2550, label: 'Letter 11×8.5" landscape' },
  a4: { w: 2480, h: 3508, label: "A4 portrait" },
  tabloid: { w: 3300, h: 5100, label: 'Tabloid 11×17" portrait' },
};

const DEFAULT = "ig";

const DEFAULT_DPI = 300;
const PER_INCH = { in: 1, mm: 1 / 25.4, cm: 1 / 2.54 };

/** "1200x1600" · "8.5x11in" · "210x297mm@150" · "1080 × 1350" */
const SIZE_RE =
  /^\s*([\d.]+)\s*[x×]\s*([\d.]+)\s*(px|in|mm|cm)?\s*(?:@\s*([\d.]+))?\s*$/i;

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
    return { w, h, label: `${w}×${h}` };
  }

  const name = String(canvas).trim();
  if (CANVASES[name]) return CANVASES[name];
  if (CANVASES[name.toLowerCase()]) return CANVASES[name.toLowerCase()];

  const m = SIZE_RE.exec(name);
  if (m) {
    const [, rawW, rawH, unit, rawDpi] = m;
    const dpi = rawDpi ? Number(rawDpi) : DEFAULT_DPI;
    const perInch = unit ? PER_INCH[unit.toLowerCase()] : null;

    // No unit, or an explicit "px": the numbers are already pixels and dpi is
    // meaningless. With a real-world unit they are inches/mm/cm at `dpi`.
    const w = perInch ? Math.round(Number(rawW) * perInch * dpi) : Math.round(Number(rawW));
    const h = perInch ? Math.round(Number(rawH) * perInch * dpi) : Math.round(Number(rawH));

    if (!(w > 0 && h > 0)) throw new Error(`Canvas "${name}" resolves to ${w}×${h}`);
    return {
      w,
      h,
      label: perInch ? `${rawW}×${rawH}${unit} at ${dpi}dpi` : `${w}×${h}`,
    };
  }

  throw new Error(
    `Unknown canvas "${name}".\n` +
      `  Presets: ${Object.keys(CANVASES).join(", ")}\n` +
      `  Or a size: "1200x1600", "8.5x11in", "210x297mm@150"`
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
