const jwt = require("jsonwebtoken");
const httpContext = require("express-http-context");
const UserModel = require("../models/user.model");
const HttpError = require("./httpError");

const verifyToken = async (req, res, next) => {
  try {
    console.log("REQ",req.body); 
    if (req.method === "OPTIONS") {
      return next();
    }

    if (!req.header("Authorization") || !req.header("Authorization").length) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "User not authorized.",
      });
    }

    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "User not authorized.",
      });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (e) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "User not authorized.",
      });
    }

    const user = await UserModel.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "User not authorized.",
      });
    }

    req.xuser = user;
    httpContext.set("xuser", {
      _id: user._id,
      fullName: `${user.firstName} ${user.lastName}`,
    });

    next();
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

module.exports = verifyToken;
