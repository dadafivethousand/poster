// BusinessCard.js — Code Ninjas Woodbridge business card.
//
// 3.5×2in at 300dpi (1050×600). Two sides, one at a time: `side="front"` is
// the brand face, `side="back"` carries the contact details. Export each and
// send the printer both files.
//
// NO BLEED. The canvas is exactly the trim size the user asked for, so this
// prints as-is on a home printer or a cut-to-size job. Most commercial
// printers want 3.75×2.25in with 0.125in of bleed off every edge — that is one
// change, `<Frame canvas="3.75x2.25in">`, and nothing here has to move: the
// field runs edge to edge and every element sits inside a safe margin well
// clear of the trim.
//
// The card carries no personal name by default, because none was given and a
// name is not something to invent. `name` and `title` render the moment they
// are passed.
import React from "react";
import "../Stylesheets/BusinessCard.css";
import cnLogo from "../Images/cn-logo-horizontal.svg";
import ninjaFigure from "../Images/cn-ninja-figure.png";
import cnHead from "../Images/cn-head-mark.png";
import qrCode from "../Images/qr-cnwoodbridge.svg";

export default function BusinessCard({
  side = "front",

  name = null,
  title = null,

  tagline = "Coding · Computer Science · Robotics · Chess · 3D Printing",

  centre = "CODE NINJAS WOODBRIDGE",
  address = "6175 Hwy 7, Woodbridge, ON",
  phone = "647-887-9940",
  site = "cnwoodbridge.com",
  instagram = "@cn_woodbridge",

  // Defaults to the centre's own code, which lives in the repo. Pass `null`
  // explicitly for a card without one — the mark takes the space instead.
  qr = qrCode,
}) {
  return (
    <div className={`pf-stage bc bc--${side}`}>
      <div className="bc-field" aria-hidden />
      <div className="bc-glow" aria-hidden />
      <Circuit />
      <img className="bc-ghost" src={cnHead} alt="" aria-hidden />
      <Grain />

      {side === "front" ? (
        <div className="bc-safe bc-front">
          <span className="bc-lockup">
            <img className="bc-logo" src={cnLogo} alt="Code Ninjas" />
            <span className="bc-centre-row">
              <p className="bc-centre">WOODBRIDGE</p>
            </span>

            {name && (
              <p className="bc-name">
                <b>{name}</b>
                {title && <i>{title}</i>}
              </p>
            )}
          </span>

          {/* A rule that runs off both edges, with the line under it. It gives
              the front a footer, so the three centred things stop floating and
              become a block over a base. */}
          <span className="bc-footrule" aria-hidden />
          <p className="bc-tag">{tagline}</p>

        </div>
      ) : (
        <div className="bc-safe bc-back">
          <div className="bc-lines">
            <p className="bc-centre-back">{centre}</p>

            <p className="bc-row">
              <Pin />
              <span className="bc-strong">{address}</span>
            </p>

            <p className="bc-row">
              <Phone />
              <span className="bc-strong">{phone}</span>
            </p>

            <p className="bc-row">
              <Globe />
              <span className="bc-strong">{site}</span>
            </p>

            <p className="bc-row">
              <Instagram />
              <span className="bc-strong">{instagram}</span>
            </p>
          </div>

          {/* A QR if there is one, the mark if there isn't. Left to itself the
              contact block sits in the left half and the right half is empty,
              which reads as a card missing something rather than as space. */}
          {qr ? (
            <span className="bc-qr">
              <img src={qr} alt="Scan for details" />
            </span>
          ) : (
            <img className="bc-mark" src={cnHead} alt="" aria-hidden />
          )}
        </div>
      )}
    </div>
  );
}

/* Tone-on-tone circuit traces in the corners. A card is held close, so it can
 * carry detail a poster cannot — at 6% these are invisible across a room and
 * are the thing someone notices when the card is actually in their hand, which
 * is the only moment that matters for a card. */
function Circuit() {
  return (
    <svg className="bc-circuit" viewBox="0 0 1080 617" aria-hidden focusable="false">
      <g fill="none" stroke="#8fc7ff" strokeWidth="2.4" strokeLinecap="round">
        <path d="M-10 96h108l44-44h96" />
        <path d="M-10 168h150l40 40h84" />
        <path d="M1090 452H986l-44 44h-92" />
        <path d="M1090 528H948l-40-40h-86" />
        <path d="M84 -10v52l40 40v54" />
        <path d="M996 627v-52l-40-40v-58" />
      </g>
      <g fill="#8fc7ff">
        <circle cx="238" cy="52" r="7" /><circle cx="274" cy="208" r="7" />
        <circle cx="850" cy="496" r="7" /><circle cx="822" cy="488" r="0" />
        <circle cx="124" cy="182" r="7" /><circle cx="956" cy="477" r="7" />
      </g>
    </svg>
  );
}

/* Grain, for the same reason as everywhere else in this repo: the field is a
 * gradient, gradients band, and on a navy this deep the steps are visible in
 * print far more than on screen. */
function Grain() {
  return (
    <svg className="bc-grain" aria-hidden focusable="false">
      <filter id="bc-noise" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#bc-noise)" />
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const Pin = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M12 22s7-7.6 7-12.6A7 7 0 0 0 5 9.4C5 14.4 12 22 12 22Z" {...stroke} />
    <circle cx="12" cy="9.4" r="2.6" {...stroke} />
  </svg>
);

const Phone = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M7 3c.9 0 1.4.5 1.8 1.3l1 2c.4.9 0 1.5-.5 2l-.9.9a12 12 0 0 0 5.4 5.4l.9-.9c.5-.5 1.1-.9 2-.5l2 1c.8.4 1.3.9 1.3 1.8 0 1.7-1.4 3-3 3C9.6 19 5 14.4 5 6c0-1.6 1.3-3 3-3Z"
          {...stroke} />
  </svg>
);

/* Drawn rather than pulled from an icon font: the card ships four glyphs and a
 * font dependency for four glyphs is a dependency for nothing. */
const Instagram = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5.2" {...stroke} />
    <circle cx="12" cy="12" r="4.1" {...stroke} />
    <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none" />
  </svg>
);

const Globe = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="9" {...stroke} />
    <ellipse cx="12" cy="12" rx="3.9" ry="9" {...stroke} />
    <path d="M3.2 9h17.6M3.2 15h17.6" {...stroke} />
  </svg>
);
