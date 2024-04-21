const Notification = require("../models/notification.model");

// Create a new notification
const createNotification = async (
  title,
  message,
  type,
  owner,
  eventId,
  chatId = null
) => {
  try {
    const notification = new Notification({
      title: title,
      message: message,
      notifType: type,
      owner: owner,
      eventId: eventId,
      chatId: chatId
    });
    const notif = await notification.save();
    return notif;
  } catch (error) {
    return null;
  }
};

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch notifications." });
  }
};

// Get a specific notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch the notification." });
  }
};

// Update a notification by ID
const updateNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Could not update the notification." });
  }
};

// Delete a notification by ID
const deleteNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndRemove(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Could not delete the notification." });
  }
};
const getAllNotificationsByOwner = async (req, res) => {
  try {
    console.log("Here")
    const ownerId = req.xuser._id;
    const notifications = await Notification.find({ owner: ownerId });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Could not fetch notifications by owner." });
  }
};
module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
  getAllNotificationsByOwner
};
