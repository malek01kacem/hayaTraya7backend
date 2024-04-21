const { Schema, model } = require("mongoose");
const eventSchema = new Schema(
  {
  
    description: {
      type: String,
      required: true,
    },
    requests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    eventType: {
      type: String,
      required: true,
      enum: ["TENNIS","PAINTBALL","CARTING"],
    },
    field: {
      type: Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    chat: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    isExpired: {
      type: Boolean,
      default: false,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    eventInfo: {
      eventType: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        required: true,
      },
      totalPlayers: {
        type: Number,
        required: true,
      },
      isPrivate: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    eventImgs: {
      type: [],
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const EventModel = model("Event", eventSchema);

module.exports = EventModel;
