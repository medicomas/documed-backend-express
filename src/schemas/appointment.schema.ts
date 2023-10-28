import { z } from "zod";

export const AppointmentSchema = z.object({
  has_ended: z.boolean(),
  hour: z.string().datetime(),
  anamnesis: z.string().min(1),
});
