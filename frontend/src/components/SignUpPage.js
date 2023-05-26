import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpPage.css";

const SignUpPage = ({ rerun }) => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/signup",
                {
                    nickname,
                    email,
                    password,
                }
            );

            navigate("/login"); // Redirect
        } catch (error) {
            // Handle error
            console.log(error.response.data);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Sign Up</h1>
            <form onSubmit={handleSignUp} className="login-form">
                <input
                    type="text"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    className="login-input"
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className="login-button">
                    Sign Up
                </button>
            </form>
            <p className="login-signup">
                Already have an account?{" "}
                <Link to="/login" className="signup-link">
                    Log in
                </Link>
            </p>
        </div>
    );
};

export default SignUpPage;
