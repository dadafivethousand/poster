import React from "react";
import "./Stylesheets/App.css";
import Feature from "./Components/Feature";

// One poster renders at a time. Swap the import and the returned component;
// leave the previous one commented out above.
//
// `withSource` is the choice every poster makes about the image that was
// submitted: true renders it as the subject, false uses only the colours taken
// off it and builds the artwork by hand.
function App() {
  return (
    <div className="pf-frame">
      <Feature withSource={true} />
    </div>
  );
}

export default App;
