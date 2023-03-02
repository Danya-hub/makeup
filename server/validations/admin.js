import validator from "express-validator";

import UserModel from "../models/user.js";
import errors from "../constant/errors.js";

const validation = {
  userBlocking: [
    validator
      .check("id")
      .custom(async (id) => {
        try {
          const foundUser = await UserModel.findById(id);

          if (!foundUser) {
            throw errors.notExist("user");
          }

          return Promise.resolve();
        } catch (error) {
          return Promise.reject(error);
        }
      })
      .bail(),
  ],
};

export default validation;
