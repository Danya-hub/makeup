import jsonwebtoken from "jsonwebtoken";
import {
  config
} from "dotenv";

import ApiError from "../utils/apiError.js";

config({
  path: "./env/.env.auth",
});

function roleAccess(roles) {
  return async function (req, res, next) {
    try {
      const [, token] = req.headers.authorization.split(/\s/);
      const decoded = jsonwebtoken.verify(token, process.env.JWT_AUTH_ACCESS_TOKEN_SECRET_KEY);

      const isEquilRole = roles.every((role) => decoded.roles.includes(role));

      if (!isEquilRole) {
        ApiError.throw("noAccess", "You do not have a access");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export default roleAccess;