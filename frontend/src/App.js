// App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import SignUpPage from "./components/SignUpPage";

import { useCookies } from "react-cookie";
import axios from "axios";

const App = () => {
    const [cookies] = useCookies(["token"]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [rerun, setRerun] = useState(false);
    const [defaultLang, setDefaultLang] = useState("eng");

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

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let lang = searchParams.get("lang");

    useEffect(() => {
        if (lang) {
            setDefaultLang(lang);
        }
    }, [lang]);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        // replace CAN'T navigate back to previous page
                        <Navigate
                            to={`/main?lang=${defaultLang}`}
                            replace={true}
                        />
                    ) : (
                        <Navigate to="/login" replace={true} />
                    )
                }
            />

            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate
                            to={`/main?lang=${defaultLang}`}
                            replace={true}
                        />
                    ) : (
                        <LoginPage rerun={SetTheRerun} />
                    )
                }
            />
            <Route
                path="/main"
                element={
                    isAuthenticated ? (
                        <MainPage
                            rerun={SetTheRerun}
                            defaultLang={defaultLang}
                        />
                    ) : (
                        <Navigate to="/login" replace={true} />
                    )
                }
            />

            <Route
                path="/signup"
                element={
                    isAuthenticated ? (
                        <Navigate
                            to={`/main?lang=${defaultLang}`}
                            replace={true}
                        />
                    ) : (
                        <SignUpPage />
                    )
                }
            />
        </Routes>
    );
};

export default App;
