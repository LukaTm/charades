import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import SignUpPage from "./components/SignUpPage";

import { useCookies } from "react-cookie";
import axios from "axios";

const App = () => {
    const [cookies] = useCookies(["token"]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [rerun, setRerun] = useState(false);

    const SetTheRerun = () => {
        setRerun(!rerun);
    };

    useEffect(() => {
        // Function to check authentication status with the server
        const checkAuthStatus = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8080/api/isauth",
                    {},
                    {
                        withCredentials: true, // Include cookies in the request
                    }
                );

                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
            }
        };

        checkAuthStatus();
    }, [cookies, rerun]);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Navigate to="/main" />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/main" />
                    ) : (
                        <LoginPage rerun={() => SetTheRerun()} />
                    )
                }
            />
            <Route
                path="/main"
                element={
                    isAuthenticated ? <MainPage /> : <Navigate to="/login" />
                }
            />
            <Route
                path="/signup"
                element={
                    isAuthenticated ? <Navigate to="/main" /> : <SignUpPage />
                }
            />
        </Routes>
    );
};

export default App;
