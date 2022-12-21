import {
    config,
} from "dotenv";

import TokenService from "../service/token.js";

import ApiError from "../utils/apiError.js";

config();

function isAuth(req, res, next) {
    try {
        const [, token] = req.headers.authorization.split(/\s/);
        
        if (!token) {
            ApiError.unauthorized();
        }
        
        const decoded = TokenService.checkOnValidToken(
            token, 
            process.env.ACCESS_TOKEN_SECRET_KEY,
        );

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