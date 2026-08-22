// OpenHouse.js — Code Ninjas Woodbridge open house, recreated from
// ~/Downloads/"Aug 21, 2026 at 03_33_15 PM.png".
//
// EVERY PICTURE IS A SLOT. The original is dense with artwork — a mascot, a
// photo, a QR code and thirteen icons — and hand-drawing that in SVG is both
// slow and worse than the real thing. So the layout, type and colour are CSS
// and every image is a prop: pass a src and it renders, leave it out and you
// get a labelled dashed box sized and positioned exactly where the artwork
// goes. Nothing has to be redrawn to see whether the composition works.
//
// Drop files into src/Images/ and pass them in from src/App.js:
//
//   <OpenHouse art={{ games: gamesPng, prizes: prizesPng, ... }} />
//
// The Code Ninjas lockup and the ninja figure default to the repo's own
// assets, so those two are already filled in.
import React from "react";
import "../Stylesheets/OpenHouse.css";
import cnLogo from "../Images/cn-logo-horizontal.svg";
import ninjaFigure from "../Images/cn-ninja-figure.png";
// THE QR WAS BLANK IN EVERY EXPORT. `a.qr` had no default, so the slot fell
// through to reserved-empty and printed as a white square with "SCAN ME!"
// over it — the only element on the sheet that converts a passer-by, rendering
// as nothing. Generated with segno at error-correction level H, which tolerates
// ~30% of the symbol being unreadable: this ends up taped to a plaza window and
// photographed at an angle.
import qrCode from "../Images/qr-cnwoodbridge.svg";
import FALLBACKS from "./OpenHouseIcons";

/**
 * A supplied image, else a drawn fallback, else reserved space.
 *
 * The fallback is what stops an unfilled poster reading as a wireframe. It is
 * a floor and not a decision — pass a src for that slot and it is gone.
 */
function Slot({ src, name, className = "", alt = "", pass }) {
  if (src) return <img className={`oh-slot ${className}`} src={src} alt={alt} />;
  const Fallback = FALLBACKS[name];
  if (Fallback) {
    return (
      <span className={`oh-slot oh-slot--drawn ${className}`} aria-hidden>
        <Fallback {...pass} />
      </span>
    );
  }
  return <span className={`oh-slot oh-slot--empty ${className}`} aria-hidden />;
}

