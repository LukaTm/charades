import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./MainPage.css";

const MainPage = () => {
    const [numWords, setNumWords] = useState(1);
    const [category, setCategory] = useState("Easy");
    const [words, setWords] = useState([]);

    const [isHolding, setIsHolding] = useState(false);
    const [operation, setOperation] = useState(null);

    const isFirstClick = useRef(true); // Ref to track the first click

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

    const handleGenerateClick = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/words?numWords=${numWords}&category=${category}`
            );
            setWords(response.data.charadesWords);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="main-page">
            <div className="controls">
                <div className="num-words">
                    <button
                        onMouseDown={() => handleMouseDown("-")}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onClick={() => handleNumWordsSingleClick(-1)}
                    >
                        -
                    </button>
                    <span>{numWords}</span>
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
                <div className="category">
                    <label htmlFor="category">Category:</label>
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
                <button onClick={handleGenerateClick}>Generate</button>
            </div>
            <div className="word-list">
                {words.map((word, index) => (
                    <span key={index}>{word}</span>
                ))}
            </div>
        </div>
    );
};

export default MainPage;
