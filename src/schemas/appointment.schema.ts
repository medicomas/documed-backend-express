import { z } from "zod";

export const AppointmentSchema = z.object({
  has_ended: z.boolean(),
  hour: z.date().minDate,
  anamnesis: z.string().min(1),
});
