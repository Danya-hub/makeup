import {
    config,
} from "dotenv";

import TokenService from "../service/token.js";

import ApiError from "../utils/apiError.js";

config();

function isAuth(req, res, next) {
    try {
        const [, token] = req.headers.Authorization.split(/\s/);

        if (!token) {
            ApiError.unauthorized();
        }

        const decoded = TokenService.checkOnValidAccessToken(token);

        if (!decoded) {
            ApiError.unauthorized();
        }

        req.body.user = decoded.id;

        next();
    } catch (error) {
        next(error)
    }
}

export {
    isAuth as
    default,
}