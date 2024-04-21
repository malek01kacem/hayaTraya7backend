const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    userLocation: {
      lat: { type: Number , default: 0 },
      long: { type: Number,  default: 0 },
    },
    deviceId: {
      type: String,
      default: "",
    },
    preferences: {
      type: [
        {
          preferenceType: {
            type: String,
            default: "",
          },
          level: {
            type: String,
            default: "",
          },
        },
      ],
      required: true,
      default: [],
    },
    role: {
      type: String,
      default: "USER",
    },
    isNotificationActive: {
      type: Boolean,
      default: true,
    },
    profileImg: {
      type: String,
      required: true,
    },
    weight: { // poids
      type: String,
      default: false,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = model("User", userSchema);
module.exports = UserModel;
