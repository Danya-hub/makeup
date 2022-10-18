import validator from "express-validator";
import bcrypt from "bcrypt";

import UserModel from "../models/user.js";

import errors from "../constant/errors.js";
import ApiError from "../utils/apiError.js";

const range = {
    min: 3,
    max: 32,
};

async function isUnique(value, {
    path,
}) {
    const article = await UserModel.findOne({
        [path]: value,
    });

    if (article) {
        return Promise.reject(errors.alreadyExist(path));
    }
}

const validation = {
    signup: [
        validator
        .check("fullname")
        .exists()
        .withMessage(errors.required("Fullname"))
        .bail()
        .isLength(range)
        .withMessage(errors.inRange("Fullname", range))
        .bail(),
        validator
        .check("telephone")
        .exists()
        .withMessage(errors.required("Telephone"))
        .bail()
        .isMobilePhone("any")
        .withMessage(errors.wrong("Telephone"))
        .bail()
        .custom(isUnique)
        .bail()
    ],
    signin: [
        validator
        .check("password")
        .exists()
        .withMessage(errors.required("Password"))
        .bail(),
        validator
        .check("telephone")
        .exists()
        .withMessage(errors.required("Telephone"))
        .bail()
        .custom(async (_, {
            req,
        }) => {
            try {
                const article = await UserModel.findOne({
                    telephone: req.body.telephone,
                });

                if (!article) {
                    throw errors.unrecognizedSignin();
                }

                const isValidPassword = bcrypt.compareSync(
                    req.body.password,
                    article.password
                );

                if (!isValidPassword) {
                    throw errors.unrecognizedSignin();
                }

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        })
        .bail()
    ]
}

export {
    validation as default,
}