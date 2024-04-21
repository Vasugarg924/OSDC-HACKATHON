const express = require("express");
const { signUp, login } = require("../Controllers/authController");
const router = express.Router();

//auth
router.post("/signup", signUp);
router.post("/login", login);

module.exports = router;
