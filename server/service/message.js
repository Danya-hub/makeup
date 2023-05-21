import nodemailer from "nodemailer";

import errors from "../config/errors.js";

import UserService from "./user.js";
import MySQL from "../utils/db.js";
import ApiError from "../utils/apiError.js";
import EmailTemplates from "../lang/email/index.js";

class Message {
  oAuth2Client = null;

  async createTransport() {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BOT_EMAIL,
        pass: process.env.BOT_APP_PASSWORD,
      },
    });

    return transport;
  }

  send(columns) {
    return new Promise((resolve, reject) => {
      MySQL.createQuery({
          sql: `INSERT INTO message (email, topic, value, expire)
              SELECT :email, :topic, :value, NOW() + INTERVAL 3 MINUTE`,
          values: {
            columns,
            formatName: "keysAndValuesObject",
          },
        },
        async (error) => {
          if (error) {
            reject(ApiError.get("alreadyExist", {
              ...errors.alreadyExist("submitedMessageValid"),
              name: "message",
            }));
            return;
          }

          let options = columns;

          await UserService.findByChannel({
              body: columns,
            })
            .then((res) => {
              options = {
                ...options,
                ...res,
              };
            })
            // eslint-disable-next-line no-console
            .catch(console.error);

            const transporter = await this.createTransport();
            const messageInfo = EmailTemplates[columns.topic][options.country](options);

          await transporter.sendMail({
            from: process.env.BOT_EMAIL,
            to: columns.email,
            ...messageInfo,
          });

          resolve(messageInfo);
        }
      );
    });
  }
}

export default new Message();