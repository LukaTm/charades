import "./MainPage.css";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";

import { useLocation } from "react-router-dom";

const MainPage = ({
    rerun,
    isAuthenticated,
    logInWithoutAccount,
    setIsAuthenticated,
    setRemoveGuestUser,
}) => {
    const [numWords, setNumWords] = useState(1);
    const [category, setCategory] = useState("Easy");
    const [language, setLanguage] = useState("English");
    const [customWord, setCustomWord] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [numberOfWords, setNumberOfWords] = useState(0);

    const [words, setWords] = useState([]);
    const [loginModal, setLoginModal] = useState(false);
    const [signupModalHelper, setSignupModalHelper] = useState(true);
    const [signupModal, setSignupModal] = useState(false);
    const [loginModalHelper, setLoginModalHelper] = useState(true);

    const [isHolding, setIsHolding] = useState(false);
    const [operation, setOperation] = useState(null);

    const isFirstClick = useRef(true); // Ref to track the first click

    const [onlyUseCustomWordsValue, setOnlyUseCustomWordsValue] = useState("");
    const [onlyUseCustomWords, setOnlyUseCustomWords] = useState(false);
    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        const newValue = selectedValue === "option1" ? false : true;
        setOnlyUseCustomWords(newValue);
        setOnlyUseCustomWordsValue(event.target.value);
    };
    useEffect(() => {
        const params = new URLSearchParams();

        if (language === "English") {
            params.set("lang", "eng");
        } else if (language === "Russian") {
            params.set("lang", "rus");
        } else if (language === "Latvian") {
            params.set("lang", "lv");
        } else {
            params.set("lang", "eng");
        }

        window.history.replaceState({}, "", `?${params.toString()}`);
    }, [language]);

    // info about the current URL
    const location = useLocation();
    // allows you to manipulate and work with query parameters in a URL
    const searchParams = new URLSearchParams(location.search);
    const lang = searchParams.get("lang");

    useEffect(() => {
        switch (lang) {
            case "eng":
                setLanguage("English");
                break;
            case "rus":
                setLanguage("Russian");
                break;
            case "lv":
                setLanguage("Latvian");
                break;
            default:
                setLanguage("English");
        }
    }, [lang]);

    useEffect(() => {
        setNumberOfWords(words.length);
    }, [words]);

    useEffect(() => {
        let timeoutId;
        let intervalId;
        const updatedNumWordsPlus = numWords + 1;
        const updatedNumWordsMinus = numWords - 1;

        if (isHolding) {
            if (isFirstClick.current) {
                timeoutId = setTimeout(() => {
                    intervalId = setInterval(() => {
                        setNumWords((prevCount) => {
                            if (
                                operation === "+" &&
                                updatedNumWordsPlus <= 50
                            ) {
                                return prevCount + 1;
                            } else if (
                                operation === "-" &&
                                updatedNumWordsMinus >= 1
                            ) {
                                return prevCount - 1;
                            } else {
                                return numWords;
                            }
                        });
                    }, 20);
                }, 500);

                isFirstClick.current = false; // Update the flag after the first click
            } else {
                intervalId = setInterval(() => {
                    setNumWords((prevCount) => {
                        if (operation === "+" && updatedNumWordsPlus <= 50) {
                            return prevCount + 1;
                        } else if (
                            operation === "-" &&
                            updatedNumWordsMinus >= 1
                        ) {
                            return prevCount - 1;
                        } else {
                            return numWords;
                        }
                    });
                }, 50);
            }
        } else {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
            isFirstClick.current = true; // Reset the flag when not holding
        }

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [isHolding, operation, numWords]);

    const handleMouseDown = (operation) => {
        setIsHolding(true);
        setOperation(operation);
    };

    const handleMouseUp = () => {
        setIsHolding(false);
    };

    const handleNumWordsChange = (increment) => {
        const updatedNumWords = numWords + increment;
        if (updatedNumWords >= 1 && updatedNumWords <= 50) {
            setNumWords(updatedNumWords);
        }
    };

    const handleNumWordsSingleClick = (increment) => {
        handleNumWordsChange(increment);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleInputCustomWordChange = (event) => {
        setCustomWord(event.target.value);
    };

    const handleGenerateClick = async () => {
        setErrorMessage("");
        if (onlyUseCustomWords) {
            try {
                const response = await axios.post(
                    `http://localhost:8080/api/get-custom-words?numWords=${numWords}`,
                    {},
                    {
                        withCredentials: true, // Include cookies in the request
                    }
                );
                if (response.data === undefined) {
                    // ! FOR NOW
                    setWords(["No words found"]);
                } else {
                    setWords(response.data);
                }
            } catch (error) {
                if (!error.response.data.notAuth) {
                    setLoginModal(true);
                } else {
                    console.log(error);
                }
            }
        } else {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/words?numWords=${numWords}&category=${category}&language=${language}`
                );
                setWords(response.data.charadesWords);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleCustomWord = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8080/api/custom-word`,
                { customWord: customWord },
                {
                    withCredentials: true, // Include cookies in the request
                }
            );
            if (response.status === 201) {
                setCustomWord("");
                setErrorMessage("");
            }
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.exists
            ) {
                setErrorMessage("Custom word already exists");
            } else {
                setErrorMessage("");
                setLoginModal(true);
            }
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/logout`,
                {},
                {
                    withCredentials: true, // Include cookies in the request
                }
            );
            setIsAuthenticated(false);
            localStorage.setItem("guestAccount", JSON.stringify(true));
            rerun();
        } catch (error) {
            console.log(error);
        }
    };
    const handleLogin = () => {
        setLoginModal(true);
    };
    const handleLoginFalse = () => {
        setLoginModal(false);
        setRemoveGuestUser(false);
    };

    const handleSignupFalse = () => {
        setSignupModal(false);
    };

    return (
        <React.Fragment>
            <div
                className={signupModal || loginModal ? "dark-background" : ""}
            ></div>
            <div
                className={`main-page ${
                    loginModal ? "modal-background darken" : ""
                }`}
            >
                <header className="header">
                    <div className="h1-container">
                        <h1>
                            {language === "English"
                                ? "Charades"
                                : language === "Russian"
                                ? "Шарады"
                                : language === "Latvian"
                                ? "Mēmais šovs"
                                : "Charades"}
                        </h1>
                    </div>

                    <div className="header-btn-container">
                        {isAuthenticated ? (
                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                {language === "English"
                                    ? "Logout"
                                    : language === "Russian"
                                    ? "Выйти"
                                    : language === "Latvian"
                                    ? "Iziet"
                                    : "Logout"}
                            </button>
                        ) : (
                            <button className="login-btn" onClick={handleLogin}>
                                {language === "English"
                                    ? "Login"
                                    : language === "Russian"
                                    ? "Войти"
                                    : language === "Latvian"
                                    ? "Ieiet"
                                    : "Login"}
                            </button>
                        )}
                    </div>
                </header>
                <div className="custom-word-container">
                    <form>
                        <label
                            htmlFor="custom-word"
                            className="custom-word-label"
                        >
                            {language === "English"
                                ? "Create custom charades word:"
                                : language === "Russian"
                                ? "Создайте собственное слово шарады:"
                                : language === "Latvian"
                                ? "Izveidot savu mēmā šova vārdu:"
                                : "Create custom charades word:"}
                        </label>
                        <div className="custom-word-container-inside">
                            <div className="custom-word-error-container">
                                <input
                                    type="text"
                                    id="custom-word"
                                    name="custom-word"
                                    placeholder={
                                        language === "English"
                                            ? "Enter your own word"
                                            : language === "Russian"
                                            ? "Введите свое слово"
                                            : language === "Latvian"
                                            ? "Ievadiet savu vārdu"
                                            : "Enter your own word"
                                    }
                                    value={customWord}
                                    onChange={handleInputCustomWordChange}
                                ></input>
                                <span id="already-exists-error">
                                    {errorMessage}
                                </span>
                            </div>
                            <input
                                id="custom-word-submit-btn"
                                type="submit"
                                value={
                                    language === "English"
                                        ? "Submit"
                                        : language === "Russian"
                                        ? "Подтвердить"
                                        : language === "Latvian"
                                        ? "Iesniegt"
                                        : "Submit"
                                }
                                onClick={handleCustomWord}
                            ></input>
                        </div>
                    </form>
                </div>
                <div className="controls">
                    <div className="select-drop-down">
                        <select
                            id="language"
                            value={language}
                            onChange={handleLanguageChange}
                        >
                            <option value="English">English</option>
                            <option value="Russian">Russian</option>
                            <option value="Latvian">Latvian</option>
                        </select>
                    </div>
                    <div className="select-drop-down">
                        <label htmlFor="only-custom-words">
                            {language === "English"
                                ? "Only use custom words:"
                                : language === "Russian"
                                ? "Используйте только собственные слова:"
                                : language === "Latvian"
                                ? "Izmantot tikai savus izveidotos vārdus:"
                                : "Only use custom words:"}
                        </label>
                        <select
                            id="only-custom-words"
                            value={onlyUseCustomWordsValue}
                            onChange={handleOptionChange}
                        >
                            <option value="option1">
                                {language === "English"
                                    ? "False"
                                    : language === "Russian"
                                    ? "Нет"
                                    : language === "Latvian"
                                    ? "Nē"
                                    : "False"}
                            </option>
                            <option value="option2">
                                {" "}
                                {language === "English"
                                    ? "True"
                                    : language === "Russian"
                                    ? "Да"
                                    : language === "Latvian"
                                    ? "Jā"
                                    : "True"}
                            </option>
                        </select>
                        <div>
                            {!onlyUseCustomWords && (
                                <>
                                    <label htmlFor="category">
                                        {language === "English"
                                            ? "Difficulty:"
                                            : language === "Russian"
                                            ? "Сложность:"
                                            : language === "Latvian"
                                            ? "Grūtība:"
                                            : null}
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="Easy">
                                            {language === "English"
                                                ? "Easy"
                                                : language === "Russian"
                                                ? "Легкий"
                                                : language === "Latvian"
                                                ? "Viegla"
                                                : "Easy"}
                                        </option>
                                        <option value="Medium">
                                            {language === "English"
                                                ? "Medium"
                                                : language === "Russian"
                                                ? "Средний"
                                                : language === "Latvian"
                                                ? "Vidēja"
                                                : "Medium"}
                                        </option>
                                        <option value="Hard">
                                            {language === "English"
                                                ? "Hard"
                                                : language === "Russian"
                                                ? "Трудный"
                                                : language === "Latvian"
                                                ? "Grūta"
                                                : "Hard"}
                                        </option>
                                    </select>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="num-submit-outer-container">
                        <div className="num-words">
                            <button
                                onMouseDown={() => handleMouseDown("-")}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onClick={() => handleNumWordsSingleClick(-1)}
                            >
                                -
                            </button>
                            <div className="num-words-container">
                                <span>{numWords}</span>
                            </div>
                            <button
                                onMouseDown={() => handleMouseDown("+")}
                                onMouseUp={handleMouseUp}
                                onClick={() => handleNumWordsSingleClick(1)}
                                onMouseLeave={handleMouseUp}
                                onContextMenuCapture={(e) => {
                                    e.preventDefault();
                                    return false;
                                }}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className="generate-btn"
                            onClick={handleGenerateClick}
                        >
                            {language === "English"
                                ? "Submit"
                                : language === "Russian"
                                ? "Подтвердить"
                                : language === "Latvian"
                                ? "Iesniegt"
                                : "Submit"}
                        </button>
                    </div>
                </div>
                <div className="word-list">
                    {words.map((word, index) => (
                        <span
                            className={`word-item ${
                                numberOfWords <= 5 && numberOfWords > 2
                                    ? "five-words-size"
                                    : numberOfWords <= 20 && numberOfWords > 5
                                    ? "ten-words-size"
                                    : numberOfWords <= 2
                                    ? "one-words-size"
                                    : ""
                            }`}
                            key={index}
                        >
                            {word}
                        </span>
                    ))}
                </div>
            </div>
            {loginModal && (
                <LoginPage
                    logInWithoutAccount={logInWithoutAccount}
                    handleLoginFalse={handleLoginFalse}
                    rerun={rerun}
                    signupModalHelper={signupModalHelper}
                    setSignupModalHelper={setSignupModalHelper}
                    setSignupModal={setSignupModal}
                    setLoginModal={setLoginModal}
                    setRemoveGuestUser={setRemoveGuestUser}
                />
            )}
            {signupModal && (
                <SignUpPage
                    handleSignupFalse={handleSignupFalse}
                    setLoginModal={setLoginModal}
                    setLoginModalHelper={setLoginModalHelper}
                    loginModalHelper={loginModalHelper}
                    setSignupModal={setSignupModal}
                />
            )}
        </React.Fragment>
    );
};

export default MainPage;
