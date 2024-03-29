import errors from "../config/errors.js";

export const errorList = {
  notExist(key) {
    return [404, [{
      error: errors.notExist(key),
    }]];
  },
  alreadyExist(message) {
    return [409, {
      error: message,
    }];
  },
  unauthorized() {
    return [401, {
      error: "This user is unauthorized",
    }];
  },
  noAccess(message) {
    return [403, {
      error: message,
    }];
  },
  badRequest(message) {
    return [400, {
      error: message,
    }];
  },
  wrongSignin(message) {
    return [400, {
      error: message,
    }];
  },
};

class ApiError extends Error {
  constructor(status, arrErrors = []) {
    super(errors);

    this.status = status;
    this.errors = arrErrors;
  }

  static get(errName, args) {
    const options = errorList[errName](args);

    return new ApiError(...options);
  }

  static throw(errName, args) {
    const options = errorList[errName](args);

    throw new ApiError(...options);
  }
}

export default ApiError;