import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import {Attendance} from "@/models/attendance";
import {Student} from "@/models/student"; 
void Student;
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const date = searchParams.get("date") || "";
    const studentId = searchParams.get("studentId") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: any = {};
    if (date) query.date = date; // "2026-07-11" format
    if (studentId) query.studentId = studentId;

    const total = await Attendance.countDocuments(query);
    const records = await Attendance.find(query)
      .populate("studentId", "name rollNumber class section imageUrls")
      .sort({ firstSeen: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}