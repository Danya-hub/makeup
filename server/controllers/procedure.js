import {
    validationResult,
} from "express-validator";

import validation from "../validations/procedure.js";
import ProcedureModel from "../models/procedure.js";
import TypesProcedureModel from "../models/typesProcedure.js";
import StateProcedure from "../models/stateProcedure.js";
import isAuth from "../middleware/isAuth.js";
import ApiError from "../utils/apiError.js";

const hiddenProp = ["user", "type", "state"];

const ProcedureController = {
    get: {
        ["byDay/:newDate"]() {
            return [
                async (req, res) => {
                    try {
                        const newDate = new Date(req.params.newDate);
                        const finedProcedure = await ProcedureModel.isEquilDate(newDate, hiddenProp);

                        res.status(200).json(finedProcedure);
                    } catch (error) {
                        next(error);
                    }
                }
            ];
        },
        ["byUser/:id"]() {
            return [
                async (req, res, next) => {
                    try {
                        const finedProcedure = await ProcedureModel.find({
                            user: req.params.id,
                        }).populate(hiddenProp);

                        if (!finedProcedure) {
                            ApiError.notExist("procedure");
                        }

                        res.status(200).json(finedProcedure);
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ];
        },
        allStates() {
            return [
                async (req, res, next) => {
                    try {
                        const states = await StateProcedure.find();

                        res.status(200).json(states);
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ]
        },
        allTypes() {
            return [
                async (req, res, next) => {
                    try {
                        const types = await TypesProcedureModel.find();

                        res.status(200).json(types);
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ]
        },
        defaultValue() {
            return [
                async (req, res, next) => {
                    try {
                        const type = await TypesProcedureModel.findOne();
                        const state = await StateProcedure.findOne();

                        res.status(200).json({
                            type,
                            state,
                        });
                        next();
                    } catch (error) {
                        next(error);
                    }
                },
            ]
        },
    },
    post: {
        create() {
            return [
                isAuth,
                validation.create,
                async (req, res, next) => {
                    try {
                        const errors = validationResult(req);

                        if (!errors.isEmpty()) {
                            ApiError.badRequest(errors.array());
                        }

                        const newProcedure = await ProcedureModel.create(req.body);
                        await newProcedure.save();

                        res.status(201).json(newProcedure);
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            ]
        }
    },
    delete: {
        ["remove/:id"]() {
            return [
                isAuth,
                async (req, res, next) => {
                    try {
                        const finedUser = await ProcedureModel.findByIdAndDelete(
                            req.params.id,
                        );

                        if (!finedUser) {
                            ApiError.notExist("procedure");
                        }

                        res.status(200).json({
                            msg: "Procedure was delete",
                            deletedProcId: req.params.id,
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
    ProcedureController as
    default,
}