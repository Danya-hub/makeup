import mongoose from "mongoose";
import crypto from "crypto";

const COUNT_BYTES = 32;

const UserSchema = new mongoose.Schema(
  {
    key: String,
    fullname: String,
    telephone: String,
    password: String,
    email: String,
    roles: {
      type: [String],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  const hex = crypto.randomBytes(COUNT_BYTES).toString("hex");

  this.key = hex;

  next();
});

const model = mongoose.model("User", UserSchema);

export default model;
