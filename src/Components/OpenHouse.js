// OpenHouse.js — Code Ninjas Woodbridge open house.
//
// ── WHAT THIS REPLACED, AND WHY ──
//
// The first version was a faithful recreation of a supplied reference, and it
// inherited that reference's problem: NINE blocks all shouting at once — a
// rotated handwritten note, a starburst, an extruded two-tone title, a banner,
// a date pill, five saturated sticker tabs, four program columns, three ticks
// and a footer. Eight hues, gradients on everything, content bleeding off all
// four edges, and the one thing a reader has to act on — the QR — rendering as
// an empty white square.
//
// A poster is not a list of everything true about an event. It answers four
// questions in a fixed order and gets out of the way:
//
//      WHAT   an open house, free, drop in
//      WHEN   the date, at a size you can read from the far side of a plaza
//      WHY    what your kid actually gets to do
//      WHERE  the address, the phone, and a code that goes somewhere
//
// The rebuild is that order, top to bottom, with one block per question and
// real air between them.
//
// ── ONE ACCENT ──
//
// Navy field, white, and lime. That is the whole palette, and the discipline is
// the point: the reference used navy + lime + green + blue + yellow + violet +
// orange + red, which is what makes a sheet read as clip art no matter how
// well each piece is drawn. Colour here means something — lime is always the
// thing to act on (the date, the icons, the phone), white is always
// information.
//
// ── THE TITLE IS FLAT ──
//
// The reference's headline is a four-layer hard extrusion with a white keyline
// round every letter. That treatment dates a poster to about 2011 and it is
// the first thing that made this look homemade. Fredoka at width 85% set flat,
// tight, and enormous is more confident and reads further away.
//
// ── NOTHING BLEEDS ──
//
// The repo's own rule (CLAUDE.md, "Composition") is one centred block with
// clear space on all four sides. Everything here lives inside `--margin`, with
// two deliberate exceptions that are full-bleed BANDS rather than escaped
// content: the header and the footer. A band that touches three edges reads as
// structure; a tab that runs off one edge reads as a mistake.
import React from "react";
import "../Stylesheets/OpenHouse.css";
import cnLogo from "../Images/cn-logo-horizontal.svg";
import ninjaFigure from "../Images/cn-ninja-figure.png";
// The QR was an empty white box in every export of the previous version — the
// single most expensive defect on the sheet, because it is the only element
// that converts a passer-by into a visit. Generated with segno at
// error-correction level H so it survives being printed small, taped to a
// plaza window and photographed at an angle.
import qrCode from "../Images/qr-cnwoodbridge.svg";
import ICONS from "./OpenHouseIcons";

/**
 * A supplied image, else the drawn icon for that slot, else reserved space.
 * Passing a src for any slot swaps in real artwork without touching layout.
 */
function Slot({ src, name, className = "", alt = "" }) {
  if (src) return <img className={`oh-slot ${className}`} src={src} alt={alt} />;
  const Drawn = ICONS[name];
  if (Drawn) {
    return (
      <span className={`oh-slot oh-slot--drawn ${className}`} aria-hidden>
        <Drawn />
      </span>
    );
  }
  return <span className={`oh-slot oh-slot--empty ${className}`} aria-hidden />;
}

