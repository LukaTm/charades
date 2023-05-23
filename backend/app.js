const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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
