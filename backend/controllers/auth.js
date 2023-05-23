const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
    const { nickname, email, password } = req.body;

    const user = { nickname, email };

    res.status(201).json({ message: "User registered" });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userId = "exampleUserId";

        const token = jwt.sign({ userId }, "your-secret-key", {
            expiresIn: "1h",
        });

        // Set the HTTP-only cookie
        res.cookie("token", token, {
            maxAge: 3600000, // 1 hour in milliseconds
            httpOnly: true,
            secure: false, // Set this to true if using HTTPS
        });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    signUp,
    login,
};
