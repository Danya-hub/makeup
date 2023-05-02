import bcrypt from "bcrypt";
import crypto from "crypto";

class Password {
  generate(length = 6, wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
    const buffer = new Uint32Array(length);
    const random = crypto.randomFillSync(buffer);

    const password = Array.from(random)
      .map((x) => wishlist[x % wishlist.length])
      .join("");

    return password;
  }

  hash(value) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(value, salt);

    return hash;
  }
}

export default new Password();
