import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./homepage.jsx";
import UserPortfolio from "./portfolio.jsx";
import MainNavBar from "./pfolioComponents/navbar.jsx";
function App() {


  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/pfolio/:uid" element={<UserPortfolio/>}> </Route>
      </Routes> 
    </div>
    </BrowserRouter>
  );
}

export default App;
