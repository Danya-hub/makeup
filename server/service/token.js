import jsonwebtoken from "jsonwebtoken";

import ApiError from "../utils/apiError.js";

class TokenService {
  generateToken(value, key, options) {
    const token = jsonwebtoken.sign(value, key, options);

    return token;
  }

  checkOnValidToken(token, secretKey) {
    let decodedToken = null;

    jsonwebtoken.verify(token, secretKey, (err, decoded) => {
      if (err) {
        ApiError.unauthorized();
      } else {
        decodedToken = decoded;
      }
    });

    return decodedToken;
  }
}

export default new TokenService();
