const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = jwt.verify(token, "your-secret-key");
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Invalid token", isAuthenticated: false });
    }
};

module.exports = isAuth;
