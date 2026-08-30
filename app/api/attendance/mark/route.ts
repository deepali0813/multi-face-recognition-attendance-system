import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import {Attendance} from "@/models/attendance";
import {Student} from "@/models/student";
import { markAttendanceSchema } from "@/lib/validations/attendance.schema";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // 1. Validate request body
    const parsed = markAttendanceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { studentId, confidence, timestamp, cameraId } = parsed.data;

    // 2. Check student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not recognized" },
        { status: 404 }
      );
    }

    // 3. Date nikaalo timestamp se (YYYY-MM-DD format, duplicate check ke liye)
    const dateObj = new Date(timestamp);
    const dateStr = dateObj.toISOString().split("T")[0]; // "2026-07-11"

    // 4. Aaj ka record already hai kya check karo
    const existingRecord = await Attendance.findOne({
      studentId,
      date: dateStr,
    });

    if (existingRecord) {
      // already marked — sirf lastSeen update karo
      existingRecord.lastSeen = dateObj;
      existingRecord.confidence = confidence; // latest confidence bhi update kar sakte hain
      await existingRecord.save();

      return NextResponse.json({
        success: true,
        message: "Attendance already marked today",
      });
    }

    // 5. Naya record banao
    await Attendance.create({
      studentId,
      date: dateStr,
      firstSeen: dateObj,
      lastSeen: dateObj,
      confidence,
      cameraId,
      status: "present",
    });

    return NextResponse.json(
      { success: true, message: "Attendance marked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Mark attendance error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}