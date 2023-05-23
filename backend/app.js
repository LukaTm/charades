const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const isAuth = require("./middleware/is-auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// Routes
app.use("/api", authRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
});

// Start the server
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
