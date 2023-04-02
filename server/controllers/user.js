import {
  config
} from "dotenv";
import crypto from "crypto";
import bcrypt from "bcrypt";

import MySQL from "../utils/db.js";
import errors from "../config/errors.js";
import {
  JWT_ACCESS_TOKEN_MAX_AGE,
  JWT_REFRESH_TOKEN_MAX_AGE,
  COOKIE_REFRESH_TOKEN_MAX_AGE,
}
from "../config/auth.js";
import server from "../config/server.js";

import UserService from "../service/user.js";
import TokenService from "../service/token.js";
import MessageService from "../service/message.js";

import Password from "../utils/password.js";
import ApiError from "../utils/apiError.js";

config();

const COUNT_BYTES = 32;

class User {
  static channels = ["email", "telephone"];

  static token(value) {
    const accessToken = TokenService.generateToken(value, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: JWT_ACCESS_TOKEN_MAX_AGE,
    });
    const refreshToken = TokenService.generateToken(value, process.env.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: JWT_REFRESH_TOKEN_MAX_AGE,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  createUser(req, res, next) {
    const accessKey = crypto.randomBytes(COUNT_BYTES).toString("hex");
    const values = {
      ...req.body,
      accessKey,
    };

    MySQL.createQuery(
      {
        sql: "INSERT INTO user **",
        values,
      },
      (error, results) => {
        if (error) {
          ApiError.throw("badRequest", errors.alreadyExist("userAlreadyExistsValid"));
        }

        const tokenValue = {
          id: results.insertId,
        };
        const {
          accessToken,
          refreshToken
        } = User.token(tokenValue);

        res.cookie("refreshToken", refreshToken, {
            maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
            httpOnly: true,
          })
          .status(201)
          .json({
            ...req.body,
            accessToken,
          });

        next();
      }
    ).catch(next);
  }

  refresh(req, res, next) {
    const token = req.cookies.refreshToken;

    if (!token) {
      const apiError = ApiError.get("unauthorized");

      next(apiError);
    }

    const decoded = TokenService.checkOnValidToken(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    MySQL.createQuery(
      {
        sql: "SELECT * FROM user WHERE id = ?",
        values: [decoded.id]
      },
      (error, results) => {
        if (error) {
          ApiError.throw("badRequest", errors.notExist("notExistUserValid"));
        }

        const tokenValue = {
          id: results[0].id,
        };
        const {
          accessToken,
          refreshToken
        } = User.token(tokenValue);

        res
          .cookie("refreshToken", refreshToken, {
            maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
            httpOnly: true,
          })
          .status(200)
          .json({
            ...results[0],
            accessToken,
          });

        next();
      }
    ).catch(next);
  }

  logout(req, res, next) {
    const {
      refreshToken
    } = req.cookies;

    res.clearCookie("refreshToken").status(200).json({
      success: "The user is logged out",
      token: refreshToken,
    });

    next();
  }

  sendPasswordForCompare(req, res, next) {
    const {
      email
    } = req.body;

    const password = Password.generate();
    console.log(password);

    const hashPassword = Password.hash(password);
    const values = {
      topic: "comparePassword",
      email,
      template: hashPassword,
    };

    MessageService.send(next, values, () => {
      res.status(200).json({
        passwordToken: hashPassword,
      });
    });
  }

  comparePassword(req, res, next) {
    const {
      email,
      password
    } = req.body;
    const values = {
      topic: "comparePassword",
      email,
    };

    MySQL.createQuery(
      {
        sql: "SELECT * FROM message WHERE topic = :topic AND email = :email",
        values,
      },
      (error, results) => {
        if (error) {
          throw error;
        }

        if (!results.length) {
          ApiError.throw("noAccess", errors.timeOut("comparingPassword"));
        }

        const isEquil = bcrypt.compareSync(password, results[0].template);

        if (!isEquil) {
          ApiError.throw("badRequest", errors.wrongSignin());
        }

        res.status(200).json({
          ...req.body,
          password: results[0].template,
        });

        next();
      }
    ).catch(next);
  }

  sendLinkForResetingPassword(req, res, next) {
    const {
      email
    } = req.body;
    const values = {
      topic: "resetPassword",
      email,
      template: `${server.origin}/resetPassword?email=${email}`,
    };

    MessageService.send(next, values, () => {
      res.status(200).json({
        success: "There was submited message for reseting password",
      });
    });
  }

  resetPassword(req, res, next) {
    const {
      newPassword,
      email
    } = req.body;
    const hashPassword = Password.hash(newPassword);
    const values = {
      password: hashPassword,
      email,
      topic: "resetPassword",
    };

    MySQL.createQuery(
      {
        sql: `UPDATE user u SET u.password = :password WHERE 
          EXISTS (SELECT * FROM message m WHERE m.email = :email AND m.topic = :topic)`,
        values,
      },
      (error, results) => {
        if (error) {
          throw error;
        }

        if (results.affectedRows === 0) {
          ApiError.throw("noAccess", errors.timeOut("passwordVerification"));
        }

        res.status(200).json({
          success: "Password is changed",
        });

        next();
      }
    ).catch(next);
  }

  loginUser(req, res, next) {
    UserService.foundByChannel(req)
      .then((result) => {
        const {
          refreshToken,
          ...object
        } = result;

        res.cookie("refreshToken", refreshToken, {
          maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
          httpOnly: true,
        });
        res.status(201).json(object);

        next();
      })
      .catch((reason) => {
        next(reason);
      });
  }
}

export default new User();