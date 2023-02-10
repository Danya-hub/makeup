"use strict";

import mongoose from "mongoose";

const ProcedureSchema = new mongoose.Schema({
    startProcTime: Date,
    finishProcTime: Date,
    year: Number,
    month: Number,
    day: Number,
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