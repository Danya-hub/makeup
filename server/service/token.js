"use strict";

import jsonwebtoken from "jsonwebtoken";

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
        const decodedToken = jsonwebtoken.verify(
            token,
            secretKey,
            callback
        );

        return decodedToken;
    }
}

export default new TokenService();