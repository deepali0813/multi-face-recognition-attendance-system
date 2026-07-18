import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Admin } from "@/models/admin";
import { loginSchema } from "@/lib/validations/auth.schema";
import { comparePassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try{
        const body=await req.json();
        // validate request body
        const parsed=loginSchema.safeParse(body);
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
    // parsed return object sucess and data
    const { email, password } = parsed.data;
    // 2. Connect DB
    await connectDB();
     // 3. Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }
    // 4. Compare password
    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }
    // 5. Set session cookie
    await setSessionCookie({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200 }
    );



    } catch(error){
        console.error("Login error:", error);
        return NextResponse.json(
          { success: false, message: "Internal server error" },
          { status: 500 }
        );

    }
    
}