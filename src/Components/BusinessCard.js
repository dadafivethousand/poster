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
//
// The two sides use the SAME lockup grammar — the head, the wordmark, and
// WOODBRIDGE struck in gold between hairlines — at two scales. The back's is
// the front's, laid on its side and shrunk to a heading, so the card reads as
// one object rather than two designs stapled back to back.
import React from "react";
import "../Stylesheets/BusinessCard.css";
import cnLogo from "../Images/cn-logo-horizontal.svg";
import cnHead from "../Images/cn-head-mark.png";
import qrCode from "../Images/qr-cnwoodbridge.svg";

export default function BusinessCard({
  side = "front",

  name = null,
  title = null,

  tagline = "Coding · Robotics · Chess · 3D Printing",

  brand = "CODE NINJAS",
  centre = "WOODBRIDGE",
  address = "6175 Hwy 7, Woodbridge, ON",
  phone = "647-887-9940",
  site = "cnwoodbridge.com",
  instagram = "@cn_woodbridge",

  // Defaults to the centre's own code, which lives in the repo. Pass `null`
  // explicitly for a card without one — the mark takes the space instead.
  qr = qrCode,
}) {
  const back = side === "back";

  return (
    <div className={`pf-stage bc bc--${side}`}>
      <div className="bc-field" aria-hidden />
      <div className="bc-glow" aria-hidden />
      {back ? <Board /> : <Circuit />}
      {back && <div className="bc-scrim" aria-hidden />}
      <img className="bc-ghost" src={cnHead} alt="" aria-hidden />
      <Grain />

      {!back ? (
        <div className="bc-safe bc-front">
          <span className="bc-lockup">
            <img className="bc-logo" src={cnLogo} alt="Code Ninjas" />
            <span className="bc-centre-row">
              <p className="bc-centre">{centre}</p>
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
            {/* The head next to the words, lit rather than recoloured — a pool
                of light behind it, the artwork left in the three tones it was
                drawn in. Same reason as everywhere else in this repo: the eye
                slits are the same near-black as the hood, so any recolour that
                lifts the hood takes his eyes with it. */}
            <span className="bc-backlock">
              <span className="bc-headbox">
                <img className="bc-head" src={cnHead} alt="Code Ninjas" />
              </span>

              <span className="bc-backwords">
                <span className="bc-brand">{brand}</span>
                <span className="bc-centre-row">
                  <p className="bc-centre">{centre}</p>
                </span>
              </span>
            </span>

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
              which reads as a card missing something rather than as space.
              On the board it is dressed as a part: gold pad ring, four legs. */}
          {qr ? (
            <span className="bc-qr">
              <span className="bc-qr-legs" aria-hidden />
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

/* Tone-on-tone circuit traces in the corners of the FRONT. A card is held
 * close, so it can carry detail a poster cannot — at 7% these are invisible
 * across a room and are the thing someone notices when the card is actually in
 * their hand, which is the only moment that matters for a card. The front
 * keeps them to a whisper because the lockup is the whole composition there;
 * the back turns them up into the composition itself. */
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

/* ---------- the back is the board ----------
 *
 * Not "some traces in the corners" — an actual PCB, with the four things that
 * make a board read as a board at a glance:
 *
 *   1. a pad field       — the regular dot grid under everything
 *   2. traces            — every segment horizontal, vertical or 45°, never an
 *                          arbitrary angle, because copper is routed on a grid
 *                          and a stray 20° line is the tell that it's wallpaper
 *   3. vias and pads     — traces terminate in something; a line that just
 *                          stops is a scratch, a line into a ring is a circuit
 *   4. two IC footprints and the gold edge fingers — the parts. Gold because
 *                          ENIG plating is gold, which is also the card's
 *                          accent, so the board joins the palette instead of
 *                          arriving with one of its own.
 *
 * Density is deliberate and the contact column is protected by `.bc-scrim`
 * rather than by leaving a hole in the artwork: a board with a bald patch
 * shaped like a paragraph looks like a mistake.
 */
function Board() {
  return (
    <svg className="bc-board" viewBox="0 0 1080 617" aria-hidden focusable="false">
      <defs>
        <pattern id="bc-pad-field" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="1.9" fill="#8fc7ff" />
        </pattern>
      </defs>

      <rect width="1080" height="617" fill="url(#bc-pad-field)" opacity="0.15" />

      {/* copper */}
      <g fill="none" stroke="#8fc7ff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.32">
        <path d="M-14 34H148l32 32h216l32-32h258l32 32h176" />
        <path d="M-14 88H92l32-32h138" />
        <path d="M-14 142h60l36 36v122" />
        <path d="M130-14v44l32 32h138l28 28v104" />
        <path d="M388-14v60h132l32 32h88" />
        <path d="M604-14v76l32 32h164l32-32h180" />
        <path d="M1094 130H968l-36-36V22" />
        <path d="M1094 206h-64l-32 32v96" />
        <path d="M1094 380h-70l-34 34h-90" />
        <path d="M1094 480H946l-36 36H742l-34 34H500" />
        <path d="M1094 560h-84l-32-32" />
        <path d="M-14 500h134l34 34h172l30 30h190" />
        <path d="M-14 566h92l30 30h108" />
        <path d="M250 631v-41l30-30h150" />
        <path d="M470 631v-61l30-30h120" />
        <path d="M660 631v-35h170l32-32h78" />
        <path d="M232 196v96l30 30h108" />
        <path d="M786 150v92l-30 30v96" />
      </g>

      {/* vias: a ring with a plated hole, sat on the corners and the ends */}
      <g fill="none" stroke="#8fc7ff" strokeWidth="2.6" opacity="0.32">
        <circle cx="180" cy="66" r="9" /><circle cx="396" cy="66" r="9" />
        <circle cx="262" cy="56" r="9" /><circle cx="96" cy="178" r="9" />
        <circle cx="520" cy="46" r="9" /><circle cx="636" cy="94" r="9" />
        <circle cx="932" cy="94" r="9" /><circle cx="998" cy="238" r="9" />
        <circle cx="990" cy="414" r="9" /><circle cx="910" cy="516" r="9" />
        <circle cx="154" cy="534" r="9" /><circle cx="108" cy="596" r="9" />
        <circle cx="280" cy="560" r="9" /><circle cx="500" cy="540" r="9" />
        <circle cx="756" cy="272" r="9" /><circle cx="262" cy="322" r="9" />
      </g>
      <g fill="#8fc7ff" opacity="0.32">
        <circle cx="180" cy="66" r="3.1" /><circle cx="396" cy="66" r="3.1" />
        <circle cx="262" cy="56" r="3.1" /><circle cx="96" cy="178" r="3.1" />
        <circle cx="520" cy="46" r="3.1" /><circle cx="636" cy="94" r="3.1" />
        <circle cx="932" cy="94" r="3.1" /><circle cx="998" cy="238" r="3.1" />
        <circle cx="990" cy="414" r="3.1" /><circle cx="910" cy="516" r="3.1" />
        <circle cx="154" cy="534" r="3.1" /><circle cx="108" cy="596" r="3.1" />
        <circle cx="280" cy="560" r="3.1" /><circle cx="500" cy="540" r="3.1" />
        <circle cx="756" cy="272" r="3.1" /><circle cx="262" cy="322" r="3.1" />
      </g>

      {/* the parts */}
      <g opacity="0.32">
        <Chip x={874} y={58} />
        <Chip x={96} y={512} />
      </g>

      {/* gold: the routed power rail and the edge connector */}
      <g fill="none" stroke="#e9c46a" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.38">
        <path d="M20 631V466l34-34V214l30-30V-14" />
        <path d="M1094 96h-90l-34 34v212" />
        <path d="M340 631v-27l30-30h230l30-30h180" />
      </g>
      <g fill="#e9c46a" opacity="0.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={806 + i * 36} y={578} width={20} height={53} rx={5} />
        ))}
      </g>
    </svg>
  );
}

/* An IC: the body, the notch that says which end is pin 1, and eight legs. */
function Chip({ x, y }) {
  const w = 104;
  const h = 62;
  const legs = [0, 1, 2, 3];
  return (
    <g stroke="#8fc7ff" fill="none" strokeWidth="3">
      <rect x={x} y={y} width={w} height={h} rx={6} />
      <path d={`M${x + 16} ${y} a8 8 0 0 0 16 0`} />
      {legs.map((i) => {
        const ly = y + 13 + i * 12;
        return (
          <g key={i}>
            <path d={`M${x} ${ly}h-13`} strokeLinecap="round" />
            <path d={`M${x + w} ${ly}h13`} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
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
