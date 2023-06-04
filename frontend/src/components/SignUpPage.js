import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpPage.css";
import useInput from "../hooks/use-input";

const SignUpPage = ({
    rerun,
    handleSignupFalse,
    loginModalHelper,
    setLoginModal,
    setSignupModal,
}) => {
    const navigate = useNavigate();
    const currentURL = window.location.href;

    const isNotEmpty = (value) => value.trim() !== "";
    const isEmail = (value) => {
        const atIndex = value.indexOf("@");
        // check if @ exists and IF its not FIRST or LAST index
        return value.includes("@") && atIndex > 0 && atIndex < value.length - 1;
    };
    const isPassword = (value) => {
        // Minimum length requirement
        if (value.length < 6) {
            return false; // Password is too short
        }

        if (value.length > 42) {
            return false; // Password is too long
        }

        return true;
    };

    const {
        value: nicknameValue,
        isValid: nicknameIsValid,
        hasError: nicknameHasError,
        valueChangeHandler: nicknameChangeHandler,
        inputBlurHandler: nicknameBlurHandler,
        reset: resetNickname,
    } = useInput(isNotEmpty);
    const {
        value: passwordValue,
        isValid: passwordIsValid,
        hasError: passwordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: resetLastName,
    } = useInput(isPassword);
    const {
        value: emailValue,
        isValid: emailIsValid,
        hasError: emailHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail,
    } = useInput(isEmail);

    let formIsValid = false;

    if (nicknameIsValid && passwordIsValid && emailIsValid) {
        formIsValid = true;
    }

    const handleSignUp = async (e) => {
        try {
            e.preventDefault();
            if (!formIsValid) {
                return;
            }
            const response = await axios.post(
                "http://localhost:8080/api/signup",
                {
                    nicknameValue,
                    emailValue,
                    passwordValue,
                }
            );
            resetNickname();
            resetLastName();
            resetEmail();

            loginModalHelper ? Login() : navigate("/login"); // Redirect
        } catch (error) {
            // Handle error
            console.log(error.response.data);
        }
    };

    const Login = () => {
        setLoginModal(true);
        setSignupModal(false);
    };

    const nicknameClasses = nicknameHasError
        ? "form-control invalid"
        : "form-control";
    const passwordClasses = passwordHasError
        ? "form-control invalid"
        : "form-control";
    const emailClasses = emailHasError
        ? "form-control invalid"
        : "form-control";

    return (
        <div className="login-container">
            <div
                className={
                    currentURL === "http://localhost:3000/signup"
                        ? ""
                        : "close-button"
                }
                onClick={handleSignupFalse}
            ></div>
            <h1 className="login-title">Sign Up</h1>
            <form onSubmit={handleSignUp} className="login-form">
                <input
                    type="text"
                    placeholder="Nickname"
                    value={nicknameValue}
                    onChange={nicknameChangeHandler}
                    onBlur={nicknameBlurHandler}
                    className={nicknameClasses}
                />
                {nicknameHasError && (
                    <p className="error-text">Please enter a Nickname.</p>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={emailValue}
                    onChange={emailChangeHandler}
                    // WHEN LOSES FOCUS
                    onBlur={emailBlurHandler}
                    className={emailClasses}
                />
                {emailHasError && (
                    <p className="error-text">Please enter a valid Email</p>
                )}
                <input
                    type="password"
                    placeholder="Password"
                    value={passwordValue}
                    onChange={passwordChangeHandler}
                    onBlur={passwordBlurHandler}
                    className={passwordClasses}
                />
                {passwordHasError && (
                    <p className="error-text">Be at least 6 characters</p>
                )}
                <button type="submit" className="login-button">
                    Sign Up
                </button>
            </form>
            <p className="login-signup">
                {loginModalHelper ? (
                    <span>
                        Already have an account?
                        <span
                            className="signup-link custom-link"
                            onClick={Login}
                        >
                            Log in
                        </span>
                    </span>
                ) : (
                    <span>
                        Already have an account?
                        <Link to="/login" className="signup-link">
                            Log in
                        </Link>
                    </span>
                )}
            </p>
        </div>
    );
};

export default SignUpPage;
