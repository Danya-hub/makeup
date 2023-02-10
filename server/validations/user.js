"use strict";

import validator from "express-validator";
import bcrypt from "bcrypt";

import UserModel from "../models/user.js";
import UserService from "../service/user.js";

import errors from "../constant/errors.js";

const range = {
    min: 3,
    max: 20,
};

class UserValidation {
    constructor() {

    }

    sendPassword = [
        validator
        .check("fullname")
        .exists({
            checkFalsy: true,
        })
        .withMessage(errors.required("Fullname"))
        .bail()
        .isLength(range)
        .withMessage(errors.inRange("Fullname", range))
        .bail()
        .custom(this.isUserName),
        validator
        .check("telephone")
        .exists({
            checkFalsy: true,
        })
        .withMessage(errors.required("Telephone"))
        .bail()
        .isMobilePhone("any")
        .withMessage(errors.wrongFormat("telephone"))
        .bail()
        .custom(this.isUnique),
        validator
        .check("email")
        .exists({
            checkFalsy: true,
        })
        .withMessage(errors.required("Email"))
        .bail()
        .isEmail()
        .withMessage(errors.wrongFormat("email"))
        .bail()
        .custom(this.isUnique),
    ];

    signin = [
        validator
        .oneOf([
            validator
            .check("telephone")
            .exists({
                checkFalsy: true,
            })
            .withMessage(errors.required("Telephone"))
            .bail()
            .isMobilePhone("any")
            .withMessage(errors.wrongFormat("telephone")),
            validator
            .check("email")
            .exists({
                checkFalsy: true,
            })
            .withMessage(errors.required("Email"))
            .bail()
            .isEmail()
            .withMessage(errors.wrongFormat("email")),
        ], errors.wrongChannels()),
        validator
        .check("password")
        .exists({
            checkFalsy: true,
        })
        .withMessage(errors.required("Password"))
        .bail()
        .custom(this.comparePassword)
    ];

    async isUnique(value, {
        path,
    }) {
        const foundUser = await UserModel.findOne({
            [path]: value,
        });

        if (foundUser) {
            throw new Error(errors.alreadyExist(`Email address or telephone`));
        }

        return true;
    }

    isUserName(value) {
        const isValid = /^\p{L}+(?:\s\p{L}+){0,2}$/u.test(value);

        if (!isValid) {
            throw new Error(errors.fullnameNotValid());
        }

        return isValid;
    }

    async comparePassword(value, {
        req,
    }) {
        const foundUser = await UserService.byChannel(req.body);

        if (!foundUser) {
            throw new Error(errors.wrongSignin());
        }

        const isEquil = bcrypt.compareSync(value, foundUser.password);

        if (!isEquil) {
            throw new Error(errors.wrongSignin());
        }

        return isEquil;
    }
}

export default new UserValidation();