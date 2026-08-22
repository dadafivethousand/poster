// OpenHouseIcons.js — the drawn icon set for the open house poster.
//
// Not placeholders. These are the poster's icons, drawn here so the whole
// sheet is one file with nothing to go missing before a print run, and every
// one is still overridable by passing a src for that slot.
//
// ── THEY TAKE THEIR COLOUR FROM WHERE THEY SIT ──
//
// The previous set hard-coded a colour into every icon: a brown dirt block, a
// green calendar, a purple clock, a blue printer, a navy bag. Nothing agreed
// with anything, and the two icons that landed on a yellow tab had to be drawn
// twice to stay legible.
//
// Now the mass of every icon is `currentColor` and the detail cut into it is
// `--ink`, so an icon is legible wherever it is put and the parent decides:
//
//     .oh-tab           color:#fff   --ink: the tab's own hue
//     .oh-tab--yellow   color:navy   --ink:#fff        (white washes out on yellow)
//     .oh-program       color:#fff   --ink: navy       (on the dark panel)
//     .oh-foot          color:lime   --ink: navy
//
// That is one drawing per idea instead of two, and it is why the row finally
// reads as a set.
//
// ── NO PARTNER LOGOS ARE DRAWN ──
//
// The old set had a recognisable Minecraft grass block and a Roblox tile —
// reproductions of other companies' marks on a piece of advertising. The names
// stay on the poster as TEXT, which is nominative use and is how you are
// allowed to say what you teach; the icons beside them are generic, so they
// read as "block-building games" without impersonating either brand.
//
// Drawn on a 64 grid, flat, one idea each: read at 44–88px on a busy field,
// where a detailed drawing turns to mush.
import React from "react";

const box = { viewBox: "0 0 64 64", xmlns: "http://www.w3.org/2000/svg" };
const INK = "var(--icon-ink, #0b2a5b)";

/* ---------- the date pill ---------- */

/* The calendar carries THE ACTUAL DATE. A generic grid of dots is a picture of
 * a calendar; a calendar reading 23 is a second, silent statement of the one
 * number on the poster that matters. `day` is passed down from the component
 * so it can never drift from the date beside it. */
export const Calendar = ({ day = "23" }) => (
  <svg {...box}>
    <rect x="5" y="12" width="54" height="47" rx="7" fill="currentColor" />
    <rect x="5" y="12" width="54" height="15" rx="7" fill={INK} />
    <rect x="5" y="20" width="54" height="7" fill={INK} />
    <rect x="15" y="4" width="8" height="15" rx="4" fill={INK} />
    <rect x="41" y="4" width="8" height="15" rx="4" fill={INK} />
    <text x="32" y="51" textAnchor="middle" fill={INK}
          fontFamily="Fredoka, Poppins, sans-serif" fontWeight="700" fontSize="26">
      {day}
    </text>
  </svg>
);

