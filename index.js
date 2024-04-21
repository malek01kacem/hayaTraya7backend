const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const httpContext = require("express-http-context");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config(); // Load environment variables from .env file
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const admin = require("firebase-admin");
const serviceAccount = require("./constants/gerrap-api-firebase-adminsdk-te92w-a478977635.json");
// set logger config.
const systemLog = require("./logsMethod");
const { handleSuccessMessage, handleErrorMessage } = require("./utils/logger");
initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "gerrap-api"
});
//Import Routes
const userRouter = require("./routes/user.routes");
const fieldRouter = require("./routes/field.routes");
const eventsRouter = require("./routes/events.routes");
const notifRouter = require("./routes/notifications.routes");
const messagesRouter = require("./routes/message.routes");
const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3500;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin"
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


const requestLogInit = function (req, res, next) {
  req.requestTime = Date.now();
  req.requestUUID = crypto.randomUUID();
  req.originIP = req.header("x-forwarded-for") || req.connection.remoteAddress;
  req._loggedheaders = JSON.parse(JSON.stringify(req.headers));
  if (req._loggedheaders.authorization)
    req._loggedheaders.authorization = "**** masked ****";
  next();
};

// the loghanders functions.
function logHandler(req, res, next) {
  try {
    systemLog.appLog(req, res);
    next();
  } catch (ierr) {
    console.log("Internal error in Logging", ierr);
  }
}

function logErrors(err, req, res, next) {
  try {
    systemLog.appLog(req, res, err);
  } catch (ierr) {
    console.log("Internal error in Logging", ierr);
  }
  // Send Http Response with Error structure
  if (!res.headersSent) {
    res.status(err.code ?? 400).json({
      success: false,
      errorCode: err.apiErrorCode ?? "HTTP_" + (err.code ?? 400),
      message: err.message ?? "Unknown Error"
      // stack: err.stack,
    });
  }
}
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));

app.use(httpContext.middleware);
app.use(cors());
app.use(requestLogInit);
app.use(express.json());

// static files.
app.use("/api/uploads", express.static(path.join(__dirname, "./uploads")));

//assign Routes
app.use("/api/users", userRouter);
app.use("/api/fields", fieldRouter);
app.use("/api/events", eventsRouter);
app.use("/api/notifications", notifRouter);
app.use("/api/messages", messagesRouter);
/* Should be the last middlewares defined here */
//app.use(handleErrorMessage);
// app.use(logErrors);
// app.use(logHandler);
//app.use(handleSuccessMessage);

// Start the Express server
httpServer.listen(PORT, () => {
  console.log(`your app listen at port ${PORT}`);
});
