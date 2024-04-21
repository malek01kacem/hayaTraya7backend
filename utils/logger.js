const HttpError = require("./httpError");

const handleSuccessMessage = (req, res, next) => {
  try {
    console.
    res.status(200).json(res.locals.res_body);
  } catch (e) {
    return next(e);
  }
};

const handleErrorMessage = (err, req, res, next) => {
  if (err) {
    if (err && err.name && err.name.length) {
      return next(new HttpError(err.message, err.code, err, err.stack));
    } else {
      let error = new Error();
      return next(new HttpError(error.message, error.code, error, error.stack));
    }
  }
  next();
};

module.exports = {
  handleSuccessMessage,
  handleErrorMessage,
};
