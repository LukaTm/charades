import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./MainPage.css";

import { useLocation } from "react-router-dom";

const MainPage = ({ rerun }) => {
    const [numWords, setNumWords] = useState(1);
    const [category, setCategory] = useState("Easy");
    const [language, setLanguage] = useState("English");
    const [words, setWords] = useState([]);

    const [isHolding, setIsHolding] = useState(false);
    const [operation, setOperation] = useState(null);

    const isFirstClick = useRef(true); // Ref to track the first click

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

    const handleGenerateClick = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/words?numWords=${numWords}&category=${category}&language=${language}`
            );
            setWords(response.data.charadesWords);
        } catch (error) {
            console.log(error);
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
            rerun();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="main-page">
            <header className="header">
                <div className="h1-container">
                    <h1>
                        {lang === "eng"
                            ? "Charades"
                            : lang === "rus"
                            ? "Шарады"
                            : language === "lv"
                            ? "Mēmais šovs"
                            : null}
                    </h1>
                </div>

                <div className="header-btn-container">
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>
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
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
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
                <button className="generate-btn" onClick={handleGenerateClick}>
                    Submit
                </button>
            </div>
            <div className="word-list">
                {words.map((word, index) => (
                    <span className="word-item" key={index}>
                        {word}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MainPage;
