import { prisma } from "../db";
import { VitalSignsSchema, idSchema } from "../schemas/appointment.schema";

/**
model Appointment {
  id                     Int      @id @default(autoincrement())
  id_doctor              Int
  id_patient             Int
  has_ended              Boolean  @default(false)
  date                   DateTime
  anamnesis              String /// Relato cronológico
  id_workplan            Int      @unique
  id_vitalsigns          Int      @unique
  id_physicalexploration Int      @unique

  vital_signs          VitalSigns          @relation(fields: [id_vitalsigns], references: [id])
  physical_exploration PhysicalExploration @relation(fields: [id_physicalexploration], references: [id])
  workplan             WorkPlan            @relation(fields: [id_workplan], references: [id])
  patient              Patient             @relation(fields: [id_patient], references: [id])
  doctor               Doctor              @relation(fields: [id_doctor], references: [id_user])
}
*/

export class AppointmentService {
  constructor() {}

  async createEmptyAppointment(id_doctor: number, id_patient: number) {
    try {
      const emptyAppointment = await prisma.appointment.create({
        data: {
          // anamnesis: "",
          date: new Date(),
          has_attended: false,
          doctor: {
            connect: {
              id_user: id_doctor,
            },
          },
          patient: {
            connect: {
              id: id_patient,
            },
          },
          consultation: {}, // consulta vacía
        },
      });
      return {
        error: null,
        appointment: emptyAppointment,
        status: 201,
      };
    } catch (e) {
      return {
        error: "something went wrong",
        appointment: null,
        status: 500,
      };
    }
  }

  // workplan -> updateWorkplan
  // vital signs -> updateVitalSigns
  // physical exploration -> updatePhysicalExploration

  async updateVitalSigns(id_consultation: number, vitalSignsData: object) {
    const idResult = idSchema.safeParse(id_consultation);
    if (!idResult.success) {
      return {
        vitalSigns: null,
        error: idResult.error.message,
        status: 400,
      };
    }

    const dataResult = VitalSignsSchema.partial().safeParse(vitalSignsData);

    if (!dataResult.success) {
      return {
        vitalSigns: null,
        error: dataResult.error.message,
        status: 400,
      };
    }

    try {
      const updateVitalSigns = await prisma.consultation.update({
        where: {
          id: id_consultation,
        },
        data: {
          vital_signs: {
            update: dataResult.data,
          },
        },
      });
      return {
        vitalSigns: updateVitalSigns,
        error: null,
        status: 200,
      };
    } catch (e) {
      console.log({ e });
      return {
        patient: null,
        error: "something went wrong",
        status: 500,
      };
    }
  }
}
