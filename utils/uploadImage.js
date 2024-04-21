const multer = require("multer");
const path = require("path");
const uuid = require("uuid");
const fs = require("fs");
const HttpError = require("./httpError");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const imageUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 50, // 10 MB
    files: 20, // Maximum 5 files
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dpath = path.join("uploads/");
      fs.mkdirSync(dpath, { recursive: true });
      cb(null, dpath);
    },
    filename: function (req, file, cb) {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid.v1() + "." + ext);
    },
  }),
  fileFilter: (rq, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid
      ? null
      : new HttpError(
          "Invalid mime type!",
          400,
          "Invalid mime type!",
          "Invalid mime type!"
        );
    cb(error, isValid);
  },
});

module.exports = imageUpload;
