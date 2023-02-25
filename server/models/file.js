"use strict";

import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    // name
    // content
}, {
    timestamps: true,
});

const model = mongoose.model("File", FileSchema);

export {
    model as
    default,
}