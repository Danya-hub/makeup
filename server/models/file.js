import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    // name
    // content
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("File", FileSchema);

export default model;
