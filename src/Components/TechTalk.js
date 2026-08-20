// TechTalk.js — Instagram post for the Staples × Code Ninjas Tech Talk.
//
// Follows the "Connecting through coding" template the user supplied: a
// photograph filling the top with its bottom edge swept into a shallow arc, a
// white panel carrying the headline in black and Staples red, and the red
// bracket and base rule that close the frame. Everything else is rebuilt
// rather than copied, because the template is a flattened PNG.
//
// Three things this adds over the template:
//   - the event's substance, as bullets, which the template has no slot for
//   - the Staples Tech Talk mark, sat on the seam like an applied sticker
//   - the real two-mark lockup at the foot, assembled from the official
//     artwork with the proportions used in ../animations/StaplesLockupAd
//
// TONE. The source description read as a children's-party invitation ("fun,
// hands-on adventure", "learn, explore, and play"). The subject is genuinely
// technical — game AI, agent behaviour, computer vision — so the copy here
// describes the work rather than the fun. It is written to be read by a parent
// deciding whether this is worth their Saturday, and to sit under a Staples
// masthead without embarrassing anyone.
import React from "react";
import "../Stylesheets/TechTalk.css";
import photo from "../Images/staples-cn-team.jpg";
import techTalk from "../Images/tech-talk.png";
import staplesLogo from "../Images/staples-easy-logo.png";
import cnLogo from "../Images/cn-logo-horizontal.svg";

export default function TechTalk({
  eyebrow = "TECH TALK · AUGUST 19, 2026",
  headline = ["Where AI meets", "game development"],
  bullets = [
    "How game AI drives character behaviour and decision-making",
    "Computer vision — teaching a game to interpret what it sees",
    "Practical applications of AI across the development pipeline",
    "The logic, problem-solving and JavaScript underneath it all",
  ],
}) {
  return (
    <div className="pf-stage tt">
      {/* ---- photograph, swept into the arc the template uses ---- */}
      <div className="tt-photo">
        <img src={photo} alt="" />
      </div>

      {/* Sat on the seam rather than inside either panel, so it reads as an
          applied mark and ties the two halves together. */}
      <img className="tt-badge" src={techTalk} alt="Staples Tech Talk" />

      <div className="tt-panel">
        <p className="tt-eyebrow">{eyebrow}</p>

        <h1 className="tt-head">
          {headline[0]}
          <br />
          <span className="tt-head-b">{headline[1]}</span>
        </h1>

        <ul className="tt-list">
          {bullets.map((b) => (
            <li key={b}>
              <span className="tt-tick" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              {b}
            </li>
          ))}
        </ul>

        {/* The partner lockup, assembled from the official artwork rather than
            used as one flat image. The proportions — 42.9% / 48.4% either side
            of a hairline — are measured off approved print artwork in the
            sibling repo, not chosen here. */}
        <div className="tt-lock">
          <img className="tt-lock-s" src={staplesLogo} alt="Staples" />
          <span className="tt-lock-bar" aria-hidden />
          <img className="tt-lock-c" src={cnLogo} alt="Code Ninjas" />
        </div>
      </div>

      <span className="tt-bracket" aria-hidden />
      <span className="tt-base" aria-hidden />
    </div>
  );
}
