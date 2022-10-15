import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
    fullname: String,
    telephone: String,
    password: String,
    roles: {
        type: [String],
        default: "user"
    },
}, {
    timestamps: true,
});

UserSchema.statics.generatePassword = function (
    length = 20,
    wishlist = "0123456789abcdefghijklmnopqrstuvwxyz"
) {
    const buffer = new Uint32Array(length);
    const random = crypto.randomFillSync(buffer);

    const password = Array.from(random)
        .map((x) => wishlist[x % wishlist.length]).join("");

    console.log(password);

    const salt = bcrypt.genSaltSync(),
        hashPassword = bcrypt.hashSync(password, salt);

    return hashPassword;
};

const model = mongoose.model("User", UserSchema);

export {
    model as
    default,
};