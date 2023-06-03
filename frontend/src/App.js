// App.js
import React, { useEffect, useRef, useState } from "react";
import {
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import SignUpPage from "./components/SignUpPage";

import { useCookies } from "react-cookie";
import axios from "axios";

const App = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies(["token"]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [rerun, setRerun] = useState(false);
    const [removeGuestUser, setRemoveGuestUser] = useState(false);
    const defaultLangRef = useRef("eng");
    const [statusHelper, setStatusHelper] = useState(true);
    let defaultLang = defaultLangRef.current;
    const [guestAccount, setGuestAccount] = useState(true);
    // const [guestAccount, setGuestAccount] = useState(() => {
    //     const storedGuestAccount = localStorage.getItem("guestAccount");
    //     return storedGuestAccount ? JSON.parse(storedGuestAccount) : false;
    // });

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!isLoaded) {
            setIsLoaded(true);
            localStorage.setItem("guestAccount", JSON.stringify(true));

            // pathname INSTEAD of FULL URL
            if (window.location.pathname === "/main") {
                // Only navigate to /main with query params on first run
                navigate(`/main?lang=${defaultLang}`);
            }
        }
    }, [isLoaded, navigate, defaultLang]);

    const SetTheRerun = () => {
        setRerun(!rerun);
    };
    const logInWithoutAccount = () => {
        setGuestAccount(true);
        localStorage.setItem("guestAccount", JSON.stringify(true));
        navigate(`/main?lang=${defaultLang}`);
    };
    const currentURL = window.location.href;

    console.log(guestAccount);
    useEffect(() => {
        if (removeGuestUser) {
            localStorage.removeItem("guestAccount");
            // setGuestAccount(false);
            setStatusHelper(false);
        }
        if (
            guestAccount &&
            statusHelper &&
            currentURL !== "http://localhost:3000/login" &&
            currentURL !== "http://localhost:3000/signup"
        ) {
            navigate(`/main?lang=${defaultLang}`);
        } else {
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
                        localStorage.removeItem("guestAccount");
                    }
                } catch (error) {
                    console.log(error);
                    setIsAuthenticated(false);
                }
            };
            checkAuthStatus();
        }
    }, [
        cookies,
        rerun,
        guestAccount,
        navigate,
        defaultLang,
        currentURL,
        removeGuestUser,
        statusHelper,
    ]);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let lang = searchParams.get("lang");

    if (lang) {
        defaultLang = lang;
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated || guestAccount ? (
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
                        <LoginPage
                            rerun={SetTheRerun}
                            logInWithoutAccount={logInWithoutAccount}
                        />
                    )
                }
            />
            <Route
                path="/main"
                element={
                    isAuthenticated || guestAccount ? (
                        <MainPage
                            rerun={SetTheRerun}
                            defaultLang={defaultLang}
                            isAuthenticated={isAuthenticated}
                            logInWithoutAccount={logInWithoutAccount}
                            setIsAuthenticated={setIsAuthenticated}
                            setRemoveGuestUser={setRemoveGuestUser}
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
