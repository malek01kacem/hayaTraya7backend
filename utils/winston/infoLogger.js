const { createLogger, format, transports } = require("winston");
const path = require("path");

const infoLogger = createLogger({
  transports: [
    new transports.File({
      filename: path.join("./logs", "systemInfoLogs.log"),
      maxsize: 1000000000,
      maxFiles: "10",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    // new transports.Console()
  ],
});
module.exports = { infoLogger };
