import { prisma } from "../db";
import {
  PhysicalExplorationSchema,
  VitalSignsSchema,
  WorkPlanSchema,
  idSchema,
} from "../schemas/appointment.schema";

export class AppointmentService {
  constructor() {}

  // ✅ validando existencia del paciente
  async findPatientById(id: number) {
    const result = idSchema.safeParse(id);

    if (!result.success) {
      return { patient: null, error: result.error.formErrors, status: 400 };
    }

    try {
      const result = await prisma.patient.findUnique({
        where: { id },
      });
      return { patient: result, error: null, status: 200 };
    } catch (error) {
      return { patient: null, error: "something went wrong!", status: 500 };
    }
  }

  async existsConsultation(consultation_id: number) {
    try {
      await prisma.consultation.findUnique({
        where: { id: consultation_id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // ✅ validando existencia de la consulta
  async findConsultationById(id: number) {
    const result = idSchema.safeParse(id);

    if (!result.success) {
      return {
        consultation: null,
        error: result.error.formErrors,
        status: 400,
      };
    }

    try {
      const result = await prisma.consultation.findUnique({
        where: { id },
      });
      return { consultation: result, error: null, status: 200 };
    } catch (error) {
      return {
        consultation: null,
        error: "something went wrong!",
        status: 500,
      };
    }
  }

  // ✅ validando existencia de la cita
  async findAppointmentById(id: number) {
    const result = idSchema.safeParse(id);

    if (!result.success) {
      return { appointment: null, error: result.error.formErrors, status: 400 };
    }

    try {
      const result = await prisma.appointment.findUnique({
        where: { id },
      });
      return { appointment: result, error: null, status: 200 };
    } catch (error) {
      return { appointment: null, error: "something went wrong!", status: 500 };
    }
  }

  // Crea una nueva cita. La idea de crear una cita es que pueda dibujarse en el calendario
  // (la ruta debe recibir la fecha y hora).
  // ✅ "/:id/citas/nueva"

  async createEmptyAppointment(
    idPatient: number,
    idDoctor: number,
    dateInput: Date,
  ) {
    const service = new AppointmentService();
    const { patient, error } = await service.findPatientById(idPatient);

    if (patient) {
      try {
        const emptyAppointment = await prisma.appointment.create({
          data: {
            date: dateInput,
            has_attended: false,
            doctor: {
              connect: {
                id_user: idDoctor,
              },
            },
            patient: {
              connect: {
                id: idPatient,
              },
            },
            consultation: {},
          },
        });
        return {
          appointment: emptyAppointment,
          error: null,
          status: 201,
        };
      } catch (error) {
        return {
          appointment: null,
          error: "something went wrong!",
          status: 500,
        };
      }
    }
    return {
      appoinment: null,
      error: error,
      status: 404,
    };
  }

  // ✅ Inicia la consulta para la cita {cita_id}.
  // Marca Appointment.has_attended=true y crea una consulta (Consultation) vacía para esa cita.
  // :id/citas/:cita_id/iniciar
  async startAppointment(
    idPatient: number,
    idAppointment: number,
    idDoctor: number,
  ) {
    const service = new AppointmentService();
    const { appointment } = await service.findAppointmentById(idAppointment);

    try {
      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: idAppointment,
          id_doctor: idDoctor,
          patient: {
            id: idPatient,
          },
        },
        data: { has_attended: true },
      });
      const emptyConsultation = await prisma.consultation.create({
        data: {
          appointment: {
            connect: {
              id: idAppointment,
              id_patient: idPatient,
            },
          },
          anamnesis: "",
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
        appointment: updatedAppointment,
        consultation: emptyConsultation,
        error: null,
        status: 201,
      };
    } catch (error) {
      return {
        appointment: appointment,
        consultation: null,
        error: "something went wrong",
        status: 500,
      };
    }
  }

  // ✅lista de todas las citas (info básica) de un paciente
  async getAllAppointments(idPatient: number) {
    try {
      const result = await prisma.appointment.findMany({
        select: {
          date: true,
          has_attended: true,
        },
        where: {
          id_patient: idPatient,
        },
      });
      return {
        error: null,
        appointments: result,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        appointments: null,
        error: "something went wrong!",
        status: 500,
      };
    }
  }

  // ✅ info básica de todas las consultas del paciente
  async getBasicConsultation(idPatient: number) {
    try {
      const result = await prisma.consultation.findMany({
        select: {
          appointment: {
            select: {
              date: true,
              id: true,
              patient: {
                select: {
                  names: true,
                  surnames: true,
                },
              },
            },
          },
        },
        where: {
          appointment: {
            id_patient: idPatient,
          },
        },
      });
      if (result.length === 0) {
        return {
          consultations: null,
          error: "Patient does not have consultations",
          status: 404,
        };
      }

      return {
        error: null,
        consultations: result,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        consultations: null,
        error: "something went wrong!",
        status: 500,
      };
    }
  }

  // ✅ info completa de cada consulta del paciente
  async getFullConsultation(idPatient: number, idConsultation: number) {
    try {
      const consultationResult = await prisma.consultation.findUnique({
        where: {
          id: idConsultation,
          appointment: {
            patient: {
              id: idPatient,
            },
          },
        },
      });
      return {
        error: null,
        consultation: consultationResult,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        consultation: null,
        error: "something went wrong!",
        status: 500,
      };
    }
  }

  // ✅ actualiza las constantes vitales del paciente para la cita {cid}
  async updateVitalSigns(
    idPatient: number,
    idConsultation: number,
    vitalSignsData: object,
  ) {
    const dataResult = VitalSignsSchema.partial().safeParse(vitalSignsData);

    if (!dataResult.success) {
      return {
        vitalSigns: null,
        error: dataResult.error.formErrors,
        status: 400,
      };
    }

    try {
      const updateVitalSigns = await prisma.consultation.update({
        where: {
          id: idConsultation,
          appointment: {
            patient: {
              id: idPatient,
            },
          },
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
    } catch (error) {
      console.log({ error });
      return {
        vitalSigns: null,
        error: "something went wrong",
        status: 500,
      };
    }
  }

  // ✅ actualiza el workplan del paciente para la cita {cid}
  async updateWorkplan(
    idPatient: number,
    idConsultation: number,
    workplanData: object,
  ) {
    const dataResult = WorkPlanSchema.partial().safeParse(workplanData);

    if (!dataResult.success) {
      return {
        workplan: null,
        error: dataResult.error.formErrors,
        status: 400,
      };
    }

    try {
      const updatedConsultation = await prisma.consultation.update({
        where: {
          id: idConsultation,
          appointment: {
            patient: {
              id: idPatient,
            },
          },
        },
        data: {
          workplan: {
            update: dataResult.data,
          },
        },
        select: {
          workplan: true,
        },
      });
      return {
        workplan: updatedConsultation.workplan,
        error: null,
        status: 200,
      };
    } catch (error) {
      console.log({ error });
      return {
        workplan: null,
        error: "something went wrong",
        status: 500,
      };
    }
  }

  // ✅ actualiza la P.E. del paciente para la cita {cid}
  async updatePhysicalExploration(
    idPatient: number,
    idConsultation: number,
    physicalExplorationData: object,
  ) {
    const dataResult = PhysicalExplorationSchema.partial().safeParse(
      physicalExplorationData,
    );

    if (!dataResult.success) {
      return {
        physicalExploration: null,
        error: dataResult.error.formErrors,
        status: 400,
      };
    }

    try {
      const updatePhysicalExploration = await prisma.consultation.update({
        where: {
          id: idConsultation,
          appointment: {
            patient: {
              id: idPatient,
            },
          },
        },
        data: {
          physical_exploration: {
            update: dataResult.data,
          },
        },
        select: {
          physical_exploration: true,
        },
      });

      return {
        physicalExploration: updatePhysicalExploration.physical_exploration,
        error: null,
        status: 200,
      };
    } catch (error) {
      console.log({ error });
      return {
        physicalExploration: null,
        error: "Something went wrong",
        status: 500,
      };
    }
  }

  async getMedicalAntecedent(idPatient: number) {
    try {
      const result = await prisma.medicalAntecedent.findMany({
        where: {
          patient: {
            id: idPatient,
          },
        },
      });

      return {
        error: null,
        medicalAntecedent: result,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        medicalAntecedent: null,
        error: "something went wrong!",
        status: 500,
      };
    }
  }
}
