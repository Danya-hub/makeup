import validator from "express-validator";
import bcrypt from "bcrypt";

import MySQL from "../utils/db.js";
import UserService from "../service/user.js";
import errors from "../config/errors.js";

class UserValidation {
  sendLinkForResetingPassword = [
    validator
    .check("email")
    .custom(this.isExists),
  ];

  signin = [
    validator
    .check("password")
    .custom(this.comparePassword)
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

  comparePassword(value, {
    req
  }) {
    return UserService.findByChannel(req)
      .then((result) => {
        const isEquil = bcrypt.compareSync(value, result.password);

        if (!isEquil) {
          return Promise.reject(errors.notMatch("password"));
        }

        return Promise.resolve();
      });
  }
}

export default new UserValidation();