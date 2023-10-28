import { z } from "zod";

export const createPatientSchema = z.object({
  names: z.string().min(1),
  surnames: z.string().min(1),
  documentType: z.string().min(1),
  document: z.string().min(1),
  gender: z.union([z.literal("F"), z.literal("M")]), // gender validation or smth like that
  phone_number: z.string().min(1).max(14),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const idSchema = z.number().min(1).int();

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
