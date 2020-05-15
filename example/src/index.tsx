import React from "react";
import ReactDOM from "react-dom";

import examplePNG from "./images/example.png";
import { ReactComponent as ExampleSVG } from "./images/example.svg";

const App: React.FC = () => (
  <div>
    <h1>Example</h1>

    <h4>File Loader</h4>
    <img src={examplePNG} />

    <h4>Inline SVG</h4>
    <ExampleSVG />
  </div>
);

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<App />, root);
