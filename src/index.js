import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./tailwind.css";

const rootElement = document.createElement("div");
rootElement.id = "root";
document.body.appendChild(rootElement);

ReactDOM.createRoot(rootElement).render(<App />);
