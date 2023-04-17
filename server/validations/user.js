import validator from "express-validator";
import bcrypt from "bcrypt";

import MySQL from "../utils/db.js";
import UserService from "../service/user.js";
import errors from "../config/errors.js";

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
    .custom(this.isUserName)
    .bail()
    .custom(this.isUnique),
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
    .withMessage(errors.wrongFormat("wrongEmailFormatValid")),
    validator
    .check("birthday")
    .exists({
      checkFalsy: true,
    })
    .withMessage(errors.required("requiredBirthday")),
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
    return MySQL.createQuery(
      {
        sql: "SELECT * FROM user WHERE ?? = ?",
        values: [value, path]
      },
      (error, results) => {
        if (error) {
          throw error;
        }

        if (!results[0]) {
          throw errors.notExist("emailOrTelephoneNotExistsValid");
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
        values: [value, path],
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
      return Promise.reject(errors.fullname());
    }

    return true;
  }

  comparePassword(value, {
    req
  }) {
    return UserService.findByChannel(req).then((result) => {
      const isEquil = bcrypt.compareSync(value, result.password);

      if (!isEquil) {
        return Promise.reject(errors.wrongSignin());
      }

      return Promise.resolve();
    });
  }
}

export default new UserValidation();