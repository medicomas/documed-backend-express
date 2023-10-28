import { z } from "zod";

export const DoctorSchema = z.object({
  documentType: z.string().min(1),
  document: z.string().min(1),
  gender: z.union([z.literal("F"), z.literal("M")]),
});
