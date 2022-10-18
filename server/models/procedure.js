import mongoose from "mongoose";

const ProcedureSchema = new mongoose.Schema({
    startProcTime: Date,
    finishProcTime: Date,
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TypesProcedure"
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

ProcedureSchema.statics.isEquilDate = async function (date, hiddenProp) {
    const allProcedure = await this.find().populate(hiddenProp);

    return allProcedure
        .filter((cart) => {
            return cart.startProcTime.getYear() === date.getYear() &&
                cart.startProcTime.getMonth() === date.getMonth() &&
                cart.startProcTime.getDate() === date.getDate()
        });
}

const model = mongoose.model("AllProcedures", ProcedureSchema);

export {
    model as
    default,
};