const express = require("express");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/words", authController.getWords);
router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/isauth", isAuth, (req, res) => {
    res.status(200).json({ message: "Success" });
});

module.exports = router;
