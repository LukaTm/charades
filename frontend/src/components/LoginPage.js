import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = ({ rerun, logInWithoutAccount, handleLoginFalse }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const currentURL = window.location.href;

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8080/api/login",
                {
                    email,
                    password,
                },
                {
                    withCredentials: true, // Include cookies in the request
                }
            );
            handleLoginFalse();
            localStorage.removeItem("guestAccount");
            rerun();
        } catch (error) {
            // Handle error
            console.log(error);
        }
    };

    const handleContinueWithoutLogin = () => {
        logInWithoutAccount();
        handleLoginFalse?.();
    };

    return (
        <div className={`login-container `}>
            <div
                className={
                    currentURL === "http://localhost:3000/login"
                        ? ""
                        : "close-button"
                }
                onClick={handleLoginFalse}
            ></div>
            <h1 className="login-title">Login</h1>
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className="login-button">
                    Log In
                </button>
            </form>
            <p className="login-signup">
                Don't have an account?{" "}
                <Link to="/signup" className="signup-link">
                    Sign up
                </Link>
            </p>
            <button
                className="continue-without-login-button"
                onClick={handleContinueWithoutLogin}
            >
                Continue Without Login
            </button>
        </div>
    );
};

export default LoginPage;
