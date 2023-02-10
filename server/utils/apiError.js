"use strict";

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
            error: errors.notExist(field),
        }]);
    }

    static unauthorized() {
        throw new ApiError(401, {
            error: "This user is unauthorized"
        });
    }

    static noAccess() {
        throw new ApiError(403, {
            error: errors.noAccess()
        });
    }

    static badRequest(errors) {
        throw new ApiError(400, {
            error: errors
        });
    }
}

export {
    ApiError as
    default,
}