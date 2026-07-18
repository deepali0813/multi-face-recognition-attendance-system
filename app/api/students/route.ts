import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Student } from "@/models/student";
import { studentSchema } from "@/lib/validations/student.schema";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { generateEmbedding } from "@/lib/pythonService";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    // 1. Extract text fields
    const rawData = {
      name: formData.get("name") as string,
      rollNumber: formData.get("rollNumber") as string,
      class: formData.get("class") as string,
      section: (formData.get("section") as string) || undefined,
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || undefined,
    };

    // 2. Validate with zod
    const parsed = studentSchema.safeParse(rawData);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // 3. Duplicate roll number check
    const existing = await Student.findOne({ rollNumber: parsed.data.rollNumber });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Roll number already exists" },
        { status: 409 }
      );
    }

    // 4. Extract images
    const files = formData.getAll("images") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one photo is required" },
        { status: 400 }
      );
    }

    const imageBuffers = await Promise.all(
      files.map(async (file) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        filename: file.name,
      }))
    );

    // 5. Upload to Cloudinary
    const imageUrls: string[] = [];
    for (const img of imageBuffers) {
      const result = await uploadImageToCloudinary(img.buffer, "students");
      imageUrls.push(result.url);
    }

    // 6. Send to Python service for embedding
    const embeddingResult = await generateEmbedding(imageBuffers);

    if (!embeddingResult.success) {
      return NextResponse.json(
        { success: false, message: embeddingResult.message },
        { status: 422 }
      );
    }

    // 7. Save student
    const student = await Student.create({
      ...parsed.data,
      imageUrls,
      embedding: embeddingResult.embedding,
      status: "active",
    });

    return NextResponse.json(
      { success: true, message: "Student enrolled successfully", student },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const classFilter = searchParams.get("class") || "";

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }
    if (classFilter) query.class = classFilter;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .select("-embedding") // embedding bhaari hota hai, list mein nahi chahiye
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: students,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get students error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}