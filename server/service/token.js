"use strict";

import jsonwebtoken from "jsonwebtoken";

import ApiError from "../utils/apiError.js";

class TokenService {
    constructor() {

    }

    generateToken(
        value,
        key,
        options,
    ) {
        const token = jsonwebtoken.sign(
            value,
            key,
            options,
        );

        return token;
    }

    checkOnValidToken(token, secretKey, callback = null) {
        try {
            const decodedToken = jsonwebtoken.verify(
                token,
                secretKey,
                callback
            );
    
            return decodedToken;
        } catch (_) {
            ApiError.unauthorized();
        }
    }
}

export default new TokenService();