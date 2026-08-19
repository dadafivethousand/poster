import React from "react";
import "./Stylesheets/App.css";
import Frame from "./Frame";
// import Feature from "./Components/Feature";
import StaplesFlyer from "./Components/StaplesFlyer";

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
function App() {
  return (
    <Frame canvas="half-letter">
      <StaplesFlyer />
    </Frame>
  );
}

export default App;
