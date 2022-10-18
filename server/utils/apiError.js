import errors from "../constant/errors.js";

class ApiError extends Error {
    constructor(
        status,
        errors = [],
    ) {
        super(errors);

        this.status = status;
        this.errors = errors;
    }

    static notExist(field) {
        throw new ApiError(404, [{
            msg: errors.notExist(field),
        }]);
    }

    static unauthorized() {
        throw new ApiError(401, "This user is unauthorized");
    }

    static noAccess() {
        throw new ApiError(403, errors.noAccess());
    }

    static badRequest(errors) {
        throw new ApiError(400, errors);
    }
}

export {
    ApiError as
    default,
}