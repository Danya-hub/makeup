import nodemailer from "nodemailer";
import {
  config,
} from "dotenv";
import crypto from "crypto";

import errors from "../config/errors.js";

import UserService from "./user.js";
import MySQL from "../utils/db.js";
import ApiError from "../utils/apiError.js";
import EmailTemplates from "../lang/email/index.js";

config({
  path: "./env/.env.email_bot",
});

class Message {
  COUNT_BYTES = 32;

  async createTransport() {
    const transport = nodemailer.createTransport({
      host: process.env.BOT_EMAIL_HOST,
      port: process.env.BOT_EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.BOT_EMAIL_LOGIN,
        pass: process.env.BOT_EMAIL_APP_PASSWORD,
      },
    });

    return transport;
  }

  generateMessageKey() {
    const key = crypto.randomBytes(this.COUNT_BYTES).toString("hex");

    return key;
  }

  send(columns) {
    return new Promise((resolve, reject) => {
      MySQL.createQuery({
          sql: `INSERT INTO message (email, topic, accessKey, body, expire)
              SELECT :email, :topic, :accessKey, :body, NOW() + INTERVAL 3 MINUTE `,
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

          const foundUserByChannel = await UserService.findByChannelGet({
            body: columns,
          });

          const body = {
            ...columns,
            ...foundUserByChannel,
          };

          const transporter = await this.createTransport();
          const messageInfo = EmailTemplates[body.topic][body.country](body);

          await transporter.sendMail({
            from: process.env.BOT_EMAIL,
            to: body.email,
            ...messageInfo,
          });

          resolve(messageInfo);
        }
      );
    });
  }
}

export default new Message();