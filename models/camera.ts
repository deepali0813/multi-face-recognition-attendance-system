import mongoose, { Schema, models, model } from "mongoose";

const cameraSchema = new Schema(
  {
    name: { type: String, required: true },
    cameraId: { type: String, required: true, unique: true },
    location: { type: String },
    streamUrl: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Camera= models.Camera || model("Camera", cameraSchema);