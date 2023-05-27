const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const CustomName = require("../models/CustomName");
const CharadesWords = require("../models/Charades-words");
const CharadesWordsLatvians = require("../models/Charades-words-latvians");
const CharadesWordsRussians = require("../models/Charades-words-russians");

const signUp = async (req, res) => {
    const {
        nicknameValue: nickname,
        emailValue: email,
        passwordValue: password,
    } = req.body;

    try {
        // VALIDATE request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPassword,
            nickname: nickname,
        });

        await user.save();

        res.status(201).json({
            message: "User created!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
            });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // COMPARE
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { userId: user._id.toString() },
            "your-secret-key",
            {
                expiresIn: "1h",
            }
        );

        // Set the HTTP-only cookie
        res.cookie("token", token, {
            maxAge: 3600000, // 1 hour in milliseconds
            httpOnly: true,
            secure: false, // Set this to true if using HTTPS
        });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

// const createNewWord = async (req, res) => {
//     const enteredName = req.params.enteredName;
//     const userId = req.userId;

//     try {
//         const customName = new CustomName({
//             content: enteredName,
//             creator: userId,
//             viewers: userId,
//         });

//         await customName.save();

//         const findUser = await User.findById(userId);
//         findUser.posts.push(post);

//         await findUser.save();
//     } catch (error) {
//         console.log(error);
//     }
// };

// Retrieve the existing array to compare against
let existingArray = [];

const getWords = async (req, res) => {
    let category = req.query.category;
    const numWords = req.query.numWords;
    let language = req.query.language;
    const userId = req.userId;

    // Convert to lowercase
    if (category) {
        category = category.toLowerCase();
    }
    if (language) {
        language = language.toLowerCase();
    }

    try {
        // Retrieve the collection
        let AllWords;

        // Retrieve the collection based on language
        switch (language) {
            case "english":
                AllWords = CharadesWords;
                break;
            case "russian":
                AllWords = CharadesWordsRussians;
                break;
            case "latvian":
                AllWords = CharadesWordsLatvians;
                break;
            default:
                throw new Error("Invalid language");
        }

        // Find the document containing allWords
        const document = await AllWords.findOne();

        // Select the array 'easy', 'medium', 'hard'

        let selectedArray;
        if (category === "easy") {
            selectedArray = document.easy;
        } else if (category === "medium") {
            selectedArray = document.medium;
        } else if (category === "hard") {
            selectedArray = document.hard;
        } else {
            return res.status(400).json({ message: "Invalid category" });
        }

        // Select random values from the array, excluding existing values
        const numRandomValues = numWords;

        async function getRandomUniqueValues(array, numValues, existingValues) {
            const uniqueValues = [];

            if (array.length <= numValues) {
                return array;
            }

            // Filter Duplicates
            const availableValues = array.filter(
                (value) =>
                    !existingValues.includes(value) &&
                    !uniqueValues
                        // convert to Lower case to compare them
                        .map((val) => val.toLowerCase())
                        .includes(value.toLowerCase())
            );

            for (let i = 0; i < numValues; i++) {
                const randomIndex = Math.floor(
                    Math.random() * availableValues.length
                );
                if (availableValues[randomIndex] !== undefined) {
                    uniqueValues.push(availableValues[randomIndex]);
                    existingArray.push(availableValues[randomIndex]);
                    availableValues.splice(randomIndex, 1);
                }
            }

            if (uniqueValues.length < 1) {
                return null;
            }
            return uniqueValues;
        }

        let charadesWords;
        charadesWords = await getRandomUniqueValues(
            selectedArray,
            numRandomValues,
            existingArray
        );
        if (charadesWords === null) {
            existingArray.length = 0;
            charadesWords = await getRandomUniqueValues(
                selectedArray,
                numRandomValues,
                existingArray
            );
        }

        res.status(201).json({ charadesWords });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create post" });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Failed to log out" });
    }
};

module.exports = {
    signUp,
    login,
    logout,
    getWords,
};
