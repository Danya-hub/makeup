import passport from "passport";
import {
    config,
} from "dotenv";

import validation from "../validations/user.js";
import checkOnValid from "../middleware/checkOnValid.js";
import UserModel from "../models/user.js";
import UserService from "../service/user.js";
import TokenService from "../service/token.js";

import ApiError from "../utils/apiError.js";

config();

const AuthController = {
    post: {
        signup() {
            return [
                validation.signup,
                checkOnValid,
                async (req, res, next) => {
                    try {
                        const newUser = await UserService.createUser(req.body);

                        res.status(201).json(newUser);
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ];
        },
        signin() {
            return [
                validation.signin,
                checkOnValid,
                async (req, res, next) => {
                    try {
                        const user = await UserModel.findOne({
                            telephone: req.body.telephone,
                        });

                        const {
                            password: _,
                            ...userWithoutPassword
                        } = user._doc;

                        const tokens = TokenService.generateTokens({
                            id: userWithoutPassword._id,
                            roles: userWithoutPassword.roles,
                        });

                        res.cookie(
                            "refreshToken",
                            tokens.refreshToken, {
                                maxAge: 7 * 24 * 60 * 60 * 1000, 
                                httpOnly: true,
                            }
                        );
                        res.status(201).json({
                            ...userWithoutPassword,
                            ...tokens,
                        });
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ];
        },
        logout() {
            return [
                (req, res, next) => {
                    try {
                        const {
                            refreshToken
                        } = req.cookies;
                        res.clearCookie("refreshToken");

                        res.json({
                            msg: "The user is logout",
                            token: refreshToken,
                        });
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ]
        }
    },
    get: {
        google() {
            return [
                passport.authenticate("google", {
                    scope: ["profile", "email"],
                }),
            ];
        },
        ["google/callback"]() {
            return [
                passport.authenticate("google", {
                    successRedirect: "/auth/success",
                    failureRedirect: "/auth/failure"
                }),
            ]
        },
        success() {
            return [
                async (req, res, next) => {
                    try {
                        if (!req.user) {
                            ApiError.unauthorized();
                        }

                        const user = await UserService.createUser(req.user);
                        const tokens = TokenService.generateTokens({
                            id: user._id,
                            roles: user.roles,
                        });

                        const {
                            password: _,
                            ...userWithoutPassword
                        } = user._doc;

                        res.cookie(
                            "refreshToken",
                            tokens.refreshToken, {
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                                httpOnly: true,
                            }
                        );
                        res.status(201).json({
                            ...userWithoutPassword,
                            ...tokens,
                        });
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ]
        },
        failure() {
            return [
                (req, res) => {
                    res.send("failure");
                }
            ]
        },
        refresh() {
            return [
                async (req, res, next) => {
                    try {
                        if (!req.cookies.refreshToken) {
                            ApiError.unauthorized();
                        }

                        const decoded = TokenService.checkOnValidToken(
                            req.cookies.refreshToken,
                            process.env.REFRESH_TOKEN_SECRET_KEY,
                        );
                        
                        const user = await UserModel.findById(decoded.id);
                        const tokens = TokenService.generateTokens({
                            id: user._id,
                            roles: user.roles,
                        });
                        const {
                            password: _,
                            ...userWithoutPassword
                        } = user._doc;

                        res.cookie(
                            "refreshToken",
                            tokens.refreshToken, {
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                                httpOnly: true,
                            }
                        );
                        res.status(200).json({
                            ...userWithoutPassword,
                            ...tokens,
                        });
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ]
        }
    },
};

export {
    AuthController as default,
}