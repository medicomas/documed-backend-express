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
          anamnesis: "",
          date: new Date(),
          has_ended: false,
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
          physical_exploration: {
            create: {
              abdomen_y_pelvis: "",
              ano_y_recto: "",
              aspecto_general: "",
              cabeza_y_cuello: "",
              cardiovascular: "",
              cavidad_oral: "",
              genito_urinario: "",
              locomotor: "",
              neurologico: "",
            },
          },
          vital_signs: {
            create: {
              presion_arterial: 0,
              temperatura: 0,
              frecuencia_respiratoria: 0,
              frecuencia_cardiaca: 0,
              peso: 0,
              talla: 0,
              imc: 0,
            },
          },
          workplan: {
            create: {
              indications: "",
              diagnoses: {
                createMany: {
                  data: [],
                },
              },
              treatements: {
                createMany: {
                  data: [],
                },
              },
            },
          },
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

  async updateVitalSigns(id_appointment: number, vitalSignsData: object) {
    const idResult = idSchema.safeParse(id_appointment);
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
      const updateVitalSigns = await prisma.vitalSigns.update({
        where: {
          id: idResult.data,
        },
        data: dataResult.data,
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
