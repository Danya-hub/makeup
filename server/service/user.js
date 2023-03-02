import { config } from "dotenv";

import UserModel from "../models/user.js";

import TokenService from "./token.js";
import MessageService from "./message.js";

import Password from "../utils/password.js";
import ApiError from "../utils/apiError.js";

import errors from "../constant/errors.js";
import { JWT_ACCESS_TOKEN_MAX_AGE, JWT_REFRESH_TOKEN_MAX_AGE } from "../constant/auth.js";
import { origin } from "../constant/server.js";

config();

class UserService {
  channels = ["email", "telephone"];

  token(value) {
    const accessToken = TokenService.generateToken(value, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: JWT_ACCESS_TOKEN_MAX_AGE,
    });
    const refreshToken = TokenService.generateToken(value, process.env.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: JWT_REFRESH_TOKEN_MAX_AGE,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async createUser(doc) {
    const newUser = await UserModel.create(doc);
    await newUser.save();

    const value = {
      id: newUser._id,
      roles: newUser.roles,
    };

    const tokens = this.token(value);

    return {
      ...newUser._doc,
      ...tokens,
    };
  }

  async getUser(payload) {
    try {
      const user = await UserModel.findOne(payload).then((doc) => doc._doc);

      const value = {
        id: user._id,
        roles: user.roles,
      };

      const tokens = this.token(value);

      return {
        ...user,
        ...tokens,
      };
    } catch (_) {
      return ApiError.badRequest(errors.notExist("user"));
    }
  }

  async sendPassword(email) {
    const password = Password.generate();
    const hashPassword = Password.hash(password);

    await MessageService.send({
      topic: "password",
      email,
      template: hashPassword,
    });

    return hashPassword;
  }

  async update(filter, update) {
    const updatedUser = await UserModel.findOneAndUpdate(filter, update);

    return updatedUser;
  }

  async resetPassword(email) {
    const foundMessage = await MessageService.get({
      topic: "resetPassword",
      email,
    });

    if (foundMessage) {
      ApiError.noAccess("Message already is submitted!");
    }

    const foundUser = await this.getUser({
      email,
    });

    await MessageService.send({
      topic: "resetPassword",
      email,
      template: `${origin}/resetPassword?key=${foundUser.key}&email=${foundUser.email}`,
    });
  }

  async checkNewPassword(key, email, newPassword) {
    const foundMessage = await MessageService.get({
      topic: "resetPassword",
      email,
    });

    if (!foundMessage) {
      ApiError.noAccess("Time is over");
    }

    const hashPassword = Password.hash(newPassword);

    await this.update(
      {
        email,
        key,
      },
      {
        password: hashPassword,
      }
    );
  }

  async byChannel(doc) {
    const name = this.channels.find((channelName) => doc[channelName]);

    const foundUser = await UserModel.findOne({
      [name]: doc[name],
    }).then((res) => res?._doc);

    if (!foundUser) {
      throw new Error(errors.wrongSignin());
    }

    const value = {
      id: foundUser._id,
      roles: foundUser.roles,
    };

    const tokens = this.token(value);

    return {
      ...foundUser,
      ...tokens,
    };
  }
}

export default new UserService();
