const express = require("express");
const router = express.Router();
const ChatController = require("./chat.controller");

router.get("/history", ChatController.getChatHistory);
router.post("/send", ChatController.sendMessage);

module.exports = router;