export default function OpenHouse({
  script = ["Turn", "Screen Time", "into", "Skill Time!"],
  // "KIDS &" was true of every kids' event ever printed. The age range is the
  // fact that decides whether a parent walking past is the audience, and it
  // costs nothing to put it in the line that was already there.
  burst = ["FUN FOR", "KIDS 5–14", "& FAMILIES!"],
  title = ["OPEN", "HOUSE"],
  // THE EVENT IS TWO EVENTS. It was billed as an open house alone, which sold
  // the chess tournament as a line inside a chip nobody was going to read.
  // The exclamation moved to the end of the whole name rather than sitting in
  // the middle of it — "OPEN HOUSE! & CHESS TOURNAMENT" punctuates a clause
  // that has not finished.
  subtitle = "& CHESS TOURNAMENT!",
  banner = ["COME EXPLORE. PLAY.", "WIN!"],

  // ONE STRING, so nobody can update the weekday and leave the number.
  //
  // AUGUST 30 2026 IS A SUNDAY. The sheet had carried "SAT, AUG 23" through
  // several passes; the number has now been corrected to the 30th, and the 30th
  // is a Sunday exactly as the 23rd was — two separate dates from the centre,
  // both Sundays, against a weekday that never moved. The weekday is the part
  // that was stale, so it now reads SUN and the two agree.
  //
  // If the event is in fact on the SATURDAY, it is Aug 29, not Aug 30: change
  // both halves of this string and `dateNum` together.
  date = "SUN, AUG 30",
  // The numeral the calendar icon prints on its own face, kept beside the date
  // it is drawn from rather than hard-coded into the icon.
  dateNum = "30",
  time = "1:00 PM – 2:00 PM",

  // Right-hand tabs. `key` names the art slot; `tone` picks the colour.
  // SHORT LINES. On the square sheet these were full-width bars with room for
  // a sentence; on a 9:16 reel they are five chips across one row, and a chip
  // 180 units wide holds two or three words. Everything cut was filler anyway
  // — "Win Awesome Prizes!" under the word PRIZES is the same word twice.
  tabs = [
    { key: "games", tone: "violet", title: "GAMES", line: "Play & explore" },
    { key: "prizes", tone: "green", title: "PRIZES", line: "All afternoon" },
    { key: "chess", tone: "blue", title: "CHESS", line: "Tournament" },
    { key: "giveaways", tone: "orange", title: "GIVEAWAYS", line: "For everyone" },
    { key: "more", tone: "yellow", title: "AND MORE", line: "Come and see" },
  ],

  programs = [
    { key: "coding", title: "CODING", line: "Build cool\nprojects!" },
    { key: "minecraft", title: "MINECRAFT®", line: "Create &\nExplore Worlds!" },
    { key: "roblox", title: "ROBLOX®", line: "Design games\n& adventure!" },
    { key: "printing", title: "3D PRINTING", line: "See ideas come\nto life!" },
  ],

  checks = ["MEET THE TEAM", "TOUR THE CENTRE", "SEE OUR PROGRAMS"],

  centre = "CODE NINJAS WOODBRIDGE",
  address = "6175 Hwy 7, Woodbridge, ON",
  // The centre is NOT in Market Lane Plaza — that line was wrong and is gone.
  // The prop stays so a real plaza or unit number can be put back without
  // touching the markup; empty renders nothing rather than an empty line box.
  plaza = "",
  phone = "647-887-9940",

  // Artwork. Anything omitted renders as a labelled slot.
  art = {},
}) {
  const a = { logo: cnLogo, mascot: ninjaFigure, qr: qrCode, ...art };

  return (
    <div className="pf-stage oh">
      <div className="oh-field" aria-hidden />
      {/* A CHESSBOARD IN PERSPECTIVE, lying under the whole sheet and running
          off the bottom edge. Two jobs at once: it says "tournament" before a
          word is read, and it fills the lower third, which the reel safe area
          reserves for Instagram's own furniture and which was otherwise flat
          navy. */}
      <div className="oh-chess-board" aria-hidden />
      <Confetti />

      {/* ---------- top band ---------- */}
      <div className="oh-sheet" aria-hidden />

      <p className="oh-script">
        {script.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </p>

      <img className="oh-logo" src={a.logo} alt="Code Ninjas" />
      <p className="oh-centre-name">WOODBRIDGE</p>

      <div className="oh-burst">
        <span>
          {burst.map((l, i) => (
            <b key={i}>{l}</b>
          ))}
        </span>
      </div>

      {/* ---------- headline ---------- */}
      <h1 className="oh-title">
        <span className="oh-title-a">{title[0]}</span>
        <span className="oh-title-b">{title[1]}</span>
        <span className="oh-title-c">{subtitle}</span>
      </h1>

      {/* The `kids` photo slot that used to sit here reserved 271×258 of the
          top-right quadrant and rendered nothing, because no photograph was
          ever supplied. A hole that has been empty through every export is not
          a placeholder, it is a hole — the space now belongs to the headline
          and the starburst, which both had too little room. Pass
          `art={{ kids: photo }}` and it comes back. */}
      {/* THE POOL IS NOT DECORATION. The mascot artwork is a near-black figure
          with a thin cyan rim, and on this navy field his body and legs simply
          disappear — he read as a floating head and a white belt. CLAUDE.md's
          rule for the logo applies to him unchanged: light the mark, don't
          recolour it. A blurred pool of light behind him separates the
          silhouette without touching the artwork. */}
      <span className="oh-mascot-pool" aria-hidden />
      <Slot src={a.mascot} name="mascot" className="oh-mascot" />

      <p className="oh-banner">
        {banner[0]} <b>{banner[1]}</b>
      </p>

      {/* ---------- when ---------- */}
      <div className="oh-when">
        <Slot src={a.calendar} name="calendar" className="oh-when-icon"
              pass={{ day: dateNum }} />
        <span className="oh-when-date">{date}</span>
        <Slot src={a.clock} name="clock" className="oh-when-icon" />
        <span className="oh-when-time">{time}</span>
      </div>

      {/* ---------- right-hand tabs ---------- */}
      <div className="oh-tabs">
        {tabs.map((t) => (
          <div className={`oh-tab oh-tab--${t.tone}`} key={t.key}>
            <Slot src={a[t.key]} name={t.key} className="oh-tab-icon" />
            <span className="oh-tab-text">
              <b>{lines(t.title)}</b>
              <i>{lines(t.line)}</i>
            </span>
          </div>
        ))}
      </div>

      {/* ---------- programs ---------- */}
      <div className="oh-programs">
        {programs.map((p) => (
          <div className="oh-program" key={p.key}>
            <Slot src={a[p.key]} name={p.key} className="oh-program-icon" />
            <b>{p.title}</b>
            <i>{lines(p.line)}</i>
          </div>
        ))}
      </div>

      {/* ---------- checks ---------- */}
      <div className="oh-checks">
        {checks.map((c) => (
          <span key={c}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m4 13 5.5 5.5L20 6" />
            </svg>
            {c}
          </span>
        ))}
      </div>

      {/* ---------- footer ---------- */}
      <div className="oh-foot">
        <Slot src={a.pin} name="pin" className="oh-foot-icon" />
        <span className="oh-foot-addr">
          <b>{centre}</b>
          <i>{address}</i>
          {plaza ? <em>{plaza}</em> : null}
        </span>

        <span className="oh-foot-rule" aria-hidden />

        <Slot src={a.phone} name="phone" className="oh-foot-icon" />
        <span className="oh-foot-tel">{phone}</span>

        <span className="oh-qr">
          <b>SCAN ME!</b>
          <Slot src={a.qr} name="QR" className="oh-qr-img" />
        </span>
      </div>
    </div>
  );
}

/** "A\nB" → A<br/>B, so a tab or a program can carry two lines from one prop. */
function lines(text) {
  return String(text)
    .split("\n")
    .map((l, i, all) => (
      <React.Fragment key={i}>
        {l}
        {i < all.length - 1 && <br />}
      </React.Fragment>
    ));
}

/* Paper confetti round the top edge. Positions are fixed rather than random so
 * the poster renders identically every time — an export that differs run to
 * run cannot be checked against anything. */
/* Confetti, spread over a 9:16 sheet.
 *
 * The percentages are of the CANVAS, so the square layout's positions all
 * bunched into the top half the moment the canvas got taller. This set is
 * distributed down the whole frame, and it keeps out of three places: the
 * handwritten note (x2-24% / y22-34%), the starburst, and the type inside the
 * white slab. Pieces below y78% are under the app's own furniture on a reel —
 * they are there so the reserved band is a field rather than a flat rectangle,
 * and losing them costs nothing.
 *
 * Fixed rather than random so the export is identical run to run; a poster
 * that differs between renders cannot be checked against anything. */
const CONFETTI = [
  [21, 1, 19, 9, 12, "#f9d81d"], [31, 6, 15, 15, -34, "#4ea936"],
  [43, 2, 17, 8, 22, "#0172ec"], [55, 5, 13, 13, -40, "#e4002b"],
  [66, 1, 20, 10, 16, "#ef7c18"], [74, 7, 15, 15, 30, "#7a2bbd"],
  [88, 6, 17, 8, 44, "#4ea936"], [95, 11, 14, 14, -20, "#0172ec"],
  [3, 4, 16, 8, -18, "#7a2bbd"], [11, 9, 13, 13, 34, "#ef7c18"],
  [2, 19, 18, 9, 26, "#f9d81d"], [97, 19, 15, 7, -30, "#e4002b"],
  [2, 30, 14, 14, 14, "#4ea936"], [96, 33, 17, 8, -24, "#f9d81d"],
  [4, 44, 13, 13, 40, "#7a2bbd"], [95, 47, 16, 8, 18, "#0172ec"],
  [1, 57, 15, 7, -36, "#ef7c18"], [97, 60, 13, 13, 22, "#4ea936"],
  [6, 82, 17, 8, -14, "#0172ec"], [92, 85, 14, 14, 32, "#f9d81d"],
  [24, 90, 15, 7, 20, "#7a2bbd"], [70, 93, 16, 8, -26, "#4ea936"],
  [47, 88, 13, 13, 38, "#ef7c18"], [83, 96, 15, 7, -18, "#0172ec"],
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
