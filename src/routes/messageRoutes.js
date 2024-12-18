const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/send", messageController.sendMessage);
router.post("/send-meal", messageController.sendMessageMeal);
router.get("/status", messageController.getStatus);

module.exports = router;
