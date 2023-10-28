import { z } from "zod";
import { createPatientSchema } from "../schemas/patient.schema";

export const DiagnoseSchema = z.object({
  names: z.string().min(1),
  surnames: z.string().min(1),
  documentType: z.string().min(1),
  document: z.string().min(1),
  patient: createPatientSchema,
});

export type CreateDiagnoseInput = z.infer<typeof DiagnoseSchema>;
