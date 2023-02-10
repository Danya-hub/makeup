"use strict";

import ProcedureModel from "../models/procedure.js";
import ProcTypesModel from "../models/typesProcedure.js";

import ApiError from "../utils/apiError.js";

const refDocsName = ["user", "type", "state"];

class Procedure {
    constructor() {

    }

    async createProcedure(doc) {
        const newProcedure = await ProcedureModel.create(doc);
        await newProcedure.save();

        return newProcedure.populate(refDocsName);
    }

    async createProcType(doc) {
        const newType = await ProcTypesModel.create(doc);
        await newType.save();

        return newType;
    }

    async removeByUser(userId) {
        const foundProcedure = await ProcedureModel.findByIdAndDelete(
            userId,
        );

        if (!foundProcedure) {
            ApiError.notExist("procedure");
        }
    }

    async byDay(date) {
        const newDate = new Date(date);
        const filter = {
            year: newDate.getFullYear(),
            month: newDate.getMonth(),
            day: newDate.getDate(),
        };

        const foundProcedures = await ProcedureModel.find(filter)
            .populate(refDocsName);

        return foundProcedures;
    }

    async byUser(userId) {
        const foundProcedure = await ProcedureModel.find({
            user: userId,
        }).populate(refDocsName);

        if (!foundProcedure) {
            ApiError.notExist("procedure");
        }

        return foundProcedure;
    }
}

export default new Procedure();