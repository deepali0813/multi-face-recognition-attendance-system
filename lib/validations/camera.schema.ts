import { z } from "zod";

export const cameraSchema = z.object({
  name: z.string().min(2, "Camera name is required"),
  cameraId: z.string().min(1, "Camera ID is required"),
  location: z.string().optional(),
  streamUrl: z.string().url("Invalid stream URL").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const cameraUpdateSchema = cameraSchema.partial();

export type CameraInput = z.infer<typeof cameraSchema>;
export type CameraUpdateInput = z.infer<typeof cameraUpdateSchema>;