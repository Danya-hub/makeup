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

ProcedureSchema.statics.isEquilDate = async function (date, refDocs) {
    const allProcedure = await this.find().populate(refDocs);

    return allProcedure
        .filter((card) => {
            return card.startProcTime.getYear() === date.getYear() &&
                card.startProcTime.getMonth() === date.getMonth() &&
                card.startProcTime.getDate() === date.getDate()
        });
}

const model = mongoose.model("AllProcedures", ProcedureSchema);

export {
    model as
    default,
};