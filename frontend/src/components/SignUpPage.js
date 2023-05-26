import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpPage.css";
import useInput from "../hooks/use-input";

const SignUpPage = ({ rerun }) => {
    const navigate = useNavigate();

    const isNotEmpty = (value) => value.trim() !== "";
    const isEmail = (value) => value.includes("@");
    const isPassword = (value) => {
        // Minimum length requirement
        if (value.length < 8) {
            return false; // Password is too short
        }

        if (value.length > 42) {
            return false; // Password is too long
        }

        // use test for checking if value includes specific pattern
        if (!/[A-Z]/.test(value)) {
            return false; // Password does not contain an uppercase letter
        }
        // At least one number requirement
        if (!/\d/.test(value)) {
            return false; // Password does not contain a number
        }

        if (!/[!@#$%^&*]/.test(value)) {
            return false; // Password does not contain a special character
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

            navigate("/login"); // Redirect
        } catch (error) {
            // Handle error
            console.log(error.response.data);
        }
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
                    <p className="error-text">
                        <div className="eight-characters-error">
                            Be at least 8 characters<br></br>
                        </div>
                        <div className="one-capital-error">
                            At least one capital letter<br></br>
                        </div>
                        <div className="one-number-error">
                            At least one number<br></br>
                        </div>
                        <div className="one-special-character-error">
                            At least one special character<br></br>
                        </div>
                    </p>
                )}
                {/* <input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordClasses}
                    onChange={passwordChangeHandler}
                    onBlur={passwordBlurHandler}
                    className={passwordClasses}
                /> */}
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
