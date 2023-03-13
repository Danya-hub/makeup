import db from "../constant/db.js";
import errors from "../constant/errors.js";
import { JWT_ACCESS_TOKEN_MAX_AGE, JWT_REFRESH_TOKEN_MAX_AGE } from "../constant/auth.js";

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

      db.query("SELECT * FROM user WHERE ?? = ?", [name, req.body[name]], (err, result) => {
        try {
          if (err) {
            throw err;
          }

          if (result.length === 0) {
            ApiError.badRequest(errors.wrongSignin());
          }

          const tokenValue = {
            id: result[0].id,
          };

          const tokens = this.token(tokenValue);

          resolve({
            ...result[0],
            ...tokens,
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

export default new UserService();
