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
  title = ["OPEN", "HOUSE!"],
  banner = ["COME EXPLORE. PLAY.", "WIN!"],

  // ONE STRING, so nobody can update the weekday and leave the number. Note
  // that August 23 2026 is a SUNDAY — see the note at the call site.
  date = "SAT, AUG 23",
  // The numeral the calendar icon prints on its own face, kept beside the date
  // it is drawn from rather than hard-coded into the icon.
  dateNum = "23",
  time = "1:00 PM",

  // Right-hand tabs. `key` names the art slot; `tone` picks the colour.
  tabs = [
    { key: "games", tone: "violet", title: "GAMES", line: "Play & Explore!" },
    { key: "prizes", tone: "green", title: "PRIZES", line: "Win Awesome Prizes!" },
    // One line, like the other four. Any longer and it wraps, which puts this
    // tab's text block a line taller than its neighbours' and breaks the
    // rhythm of five identical bars — the same reason the head is no longer
    // "CHESS TOURNAMENT".
    { key: "chess", tone: "blue", title: "CHESS", line: "Tournament all day!" },
    { key: "giveaways", tone: "orange", title: "GIVEAWAYS", line: "Fun for Everyone!" },
    { key: "more", tone: "yellow", title: "AND MORE!", line: "Bring your friends along!" },
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
const CONFETTI = [
  /* The first three of these used to sit at [4,2], [13,8] and [2,12] — right
   * on top of the handwritten note, which occupies x2-16% / y1-16%. Paper
   * confetti scattered across the one piece of handwriting on the sheet reads
   * as dirt, not as celebration. Moved into the clear gutter below it. */
  [1, 20, 20, 10, -18, "#f9d81d"], [17, 17, 15, 15, 34, "#7a2bbd"],
  [21, 1, 19, 9, 12, "#4ea936"], [30, 6, 14, 14, -40, "#ef7c18"],
  [46, 0, 21, 10, 22, "#0172ec"], [55, 5, 15, 15, -12, "#e4002b"],
  [63, 2, 18, 9, 48, "#f9d81d"], [72, 7, 14, 14, -28, "#4ea936"],
  [80, 1, 20, 10, 16, "#7a2bbd"], [88, 6, 16, 16, -44, "#ef7c18"],
  [95, 11, 18, 9, 30, "#0172ec"], [2, 30, 15, 15, 8, "#4ea936"],
  [10, 18, 18, 9, -22, "#0172ec"], [92, 17, 19, 10, 40, "#f9d81d"],
  [6, 26, 13, 13, 18, "#f9d81d"], [86, 26, 16, 8, -30, "#4ea936"],
  [97, 33, 14, 14, 24, "#7a2bbd"], [1, 34, 17, 8, -14, "#ef7c18"],
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
