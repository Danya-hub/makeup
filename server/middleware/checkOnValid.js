import {
    validationResult,
} from "express-validator";
import ApiError from "../utils/apiError.js";

function checkOnValid(req, res, next) {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            ApiError.badRequest(errors.array());
        }

        next();
    } catch (error) {
        next(error);
    }
}

export {
    checkOnValid as default,
}