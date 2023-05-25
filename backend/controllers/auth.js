const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const CustomName = require("../models/CustomName");
const CharadesWords = require("../models/Charades-words");

const signUp = async (req, res) => {
    const { nickname, email, password } = req.body;

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

const getWords = async (req, res) => {
    let category = req.query.category;
    const numWords = req.query.numWords;
    const userId = req.userId;

    // Convert to lowercase
    if (category) {
        category = category.toLowerCase();
    }

    try {
        // Retrieve the collection
        const AllWords = CharadesWords;

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

        // Retrieve the existing array to compare against
        const existingArray = ["existing1", "existing2"];

        // Select random values from the array, excluding existing values
        const numRandomValues = numWords;

        async function getRandomUniqueValues(array, numValues, existingValues) {
            const uniqueValues = [];

            if (array.length <= numValues) {
                return array;
            }

            const availableValues = array.filter(
                (value) =>
                    !existingValues.includes(value) &&
                    !uniqueValues.includes(value)
            );

            for (let i = 0; i < numValues; i++) {
                const randomIndex = Math.floor(
                    Math.random() * availableValues.length
                );
                uniqueValues.push(availableValues[randomIndex]);
                availableValues.splice(randomIndex, 1);
            }

            return uniqueValues;
        }

        const charadesWords = await getRandomUniqueValues(
            selectedArray,
            numRandomValues,
            existingArray
        );

        res.status(201).json({ charadesWords });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create post" });
    }
};

module.exports = {
    signUp,
    login,
    getWords,
};
