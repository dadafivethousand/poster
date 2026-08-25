#!/usr/bin/env node
/**
 * Export the poster currently in src/App.js as a PNG.
 *
 *   npm start                      # in one shell, from the repo root
 *   npm run shot                   # the size the poster asks for (default: IG post)
 *   npm run shot -- square         # override it
 *   npm run shot -- letter
 *   npm run shot -- 8.5x11in       # or 1200x1600, or 210x297mm@150
 *   OUT=~/Desktop/x.png npm run shot -- letter
 *   SCALE=2 npm run shot           # a genuine 2x render of a social size
 *   URL=http://localhost:3000 npm run shot
 *
 * The size argument is handed to the PAGE as ?canvas=, not to the window. The
 * aspect has to change inside the layout — resizing only the window would
 * letterbox a poster still laid out at its old shape.
 *
 * No puppeteer. The sibling repo's recorder needs CDP to drive a screencast;
 * a still needs one screenshot, and the Chrome already on this machine takes
 * it with a flag. That keeps a browser download out of an install that every
 * export has to do.
 *
 * THE WINDOW IS THE CANVAS, and the page decides what the canvas is. The size
 * is NOT configured here: Chrome is run once with --dump-dom to read the
 * `data-canvas` attribute src/Frame.js puts on the frame, and the window is
 * opened at exactly that. So the poster fills the window edge to edge and lays
 * out at its true size, with nothing scaled anywhere in the pipeline.
 *
 * That extra launch buys the one guarantee worth paying for. An exporter told
 * the size by a flag can be told the wrong one, and a letter poster exported
 * at Instagram dimensions is a mistake nothing downstream would catch — it is
 * just a slightly-wrong file that looks deliberate. Reading it off the page
 * makes the two impossible to desync.
 *
 * SCALE raises the device pixel ratio instead of resizing the window, so 2× is
 * a genuine 2× render (type re-rasterised, hairlines still hairlines) rather
 * than an upscale. Print presets are already 300dpi, so SCALE is for social
 * sizes that need a retina crop.
 *
 * The PNG's dimensions are asserted afterwards. Silently exporting an off-size
 * or upscaled file is the failure mode that hides for weeks and then gets
 * blamed on the artwork.
 *
 * AND THE FILE IS TOLD ITS PHYSICAL SIZE. Chrome writes no pHYs chunk, and a
 * PNG that does not carry one is read as 72dpi by everything that opens it — so
 * a 3.5×2in business card, pixel-perfect at 1050×600, arrives at the printer
 * claiming to be 14.58×8.33 inches. The size is right and the file lies about
 * it. When the page reports a `data-canvas-dpi` (print presets and real-world
 * specs have one; a feed post does not) that density, times SCALE, is stamped
 * in before the file is finished.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const zlib = require("zlib");
const { spawnSync } = require("child_process");

const { resolveCanvas } = require("../src/canvas");

const CHROME =
  process.env.CHROME ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.URL || "http://localhost:3000";
// `npm run shot -- letter`, or SIZE=letter for the same thing from a script.
const SIZE = process.argv[2] || process.env.SIZE || "";
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

// Resolve the requested size HERE, before launching anything, so a typo comes
// back as the list of presets rather than as a mystery export.
let want = null;
if (SIZE) {
  try {
    want = resolveCanvas(SIZE);
  } catch (e) {
    fail(e.message);
  }
}

// Handed to the page, which lays out at the new aspect; the window is then
// sized from what the page reports back.
const URL = want
  ? BASE_URL + (BASE_URL.includes("?") ? "&" : "?") + `canvas=${encodeURIComponent(SIZE)}`
  : BASE_URL;

fs.mkdirSync(path.dirname(OUT), { recursive: true });

// Flags shared by both launches.
const BASE = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-color-profile=srgb",
  // A poster has no motion, but a stylesheet copied in from a sibling repo can
  // still carry an entrance animation. Reduced motion pins it at its rest
  // state instead of exporting whatever frame the shutter happened to catch.
  "--force-prefers-reduced-motion",
  `--virtual-time-budget=${WAIT}`,
];

// ---- launch 1: ask the page how big it is ----
// maxBuffer is raised well past the default 1MB because useLogo and useSource
// publish their trimmed images as data: URLs in an inline style attribute, so
// the serialised DOM carries the artwork inside it.
const probe = spawnSync(CHROME, [...BASE, "--dump-dom", URL], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
if (probe.error) fail(`Couldn't start Chrome: ${probe.error.message}`);

const found = /data-canvas="(\d+)x(\d+)"/.exec(probe.stdout || "");
const foundDpi = /data-canvas-dpi="([\d.]+)"/.exec(probe.stdout || "");
if (!found) {
  fail(
    `Couldn't read the canvas size from the page.\n` +
      `    Is the dev server up at ${URL}? Start it with \`npm start\`.\n` +
      `    If it is, check src/App.js renders its poster inside <Frame>, which\n` +
      `    is what puts data-canvas on the frame.`
  );
}
const CANVAS_W = Number(found[1]);
const CANVAS_H = Number(found[2]);
// The page is the authority here too. `want.dpi` is the fallback for the case
// where a size was named on the command line but the page is an older build.
const DPI = foundDpi ? Number(foundDpi[1]) : (want && want.dpi) || null;

// The page is the authority, but if it laid out at something other than what
// was asked for, that is a bug worth stopping on rather than a file to ship.
if (want && (want.w !== CANVAS_W || want.h !== CANVAS_H)) {
  fail(
    `Asked for ${SIZE} (${want.w}×${want.h}) but the page laid out at ` +
      `${CANVAS_W}×${CANVAS_H}.\n` +
      `    Check src/App.js renders its poster inside <Frame>, which is what\n` +
      `    reads the ?canvas= override.`
  );
}

// ---- launch 2: take the picture ----
const args = [
  ...BASE,
  `--force-device-scale-factor=${SCALE}`,
  `--window-size=${CANVAS_W},${CANVAS_H}`,
  `--screenshot=${OUT}`,
  URL,
];

console.log(
  `\n  → ${BASE_URL}  ${CANVAS_W}×${CANVAS_H} @${SCALE}x` +
    (DPI ? `  ${DPI * SCALE}dpi` : "") +
    (want ? `  (${want.label})` : "")
);
const run = spawnSync(CHROME, args, { encoding: "utf8" });

if (run.error) fail(`Couldn't start Chrome: ${run.error.message}`);
if (!fs.existsSync(OUT)) {
  fail(
    `Chrome wrote nothing.\n` +
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

// ---- tell the file how big it is in the world ----
// Everything above proves the PIXELS are right. This is what makes the INCHES
// right, and it is a separate claim: without it the card is 1050×600 at an
// assumed 72dpi, which is fourteen inches of business card.
let written = png;
if (DPI) {
  written = stampDensity(png, DPI * SCALE);
  fs.writeFileSync(OUT, written);
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
  `  ✓ ${OUT}\n    ${w}×${h}` +
    (DPI ? ` at ${DPI * SCALE}dpi — ${trim(w / (DPI * SCALE))}×${trim(h / (DPI * SCALE))}in` : "") +
    `, ${(written.length / 1024).toFixed(0)}KB\n`
);

function trim(n) {
  return String(Math.round(n * 100) / 100);
}

/**
 * Insert a pHYs chunk saying how many pixels there are per metre, replacing any
 * that is already there. Nine bytes: x per unit, y per unit, and the unit — 1
 * meaning metres, which is the only unit PNG defines.
 *
 * Written by hand rather than pulled from a library because this repo's export
 * path deliberately has no dependencies: no puppeteer for the browser, and
 * nothing for twenty bytes of header either.
 */
