const express = require("express");
const { handleUserSignup, handleUserLogin } = require("../controllers/user");

const router = express.Router();

// Route for user signup
router.post("/signup", handleUserSignup);

// Route for user login
router.post("/login", handleUserLogin);

module.exports = router;