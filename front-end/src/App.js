import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/LandingPage";
import MoreInfo from "./components/MoreInfo";
import AfterRegistration from "./components/AfterRegistration";
import LoginPage from "./components/LoginPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/MoreInfo" element={<MoreInfo />} />
        <Route path="/AfterRegistration" element={<AfterRegistration />} />
        <Route path="/LogIn" element={<LoginPage />} />
        
        <Route path="*" element={<Navigate replace to="/Home" />} />
      </Routes>
    </>
  );
};

export default App;
