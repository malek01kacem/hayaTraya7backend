const { Schema, model } = require("mongoose");

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    notifType: {
      type: String,
      required: true
    },
    eventId: { type: Schema.Types.ObjectId, ref: "Event" },
    chatId: { type: Schema.Types.ObjectId, ref: "Message" },
    isReaden: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

const NotificationModel = model("Notification", NotificationSchema);

module.exports = NotificationModel;
