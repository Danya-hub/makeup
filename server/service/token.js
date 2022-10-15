import jsonwebtoken from "jsonwebtoken";
import {
    config,
} from "dotenv";

config();

class TokenService {
    constructor() {

    }

    generateTokens(paylaod) {
        const accessToken = jsonwebtoken.sign(
                paylaod,
                process.env.ACCESS_TOKEN_SECRET_KEY, {
                    expiresIn: "10s",
                },
            ),
            refreshToken = jsonwebtoken.sign(
                paylaod,
                process.env.REFRESH_TOKEN_SECRET_KEY, {
                    expiresIn: "60s",
                },
            );

        return {
            accessToken,
            refreshToken
        };
    }

    checkOnValidAccessToken(token) {
        try {
            const accessToken = jsonwebtoken.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET_KEY
            );

            return accessToken;
        } catch (_) {
            return null;
        }
    }

    checkOnValidRefreshToken(token) {
        try {
            const refreshToken = jsonwebtoken.verify(
                token,
                process.env.REFRESH_TOKEN_SECRET_KEY
            );

            return refreshToken;
        } catch (_) {
            return null;
        }
    }
}

export default new TokenService();