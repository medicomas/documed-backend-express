import { z } from "zod";

export const WorkPlanSchema = z.object({
  indications: z.string().min(1),
});

export const DiagnoseSchema = z.object({
  ICD10_code: z.string().min(1),
});

export const TreatmentSchema = z.object({
  medication: z.string().min(1),
  dose: z.string().min(1),
});

export const PhysicalExplorationSchema = z.object({
  abdomen_y_pelvis: z.number(),
  ano_y_recto: z.number(),
  aspecto_general: z.number(),
  cabeza_y_cuello: z.number(),
  cardiovascular: z.number(),
  cavidad_oral: z.number(),
  genito_urinario: z.number(),
  locomotor: z.number(),
  neurologico: z.number(),
});

export const VitalSignsSchema = z.object({
  presion_arterial: z.number(),
  temperatura: z.number(),
  frecuencia_respiratoria: z.number(),
  frecuencia_cardiaca: z.number(),
  peso: z.number(),
  talla: z.number(),
  imc: z.number(),
});

export const AppointmentSchema = z.object({
  has_ended: z.boolean(),
  date: z.string().datetime(),
  anamnesis: z.string().min(1),
});

export const idSchema = z.number().min(1).int();

export type AppointmentInput = z.infer<typeof AppointmentSchema>;
export type WorkPlan = z.infer<typeof WorkPlanSchema>;
export type Diagnose = z.infer<typeof DiagnoseSchema>;
export type Treatment = z.infer<typeof TreatmentSchema>;
export type PhysicalExploration = z.infer<typeof PhysicalExplorationSchema>;
export type VitalSigns = z.infer<typeof VitalSignsSchema>;
