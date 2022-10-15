import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

import ApiError from "../utils/apiError.js";

dotenv.config();

function roleAccess(roles) {
    return async function (req, res, next) {
        try {
            const [, token] = req.headers.Authorization.split(/\s/);
            const decoded = jsonwebtoken.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET_KEY
            );

            const isEquilRole = roles.every((role) => decoded.roles.includes(role));

            if (!isEquilRole) {
                ApiError.noAccess();
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}

export {
    roleAccess as default,
}