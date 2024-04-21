class HttpError extends Error {
    constructor(
      message = "General error, please try again later",
      errorCode = 400,
      sourceError = null,
      stack = null
    ) {
      super(message);
      this.code = errorCode;
      this.sourceError = sourceError;
      this.stack = stack;
    }
  }
  
  module.exports = HttpError;
