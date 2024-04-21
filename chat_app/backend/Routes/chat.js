const express = require("express");
const authVerify = require("../Middelware/authMiddelware");
const { sendMessage, fetcMessage } = require("../Controllers/chatController");
const router = express.Router();

router.post("/send", authVerify, sendMessage);
router.get("/fetch/:chatId", authVerify, fetcMessage);

module.exports = router;
