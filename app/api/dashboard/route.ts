import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import {Student} from "@/models/student";
import {Attendance} from "@/models/attendance";

function todayDateStr() {
  return new Date().toISOString().split("T")[0];
}

export async function GET() {
  try {
    await connectDB();

    const today = todayDateStr();

    const totalStudents = await Student.countDocuments({ status: "active" });
    const presentToday = await Attendance.countDocuments({ date: today });
    const absentToday = totalStudents - presentToday;
    const attendancePercentage =
      totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        presentToday,
        absentToday,
        attendancePercentage,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}