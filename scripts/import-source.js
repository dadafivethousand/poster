#!/usr/bin/env node
/**
 * Copy a reference image out of ~/Downloads into src/Images/, and rewrite
 * src/source.js to import it.
 *
 *   npm run source                      # newest image file in ~/Downloads
 *   npm run source -- ~/Downloads/x.jpg # an explicit file
 *
 * Two differences from `npm run logo`:
 *
 *  - the extension is PRESERVED (a submitted photo is usually a .jpg, and
 *    renaming it to .png would be a lie the decoder has to work around), which
 *    is why src/source.js has to be rewritten rather than just overwritten as
 *    a fixed path;
 *  - no alpha warning. A poster's source image is a photo or a piece of
 *    reference art; transparency is optional and usually absent.
 *
 * Any previously imported source with a different extension is removed, so
 * src/Images/ never accumulates a pile of stale source.* files that the next
 * reader has to guess between.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const IMAGES = path.join(ROOT, "src", "Images");
const MODULE = path.join(ROOT, "src", "source.js");
const DOWNLOADS = path.join(os.homedir(), "Downloads");
const EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif"]);

function fail(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

function newestInDownloads() {
  let entries;
  try {
    entries = fs.readdirSync(DOWNLOADS);
  } catch {
    fail(`Can't read ${DOWNLOADS}`);
  }
  const candidates = entries
    .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
    .map((f) => {
      const full = path.join(DOWNLOADS, f);
      return { full, mtime: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  if (!candidates.length) fail(`No image files in ${DOWNLOADS}`);
  return candidates[0].full;
}

/** Intrinsic size, best effort, so the log says something useful. */
function dimensions(file) {
  const buf = fs.readFileSync(file);
  const isPng = buf.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  );
  if (isPng) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };

  if (buf[0] === 0xff && buf[1] === 0xd8) {
    // Walk the JPEG segment chain to the first frame header.
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      // SOF0..SOF15, skipping the four that aren't frame headers
      if (marker >= 0xc0 && marker <= 0xcf &&
          marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

const arg = process.argv[2];
const src = arg
  ? path.resolve(arg.replace(/^~/, os.homedir()))
  : newestInDownloads();

if (!fs.existsSync(src)) fail(`No such file: ${src}`);

const ext = path.extname(src).toLowerCase();
if (!EXTS.has(ext)) fail(`Not an image extension: ${ext}`);

// Clear out any earlier source.* so only one can ever be the current one.
fs.readdirSync(IMAGES)
  .filter((f) => /^source\./i.test(f))
  .forEach((f) => fs.rmSync(path.join(IMAGES, f)));

const destName = `source${ext}`;
fs.copyFileSync(src, path.join(IMAGES, destName));

const module_ = fs.readFileSync(MODULE, "utf8");
const rewritten = module_.replace(
  /^import sourceSrc from ".\/Images\/source\.[a-z]+";$/m,
  `import sourceSrc from "./Images/${destName}";`
);
if (rewritten === module_) {
  fail(
    `Couldn't find the import line in src/source.js to rewrite.\n` +
      `    The image was copied to src/Images/${destName} — point the import at it by hand.`
  );
}
fs.writeFileSync(MODULE, rewritten);

console.log(`\n  ✓ ${path.basename(src)}  →  src/Images/${destName}`);
const dim = dimensions(path.join(IMAGES, destName));
if (dim) {
  console.log(`    ${dim.w}×${dim.h}px`);
  // The canvas is 1080×1350. A source rendered full-bleed off a smaller file
  // is being upscaled, which shows on an exported still far more than it does
  // on a phone screen.
  if (dim.w < 1080 || dim.h < 1350) {
    console.log(
      "\n  ⚠  Smaller than the 1080×1350 canvas. Fine as a palette or style\n" +
        "     reference; upscaled and soft if rendered full-bleed."
    );
  }
}
console.log("");
