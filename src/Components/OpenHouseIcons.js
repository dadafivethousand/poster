// OpenHouseIcons.js — the drawn icon set for the open house poster.
//
// These are not placeholders any more. They are the poster's actual icons, and
// they are drawn here rather than sourced so the whole sheet is one file with
// no image dependencies to go missing before a print run. Every one is still
// overridable by passing a src for that slot, so licensed artwork remains one
// prop away.
//
// ── TWO INKS, AND THAT IS THE POINT ──
//
// Every icon is drawn in exactly `--lime` and white on transparent, because
// they sit in a row and a row of icons in eight colours is a row of stickers,
// not a set. The previous set was sampled per-icon off a reference — a brown
// dirt block, a green calendar, a purple clock, a blue printer — and the row
// read as clip art gathered from four places, which is exactly what it was.
//
// ── NO PARTNER LOGOS ARE DRAWN HERE, DELIBERATELY ──
//
// The old set had a Minecraft grass block and a Roblox tile: recognisable
// reproductions of other companies' marks on a piece of advertising, which is
// the kind of thing that is fine right up until it is not. The names are still
// on the poster as TEXT, which is nominative use and is how you are allowed to
// say what you teach. The icons beside them are generic — a voxel cube, a
// stacked-block tile — so they read as "building-block games" without
// impersonating either brand.
//
// Drawn on a 64-unit grid, flat, one idea each: they are read at ~52px on a
// dark field, where a detailed drawing turns to mush.
import React from "react";

const box = { viewBox: "0 0 64 64", xmlns: "http://www.w3.org/2000/svg" };

const LIME = "#c1d931";
const WHITE = "#ffffff";

/* ---------- the activity row ---------- */

export const Laptop = () => (
  <svg {...box}>
    <rect x="8" y="11" width="48" height="33" rx="4" fill={WHITE} />
    <rect x="12.5" y="15.5" width="39" height="24" rx="2" fill="#06214a" />
    {/* </> — the one universally read symbol for "code" */}
    <path d="M25 22l-6 5.5 6 5.5M39 22l6 5.5-6 5.5M35.5 20l-7 15"
          fill="none" stroke={LIME} strokeWidth="3.2"
          strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 48h58l-2.6 4.6c-.7 1.2-2 1.9-3.4 1.9H9c-1.4 0-2.7-.7-3.4-1.9z"
          fill={LIME} />
  </svg>
);

/* A voxel cube — the shape of block-building games, not any one game's block. */
export const Cube = () => (
  <svg {...box}>
    <path d="M32 6l24 12.5L32 31 8 18.5z" fill={LIME} />
    <path d="M8 18.5L32 31v25L8 43.5z" fill={WHITE} opacity=".92" />
    <path d="M56 18.5L32 31v25l24-12.5z" fill={WHITE} opacity=".55" />
    <path d="M32 6l24 12.5L32 31 8 18.5z" fill="none" stroke="#06214a"
          strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/* Stacked tiles — "make a world out of parts", again with nobody's logo in it. */
export const Blocks = () => (
  <svg {...box}>
    <rect x="7" y="7" width="23" height="23" rx="4" fill={WHITE} />
    <rect x="34" y="7" width="23" height="23" rx="4" fill={LIME} />
    <rect x="7" y="34" width="23" height="23" rx="4" fill={LIME} />
    <rect x="34" y="34" width="23" height="23" rx="4" fill={WHITE} opacity=".55" />
  </svg>
);

export const Printer = () => (
  <svg {...box}>
    <rect x="7" y="7" width="50" height="40" rx="5" fill="none" stroke={WHITE}
          strokeWidth="4.5" />
    {/* the nozzle and its gantry */}
    <rect x="15" y="16" width="34" height="6" rx="3" fill={WHITE} />
    <path d="M32 22v7" stroke={WHITE} strokeWidth="5" strokeLinecap="round" />
    {/* the object growing on the bed */}
    <path d="M22 40l10-8 10 8z" fill={LIME} />
    <rect x="15" y="40" width="34" height="5" rx="2.5" fill={LIME} />
    <rect x="19" y="52" width="26" height="6" rx="3" fill={WHITE} opacity=".55" />
  </svg>
);

export const Chess = () => (
  <svg {...box}>
    {/* a knight, because it is the piece a seven-year-old can name */}
    <path d="M40 12c-4-4-9-6-14-6l-2 5-7 4c-3 1.6-5 4.8-5 8.3V32l7-3 2-4 5 2-8 9c-2 2.2-3 5-3 8v3h27v-6c0-9-1-16-2-20 0-4-.6-7-2-9z"
          fill={LIME} />
    <circle cx="35" cy="19" r="2" fill="#06214a" />
    <rect x="11" y="52" width="42" height="7" rx="3.5" fill={WHITE} />
    <rect x="16" y="45" width="32" height="6" rx="3" fill={WHITE} opacity=".7" />
  </svg>
);

/* ---------- the strip ---------- */

export const Trophy = () => (
  <svg {...box}>
    <path d="M20 8h24v14c0 7-5.4 12-12 12s-12-5-12-12z" fill={LIME} />
    <path d="M20 12h-7v5c0 5 3 8 8 8M44 12h7v5c0 5-3 8-8 8"
          fill="none" stroke={WHITE} strokeWidth="4" strokeLinecap="round" />
    <path d="M28 34h8v9h-8z" fill={WHITE} />
    <rect x="18" y="43" width="28" height="7" rx="3.5" fill={WHITE} />
  </svg>
);

export const Gift = () => (
  <svg {...box}>
    <rect x="8" y="26" width="48" height="30" rx="4" fill={WHITE} />
    <rect x="5" y="17" width="54" height="11" rx="4" fill={WHITE} />
    <rect x="27.5" y="17" width="9" height="39" fill={LIME} />
    <path d="M32 17c-6-8.5-17-9.5-17-3 0 4.7 8.5 5.7 17 3zM32 17c6-8.5 17-9.5 17-3 0 4.7-8.5 5.7-17 3z"
          fill={LIME} />
  </svg>
);

export const Team = () => (
  <svg {...box}>
    <circle cx="23" cy="21" r="9" fill={WHITE} />
    <path d="M6 52c0-9.4 7.6-17 17-17s17 7.6 17 17z" fill={WHITE} />
    <circle cx="44" cy="24" r="7.5" fill={LIME} />
    <path d="M31 52c0-7.2 5.8-13 13-13s13 5.8 13 13z" fill={LIME} />
  </svg>
);

/* ---------- footer ---------- */

export const Pin = () => (
  <svg {...box}>
    <path d="M32 4c-10.5 0-19 8.5-19 19 0 14 19 37 19 37s19-23 19-37c0-10.5-8.5-19-19-19z"
          fill={LIME} />
    <circle cx="32" cy="23" r="7.5" fill="#06214a" />
  </svg>
);

export const Phone = () => (
  <svg {...box}>
    <path d="M23 18c2 0 3 1 4 3l2 4c1 2 0 3-1 4l-2 2c2 5 6 9 11 11l2-2c1-1 2-2 4-1l4 2c2 1 3 2 3 4 0 4-3 7-7 7C29 52 12 35 12 21c0-4 3-7 7-7z"
          fill={LIME} />
  </svg>
);

/** Slot key → drawn icon. Anything not listed renders nothing. */
const FALLBACKS = {
  coding: Laptop,
  minecraft: Cube,
  roblox: Blocks,
  printing: Printer,
  chess: Chess,
  prizes: Trophy,
  giveaways: Gift,
  team: Team,
  pin: Pin,
  phone: Phone,
};

export default FALLBACKS;
