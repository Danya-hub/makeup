"use strict";

import mongoose from "mongoose";

const ProcedureSchema = new mongoose.Schema({
    startProcTime: Date,
    finishProcTime: Date,
    paymentMethod: String,
    year: Number,
    month: Number,
    day: Number,
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TypesProcedure",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StateProcedure",
    }
}, {
    timestamps: true,
});

ProcedureSchema.pre("save", function (next) {
    const date = this.startProcTime;

    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.day = date.getDate();

    next();
});

const model = mongoose.model("AllProcedures", ProcedureSchema);

export {
    model as
    default,
};