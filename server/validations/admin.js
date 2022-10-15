import UserModel from "../models/user.js";

import validator from "express-validator";
import ApiError from "../utils/apiError.js";

const validation = {
    userBlocking: [
        validator
        .check("id")
        .custom(async (id) => {
            try {
                const finedUser = await UserModel.findById(id);

                if (!finedUser) {
                    ApiError.notExist("user");
                }

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        })
        .bail()
    ]
}

export {
    validation as default,
}