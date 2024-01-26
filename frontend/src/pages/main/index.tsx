import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './main.css'
import Header from "../../components/header";
import Home from "../home";
import AddVideo from "../addVideo";


function Main() {
  return (

      <BrowserRouter>
        <div id="main" className="main">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addVideo" element={<AddVideo />} />
          </Routes>
        </div>
      </BrowserRouter>
 
  );
}

export default Main;
