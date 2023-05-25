const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// LIMIT REQUESTS 15 MIN | MAX - 100

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
// });

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

mongoose
    .connect(process.env.MONGO_DB_CONNECTION_STRING)
    .then(() => {
        console.log("Connected to MongoDB!");
        const port = process.env.PORT || 8080;
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
