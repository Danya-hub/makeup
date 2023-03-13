import validator from "express-validator";
import bcrypt from "bcrypt";

import db from "../constant/db.js";
import errors from "../constant/errors.js";

import UserService from "../service/user.js";

const range = {
  min: 3,
  max: 20,
};

class UserValidation {
  sendPasswordForCompare = [
    validator
    .check("fullname")
    .exists({
      checkFalsy: true,
    })
    .withMessage(errors.required("requiredFullnameValid"))
    .bail()
    .isLength(range)
    .withMessage(errors.inRange("fullname", range))
    .bail()
    .custom(this.isUserName),
    validator
    .check("telephone")
    .exists({
      checkFalsy: true,
    })
    .withMessage(errors.required("requiredTelephoneValid"))
    .bail()
    .isMobilePhone("any")
    .withMessage(errors.wrongFormat("wrongTelFormatValid"))
    .bail()
    .custom(this.isUnique),
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
    .custom(this.isUnique),
  ];

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
    validator
    .check("key")
    .exists({
      checkFalsy: true,
    })
    .withMessage(errors.required("requiredKeyValid"))
  ];

  signin = [
    validator.oneOf(
      [
        validator
        .check("telephone")
        .exists({
          checkFalsy: true,
        })
        .withMessage(errors.required("requiredTelOrEmailValid"))
        .bail()
        .isMobilePhone("any")
        .withMessage(errors.wrongFormat("wrongTelFormatValid")),
        validator
        .check("email")
        .exists({
          checkFalsy: true,
        })
        .withMessage(errors.required("requiredTelOrEmailValid"))
        .bail()
        .isEmail()
        .withMessage(errors.wrongFormat("wrongEmailFormatValid")),
      ],
      errors.wrongChannels()
    ),
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
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user WHERE ?? = ?", [path, value], (err, result) => {
        if (err) {
          return reject(err);
        }

        if (!result[0]) {
          return reject(errors.notExist("emailOrTelephoneNotExistsValid"));
        }

        return resolve(result);
      });
    });
  }

  isUnique(value, {
    path
  }) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user WHERE ?? = ?", [path, value], (err, result) => {
        if (err) {
          return reject(err);
        }

        if (result[0]) {
          return reject(errors.alreadyExist("emailOrTelephoneAlreadyExistsValid"));
        }

        return resolve(result);
      });
    });
  }

  isUserName(value) {
    const isValid = /^\p{L}+(?:\s\p{L}+){0,2}$/u.test(value);

    if (!isValid) {
      return Promise.reject(errors.fullname());
    }

    return true;
  }

  comparePassword(value, {
    req
  }) {
    return UserService.foundByChannel(req).then((result) => {
      const isEquil = bcrypt.compareSync(value, result.password);

      if (!isEquil) {
        return Promise.reject(errors.wrongSignin());
      }

      return Promise.resolve();
    });
  }
}

export default new UserValidation();