import validator from "express-validator";
import bcrypt from "bcrypt";

import MySQL from "../utils/db.js";
import UserService from "../service/user.js";
import errors from "../config/errors.js";

class UserValidation {
  sendLinkForResetingPassword = [
    validator
    .check("email")
    .exists({
      checkFalsy: true,
    })
    .withMessage(errors.required("requiredEmailValid"))
    .bail()
    .isEmail()
    .withMessage(errors.wrongFormat("wrongEmailFormatValid"))
    .bail()
    .custom(this.isExists),
  ];

  signin = [
    validator
    .check("password")
    .exists({
      checkFalsy: true,
    })
    .withMessage(errors.required("requiredPasswordValid"))
    .bail()
    .custom(this.comparePassword)
    .withMessage(errors.wrongSignin()),
  ];

  isExists(value, {
    path
  }) {
    return MySQL.createQuery(
      {
        sql: "SELECT * FROM user WHERE ?? = ?",
        values: [path, value]
      },
      (error, results) => {
        if (error) {
          throw error;
        }

        if (!results[0]) {
          throw errors.notExist(`${path}NotExistsValid`);
        }
      }
    );
  }

  isUnique(value, {
    path
  }) {
    return MySQL.createQuery(
      {
        sql: "SELECT * FROM user WHERE ?? = ?",
        values: [path, value],
      },
      (error, results) => {
        if (error) {
          throw error;
        }

        if (results[0]) {
          throw errors.alreadyExist("baseUserInfoAlreadyExistsValid");
        }
      }
    );
  }

  isUserName(value) {
    const isValid = /^\p{L}+(?:\s\p{L}+){0,2}$/u.test(value);

    if (!isValid) {
      return Promise.reject(errors.username());
    }

    return true;
  }

  comparePassword(value, {
    req
  }) {
    return UserService.findByChannel(req)
      .then((result) => {
        const isEquil = bcrypt.compareSync(value, result.password);

        if (!isEquil) {
          return Promise.reject(errors.wrongSignin());
        }

        return Promise.resolve();
      });
  }
}

export default new UserValidation();