"use strict";

import mongoose from "mongoose";

const StateProcedureSchema = new mongoose.Schema({
    color: String,
    name: String,
});

const model = mongoose.model("StateProcedure", StateProcedureSchema);

export {
    model as default,
};