const { Schema, model } = require("mongoose");
const filedSchema = new Schema(
  {
    fieldName: {
      type: String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    },
    maxPlayers: {
      type: String,
      required: true
    },
    mapLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    address: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const fieldModel = model("Field", filedSchema);
module.exports = fieldModel;
