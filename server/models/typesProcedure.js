import mongoose from "mongoose";

const TypesProcedureSchema = new mongoose.Schema({
    name: String,
    price: Number,
    currency: String,
    text: String,
    durationProc: Number
}, {
    timestamps: true,
});

const model = mongoose.model("TypesProcedure", TypesProcedureSchema);

export {
    model as
    default,
};