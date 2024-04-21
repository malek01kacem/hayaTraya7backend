const { createLogger, format, transports } = require("winston");
const path = require("path");

const systemlogger = createLogger({
  transports: [
    new transports.File({
      filename: path.join("logs/", "systemErrorLogs.log"),
      maxsize: 1000000000,
      maxFiles: "10",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
    // new transports.Console(),
  ],
});
module.exports = { systemlogger };
