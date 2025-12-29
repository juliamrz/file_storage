import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    index: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: new Date(),
  },
  extension: {
    type: String,
    required: true,
  },
});

export default mongoose.model("File", fileSchema, 'files');
