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
      return { patient: null, error: result.error.message, status: 400 };
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

  // ✅ validando existencia de la consulta
  async findConsultationById(id: number) {
    const result = idSchema.safeParse(id);

    if (!result.success) {
      return { consultation: null, error: result.error.message, status: 400 };
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
      return { appointment: null, error: result.error.message, status: 400 };
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
  async startAppointment(idPatient: number, idAppointment: number) {
    const service = new AppointmentService();
    const { patient, error } = await service.findPatientById(idPatient);
    const { appointment } = await service.findAppointmentById(idAppointment);

    if (patient && appointment) {
      try {
        const updatedAppointment = await prisma.appointment.update({
          where: { id: idAppointment },
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
    return {
      appointment: null,
      error: error,
      status: 404,
    };
  }

  // ✅lista de todas las citas (info básica) de un paciente
  async getAllAppointments(idPatient: number) {
    const service = new AppointmentService();
    const { patient, error } = await service.findPatientById(idPatient);

    if (patient) {
      try {
        const result = await prisma.appointment.findMany({
          select: {
            date: true,
            has_attended: true,
            patient: {
              select: {
                names: true,
                surnames: true,
              },
            },
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
    return {
      consultations: null,
      error: error,
      status: 404,
    };
  }

  // ✅ info básica de todas las consultas del paciente
  async getBasicConsultation(idPatient: number) {
    const service = new AppointmentService();
    const { patient, error } = await service.findPatientById(idPatient);

    if (patient) {
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
    return {
      consultations: null,
      error: error,
      status: 404,
    };
  }

  // ✅ info completa de cada consulta del paciente
  async getFullConsultation(idPatient: number, idConsultation: number) {
    const service = new AppointmentService();
    const { patient, error } = await service.findPatientById(idPatient);
    const { consultation } = await service.findConsultationById(idConsultation);

    if (patient && consultation) {
      try {
        const result = await prisma.consultation.findMany();
        return {
          error: null,
          consultation: result,
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
    return {
      consultation: null,
      error: error,
      status: 404,
    };
  }

  // ✅ actualiza las constantes vitales del paciente para la cita {cid}
  async updateVitalSigns(
    idPatient: number,
    idConsultation: number,
    vitalSignsData: object,
  ) {
    const service = new AppointmentService();
    const { patient, error } = await service.findPatientById(idPatient);
    const { consultation } = await service.findConsultationById(idConsultation);

    if (patient && consultation) {
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
            id: idConsultation,
          },
          data: dataResult.data,
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
    return {
      consultation: null,
      error: error,
      status: 404,
    };
  }

  // ✅ actualiza el workplan del paciente para la cita {cid}
  async updateWorkplan(
    idPatient: number,
    idConsultation: number,
    workplanData: object,
  ) {
    const service = new AppointmentService();
    const { patient, error } = await service.findPatientById(idPatient);
    const { consultation } = await service.findConsultationById(idConsultation);

    if (patient && consultation) {
      const dataResult = WorkPlanSchema.partial().safeParse(workplanData);

      if (!dataResult.success) {
        return {
          workplan: null,
          error: dataResult.error.message,
          status: 400,
        };
      }

      try {
        const updateWorkplan = await prisma.workPlan.update({
          where: {
            id: idConsultation,
          },
          data: dataResult.data,
        });
        return {
          workplan: updateWorkplan,
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
    return {
      workplan: null,
      error: error,
      status: 404,
    };
  }

  // ✅ actualiza la P.E. del paciente para la cita {cid}
  async updatePhysicalExploration(
    idPatient: number,
    idConsultation: number,
    physicalExplorationData: object,
  ) {
    const service = new AppointmentService();
    const { patient, error } = await service.findPatientById(idPatient);
    const { consultation } = await service.findConsultationById(idConsultation);

    if (patient && consultation) {
      const dataResult = PhysicalExplorationSchema.partial().safeParse(
        physicalExplorationData,
      );

      if (!dataResult.success) {
        return {
          physicalExploration: null,
          error: dataResult.error.message,
          status: 400,
        };
      }

      try {
        const updatePhysicalExploration =
          await prisma.physicalExploration.update({
            where: {
              id: idConsultation,
            },
            data: dataResult.data,
          });
        return {
          physicalExploration: updatePhysicalExploration,
          error: null,
          status: 200,
        };
      } catch (error) {
        console.log({ error });
        return {
          physicalExploration: null,
          error: "something went wrong",
          status: 500,
        };
      }
    }
    return {
      physicalExploration: null,
      error: error,
      status: 404,
    };
  }

  async getMedicalAntecedent(idPatient: number) {
    const service = new AppointmentService();
    const { patient, error } = await service.findPatientById(idPatient);

    if (patient) {
      try {
        const result = await prisma.medicalAntecedent.findMany();
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
    return {
      medicalAntecedent: null,
      error: error,
      status: 404,
    };
  }
}
