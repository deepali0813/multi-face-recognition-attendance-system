// tells the currently login user
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Admin } from "@/models/admin";


export async function GET(){
    try{
        // get session checks the cookie se jwt verify
        const session=await getSession();
        if (!session) {
         return NextResponse.json(
          { success: false, message: "Not authenticated" },
          { status: 401 }
         );
        } 

        await connectDB();
        const admin = await Admin.findById(session.id).select("-password");

        if (!admin) {
          return NextResponse.json(
           { success: false, message: "Admin not found" },
           { status: 404 }
           );
        }

        // 3. Return admin info
        return NextResponse.json({
        success: true,
        message: "Authenticated",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200 }
    );
    }catch(error){
        console.error("Me route error:", error);
        return NextResponse.json(
         { success: false, message: "Internal server error" },
         { status: 500 }
        );
        
    }
}