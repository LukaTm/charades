const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res
            .status(401)
            .json({ message: "Unauthorized", notAuth: false });
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "your-secret-key");
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
    // USE it in ROUTES middleware in this request
    req.userId = decodedToken.userId;
    next();
};
