import { z } from "zod";

// Python service → Next.js (attendance mark request)
export const markAttendanceSchema = z.object({
  studentId: z.string().min(1, "studentId is required"),
  confidence: z.number().min(0).max(1),
  timestamp: z.string().datetime({ message: "Invalid timestamp format" }),
  cameraId: z.string().min(1, "cameraId is required"),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;