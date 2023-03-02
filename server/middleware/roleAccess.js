import jsonwebtoken from "jsonwebtoken";
import { config } from "dotenv";

import ApiError from "../utils/apiError.js";

config();

function roleAccess(roles) {
  return async function (req, res, next) {
    try {
      const [, token] = req.headers.authorization.split(/\s/);
      const decoded = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

      const isEquilRole = roles.every((role) => decoded.roles.includes(role));

      if (!isEquilRole) {
        ApiError.noAccess();
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export default roleAccess;
