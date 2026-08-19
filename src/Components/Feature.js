// Feature.js — the template poster: a photograph carrying the frame, the mark
// and WOODBRIDGE welded together as one centred lockup over it.
//
// It exists to demonstrate BOTH things a submitted image can be, switched by
// one prop and nothing else:
//
//   withSource  true   the photo is the subject — full bleed, graded, scrimmed
//               false  the photo never appears; the poster is built by hand out
//                      of the colours taken OFF it, so a drawn composition still
//                      sits in the same world as the reference
//
// Either way the palette drives the poster: the ground and the scrim take the
// image's own dark, the rule takes its most saturated colour, the page and the
// type take its lightest. Hard-coding a palette here would waste the half of
// `useSource` that a style-reference poster is entirely built on.
//
// The mark is painted by REGION, never as one flat tint: the logo is a black
// hood with "NINJAS", a skin band across the eyes and "CODE" in blue, and
// masking the whole thing by `--logo` alone collapses the ninja's face into his
// hood. It keeps those three colours on any photograph because the poster puts
// a pool of LIGHT behind it rather than recolouring it to suit the picture —
// see `.ft-pool`, and the note on `.ft-mark-hood` for what recolouring cost.
import React from "react";
import "../Stylesheets/Feature.css";
import useLogo from "../Utils/useLogo";
import useSource from "../Utils/useSource";

export default function Feature({
  // The one word the mark doesn't already say. Anything beyond this is a
  // claim, so `headline` is opt-in and its wording has to come from the user.
  caption = "WOODBRIDGE",
  headline = null,
  withSource = true,
}) {
  const { logoVar, ready: logoReady, regions } = useLogo();
  const { sourceVar, ready: sourceReady } = useSource();

  // Both hooks trim/decode on a canvas, and a poster that paints before they
  // land would export a half-built frame. `npm run shot` covers this by giving
  // the page a few seconds of virtual time rather than by polling; the
  // attribute is here so a failed export can be diagnosed in devtools instead
  // of guessed at.
  const ready = logoReady && sourceReady;

  return (
    <div
      className={`pf-stage ft ${withSource ? "ft-photo-on" : "ft-photo-off"}`}
      style={{ ...logoVar, ...sourceVar }}
      data-ready={ready ? "1" : "0"}
    >
      {/* ---- ground: either the photograph, or the palette built by hand ---- */}
      {withSource ? (
        <div className="ft-photo" aria-hidden />
      ) : (
        <div className="ft-ground" aria-hidden />
      )}
      <div className="ft-scrim" aria-hidden />
      <div className="ft-vignette" aria-hidden />
      <Grain />

      {/* the light the lockup stands in — see .ft-pool for why the poster
          lights the mark instead of recolouring it */}
      <div className="ft-pool" aria-hidden />

      {/* ---- the lockup: mark and caption are flow siblings, so they can
              never drift apart no matter what else moves ---- */}
      <div className="ft-card">
        <div className="ft-markwrap">
          <div className="ft-markbox">
            {/* one masked layer per region — see the note at the top */}
            <div className="ft-mark ft-mark-hood" aria-hidden />
            {regions?.light && <div className="ft-mark ft-mark-face" aria-hidden />}
            {regions?.accent && <div className="ft-mark ft-mark-code" aria-hidden />}
            {/* no region masks at all (a flat one-tone logo): fall back to the
                whole alpha so the mark still renders rather than vanishing */}
            {!regions && <div className="ft-mark ft-mark-flat" aria-hidden />}
          </div>
          <div className="ft-caption">{caption}</div>
        </div>

        <div className="ft-rule" aria-hidden />
        {headline && <p className="ft-headline">{headline}</p>}
      </div>
    </div>
  );
}

/* Film grain over the whole frame. A poster exported at 1080 and looked at on
 * a phone shows gradient banding in the scrim without it; feTurbulence costs
 * nothing on a still and it is desaturated with feColorMatrix, because raw
 * turbulence is coloured confetti rather than grain. */
function Grain() {
  return (
    <svg className="ft-grain" aria-hidden focusable="false">
      <filter id="ft-noise" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#ft-noise)" />
    </svg>
  );
}
