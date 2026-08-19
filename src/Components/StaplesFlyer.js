// StaplesFlyer.js — the Staples × Code Ninjas $50-off handout.
//
// Reconstructed from ~/Downloads/staples-flyer-50-off-code-ninjas.pdf, which
// had no source file anywhere on the machine. The mascot is extracted out of
// that PDF; the palette is sampled from it, not eyeballed:
//
//   #e4002b  brand red      #123a5e  deep navy (pill, note block)
//   #16233a  ink            #2b7cb8  blue accent
//   #e6eef8  page           #d3deea  the bands behind coupon and cards
//   #7b8aa3  fine print
//
// Half-letter, 5.5×8.5in — prints two-up on a sheet and stacks on a counter.
//
// EVERY STRING IS A PROP. This is a real co-branded offer: a date, a dollar
// amount, a promo code and a legal footer that came from Staples. The FACTS
// are fixed — $50, $100, three months, October 31 2026, STAPLES2026, new
// members only, and the whole of `fine` — and nothing here invents one. Only
// the marketing lines around them are this file's to write.
import React from "react";
import "../Stylesheets/StaplesFlyer.css";
import staplesLogo from "../Images/staples-easy-logo.png";
import cnHead from "../Images/cn-head-mark.png";
import ninja from "../Images/ninja-wave.png";

export default function StaplesFlyer({
  kicker = "WHILE YOU'RE AT STAPLES",
  headline = ["Turn today's receipt into", "their first video game."],
  body =
    "Kids learn real JavaScript by building games they actually want to play — earning belts as they level up, the way a dojo works.",

  amount = "$50",
  amountWord = "OFF",
  offer = "your first 3 months at Code Ninjas",
  condition = "When you spend $100 or more at Staples",
  promoLabel = "Use promo code",
  promoCode = "STAPLES2026",
  terms = "Offer ends October 31, 2026 · new Code Ninjas members only",

  noteTitle = "Not quite at $100?",
  note =
    "A backpack, a set of headphones or the year's ink usually closes the gap — and turns a routine receipt into $50 off something they'll still be talking about in June.",

  // Label + line. The wording is the user's own from an earlier draft of this
  // flyer rather than anything invented here.
  features = [
    ["Real games", "They build and publish their own"],
    ["Real code", "JavaScript, one belt at a time"],
    ["Real progress", "White belt to black, at their pace"],
  ],

  cta = "Keep your receipt — bring it in with the code.",
  site = "codeninjas.com",
  fine =
    "Requires a $100+ (before tax) single-transaction in-store purchase at any Staples in Canada. New Code Ninjas members only. Applies to a 3-month membership paid in full. One redemption per customer per 3-month period. Cannot be combined with other offers. Offer valid through October 31, 2026. Redemption takes place at a participating Code Ninjas centre; participating centres and program availability vary. Staples® and the easy® button are trademarks of Staples, Inc.",
}) {
  return (
    <div className="pf-stage sf">
      {/* ---- co-brand lockup: two marks, one rule between them ---- */}
      <header className="sf-head">
        <img className="sf-staples" src={staplesLogo} alt="Staples easy" />
        <span className="sf-divide" aria-hidden />
        <span className="sf-cn">
          <img className="sf-cn-head" src={cnHead} alt="" />
          <span className="sf-cn-word">
            <b>CODE</b>NINJAS<sup>&reg;</sup>
          </span>
        </span>
      </header>

      {/* ---- hero: the pitch, with the mascot alongside ---- */}
      <section className="sf-hero">
        <div className="sf-hero-copy">
          <p className="sf-kicker">{kicker}</p>
          <h1 className="sf-headline">
            {headline[0]}
            <br />
            <span className="sf-headline-b">{headline[1]}</span>
          </h1>
          <p className="sf-body">{body}</p>
        </div>
        {/* Sized and inset to sit fully inside the card. Earlier passes ran the
            raised hand into the card's right edge, which reads as a printing
            error rather than as artwork breaking a frame on purpose. */}
        <div className="sf-ninja-wrap">
          <img className="sf-ninja" src={ninja} alt="" />
        </div>
      </section>

      {/* ---- the coupon: the one thing on the sheet that has to be seen ----
              A solid card with the cut line INSIDE it, rather than a dashed
              card edge: the dashes then read as a perforation to tear along
              instead of as a border someone drew. */}
      <section className="sf-band">
        <div className="sf-coupon">
          <span className="sf-notch sf-notch-l" aria-hidden />
          <span className="sf-notch sf-notch-r" aria-hidden />

          <div className="sf-cut">
            <p className="sf-amount">
              <span className="sf-amount-num">{amount}</span>
              <span className="sf-amount-word">{amountWord}</span>
            </p>
            <p className="sf-offer">{offer}</p>
            <p className="sf-condition">{condition}</p>
            <p className="sf-promo">
              <span className="sf-promo-label">{promoLabel}</span>
              <span className="sf-promo-code">{promoCode}</span>
            </p>
            <p className="sf-terms">{terms}</p>
          </div>
        </div>
      </section>

      {/* ---- the upsell ---- */}
      <section className="sf-note">
        <p className="sf-note-title">{noteTitle}</p>
        <p className="sf-note-body">{note}</p>
      </section>

      {/* ---- three proof points ---- */}
      <section className="sf-cards">
        {features.map(([title, line], i) => (
          <div className="sf-card" key={title}>
            <span className="sf-card-icon" aria-hidden>
              <Icon i={i} />
            </span>
            <p className="sf-card-title">{title}</p>
            <p className="sf-card-line">{line}</p>
          </div>
        ))}
      </section>

      <p className="sf-cta">{cta}</p>
      <p className="sf-site">{site}</p>
      <p className="sf-fine">{fine}</p>
    </div>
  );
}

/* Three glyphs for the proof points: a controller, angle brackets, a belt.
 * Drawn rather than set as emoji or a font — at this size an emoji renders as
 * a different typeface on every machine and prints muddy. */
function Icon({ i }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (i === 0)
    return (
      <svg {...common}>
        <path d="M7 12h4M9 10v4M15.5 12.5h.01M18 10.5h.01" />
        <path d="M17.5 6h-11A4.5 4.5 0 0 0 2 10.5v3A4.5 4.5 0 0 0 6.5 18c1.4 0 2-.7 2.7-1.5h5.6c.7.8 1.3 1.5 2.7 1.5a4.5 4.5 0 0 0 4.5-4.5v-3A4.5 4.5 0 0 0 17.5 6Z" />
      </svg>
    );
  if (i === 1)
    return (
      <svg {...common}>
        <path d="m8 6-6 6 6 6M16 6l6 6-6 6M13.5 4l-3 16" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M2 10h20v4H2z" />
      <path d="m15 14 4 6M19 14l-4 6" />
    </svg>
  );
}
