import { config } from "dotenv";
import crypto from "crypto";
import bcrypt from "bcrypt";

import db from "../constant/db.js";
import errors from "../constant/errors.js";
import {
  JWT_ACCESS_TOKEN_MAX_AGE,
  JWT_REFRESH_TOKEN_MAX_AGE,
  COOKIE_REFRESH_TOKEN_MAX_AGE,
} from "../constant/auth.js";
import server from "../constant/server.js";

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
    const key = crypto.randomBytes(COUNT_BYTES).toString("hex");

    db.query(
      "INSERT INTO user SET ?",
      {
        ...req.body,
        key,
      },
      (err, result) => {
        try {
          if (err) {
            throw err;
          }

          const tokenValue = {
            id: result.insertId,
          };
          const { accessToken, refreshToken } = User.token(tokenValue);

          res
            .cookie("refreshToken", refreshToken, {
              maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
              httpOnly: true,
            })
            .status(201)
            .json({
              ...req.body,
              accessToken,
            });

          next();
        } catch (error) {
          next(error);
        }
      }
    );
  }

  refresh(req, res, next) {
    const { user } = req.body;

    db.query("SELECT * FROM user WHERE id = ?", [user], (err, result) => {
      try {
        if (err) {
          ApiError.badRequest(errors.notExist("notExistUserValid"));
        }

        const tokenValue = {
          id: result.insertId,
        };
        const { accessToken, refreshToken } = User.token(tokenValue);

        res
          .cookie("refreshToken", refreshToken, {
            maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
            httpOnly: true,
          })
          .status(200)
          .json({
            ...result[0],
            accessToken,
          });

        next();
      } catch (error) {
        next(error);
      }
    });
  }

  logout(req, res, next) {
    const { refreshToken } = req.cookies;

    res.clearCookie("refreshToken").status(200).json({
      success: "The user is logged out",
      token: refreshToken,
    });

    next();
  }

  sendPasswordForCompare(req, res, next) {
    const { email } = req.body;

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
    const { email, password } = req.body;

    db.query(
      "SELECT * FROM message WHERE topic = ? AND email = ?",
      ["password", email],
      (err, result) => {
        try {
          if (err) {
            throw err;
          }

          if (!result.length) {
            ApiError.noAccess(errors.timeOut("comparingPassword"));
          }

          const isEquil = bcrypt.compareSync(password, result[0].template);

          if (!isEquil) {
            ApiError.badRequest(errors.wrongSignin());
          }

          res.status(200).json({
            ...req.body,
            password: result[0].template,
          });

          next();
        } catch (error) {
          next(error);
        }
      }
    );
  }

  sendLinkForResetingPassword(req, res, next) {
    const { email, key } = req.body;
    const values = {
      topic: "resetPassword",
      email,
      template: `${server.origin}/resetPassword/key/${key}/email/${email}`,
    };

    MessageService.send(next, values, () => {
      res.status(200).json({
        success: "There was submited message for reseting password",
      });
    });
  }

  resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const hashPassword = Password.hash(newPassword);
    const { key } = req.query;

    db.query(
      `UPDATE user u SET u.password = ? WHERE u.key = ? 
      AND EXISTS (SELECT * FROM message m WHERE m.email = u.email AND m.topic = ?)`,
      [hashPassword, key, "resetPassword"],
      (err, result) => {
        try {
          if (err) {
            throw err;
          }

          if (result.affectedRows === 0) {
            ApiError.noAccess(errors.timeOut("passwordVerification"));
          }

          res.status(200).json({
            success: "Password is changed",
          });

          next();
        } catch (error) {
          next(error);
        }
      }
    );
  }

  loginUser(req, res, next) {
    UserService.foundByChannel(req)
      .then((result) => {
        const { refreshToken, ...object } = result;

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
