import errors from "../constant/errors.js";

class ApiError extends Error {
  constructor(status, arrErrors = []) {
    super(errors);

    this.status = status;
    this.errors = arrErrors;
  }

  static notExist(field) {
    throw new ApiError(404, [
      {
        error: errors.notExist(field),
      },
    ]);
  }

  static unauthorized() {
    throw new ApiError(401, {
      error: "This user is unauthorized",
    });
  }

  static noAccess() {
    throw new ApiError(403, {
      error: errors.noAccess(),
    });
  }

  static badRequest(arrErrors) {
    throw new ApiError(400, {
      error: arrErrors,
    });
  }
}

export default ApiError;
