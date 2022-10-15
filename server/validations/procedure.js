import errors from "../constant/errors.js";
import validator from "express-validator";

const validation = {
    create: [
        validator
        .check("startProcTime")
        .exists()
        .withMessage(errors.required("Started time"))
        .bail(),
        validator
        .check("finishProcTime")
        .exists()
        .withMessage(errors.required("Finished time"))
        .bail(),
    ],
};

export {
    validation as default,
};