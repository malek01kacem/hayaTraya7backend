const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const verifyToken = require("../utils/verifToken");

// Get all notifications
router.get("/", verifyToken, notificationController.getAllNotifications);



// Update a notification by ID
router.put("/:id", verifyToken, notificationController.updateNotificationById);

// Delete a notification by ID
router.delete(
  "/:id",
  verifyToken,
  notificationController.deleteNotificationById
);

// Get all notifications by owner ID
router.get(
  "/owner",
  verifyToken,
  notificationController.getAllNotificationsByOwner
); // New route

module.exports = router;
