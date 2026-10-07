import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import PomodoroTimer from "./Timer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/timer" element={<PomodoroTimer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
