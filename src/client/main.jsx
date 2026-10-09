import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import App from "./App";

import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MatchPage from "./pages/MatchPage";
import ProfilePage from "./pages/ProfilePage";
import UserPage from "./pages/UserPage";
import AllGamesPage from "./pages/AllGamesPage"
import SearchPage from "./pages/SearchPage"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="games" element={<AllGamesPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<ProfilePage />} />

          <Route path="game/:gameName" element={<GamePage />} />
          <Route path="allgames" element={<AllGamesPage />} />
          <Route path="search" element={<SearchPage />} />

          <Route path="match/:matchId" element={<MatchPage />} />
          <Route path="user/:username" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
