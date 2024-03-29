import {
  config
} from "dotenv";

import TokenService from "../service/token.js";

import ApiError from "../utils/apiError.js";

config({
  path: "./env/.env.auth",
});

function isAuth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      ApiError.throw("unauthorized");
    }

    const [, token] = req.headers.authorization.split(/\s/);
    const decoded = TokenService.checkOnValidToken(
      token,
      process.env.JWT_AUTH_ACCESS_TOKEN_SECRET_KEY,
      "unauthorized",
    );

    req.params.user = decoded.id;

    next();
  } catch (error) {
    next(error);
  }
}

export default isAuth;