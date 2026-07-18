import mongoose, { Schema, models, model } from "mongoose";

const attendanceSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    date: { type: String, required: true },           // "2026-07-10"
    firstSeen: { type: Date, required: true },
    lastSeen: { type: Date, required: true },
    confidence: { type: Number, required: true },
    cameraId: { type: String,
    required:true, },
    status: {
      type: String,
      enum: ["present", "late"],
      default: "present",
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export const Attendance= models.Attendance || model("Attendance", attendanceSchema);