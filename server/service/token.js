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
                    expiresIn: "30m",
                },
            ),
            refreshToken = jsonwebtoken.sign(
                paylaod,
                process.env.REFRESH_TOKEN_SECRET_KEY, {
                    expiresIn: "7d",
                },
            );

        return {
            accessToken,
            refreshToken
        };
    }

    checkOnValidToken(token, secretKey) {
        try {
            const refreshToken = jsonwebtoken.verify(
                token,
                secretKey
            );

            return refreshToken;
        } catch (_) {
            throw ApiError.unauthorized();
        }
    }
}

export default new TokenService();