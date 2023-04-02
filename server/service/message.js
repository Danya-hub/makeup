import errors from "../config/errors.js";

import MySQL from "../utils/db.js";
import ApiError from "../utils/apiError.js";

class Message {
  send(next, values, successback) {
    MySQL.createQuery(
      {
        sql: `INSERT INTO message (email, topic, template, expire)
            SELECT :email, :topic, :template, NOW() + INTERVAL 3 MINUTE
            WHERE NOT EXISTS (SELECT * FROM message m WHERE m.email = :email AND m.topic = :topic)`,
        values,
      },
      (error) => {
        if (error) {
          ApiError.throw("badRequest", errors.alreadyExist("submitedMessageValid"));
        }

        successback();

        next();
      }
    ).catch(next);
  }
}

export default new Message();