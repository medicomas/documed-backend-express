// model Consultation {
//   id                     Int    @id @default(autoincrement())
//   ✅ anamnesis              String /// Relato cronológico
//   id_appointment         Int    @unique /// Cita en la que la consulta fue creada.
//   id_vitalsigns          Int    @unique
//   id_physicalexploration Int    @unique
//   id_workplan            Int    @unique

//   appointment          Appointment         @relation(fields: [id_appointment], references: [id])
//   ✅ vital_signs          VitalSigns          @relation(fields: [id_vitalsigns], references: [id])
//   ✅ physical_exploration PhysicalExploration @relation(fields: [id_physicalexploration], references: [id])
//   ✅ workplan             WorkPlan            @relation(fields: [id_workplan], references: [id])
// }

import { z } from "zod";
import {
  PhysicalExplorationSchema,
  VitalSignsSchema,
} from "../schemas/appointment.schema";
import { prisma } from "../db";

const planWorkSchema = z.object({
  indications: z.string(),
  diagnose: z.array(z.string()),
  treatments: z.array(
    z.object({
      medication: z.string(),
      dose: z.string(),
    }),
  ),
});

export const consultationSchema = z.object({
  anamnesis: z.string().min(1),
  physicalExploration: PhysicalExplorationSchema,
  vitalSigns: VitalSignsSchema,
  workPlan: planWorkSchema,
});

export class ConsultationService {
  constructor() {}

  async updateConsultation(
    idPatient: number,
    idConsulta: number,
    dataConsultation: object,
  ) {
    const consultation = consultationSchema
      .partial()
      .safeParse(dataConsultation);
    if (!consultation.success) {
      return {
        consult: null,
        error: consultation.error.formErrors,
        status: 400,
      };
    }
    try {
      const { anamnesis, physicalExploration, vitalSigns, workPlan } =
        consultation.data;

      const fullConsult = await prisma.consultation.update({
        where: {
          id: idConsulta,
          appointment: {
            patient: {
              id: idPatient,
            },
          },
        },
        data: {
          anamnesis: anamnesis,
          vital_signs: { update: vitalSigns },
          physical_exploration: { update: physicalExploration },
          workplan: { update: workPlan },
        },
      });
      return {
        consult: fullConsult,
        error: null,
        status: 201,
      };
    } catch (error) {
      console.log({ error });
      return {
        consult: null,
        error: "something went wrong",
        status: 500,
      };
    }
  }
}
