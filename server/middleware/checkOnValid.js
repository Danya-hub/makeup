import { validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

function checkOnValid(req, res, next) {
  try {
    const errors = validationResult(req);
    const isEmpty = errors.isEmpty();

    if (!isEmpty) {
      ApiError.badRequest(errors.array());
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default checkOnValid;
