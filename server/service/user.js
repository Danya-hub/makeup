import MySQL from "../utils/db.js";
import errors from "../config/errors.js";
import {
  JWT_ACCESS_TOKEN_MAX_AGE,
  JWT_REFRESH_TOKEN_MAX_AGE
} from "../config/auth.js";

import TokenService from "./token.js";

import ApiError from "../utils/apiError.js";

class UserService {
  channels = ["email", "telephone"];

  token(value) {
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

  foundByChannel(req) {
    return new Promise((resolve, reject) => {
      const name = this.channels.find((channelName) => req.body[channelName]);

      MySQL.createQuery(
        {
          sql: "SELECT * FROM user WHERE ?? = ?",
          values: [req.body[name], name],
        },
        (error, results) => {
          if (error) {
            throw error;
          }

          if (results.length === 0) {
            ApiError.throw("badRequest", errors.wrongSignin());
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
}

export default new UserService();