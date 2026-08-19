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
  letter: { w: 2550, h: 3300, label: 'Letter 8.5×11" portrait' },
  "letter-landscape": { w: 3300, h: 2550, label: 'Letter 11×8.5" landscape' },
  a4: { w: 2480, h: 3508, label: "A4 portrait" },
  tabloid: { w: 3300, h: 5100, label: 'Tabloid 11×17" portrait' },
};

const DEFAULT = "ig";

/**
 * Resolve a preset name, or a plain {w, h} for a one-off size, into a canvas.
 * Throws on an unknown name rather than silently falling back — exporting a
 * poster at the wrong size is the one mistake this repo's tooling exists to
 * make impossible.
 */
function resolveCanvas(canvas = DEFAULT) {
  if (canvas && typeof canvas === "object") {
    const w = Math.round(Number(canvas.w));
    const h = Math.round(Number(canvas.h));
    if (!(w > 0 && h > 0)) {
      throw new Error(
        `canvas {w, h} must be positive numbers, got ${JSON.stringify(canvas)}`
      );
    }
    return { w, h, label: `${w}×${h}` };
  }

  const hit = CANVASES[canvas];
  if (!hit) {
    throw new Error(
      `Unknown canvas "${canvas}". Known: ${Object.keys(CANVASES).join(", ")}` +
        ` — or pass {w, h} for a one-off size.`
    );
  }
  return hit;
}

module.exports = { CANVASES, DEFAULT, resolveCanvas };
