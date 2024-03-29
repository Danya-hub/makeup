import {
  config,
} from "dotenv";

import MySQL from "../utils/db.js";
import errors from "../config/errors.js";

import TokenService from "./token.js";

import ApiError from "../utils/apiError.js";

config({
  path: "./env/.env.auth"
});

class UserService {
  channels = ["email", "telephone"];

  token(value) {
    const accessToken = TokenService.generateToken(value,
      process.env.JWT_AUTH_ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: process.env.JWT_AUTH_ACCESS_TOKEN_MAX_AGE,
      });
    const refreshToken = TokenService.generateToken(value,
      process.env.JWT_AUTH_REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: process.env.JWT_AUTH_REFRESH_TOKEN_MAX_AGE,
      });

    return {
      accessToken,
      refreshToken,
    };
  }

  findByChannelThrow(req) {
    return new Promise((resolve, reject) => {
      const name = this.channels.find((channelName) => req.body[channelName]);

      MySQL.createQuery({
          sql: "SELECT * FROM user WHERE ?? = ?",
          values: {
            columns: [name, req.body[name]],
            formatName: "keyAndValueArray",
          },
        },
        (error, results) => {
          if (error) {
            throw error;
          }

          if (results.length === 0) {
            throw errors.wrongSignin();
          }

          const tokenValue = {
            id: results[0].id,
          };
          const tokens = this.token(tokenValue);

          resolve({
            ...results[0],
            ...tokens,
          });
        }
      ).catch(reject);
    });
  }

  findByChannelGet(req) {
    return new Promise((resolve) => {
      const name = this.channels.find((channelName) => req.body[channelName]);

      MySQL.createQuery({
          sql: "SELECT * FROM user WHERE ?? = ?",
          values: {
            columns: [name, req.body[name]],
            formatName: "keyAndValueArray",
          },
        },
        (error, results) => {
          if (error) {
            throw error;
          }

          if (results.length === 0) {
            throw errors.wrongSignin();
          }

          const tokenValue = {
            id: results[0].id,
          };
          const tokens = this.token(tokenValue);

          resolve({
            ...results[0],
            ...tokens,
          });
        }
      ).catch(() => resolve({}));
    });
  }

  findById(id) {
    return MySQL.createQuery({
        sql: "SELECT * FROM user WHERE ?? = ?",
        values: {
          columns: ["id", id],
          formatName: "keyAndValueArray",
        },
      },
      (error) => {
        if (error) {
          ApiError.throw("badRequest", errors.notExist("notExistUserValid"));
        }
      }
    );
  }

  findByValue(params) {
    return new Promise((resolve, reject) => {
      MySQL.createQuery({
          sql: "SELECT * FROM user WHERE ?? = ?",
          values: {
            columns: [params.key, params.value],
            formatName: "keyAndValueArray",
          },
        },
        (error, results) => {
          if (error) {
            reject(error);
          }

          if (results[0]) {
            resolve(results);
          } else {
            reject(results);
          }
        }
      );
    });
  }

  editById(req) {
    const {
      field,
      data,
      id,
    } = req.body;

    return new Promise((resolve, reject) => {
      MySQL.createQuery({
          sql: `UPDATE user SET ** WHERE id = ${id}`,
          values: {
            columns: data,
            formatName: "column",
          },
        },
        (error, results) => {
          if (error) {
            reject(ApiError.get("alreadyExist", {
              ...errors.alreadyExist(`${field}AlreadyExistsValid`),
              name: field,
            }));
          }

          resolve(results);
        }
      );
    });
  }
}

export default new UserService();