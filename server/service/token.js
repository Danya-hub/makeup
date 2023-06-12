import jsonwebtoken from "jsonwebtoken";

import errors from "../config/errors.js";

import ApiError from "../utils/apiError.js";

class TokenService {
  generateToken(value, key, options) {
    const token = jsonwebtoken.sign(value, key, options);

    return token;
  }

  checkOnValidToken(token, secretKey, message) {
    let decodedToken = null;

    jsonwebtoken.verify(token, secretKey, (err, decoded) => {
      if (err) {
        ApiError.throw("noAccess", errors.timeOut(message));
      } else {
        decodedToken = decoded;
      }
    });

    return decodedToken;
  }
}

export default new TokenService();