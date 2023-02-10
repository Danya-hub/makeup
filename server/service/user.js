"use strict";

import {
    config
} from "dotenv";

import UserModel from "../models/user.js";

import TokenService from "../service/token.js";
import MessageService from "../service/message.js";

import Password from "../utils/password.js";
import ApiError from "../utils/apiError.js";

import errors from "../constant/errors.js";
import {
    JWT_ACCESS_TOKEN_MAX_AGE,
    JWT_REFRESH_TOKEN_MAX_AGE
} from "../constant/auth.js";
import {
    origin,
} from "../constant/server.js";

config();

class UserService {
    channels = ["email", "telephone"];

    constructor() {

    }

    token(value) {
        const accessToken = TokenService.generateToken(value,
                process.env.ACCESS_TOKEN_SECRET_KEY, {
                    expiresIn: JWT_ACCESS_TOKEN_MAX_AGE,
                }),
            refreshToken = TokenService.generateToken(value,
                process.env.REFRESH_TOKEN_SECRET_KEY, {
                    expiresIn: JWT_REFRESH_TOKEN_MAX_AGE,
                });

        return {
            accessToken,
            refreshToken
        }
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
            ...tokens
        };
    }

    async getUser(payload) {
        try {
            const user = await UserModel.findOne(payload)
                .then((user) => user._doc);

            const value = {
                id: user._id,
                roles: user.roles,
            };

            const tokens = this.token(value);

            return {
                ...user,
                ...tokens,
            }
        } catch (_) {
            ApiError.badRequest(errors.notExist("user"));
        }
    }

    async sendPassword(email) {
        const password = Password.generate();
        const hashPassword = Password.hash(password);
console.log(password);
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

    async resetPassword(email) { //!
        try {
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
        } catch (error) {
            throw error;
        }
    }

    async checkNewPassword(key, email, newPassword) {
        try {
            const foundMessage = await MessageService.get({
                topic: "resetPassword",
                email,
            });

            if (!foundMessage) {
                ApiError.noAccess("Time is over");
            }

            const hashPassword = Password.hash(newPassword);

            await this.update({
                email,
                key,
            }, {
                password: hashPassword,
            });
        } catch (error) {
            throw error;
        }
    }

    async byChannel(doc) {
        try {
            const name = this.channels.find((name) => doc[name]);

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
            }
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService();