import errors from "../constant/errors.js";

class ApiError extends Error {
  constructor(status, arrErrors = []) {
    super(errors);

    this.status = status;
    this.errors = arrErrors;
  }

  static notExist(key) {
    throw new ApiError(404, [
      {
        error: errors.notExist(key),
      },
    ]);
  }

  static unauthorized() {
    throw new ApiError(401, {
      error: "This user is unauthorized",
    });
  }

  static noAccess(message) {
    throw new ApiError(403, {
      error: message,
    });
  }

  static badRequest(arrErrors) {
    throw new ApiError(400, {
      error: arrErrors,
    });
  }
}

export default ApiError;
