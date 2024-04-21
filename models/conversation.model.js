const { Schema, model } = require("mongoose");

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    isDeleted: {
      type: Boolean,
      default: false
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event"
    }
  },
  {
    timestamps: true
  }
);

const ConversationModel = model("Conversation", conversationSchema);

module.exports = ConversationModel;
