const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
    const { nickname, email, password } = req.body;

    const user = { nickname, email };

    res.status(201).json({ message: "User registered" });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = { email };

    const token = jwt.sign({ userId: user.id }, "your-secret-key", {
        expiresIn: "1h",
    });

    // Set the HTTP-only cookie
    res.cookie("token", token, {
        maxAge: 3600000, // 1 hour in milliseconds
        httpOnly: true,
        secure: false, // Set this to true if using HTTPS
    });

    res.json({ message: "Login successful", token });
};

module.exports = {
    signUp,
    login,
};
