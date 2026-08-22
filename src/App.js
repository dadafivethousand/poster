import React from "react";
import "./Stylesheets/App.css";
import Frame from "./Frame";
// import Feature from "./Components/Feature";
// import StaplesFlyer from "./Components/StaplesFlyer";
// import TechTalk from "./Components/TechTalk";
// import MapleBackToSchool from "./Components/MapleBackToSchool";
import OpenHouse from "./Components/OpenHouse";

// One poster renders at a time. Swap the import and the returned component;
// leave the previous one commented out above.
//
// The Frame sets the output size, and `npm run shot` follows it — omit
// `canvas` for an Instagram post, or name one: "square", "story", "letter",
// "letter-landscape", "a4", "tabloid", or {w, h} for a one-off. See
// src/canvas.js.
//
// `withSource` is the choice every poster makes about the image that was
// submitted: true renders it as the subject, false uses only the colours taken
// off it and builds the artwork by hand.
// STORY, not square: OpenHouse goes out as an Instagram Reel. The poster is
// laid out inside a safe area — see the top of OpenHouse.css — because a reel
// played full screen loses its top to the status bar and the Reels header, its
// bottom to the caption and audio strip, and whatever else the device crops
// off to fill its own aspect.
function App() {
  return (
    <Frame canvas="story">
      <OpenHouse />
    </Frame>
  );
}

export default App;
