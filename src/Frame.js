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

  return (
    <div
      className="pf-frame"
      data-canvas={`${w}x${h}`}
      // Present only for a size that HAS a physical one — a print preset or a
      // real-world spec. `npm run shot` reads it back and stamps it into the
      // PNG, so a card exported at 3.5×2in opens as 3.5×2in rather than as
      // 1050×600 pixels at whatever density the reader assumes.
      data-canvas-dpi={dpi || undefined}
      style={{ "--canvas-w": w, "--canvas-h": h }}
    >
      {children}
      {error && <pre className="pf-error">{error}</pre>}
    </div>
  );
}

function queryCanvas() {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("canvas");
  return v && v.trim() ? v.trim() : null;
}
