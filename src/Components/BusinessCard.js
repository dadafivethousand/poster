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

export default function BusinessCard({
  side = "front",

  name = null,
  title = null,

  tagline = "Kids learn to code by building video games.",

  centre = "CODE NINJAS WOODBRIDGE",
  address = "6175 Hwy 7, Woodbridge, ON",
  phone = "647-887-9940",
  site = "cnwoodbridge.com",
  instagram = "@cn_woodbridge",

  // Optional: a QR image. Without one the block simply isn't there, rather
  // than leaving a white square that looks like a printing fault.
  qr = null,
}) {
  return (
    <div className={`pf-stage bc bc--${side}`}>
      <div className="bc-field" aria-hidden />
      <Grain />

      {side === "front" ? (
        <div className="bc-safe bc-front">
          <img className="bc-logo" src={cnLogo} alt="Code Ninjas" />
          <span className="bc-centre-row" aria-hidden={false}>
            <p className="bc-centre">WOODBRIDGE</p>
          </span>
          <p className="bc-tag">{tagline}</p>

          {name && (
            <p className="bc-name">
              <b>{name}</b>
              {title && <i>{title}</i>}
            </p>
          )}

          <img className="bc-mascot" src={ninjaFigure} alt="" aria-hidden />
        </div>
      ) : (
        <div className="bc-safe bc-back">
          <div className="bc-lines">
            <p className="bc-centre-back">{centre}</p>

            <p className="bc-row">
              <Pin />
              <span>{address}</span>
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
