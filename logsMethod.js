const errorLogger = require("./utils/winston/errorLogger");
const infoLogger = require("./utils/winston/infoLogger");

const textRedColor = "\x1b[31m";
const textGreenColor = "\x1b[32m";
const resetColor = "\x1b[0m";
const textBold = "\x1b[1m";

const logSuccess = (obj) => {
  infoLogger.infoLogger.log("info", obj);
};

const logError = (obj) => {
  errorLogger.systemlogger.log("error", obj);
};

const appLog = (req, res, err = null) => {
  if (req.body.password) req.body.password = "**** masked ****";
  var userEmail = (req.xuser ?? { email: "anonymousMail" }).email;
  var restoID = (req.xuser ?? { _id: "anonymousId" })._id;
  var restoName = (req.xuser ?? { resto_name: "anonymousName" }).firstName;

  let logObj = {
    startTime: new Date(req.requestTime).toISOString(),
    originIP: req.originIP,
    method: req.route ? req.route.path : req.originalUrl,
    httpMethod: req.method,
    url: req.originalUrl,
    httpHeaders: req._loggedheaders,
    path: req.path,
    uuid: req.requestUUID,
    restoID: restoID.valueOf(),
    restoName: restoName,
    userEmail: userEmail,
    requestBody: req.body,
    execTimeMS: new Date().getTime() - new Date(req.requestTime).getTime(),
    message: (res.locals.res_body ?? { message: "anonymous message" }).message,
  };
  console.log(
    `${textGreenColor}INFO ${
      logObj["startTime"]
    } ${resetColor}: ENDPOINT: ${textBold}${
      logObj["method"]
    } ${resetColor} METHOD: ${textBold}${
      logObj["httpMethod"]
    } ${resetColor} RESTO_ID: ${textBold}${
      logObj["restoID"]
    } ${resetColor} RESTO_NAME: ${textBold}${
      logObj["restoName"]
    } ${resetColor} REQUEST_BODY: ${textBold}${JSON.stringify(
      logObj["requestBody"]
    )} ${resetColor}`
  );

  if (err) {
    logObj = {
      ...logObj,
      message: err.message ?? "An error occured",
      errorCode: err.apiErrorCode ?? "HTTP_" + (err.code ?? 400),
      errorStack: err.stack,
      errorOrigin: err.sourceError
        ? { error: err.sourceError, errorStack: err.sourceError.stack }
        : null,
    };
    console.log(
      `${textRedColor}ERROR ${
        logObj["startTime"]
      } ${resetColor}: ENDPOINT: ${textBold}${
        logObj["method"]
      }${resetColor}} ${resetColor} RESTO_ID: ${textBold}${
        logObj["restoID"]
      } ${resetColor} RESTO_NAME: ${textBold}${
        logObj["restoName"]
      } ${resetColor} MESSAGE: ${textBold}${
        logObj["message"]
      }${resetColor} CODE_ERROR: ${textBold}${JSON.stringify(
        logObj["errorCode"]
      )}${resetColor} REQUEST_BODY: ${textBold}${JSON.stringify(
        logObj["requestBody"]
      )}${resetColor}`
    );
    logError(logObj);
  } else logSuccess(logObj);
};

module.exports = { appLog };
