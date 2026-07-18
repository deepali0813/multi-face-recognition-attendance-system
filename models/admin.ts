import mongoose, { Schema, models, model } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },        // bcrypt hashed
    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "admin",
    },
  },
  { timestamps: true }
);

export const Admin= models.Admin || model("Admin", adminSchema);