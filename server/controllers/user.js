import {
  config
} from "dotenv";
import crypto from "crypto";
import bcrypt from "bcrypt";

import Value from "../utils/value.js";
import MySQL from "../utils/db.js";
import errors from "../config/errors.js";
import {
  JWT_ACCESS_TOKEN_MAX_AGE,
  JWT_REFRESH_TOKEN_MAX_AGE,
  COOKIE_REFRESH_TOKEN_MAX_AGE,
}
from "../config/auth.js";
import {
  server
} from "../config/server.js";

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
    const formated = Value.toSQLDate(req.body);

    const accessKey = crypto.randomBytes(COUNT_BYTES).toString("hex");
    const values = {
      ...formated,
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
          refreshToken,
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

  async refresh(req, res, next) {
    if (!req.cookies.refreshToken) {
      const apiError = ApiError.get("unauthorized");

      next(apiError);
      return;
    }

    const decoded = TokenService.checkOnValidToken(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    const user = await UserService.findById(decoded.id)
      .catch(next);

    if (!user[0]) {
      const apiError = ApiError.get("unauthorized");

      next(apiError);
      return;
    }

    const tokenValue = {
      id: user[0].id,
    };
    const {
      accessToken,
      refreshToken
    } = UserService.token(tokenValue);

    res
      .cookie("refreshToken", refreshToken, {
        maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
        httpOnly: true,
      })
      .status(200)
      .json({
        ...user[0],
        accessToken,
      });

    next();
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

    const hashPassword = Password.hash(password);
    const values = {
      topic: "comparePassword",
      email,
      template: hashPassword,
    };

    MessageService.send(next, values, () => {
      console.log(password);
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

  async isUnique(req, res, next) {
    await UserService.findByValue(req.params)
    .then(() => res.status(400).json({
      ...errors.alreadyExist(`${req.params.key}AlreadyExistsValid`),
      args: {
        key: req.params.key,
        value: req.params.value,
      },
    }))
    .catch(() => {
      res.status(200).json({
        key: "isUniqueValid",
      });
    });

    next();
  }

  sendLinkForResetingPassword(req, res, next) {
    const {
      email
    } = req.body;
    const values = {
      topic: "resetPassword",
      email,
      template: `${server.origin}/resetPassword/${email}`,
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
          ApiError.throw("noAccess", errors.timeOut("resettingPassword"));
        }

        res.status(200).json({
          success: "Password is changed",
        });

        next();
      }
    ).catch(next);
  }

  login(req, res, next) {
    UserService.findByChannel(req)
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
      .catch(next);
  }
}

export default new User();