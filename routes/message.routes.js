const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/conversation.controller");
const verifyToken = require("../utils/verifToken");

router.get("/owner", verifyToken, messagesController.getAllConversationByUser);
router.post("/send", messagesController.sendMessage);
router.get("/:convId", verifyToken, messagesController.getConverSationById);
router.get(
  "/event/:eventId",
  verifyToken,
  messagesController.getConverSationByEventId
);
module.exports = router;
