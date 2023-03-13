import db from "../constant/db.js";
import errors from "../constant/errors.js";

import ApiError from "../utils/apiError.js";

class Message {
  send(next, values, successback) {
    db.query(
      `INSERT INTO message (email, topic, template, expire)
        SELECT "${values.email}", "${values.topic}", "${values.template}", NOW() + INTERVAL 3 MINUTE
        WHERE NOT EXISTS (SELECT * FROM message m WHERE m.email = "${values.email}" AND m.topic = "${values.topic}")`,
      values,
      (err) => {
        try {
          if (err) {
            ApiError.badRequest(errors.alreadyExist("submitedMessageValid"));
          }

          successback();

          next();
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

export default new Message();