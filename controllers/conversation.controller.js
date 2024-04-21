const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const { formatType } = require("../utils/formatType");
const { sendNotification } = require("../utils/notification");
const { createNotification } = require("./notification.controller");

const createNewConversation = async (eventId) => {
  try {
    const savedConv = new Conversation({
      participants: [],
      eventId: eventId,
      messages: [],
      isDeleted: false
    });
    const resp = await savedConv.save();
    return resp;
  } catch (error) {
    console.log("Error", error);
    return null;
  }
};

const joinConversationByEvent = async (userId, eventId) => {
  try {
    const conv = await Conversation.findOne({ eventId: eventId });

    conv.participants = [...conv.participants, userId];
    const resp = await conv.save();
    return resp;
  } catch (error) {
    console.log("Error", error);
    return null;
  }
};

const getAllConversationByUser = async (req, res) => {
  try {
    const userId = req.xuser;
    const conversationList = await Conversation.find({
      participants: { $in: [userId] }
    })
      .populate("eventId")
      .populate({
        path: "participants",
        select: "firstName lastName _id"
      })
      .populate({
        path: "eventId",
        populate: {
          path: "field",
          model: "Field",
          select: "fieldName mapLocation address"
        }
      })
      .select("-messages");
    res.json({ success: true, conversationList: conversationList });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content, convId, userId, eventId } = req.body;
    const convo = await Conversation.findById(convId).populate("participants");
    const message = new Message({
      eventId: eventId,
      conversation: convId,
      message: content,
      sender: userId
    });
    const savedMessage = await message.save();
    convo.messages = [...convo.messages, savedMessage._id];
    await convo.save();
    const conv = await Conversation.findById(convId).populate({
      path: "messages",
      populate: {
        path: "sender",
        model: "User",
        select: "firstName lastName _id"
      }
    });
    const messageSent = await Message.findById(savedMessage._id).populate(
      "sender"
    );
    const sentNotifs = convo.participants.map(async (user) => {
      const notifResult = await sendNotification(
        user.deviceId,
        "Nouveau message réçu",
        `${messageSent.sender.firstName} ${messageSent.sender.firstName} à envoyé un message`
      );
      const notif = await createNotification(
        "Nouveau message réçu",
        `${messageSent.sender.firstName} ${messageSent.sender.firstName} à envoyé un message`,
        "MESSAGE_REQUEST",
        user._id,
        null,
        conv._id
      );
    });
    const resp = await Promise.all(sentNotifs);

    res.json({ success: true, conversation: conv });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
const getConverSationById = async (req, res) => {
  try {
    const { convId } = req.params;
    const conv = await Conversation.findById(convId).populate({
      path: "messages",
      options: { sort: { createdAt: -1 } }, // Sort messages in ascending order by createdAt
      populate: {
        path: "sender",
        model: "User",
        select: "firstName lastName _id"
      }
    });
    res.json({ success: true, conversation: conv });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getConverSationByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const conv = await Conversation.findOne({ eventId: eventId }).populate({
      path: "messages",
      options: { sort: { createdAt: -1 } }, // Sort messages in ascending order by createdAt
      populate: {
        path: "sender",
        model: "User",
        select: "firstName lastName _id"
      }
    });
    res.json({ success: true, conversation: conv });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
module.exports = {
  createNewConversation,
  joinConversationByEvent,
  sendMessage,
  getAllConversationByUser,
  getConverSationById,
  getConverSationByEventId
};
