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
  abdomen_y_pelvis: z.string(),
  ano_y_recto: z.string(),
  aspecto_general: z.string(),
  cabeza_y_cuello: z.string(),
  cardiovascular: z.string(),
  cavidad_oral: z.string(),
  genito_urinario: z.string(),
  locomotor: z.string(),
  neurologico: z.string(),
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

export const ConsultationSchema = z.object({
  anamnesis: z.string().min(1),
});

export const AppointmentSchema = z.object({
  has_attended: z.boolean(),
  date: z.string().datetime({ offset: true }),
});

export const MedicalAntecedentSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const idSchema = z.number().min(1).int();

export type AppointmentInput = z.infer<typeof AppointmentSchema>;
export type WorkPlan = z.infer<typeof WorkPlanSchema>;
export type Diagnose = z.infer<typeof DiagnoseSchema>;
export type Treatment = z.infer<typeof TreatmentSchema>;
export type PhysicalExploration = z.infer<typeof PhysicalExplorationSchema>;
export type VitalSigns = z.infer<typeof VitalSignsSchema>;
export type AntecedentSchema = z.infer<typeof MedicalAntecedentSchema>;
