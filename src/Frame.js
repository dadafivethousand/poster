import React from "react";
import { resolveCanvas } from "./canvas";

/**
 * The poster's paper. Wraps whichever poster is being rendered and fixes the
 * output size for both the preview and the export.
 *
 *   <Frame><Feature /></Frame>                     // Instagram post, the default
 *   <Frame canvas="square"><Feature /></Frame>
 *   <Frame canvas="letter"><Feature /></Frame>
 *   <Frame canvas={{ w: 1200, h: 1600 }}><Feature /></Frame>
 *
 * `data-canvas` is not decoration: `npm run shot` reads it off the rendered
 * page to size the export window. That is deliberately the only place the size
 * is written down — an exporter told the size separately can be told the wrong
 * one, and a letter poster exported at Instagram dimensions is a mistake
 * nothing downstream would catch.
 */
export default function Frame({ canvas, children }) {
  const { w, h } = resolveCanvas(canvas);
  return (
    <div
      className="pf-frame"
      data-canvas={`${w}x${h}`}
      style={{ "--canvas-w": w, "--canvas-h": h }}
    >
      {children}
    </div>
  );
}