export const Clock = () => (
  <svg {...box}>
    <circle cx="32" cy="32" r="27" fill="currentColor" />
    <circle cx="32" cy="32" r="27" fill="none" stroke={INK} strokeWidth="4" />
    <path d="M32 15v18l11 6.5" fill="none" stroke={INK} strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- the tabs ---------- */

export const Gamepad = () => (
  <svg {...box}>
    <path d="M19 20h26c8.3 0 15 6.7 15 15v6.5c0 5-4 9-9 9-3.6 0-6.2-1.9-8-5H21c-1.8 3.1-4.4 5-8 5-5 0-9-4-9-9V35c0-8.3 6.7-15 15-15z"
          fill="currentColor" />
    <rect x="12" y="31.5" width="15" height="5" rx="2.5" fill={INK} />
    <rect x="17" y="26.5" width="5" height="15" rx="2.5" fill={INK} />
    <circle cx="45" cy="30" r="3.6" fill={INK} />
    <circle cx="52.5" cy="37.5" r="3.6" fill={INK} />
  </svg>
);

export const Gift = () => (
  <svg {...box}>
    <rect x="7" y="27" width="50" height="31" rx="5" fill="currentColor" />
    <rect x="4" y="17" width="56" height="12" rx="4" fill="currentColor" />
    <rect x="27" y="17" width="10" height="41" fill={INK} />
    <path d="M32 17c-6-9-18-10-18-3 0 5 9 6 18 3zM32 17c6-9 18-10 18-3 0 5-9 6-18 3z"
          fill="currentColor" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
  </svg>
);

/* PRIZES and GIVEAWAYS were both drawing Gift — two adjacent tabs carrying the
 * identical picture, which makes them read as one thing said twice. A trophy
 * is what you win and a parcel is what you are handed, and that is the actual
 * difference between the two tabs. */
export const Trophy = () => (
  <svg {...box}>
    <path d="M20 7h24v15c0 6.6-5.4 12-12 12s-12-5.4-12-12z" fill="currentColor" />
    <path d="M20 11h-8v5.5c0 5.2 3.4 8.5 8.5 8.5M44 11h8v5.5c0 5.2-3.4 8.5-8.5 8.5"
          fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M28 34h8v10h-8z" fill="currentColor" />
    <rect x="17" y="44" width="30" height="6" rx="3" fill="currentColor" />
    <rect x="12" y="50" width="40" height="8" rx="4" fill="currentColor" />
    <circle cx="32" cy="19" r="5" fill={INK} />
  </svg>
);

/* A knight, because it is the piece a seven-year-old can name on sight. The
 * old drawing was a pawn-shaped blob that read as a chess piece only because
 * the word CHESS was next to it. */
export const Chess = () => (
  <svg {...box}>
    <path d="M41 13c-4.2-4.4-9.6-6.6-15-6.6l-2.2 5.4-7.2 4.2c-3.2 1.9-5.2 5.3-5.2 9V33l7.4-3.2 2.2-4.4 5.2 2.2-8.4 9.4c-2.2 2.4-3.4 5.6-3.4 8.8V48h29v-6.4c0-9.6-1-17-2.2-21.2-.2-3.2-.8-5.6-2.2-7.4z"
          fill="currentColor" />
    <circle cx="35.5" cy="19.5" r="2.2" fill={INK} />
    <rect x="15" y="47" width="34" height="6" rx="3" fill="currentColor" />
    <rect x="10" y="53" width="44" height="7" rx="3.5" fill="currentColor" />
  </svg>
);

export const Bag = () => (
  <svg {...box}>
    <path d="M11 20h42l4.2 34.4c.4 3.2-2.1 6-5.3 6H12.1c-3.2 0-5.7-2.8-5.3-6z"
          fill="currentColor" />
    <path d="M22 24V17c0-5.5 4.5-10 10-10s10 4.5 10 10v7" fill="none" stroke="currentColor"
          strokeWidth="5" strokeLinecap="round" />
    <circle cx="21" cy="31" r="3.4" fill={INK} />
    <circle cx="43" cy="31" r="3.4" fill={INK} />
  </svg>
);

/* ---------- the programs row ---------- */

export const Laptop = () => (
  <svg {...box}>
    <rect x="8" y="11" width="48" height="33" rx="4" fill="currentColor" />
    <rect x="12.5" y="15.5" width="39" height="24" rx="2" fill={INK} />
    <path d="M25 22l-6 5.5 6 5.5M39 22l6 5.5-6 5.5M35.5 20l-7 15"
          fill="none" stroke="currentColor" strokeWidth="3.2"
          strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 48h58l-2.6 4.6c-.7 1.2-2 1.9-3.4 1.9H9c-1.4 0-2.7-.7-3.4-1.9z"
          fill="currentColor" />
  </svg>
);

/* A voxel cube — the shape of block-building games, not any one game's block.
 * Three faces at three lightnesses is what makes a hexagon read as a solid. */
export const Cube = () => (
  <svg {...box}>
    <path d="M32 6l24 12.5L32 31 8 18.5z" fill="currentColor" />
    <path d="M8 18.5L32 31v25L8 43.5z" fill="currentColor" opacity=".72" />
    <path d="M56 18.5L32 31v25l24-12.5z" fill="currentColor" opacity=".42" />
    <path d="M32 6l24 12.5L32 31 8 18.5zM32 31v25M8 18.5v25L32 56M56 18.5v25L32 56"
          fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

/* Four studded tiles — "a world made out of parts". The old one was a single
 * rounded square with a hole in it, which read as nothing at all. */
export const Blocks = () => (
  <svg {...box}>
    <rect x="6" y="6" width="24" height="24" rx="4" fill="currentColor" />
    <rect x="34" y="6" width="24" height="24" rx="4" fill="currentColor" opacity=".55" />
    <rect x="6" y="34" width="24" height="24" rx="4" fill="currentColor" opacity=".55" />
    <rect x="34" y="34" width="24" height="24" rx="4" fill="currentColor" />
    <circle cx="18" cy="18" r="4" fill={INK} />
    <circle cx="46" cy="46" r="4" fill={INK} />
  </svg>
);

/* A printer mid-print: gantry, nozzle, and an object growing on the bed. The
 * old one had the letters "3D" set inside it, which is a label pretending to
 * be a drawing — and the words "3D PRINTING" are already underneath. */
/* AN OPEN-FRONTED GANTRY, not a box. The first drawing put a closed rectangle
 * round the whole mechanism and at 84px that reads as a monitor with a
 * triangle on it — which is exactly what it looked like next to the word
 * CODING and a laptop. Two uprights and a top rail is the silhouette people
 * actually recognise as a 3D printer, and it leaves the nozzle and the object
 * on the bed as the only things inside. */
export const Printer = () => (
  <svg {...box}>
    {/* uprights + top rail */}
    <rect x="6" y="6" width="6" height="42" rx="3" fill="currentColor" />
    <rect x="52" y="6" width="6" height="42" rx="3" fill="currentColor" />
    <rect x="6" y="6" width="52" height="6" rx="3" fill="currentColor" />
    {/* the gantry and its nozzle, part-way down its travel */}
    <rect x="12" y="19" width="40" height="5" rx="2.5" fill="currentColor" />
    <path d="M32 24v5l-3 3h6l-3-3z" fill="currentColor" />
    {/* the object growing on the bed, printed in the lighter tone */}
    <path d="M22 42l10-11 10 11z" fill="currentColor" opacity=".55" />
    <rect x="12" y="42" width="40" height="6" rx="3" fill="currentColor" />
    <rect x="18" y="53" width="28" height="6" rx="3" fill="currentColor" opacity=".5" />
  </svg>
);

/* ---------- footer ---------- */

export const Pin = () => (
  <svg {...box}>
    <path d="M32 4c-10.5 0-19 8.5-19 19 0 14 19 37 19 37s19-23 19-37c0-10.5-8.5-19-19-19z"
          fill="currentColor" />
    <circle cx="32" cy="23" r="7.5" fill={INK} />
  </svg>
);

export const Phone = () => (
  <svg {...box}>
    <path d="M23 18c2 0 3 1 4 3l2 4c1 2 0 3-1 4l-2 2c2 5 6 9 11 11l2-2c1-1 2-2 4-1l4 2c2 1 3 2 3 4 0 4-3 7-7 7C29 52 12 35 12 21c0-4 3-7 7-7z"
          fill="currentColor" />
  </svg>
);

/** Slot key → drawn icon. Anything not listed renders nothing. */
const FALLBACKS = {
  calendar: Calendar,
  clock: Clock,
  pin: Pin,
  phone: Phone,
  games: Gamepad,
  prizes: Trophy,
  chess: Chess,
  giveaways: Gift,
  more: Bag,
  coding: Laptop,
  minecraft: Cube,
  roblox: Blocks,
  printing: Printer,
};

export default FALLBACKS;
