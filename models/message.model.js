const { Schema, model } = require("mongoose");
const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isRead: {
      type: Boolean
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event"
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const messageModel = model("Message", messageSchema);
module.exports = messageModel;
