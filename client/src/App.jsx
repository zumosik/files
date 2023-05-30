import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from "axios";

import Login from "./Pages/Login";
import Home from "./Pages/Home";

function App() {
  axios.defaults.baseURL = "http://localhost:1234"; //change to actual api later

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/:group" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function NotFound() {
  return <h1>404</h1>;
}

export default App;
