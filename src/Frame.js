import React from "react";
// `require`, not `import`: canvas.js is CommonJS so tools/shoot.js can read it
// without a build step, and webpack's named-export inference for a CJS module
// is a heuristic that does not hold here — `import { resolveCanvas }` fails to
// compile even though node resolves it fine. require() is exact.
const { resolveCanvas } = require("./canvas");

/**
 * The poster's paper. Wraps whichever poster is being rendered and fixes the
 * output size for both the preview and the export.
 *
 *   <Frame><Feature /></Frame>                     // Instagram post, the default
 *   <Frame canvas="square"><Feature /></Frame>
 *   <Frame canvas="letter"><Feature /></Frame>
 *   <Frame canvas="8.5x11in"><Feature /></Frame>
 *   <Frame canvas={{ w: 1200, h: 1600 }}><Feature /></Frame>
 *
 * THE SIZE CAN ALSO COME FROM THE URL — `?canvas=letter`, `?canvas=1200x1600`,
 * `?canvas=8.5x11in` — which overrides the prop. That is what makes the size
 * something you can just ask for rather than a code change: open
 * `localhost:3000/?canvas=square` to look at the same poster square, and
 * `npm run shot -- square` to export it that way.
 *
 * The query param is the mechanism rather than a flag on the exporter because
 * the aspect has to change INSIDE the page. Resizing only the export window
 * would letterbox a poster still laid out at its old shape.
 *
 * `data-canvas` is not decoration: `npm run shot` reads it back off the
 * rendered page to size the window, so the picture is always taken at whatever
 * the page actually laid out — never at what something upstream believed. The
 * same goes for `data-canvas-dpi`, which is how a physical size reaches the
 * exported file.
 */
export default function Frame({ canvas, children }) {
  // undefined falls through to resolveCanvas's own default (an IG post).
  const requested = queryCanvas() ?? canvas;

  let resolved;
  let error = null;
  try {
    resolved = resolveCanvas(requested);
  } catch (e) {
    // A typo in the address bar shouldn't white-screen the app, but it must
    // not quietly render at some other size either — say so on the page. The
    // exporter validates before it ever launches, so this is the browser path.
    error = e.message;
    resolved = resolveCanvas();
  }

  const { w, h, dpi } = resolved;
  // A preset carries no bleed, so the trim IS the canvas and these fall back to
  // the no-bleed identity: the ratios below come out 1 and 0, and every poster
  // lays out exactly as it did before bleed existed.
  const bleed = resolved.bleed || 0;
  const trimW = resolved.trimW || w;

  return (
    <div
      className="pf-frame"
      data-canvas={`${w}x${h}`}
      // Present only for a size that HAS a physical one — a print preset or a
      // real-world spec. `npm run shot` reads it back and stamps it into the
      // PNG, so a card exported at 3.5×2in opens as 3.5×2in rather than as
      // 1050×600 pixels at whatever density the reader assumes.
      data-canvas-dpi={dpi || undefined}
      // For the export's log line, so a bled file reports the size it will be
      // after trimming rather than the larger one it is on disk.
      data-canvas-trim={bleed ? `${trimW}x${resolved.trimH}` : undefined}
      style={{
        "--canvas-w": w,
        "--canvas-h": h,
        // Both as bare fractions of the canvas WIDTH, because that is the one
        // dimension `100cqw` gives the stylesheet to multiply. `--trim-ratio`
        // keeps `--px` pinned to the trim, so adding bleed enlarges the paper
        // and not the type; `--bleed-ratio` is how a margin measured from the
        // trim edge finds it again from the paper's.
        "--trim-ratio": trimW / w,
        "--bleed-ratio": bleed / w,
      }}
    >
      {children}
      {bleed > 0 && showGuides() && <TrimGuide />}
      {error && <pre className="pf-error">{error}</pre>}
    </div>
  );
}

function queryCanvas() {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("canvas");
  return v && v.trim() ? v.trim() : null;
}

/**
 * The cut line, drawn over a bled poster so you can see what the guillotine
 * takes — the one thing about a bleed you cannot check by looking at the file,
 * since the whole point is that the artwork runs past the edge of the card.
 *
 * OPT-IN, via `?guides` in the address bar, and that is what keeps it out of
 * every export: `npm run shot` builds its URL from `?canvas=` alone and never
 * adds this, so a guide cannot reach a printer even by accident. Nothing here
 * is conditional on some "is this an export" flag, because a flag like that is
 * exactly what eventually gets read wrong once.
 */
function TrimGuide() {
  return <div className="pf-trim" aria-hidden />;
}

function showGuides() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("guides");
}
