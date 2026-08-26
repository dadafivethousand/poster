import React from "react";
import "./Stylesheets/App.css";
import Frame from "./Frame";
// import Feature from "./Components/Feature";
// import StaplesFlyer from "./Components/StaplesFlyer";
// import TechTalk from "./Components/TechTalk";
// import MapleBackToSchool from "./Components/MapleBackToSchool";
// import OpenHouse from "./Components/OpenHouse";
// import BusinessCard from "./Components/BusinessCard";
import RoundLogo from "./Components/RoundLogo";

// One poster renders at a time. Swap the import and the returned component;
// leave the previous one commented out above.
//
// The Frame sets the output size, and `npm run shot` follows it — omit
// `canvas` for an Instagram post, or name one: "square", "story", "letter",
// "letter-landscape", "half-letter", "a4", "tabloid", a literal "1200x1600",
// a real-world "3.5x2in", the same with bleed "3.5x2in+0.125in", or {w, h}.
// See src/canvas.js.
//
// OpenHouse goes out as an Instagram Reel and wants canvas="story", laid out
// inside a safe area — see the top of OpenHouse.css — because a reel played
// full screen loses its top to the status bar and the Reels header, its bottom
// to the caption and audio strip, and whatever else the device crops off to
// fill its own aspect:
//
//   <Frame canvas="story"><OpenHouse /></Frame>
//
// BusinessCard has two sides; export each: side="front" then side="back".
function App() {
  return (
    <Frame canvas="square">
      <RoundLogo />
    </Frame>
  );
}

export default App;
