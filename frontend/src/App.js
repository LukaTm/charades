import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<SignUpPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/main" element={<MainPage />} />
        </Routes>
    );
};

export default App;
