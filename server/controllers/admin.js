"use strict";

import {
    validationResult,
} from "express-validator";

import UserModel from "../models/user.js";
import isAuth from "../middleware/isAuth.js";
import roleAccess from "../middleware/roleAccess.js";
import validation from "../validations/admin.js";
import ApiError from "../utils/apiError.js";

const AdminController = {
    patch: {
        ["block/:id"]() {
            return [
                isAuth,
                roleAccess(["admin"]),
                validation.userBlocking,
                async (req, res, next) => {
                    try {
                        const errors = validationResult(req);

                        if (!errors.isEmpty()) {
                            ApiError.badRequest(errors.array());
                        }

                        const foundUser = await UserModel.findByIdAndDelete(req.params.id);

                        if (!foundUser) {
                            ApiError.notExistUser("user");
                        }

                        res.status(202).json(foundUser);
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ];
        }
    },
    delete: {
        ["remove/:id"]() {
            return [
                isAuth,
                roleAccess(["admin"]),
                async (req, res, next) => {
                    try {
                        const foundUser = await UserModel.findByIdAndDelete(
                            req.params.id,
                        );

                        if (!foundUser) {
                            ApiError.notExistUser("user");
                        }

                        res.status(200).json({
                            msg: "User was delete",
                            deletedUserId: req.params.id,
                        });
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ];
        }
    }
}

export {
    AdminController as
    default,
}