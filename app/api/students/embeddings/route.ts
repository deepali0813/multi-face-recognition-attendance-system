import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import {Student} from "@/models/student";

export async function GET() {
  try {
    await connectDB();

    const students = await Student.find({ status: "active" }).select(
      "_id embedding"
    );

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get embeddings error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}