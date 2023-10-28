import { prisma } from "../db";
import { createPatientSchema, idSchema } from "../schemas/patient.schema";

export class PatientService {
  constructor() {}

  async create(patientData: object) {
    try {
      const result = createPatientSchema.safeParse(patientData);
      if (result.success) {
        const patient = await prisma.patient.create({ data: result.data });
        return { patient, error: null };
      }
      return { patient: null, error: result.error.message };
    } catch (error) {
      console.log(error);
      return { patient: null, error: "something went wrong!" };
    }
  }

  async getAllPatients() {
    try {
      const result = await prisma.patient.findMany();
      return {
        error: null,
        patients: result,
      };
    } catch (error) {
      console.log(error);
      return { patients: null, error: "something went wrong!" };
    }
  }

  async findById(id: number) {
    const result = idSchema.safeParse(id);

    if (!result.success) {
      return { patient: null, error: result.error.message, status: 400 };
    }

    try {
      const result = await prisma.patient.findUnique({
        where: { id },
      });
      return { patient: result, error: null, status: 200 };
    } catch {
      return { patient: null, error: "something went wrong!", status: 500 };
    }
  }

  async updatePatient(id: number, patientData: object) {
    const idResult = idSchema.safeParse(id);

    if (!idResult.success) {
      return {
        patient: null,
        error: idResult.error.message,
        status: 400,
      };
    }

    const dataResult = createPatientSchema.safeParse(patientData);

    try {
      const updatedPatient = await prisma.patient.update({
        where: {
          id: idResult.data,
        },
        data: dataResult,
      });
      return {
        patient: updatedPatient,
        error: null,
        status: 200,
      };
    } catch (e) {
      return {
        patient: null,
        error: "something went wrong",
        status: 500,
      };
    }
  }

  async deleteById(id: number) {
    const service = new PatientService();
    const { patient, error } = await service.findById(id);

    if (patient) {
      try {
        const deletedPatient = await prisma.patient.delete({
          where: {
            id: id, //id,
          },
        });
        if (!deletedPatient) {
          return {
            deletedPatient: null,
            error: "No patient found",
            status: 404,
          };
        }
        return { deletedPatient, error: null, status: 200 };
      } catch {
        return {
          patient: null,
          error: "something went wrong!",
          status: 500,
        };
      }
    }
    return {
      deletedPatient: null,
      error: error,
      status: 404,
    };
  }
}