export default function OpenHouse({
  centreName = "WOODBRIDGE",

  // The three barriers to walking in, answered before anything else is read.
  // "ALL AGES" was the reference's wording and it is vague in the one direction
  // that costs a visit — a parent of a six-year-old reads it and assumes the
  // room is full of teenagers. The centre's actual range is 5–14, so say it.
  eyebrow = ["FREE", "DROP IN — NO SIGN-UP", "AGES 5–14"],

  title = ["OPEN", "HOUSE"],

  // THE DAY OF THE WEEK AND THE DATE HAVE TO AGREE. They are one string on
  // purpose so nobody can update one and leave the other — see the note in
  // App.js. August 23 2026 falls on a Sunday.
  day = "SAT",
  date = "AUG 23",
  time = "1:00 PM",

  // What a kid actually gets to do. Five, in a row, one visual treatment.
  // MINECRAFT and ROBLOX appear as TEXT — that is nominative use and is how
  // you are allowed to name what you teach. Their logos are deliberately not
  // drawn; see OpenHouseIcons.js.
  activities = [
    { key: "coding", label: "CODING" },
    { key: "minecraft", label: "MINECRAFT" },
    { key: "roblox", label: "ROBLOX" },
    { key: "printing", label: "3D PRINTING" },
    { key: "chess", label: "CHESS" },
  ],

  // The draws, kept out of the activity row so the row stays one idea.
  draws = [
    { key: "prizes", label: "Prizes all afternoon" },
    { key: "giveaways", label: "Giveaways" },
    { key: "team", label: "Meet the senseis" },
  ],

  kicker = "Turn screen time into skill time.",

  centre = "CODE NINJAS WOODBRIDGE",
  address = "6175 Hwy 7 · Market Lane Plaza, Woodbridge ON",
  phone = "647-887-9940",
  scanLabel = "SCAN FOR DETAILS",

  // Artwork. Anything omitted falls back to the drawn icon for that slot.
  art = {},
}) {
  const a = { logo: cnLogo, mascot: ninjaFigure, qr: qrCode, ...art };

  return (
    <div className="pf-stage oh">
      <div className="oh-field" aria-hidden />
      <Confetti />

      {/* ---------- WHO ---------- */}
      <header className="oh-head">
        <img className="oh-head-logo" src={a.logo} alt="Code Ninjas" />
        <span className="oh-head-bar" aria-hidden />
        <span className="oh-head-centre">{centreName}</span>
      </header>

      {/* ---------- WHAT ----------
          The three barriers first. A parent's objections to walking into a
          coding centre on a weekend are cost, commitment and "is my kid old
          enough" — all three are answered above the headline, in the smallest
          type on the sheet, because they only have to be found, not shouted. */}
      <ul className="oh-eyebrow">
        {eyebrow.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>

      <h1 className="oh-title">
        <span className="oh-title-a">{title[0]}</span>
        <span className="oh-title-b">{title[1]}</span>
      </h1>

      {/* THE POOL IS NOT DECORATION. The mascot artwork is a near-black figure
          with a thin cyan rim, and on a navy field his body and legs simply
          vanish — the first render of this layout read as a floating head and
          a white belt. CLAUDE.md's rule for the logo applies to him unchanged:
          light the mark, don't recolour it. A blurred pool of the poster's own
          two lights behind him separates the silhouette without touching the
          artwork. */}
      <span className="oh-mascot-pool" aria-hidden />

      {/* He stands ON the date slab, overlapping its top edge, which is why
          the slab's own type is packed to the left. A mascot with no ground
          under him is the tell of a pasted sticker. */}
      <img className="oh-mascot" src={a.mascot} alt="" aria-hidden />

      {/* ---------- WHEN ----------
          The second hero, not a footnote. This is the one fact a passer-by has
          to carry away, so it gets the accent, the full width and the only
          solid light block above the fold. */}
      <div className="oh-when">
        <span className="oh-when-day">{day}</span>
        <span className="oh-when-date">{date}</span>
        <span className="oh-when-rule" aria-hidden />
        <span className="oh-when-time">{time}</span>
      </div>

      {/* ---------- WHY ---------- */}
      <section className="oh-what">
        <h2 className="oh-what-h">
          <span>TRY IT ALL</span>
          <i>{kicker}</i>
        </h2>

        <ul className="oh-acts">
          {activities.map((x) => (
            <li key={x.key}>
              <Slot src={a[x.key]} name={x.key} className="oh-act-icon" />
              <b>{x.label}</b>
            </li>
          ))}
        </ul>
      </section>

      <ul className="oh-draws">
        {draws.map((d) => (
          <li key={d.key}>
            <Slot src={a[d.key]} name={d.key} className="oh-draw-icon" />
            {d.label}
          </li>
        ))}
      </ul>

      {/* ---------- WHERE ---------- */}
      <footer className="oh-foot">
        <span className="oh-foot-where">
          <b>{centre}</b>
          <i>{address}</i>
        </span>

        <span className="oh-foot-tel">{phone}</span>

        <span className="oh-foot-qr">
          <img src={a.qr} alt="" aria-hidden />
          <em>{scanLabel}</em>
        </span>
      </footer>
    </div>
  );
}

/* Confetti, rationed.
 *
 * The reference threw eighteen pieces in six colours around all four edges,
 * including four inside the margins where they collided with type. This is
 * twelve, in the poster's own two inks plus one cool blue, kept to the upper
 * field where there is nothing to hit — they read as atmosphere behind the
 * headline instead of as decoration sprinkled over finished work.
 *
 * Positions are fixed rather than random so the export is byte-identical run
 * to run; a poster that differs between renders cannot be checked against
 * anything. */
const CONFETTI = [
  [5, 6, 18, 9, -18, "#c1d931"], [14, 15, 13, 13, 34, "#ffffff"],
  [24, 4, 17, 8, 12, "#4aa3ff"], [35, 12, 12, 12, -40, "#c1d931"],
  [50, 3, 19, 9, 22, "#ffffff"], [61, 10, 13, 13, -12, "#4aa3ff"],
  [70, 5, 16, 8, 48, "#c1d931"], [79, 14, 12, 12, -28, "#ffffff"],
  [88, 4, 18, 9, 16, "#4aa3ff"], [93, 20, 13, 13, -44, "#c1d931"],
  [8, 27, 15, 7, 30, "#ffffff"], [90, 31, 14, 7, -20, "#c1d931"],
];

function Confetti() {
  return (
    <div className="oh-confetti" aria-hidden>
      {CONFETTI.map(([x, y, w, h, rot, c], i) => (
        <span
          key={i}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `calc(${w} * var(--px))`,
            height: `calc(${h} * var(--px))`,
            background: c,
            transform: `rotate(${rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}
