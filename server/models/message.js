import mongoose from "mongoose";

import { TTL_MESSAGE_EXPIRE } from "../constant/auth.js";

const MessageSchema = new mongoose.Schema(
  {
    topic: String,
    email: String,
    template: String,
  },
  {
    timestamps: true,
  }
);

MessageSchema.index(
  {
    createdAt: 1,
  },
  {
    expireAfterSeconds: TTL_MESSAGE_EXPIRE,
  }
);

const model = mongoose.model("Message", MessageSchema);

export default model;