function stampDensity(buf, dpi) {
  const ppm = Math.round(dpi / 0.0254);
  const data = Buffer.alloc(9);
  data.writeUInt32BE(ppm, 0);
  data.writeUInt32BE(ppm, 4);
  data.writeUInt8(1, 8);

  const type = Buffer.from("pHYs", "latin1");
  const chunk = Buffer.alloc(21);
  chunk.writeUInt32BE(9, 0);
  type.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([type, data])), 17);

  const out = [buf.subarray(0, 8)];
  let i = 8;
  let placed = false;
  while (i + 12 <= buf.length) {
    const len = buf.readUInt32BE(i);
    const t = buf.toString("latin1", i + 4, i + 8);
    const end = i + 12 + len;
    if (end > buf.length) break;
    if (t !== "pHYs") out.push(buf.subarray(i, end));
    // Straight after IHDR, which is where pHYs is allowed and where every
    // reader looks for it.
    if (t === "IHDR" && !placed) {
      out.push(chunk);
      placed = true;
    }
    i = end;
  }
  if (!placed) fail(`${OUT} has no IHDR — that is not a PNG this can stamp`);
  return Buffer.concat(out);
}

function crc32(buf) {
  if (typeof zlib.crc32 === "function") return zlib.crc32(buf) >>> 0;
  if (!crc32.table) {
    crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crc32.table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crc32.table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}
