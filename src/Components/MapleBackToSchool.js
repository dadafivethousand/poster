// MapleBackToSchool.js — Maple Jiu Jitsu back-to-school offer, Instagram post.
//
// Recreated from ~/Downloads/"maple back to school special.PNG", which had no
// source. Deep navy field, the leaf mark up top, a stacked condensed headline
// with SPECIAL knocked out of a white slab, a bonus-value roundel, three
// numbered offer cards and the sign-up block.
//
// The two product shots in the original — a branded gi and branded gloves —
// are EMOJI here at the user's direction. That is a deliberate trade: the
// photographs carried Maple patches, so reproducing them would mean sourcing
// and retouching artwork for a post that reads fine with a glyph. It also
// keeps the sheet self-contained: no photography to re-license or re-shoot
// when a value changes.
//
// EVERY NUMBER IS A PROP. $120, $50, $169, "over $300", the address and the
// domain are the club's claims, not this file's. The three values sum to $339,
// which is what "over $300" is standing on — change one and check the other
// still holds.
import React from "react";
import "../Stylesheets/MapleBackToSchool.css";
import mapleLogo from "../Images/maple-logo.png";
import cnLogo from "../Images/cn-logo-horizontal.svg";

export default function MapleBackToSchool({
  headline = ["BACK TO", "SCHOOL"],
  emphasis = "SPECIAL",
  badge = ["OVER", "$300", "IN BONUS", "VALUE"],
  eyebrow = "For New Kids Signups",

  cards = [
    { big: "FREE GI", small: [], value: "($120 Value)", emoji: "🥋" },
    { big: "FREE", small: ["BOXING GLOVES"], value: "($50 Value)", emoji: "🥊" },
    {
      big: "FREE",
      small: ["MONTH OF", "CODE NINJAS", "WOODBRIDGE"],
      value: "($169 Value)",
      partner: true,
    },
  ],

  cta = "SIGN UP TODAY",
  site = "maplebjj.com",
  address = "20 Cranston Park Ave, Vaughan",
}) {
  return (
    <div className="pf-stage mb">
      <img className="mb-logo" src={mapleLogo} alt="Maple Jiu Jitsu" />

      {/* ---- headline. The roundel sits beside it rather than over it, so the
              two never fight for the same pixels at any string length. ---- */}
      <div className="mb-top">
        <h1 className="mb-head">
          {headline.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </h1>

        <div className="mb-badge" aria-hidden={false}>
          <span className="mb-badge-sm">{badge[0]}</span>
          <span className="mb-badge-lg">{badge[1]}</span>
          <span className="mb-badge-sm">{badge[2]}</span>
          <span className="mb-badge-sm">{badge[3]}</span>
        </div>
      </div>

      {/* Knocked out of a white slab — the one place on the sheet where the
          navy becomes the ink and the paper becomes the ground. */}
      <p className="mb-emph">
        <span>{emphasis}</span>
      </p>

      <p className="mb-eyebrow">
        <span>{eyebrow}</span>
      </p>

      <div className="mb-cards">
        {cards.map((c, i) => (
          <div
            className={`mb-card ${c.small.length ? "" : "mb-card--plain"}`}
            key={c.big + i}
          >
            <span className="mb-num">{i + 1}</span>
            <div className="mb-copy">
              <p className="mb-big">{c.big}</p>
              {c.small.length > 0 && (
                <p className="mb-small">
                  {c.small.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </p>
              )}
              <p className="mb-value">{c.value}</p>
            </div>

            <div className="mb-art">
              {c.partner ? (
                <span className="mb-cn">
                  <img src={cnLogo} alt="Code Ninjas" />
                  <em>WOODBRIDGE</em>
                </span>
              ) : (
                <span className="mb-emoji">{c.emoji}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mb-cta">
        <span>{cta}</span>
      </p>

      <p className="mb-site">
        <Globe />
        {site}
      </p>

      <p className="mb-addr">
        <Pin />
        {address}
      </p>
    </div>
  );
}

/* Drawn, not set as emoji: 🌐 and 📍 render full-colour on Apple platforms and
 * would be the only two coloured marks on a two-colour sheet. */
function Globe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="9.4" />
      <ellipse cx="12" cy="12" rx="4" ry="9.4" />
      <path d="M2.9 9h18.2M2.9 15h18.2" />
    </svg>
  );
}

function Pin() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z" />
    </svg>
  );
}
