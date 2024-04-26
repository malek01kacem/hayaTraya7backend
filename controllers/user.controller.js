const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  signUpValidationSchema,
  signInValidationSchema,
} = require("../dto/user.validations");
const HttpError = require("../utils/httpError");
const EventModel = require("../models/event.model");
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const registerUser = async (req, res, next) => {
  try {
    const img = req.file;
    const { error, value } = signUpValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: error.details[0].message,
      });
    }
    const ExistingEmail = await UserModel.findOne({
      email: value.email.toLowerCase(),
    });
    if (ExistingEmail) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "this email not valid.",
      });
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    const defaultImagePath = 'C:/Users/MALEK/Desktop/Backend-main/uploads/userimag/default-image.jpg'; // Specify your default image path here

    const newUser = new UserModel({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email.toLowerCase(),
      phoneNumber: value.phoneNumber,
      gender: value.gender,
      password: hashedPassword,
      profileImg: img && img.path ? img.path : defaultImagePath,
      userLocation: value.userLocation ? JSON.parse(value.userLocation) : null,
    });
    

    await newUser.save();
    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { error, value } = signInValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: error.details[0].message,
      });
    }
    const foundUser = await UserModel.findOne({
      email: value.email.toLowerCase(),
    });
    if (!foundUser) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Invalid Password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      value.password,
      foundUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ userId: foundUser._id }, TOKEN_SECRET);
    await UserModel.findByIdAndUpdate(foundUser._id, {
      deviceId: value.deviceId,
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      token: token,
      user: foundUser,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    //console.log("XUSER",req.xuser); 
    const { _id } = req.xuser;
    console.log("_id",_id);
    const updatedData = req.body;
    console.log("Updated DATA",req.body); 
  const result=  await UserModel.findByIdAndUpdate(_id.toString(), updatedData,{new:true});
  console.log("RES",result); 
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.xuser;
    const img = req.file.path;
    await UserModel.findByIdAndUpdate(_id, {
      profileImg: img,
    });
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let { _id } = req.xuser;
    await UserModel.findByIdAndRemove(_id);

    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getUserById = async (req, res, next) => {
  try {
    let { _id } = req.xuser;
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User Not Found.",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, password, userId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const currentUser = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    return res.status(200).json({
      user: currentUser,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getExternalProfileInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = await UserModel.findById(userId);
    const events = await EventModel.find({ creator: currentUser._id })
      .populate("field")
      .populate("creator")
      .populate("participants");
    return res.status(200).json({
      userProfile: { user: currentUser, eventList: events },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  getExternalProfileInfo,
  updateUserPassword,
  updateUserImage,
};
