// RoundLogo.js — the square badge: CODE NINJAS arced over the head,
// WOODBRIDGE arced under it, both extruded.
//
// Square canvas. The head is the 3D render the user supplied, dropped in whole
// — it already carries its own lighting, so nothing here recolours it.
//
// THE TYPE IS THE 3D, and it is built rather than filtered. A CSS `text-shadow`
// chain fakes depth for a few pixels and then falls apart; this stacks 40 copies
// of the same glyphs along one light vector to make real side walls, then puts a
// lit face on top of them. Four layers, back to front:
//
//   1. cast shadow   a blurred copy, offset the way the extrusion runs
//   2. side walls    40 `<use>`s of one <text>, each a step further down-right,
//                    darkening with depth so the extrusion turns away from the
//                    light instead of reading as a flat smear
//   3. bevel         one light copy offset UP-LEFT, sitting behind the face so
//                    it peeks out along the lit edges only
//   4. face          the top surface, gradient-filled
//
// Which is also why the text lives in <defs> and is used four times over: one
// definition, four materials, and the letter-spacing can never drift between
// the face and the walls holding it up.
import React from "react";
import "../Stylesheets/RoundLogo.css";
import head from "../Images/cn-head-3d.png";

// The design sheet is 1080 wide (App.css). Everything here is on it.
const C = 540;          // centre
const R_TOP = 390;      // baseline radius, top arc — caps grow OUTWARD from it
const R_BOT = 467;      // baseline radius, bottom arc — caps grow INWARD
const DEPTH = 40;       // extrusion steps
const DX = 0.58;        // ...and the light vector they run along
const DY = 0.82;

export default function RoundLogo({
  top = "CODE NINJAS",
  // `bottom={null}` drops the lower arc and leaves CODE NINJAS ringing the head
  // on its own — the ring is built from two independent runs, so nothing else
  // has to move for that.
  bottom = "WOODBRIDGE",
}) {
  return (
    <div className="pf-stage rl">
      <div className="rl-ground" aria-hidden />

      <svg className="rl-ring" viewBox="0 0 1080 1080" aria-label={`${top} ${bottom}`}>
        <defs>
          {/* Top arc: 9 o'clock → 12 → 3, drawn clockwise, so the glyphs stand
              with their tops pointing out of the circle. Bottom arc: 9 → 6 → 3,
              drawn the other way, which is what keeps WOODBRIDGE the right way
              up instead of hanging upside down under the head. */}
          <path id="rl-arc-top" d={`M ${C - R_TOP} ${C} a ${R_TOP} ${R_TOP} 0 1 1 ${R_TOP * 2} 0`} />
          <path id="rl-arc-bot" d={`M ${C - R_BOT} ${C} a ${R_BOT} ${R_BOT} 0 1 0 ${R_BOT * 2} 0`} />

          <text id="rl-t-top" className="rl-type rl-type--top">
            <textPath href="#rl-arc-top" startOffset="50%" textAnchor="middle">
              {top}
            </textPath>
          </text>
          {bottom && (
            <text id="rl-t-bot" className="rl-type rl-type--bot">
              <textPath href="#rl-arc-bot" startOffset="50%" textAnchor="middle">
                {bottom}
              </textPath>
            </text>
          )}

          {/* The lit face of the black type. Not flat black: a black object in
              a lit scene has a bright top and a near-black underside, and that
              difference is most of what says "solid" here. */}
          <linearGradient id="rl-face-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7c8794" />
            <stop offset="0.16" stopColor="#2b323c" />
            <stop offset="0.55" stopColor="#12161c" />
            <stop offset="1" stopColor="#04060a" />
          </linearGradient>

          {/* Lit from the same side as the black run. The bottom arc's glyphs
              stand with their tops toward the centre, so "up the glyph" is still
              up the canvas — one vertical ramp lights both bands consistently,
              and flipping this one is what stopped WOODBRIDGE reading as lit
              from the floor while CODE NINJAS was lit from the sky. */}
          <linearGradient id="rl-face-bot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bdedff" />
            <stop offset="0.34" stopColor="#5fc8f2" />
            <stop offset="0.68" stopColor="#2196cd" />
            <stop offset="1" stopColor="#0c527a" />
          </linearGradient>

          <filter id="rl-cast" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <Extruded id="rl-t-top" face="url(#rl-face-top)" wall="#0b0e13" bevel="#aab6c4" />
        {bottom && (
          <Extruded id="rl-t-bot" face="url(#rl-face-bot)" wall="#06344c" bevel="#d8f4ff" />
        )}
      </svg>

      <img className="rl-head" src={head} alt="Code Ninjas" />
    </div>
  );
}

/* One run of type, built into a solid. `wall` is the deepest colour; each step
 * back toward the face lightens a little, so the side wall carries a gradient
 * of its own and the extrusion reads as a surface rather than a shadow. */
function Extruded({ id, face, wall, bevel }) {
  const steps = Array.from({ length: DEPTH }, (_, i) => DEPTH - i); // far → near

  return (
    <g>
      <use
        href={`#${id}`}
        fill="#8c99a8"
        opacity="0.55"
        filter="url(#rl-cast)"
        transform={`translate(${DX * DEPTH + 10} ${DY * DEPTH + 14})`}
      />

      {steps.map((s) => (
        <use
          key={s}
          href={`#${id}`}
          fill={wall}
          opacity={0.5 + 0.5 * (1 - s / DEPTH)}
          transform={`translate(${DX * s} ${DY * s})`}
        />
      ))}

      {/* Behind the face, offset the other way: it shows only where the face
          does not cover it, which is the top-left edge of every glyph — a
          catchlight along the lit side, not an outline round the whole letter. */}
      <use href={`#${id}`} fill={bevel} transform="translate(-2.4 -3.2)" />

      <use href={`#${id}`} fill={face} />
    </g>
  );
}
