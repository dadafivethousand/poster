#!/usr/bin/env node
/**
 * Export the poster currently in src/App.js as a PNG.
 *
 *   npm start                      # in one shell, from the repo root
 *   npm run shot                   # → ~/Downloads/poster.png at 1080×1350
 *   OUT=~/Desktop/x.png npm run shot
 *   SCALE=2 npm run shot           # 2160×2700, for print or a retina crop
 *   URL=http://localhost:3000 npm run shot
 *
 * No puppeteer. The sibling repo's recorder needs CDP to drive a screencast;
 * a still needs one screenshot, and the Chrome already on this machine takes
 * it with a flag. That keeps a browser download out of an install that every
 * export has to do.
 *
 * THE WINDOW IS THE CANVAS. Chrome opens at exactly 1080×1350, so the 4:5
 * frame in App.css fills it edge to edge and the poster lays out at its true
 * size — nothing is scaled anywhere in the pipeline. SCALE raises the device
 * pixel ratio instead of resizing the window, so 2× is a genuine 2× render
 * (type re-rasterised, hairlines still hairlines) rather than an upscale.
 *
 * The PNG's dimensions are asserted afterwards. Silently exporting an
 * off-size or upscaled file is the failure mode that hides for weeks and then
 * gets blamed on the artwork.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const CANVAS_W = 1080;
const CANVAS_H = 1350;

const CHROME =
  process.env.CHROME ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.env.URL || "http://localhost:3000";
const SCALE = Number(process.env.SCALE || 1);
const OUT = path.resolve(
  (process.env.OUT || path.join(os.homedir(), "Downloads", "poster.png"))
    .replace(/^~/, os.homedir())
);
// Time to sit on the page before the shutter. useLogo and useSource both decode
// and re-encode through a canvas, and the poster paints nothing until they land.
const WAIT = Number(process.env.WAIT || 4000);

function fail(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(CHROME)) {
  fail(`No Chrome at ${CHROME}\n    Set CHROME=/path/to/chrome and re-run.`);
}
if (!(SCALE > 0)) fail(`SCALE must be a positive number, got "${process.env.SCALE}"`);

fs.mkdirSync(path.dirname(OUT), { recursive: true });

const args = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-color-profile=srgb",
  // A poster has no motion, but a stylesheet copied in from a sibling repo can
  // still carry an entrance animation. Reduced motion pins it at its rest
  // state instead of exporting whatever frame the shutter happened to catch.
  "--force-prefers-reduced-motion",
  `--force-device-scale-factor=${SCALE}`,
  `--window-size=${CANVAS_W},${CANVAS_H}`,
  `--virtual-time-budget=${WAIT}`,
  `--screenshot=${OUT}`,
  URL,
];

console.log(`\n  → ${URL}  ${CANVAS_W}×${CANVAS_H} @${SCALE}x`);
const run = spawnSync(CHROME, args, { encoding: "utf8" });

if (run.error) fail(`Couldn't start Chrome: ${run.error.message}`);
if (!fs.existsSync(OUT)) {
  fail(
    `Chrome wrote nothing.\n` +
      `    Is the dev server up at ${URL}? Start it with \`npm start\`.\n` +
      (run.stderr ? `    ${run.stderr.trim().split("\n").slice(-3).join("\n    ")}` : "")
  );
}

// ---- assert the file is what it claims to be ----
const png = fs.readFileSync(OUT);
const isPng = png.subarray(0, 8).equals(
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
);
if (!isPng) fail(`${OUT} is not a PNG`);

const w = png.readUInt32BE(16);
const h = png.readUInt32BE(20);
const wantW = Math.round(CANVAS_W * SCALE);
const wantH = Math.round(CANVAS_H * SCALE);
if (w !== wantW || h !== wantH) {
  fail(
    `exported ${w}×${h}, expected ${wantW}×${wantH} — the window is not at ` +
      `the canvas size (check --window-size / --force-device-scale-factor)`
  );
}

// A blank export is the other silent failure: the dev server answers, React
// never mounts, and a flat frame lands in ~/Downloads looking deliberate. A
// finished poster is never one colour, so its PNG never compresses this hard.
const bytesPerPixel = png.length / (w * h);
if (bytesPerPixel < 0.02) {
  console.log(
    `\n  ⚠  ${(png.length / 1024).toFixed(0)}KB for ${w}×${h} — that is close to` +
      ` a flat\n     frame. Check the poster actually rendered before using it.`
  );
}

console.log(
  `  ✓ ${OUT}\n    ${w}×${h}, ${(png.length / 1024).toFixed(0)}KB\n`
);
