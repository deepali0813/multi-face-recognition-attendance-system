// app/api/auth/setup-admin/route.ts (TEMPORARY — ek baar chalao, phir delete kar dena)
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Admin } from "@/models/admin";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const email = "admin@aisoc.com";
    const existing = await Admin.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await hashPassword("Aisoc@2026");

    const admin = await Admin.create({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message: "Admin created — delete this route now!",
      email: admin.email,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}