// StaplesFlyer.js — the Staples × Code Ninjas $50-off handout, rebuilt.
//
// Reconstructed from ~/Downloads/staples-flyer-50-off-code-ninjas.pdf, which
// had no source file anywhere on the machine (Chrome print-to-PDF, Poppins,
// while both sibling repos use Inter — so it did not come from them). The
// palette here is sampled straight out of that PDF, not eyeballed:
//
//   #e4002b  brand red      #123a5e  deep navy (pill, note block)
//   #16233a  ink            #2b7cb8  blue accent
//   #e6eef8  page           #d3deea  the bands behind coupon and cards
//   #7b8aa3  fine print
//
// Half-letter, 5.5×8.5in — the size the original was laid out at, so it prints
// two-up on a sheet and stacks on a counter.
//
// EVERY STRING IS A PROP. This is a real co-branded offer with real terms: a
// date, a dollar amount, a promo code and a legal footer that came from
// Staples. Nothing here should be edited by hand in the markup, and nothing
// should be invented — see CLAUDE.md on copy.
import React from "react";
import "../Stylesheets/StaplesFlyer.css";
import staplesLogo from "../Images/staples-easy-logo.png";
import cnHead from "../Images/cn-head-mark.png";
import ninja from "../Images/ninja-wave.png";

export default function StaplesFlyer({
  kicker = "WHILE YOU'RE SHOPPING",
  headline = ["Turn today's receipt into", "their first video game."],
  body =
    "At Code Ninjas, kids learn to code by building real games — earning belts as they level up, the way a dojo works.",

  amount = "$50",
  amountWord = "OFF",
  offer = "Your first 3 months at Code Ninjas",
  condition = "When you spend $100 or more at Staples",
  promoLabel = "Use promo code",
  promoCode = "STAPLES2026",
  terms = "Offer ends October 31, 2026 · new Code Ninjas members only",

  noteTitle = "Not quite at $100?",
  note =
    "A backpack, a set of headphones or the year's ink usually closes the gap — and turns your receipt into $50 off something they'll still be talking about in June.",

  features = [
    ["Build real", "video games"],
    ["Write real", "JavaScript"],
    ["Earn belts,", "like a dojo"],
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

      {/* ---- hero: the pitch, with the mascot breaking the card edge ---- */}
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
        <img className="sf-ninja" src={ninja} alt="" />
      </section>

      {/* ---- the coupon. The dashed rule and the two punched notches are
              what make it read as something to tear out and carry in ---- */}
      <section className="sf-band">
        <div className="sf-coupon">
          <span className="sf-notch sf-notch-l" aria-hidden />
          <span className="sf-notch sf-notch-r" aria-hidden />

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
      </section>

      {/* ---- the upsell ---- */}
      <section className="sf-note">
        <p className="sf-note-title">{noteTitle}</p>
        <p className="sf-note-body">{note}</p>
      </section>

      {/* ---- three proof points ---- */}
      <section className="sf-band sf-band-cards">
        <div className="sf-cards">
          {features.map(([a, b]) => (
            <div className="sf-card" key={a}>
              {a}
              <br />
              {b}
            </div>
          ))}
        </div>
      </section>

      <p className="sf-cta">{cta}</p>
      <p className="sf-site">{site}</p>
      <p className="sf-fine">{fine}</p>
    </div>
  );
}
