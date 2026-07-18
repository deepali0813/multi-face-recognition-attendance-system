import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  class: z.string().min(1, "Class is required"),
  section: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
});

// used when editing — allows partial updates
export const studentUpdateSchema = studentSchema.partial();

export type StudentInput = z.infer<typeof studentSchema>;
export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>;