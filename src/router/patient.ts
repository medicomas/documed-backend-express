import { Router } from "express";
import { PatientService } from "../services/patient.services";
import { authMiddleware, authWithUserMiddleware } from "../middlewares/auth";
import { docs } from "../docs/middleware";
import { z } from "zod";
import {
  createPatientSchema,
  patientResponseSchema,
} from "../schemas/patient.schema";
import { AppointmentService } from "../services/appointment.services";
import {
  PhysicalExplorationSchema,
  WorkPlanSchema,
} from "../schemas/appointment.schema";

const router = Router();
const patientService = new PatientService();
const appointmentService = new AppointmentService();

// show all patients
router.get(
  "/",
  authWithUserMiddleware,
  async (req, res) => {
    console.log({
      user: req.user,
    });
    // <header>.<claims>.<signature>
    //oye sácame los claims

    // token -> claims
    // claims -> user_id
    // user_id -> User
    const { patients, error } = await patientService.getAllPatients();

    if (error) {
      res.status(500).send({
        error: error,
      });
      return;
    }
    res.send(patients);
  },
  docs({
    description: "Returns all patients in the database",
    responses: {
      200: {
        description: "Array of Documed patients",
        schema: z.array(patientResponseSchema),
      },
    },
  }),
);

// search patient
router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    const { patient, error, status } = await patientService.findById(
      Number(req.params.id),
    );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(patient);
  },
  docs({
    description: "Returns a patient by id",
    responses: {
      200: {
        schema: patientResponseSchema,
      },
    },
  }),
);

// create one patient
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    const { patient, error } = await patientService.create(req.body);
    if (error) {
      res.status(500).send({
        error: error,
      });
      return;
    }
    res.send(patient);
  },
  docs({
    description: "Crea un nuevo paciente.",
    body: createPatientSchema,
    responses: {
      200: {
        schema: patientResponseSchema,
      },
    },
  }),
);

// update one patient
router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {
    const { patient, error, status } = await patientService.updatePatient(
      Number(req.params.id),
      req.body,
    );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(patient);
  },
  docs({
    description: "Edits one patient. All fields defined are OPTIONAL.",
    body: createPatientSchema.partial(),
    responses: {
      200: {
        schema: patientResponseSchema,
      },
    },
  }),
);

//delete one patient
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    const { patient, error, status } = await patientService.deleteById(
      Number(req.params.id),
    );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(patient);
  },
  docs({
    description:
      "Warning: destructive action. Only authenticated doctors/admin can perform this.",
    responses: {
      200: {
        schema: patientResponseSchema,
      },
    },
  }),
);

/**
{
  id: number;
  date: Date;
  has_attended: boolean;
  id_patient: number;
  id_doctor: number;
}
 */

const appointmentSchema = z.object({
  id: z.number(),
  date: z.string(),
  has_attended: z.boolean(),
  id_patient: z.number(),
  id_doctor: z.number(),
});

// ✅ Crea una nueva cita; se crea sobre el paciente {id} y tiene una consulta (Consultation) inicialmente nula (null).
router.post(
  "/:id/citas/nueva",
  authWithUserMiddleware,
  async (req, res) => {
    const { appointment, error, status } =
      await appointmentService.createEmptyAppointment(
        Number(req.params.id),
        Number(req.user?.id),
        new Date(req.body.date),
      );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(appointment);
  },
  docs({
    description: `Agenda una cita sobre un paciente con id {id}.
Esta cita todavía no cuenta con la presencia del paciente.

La fecha que recibe esta ruta debe un objeto parseable por \`new Date(date)\``,
    body: z.object({
      date: z.date(),
    }),
    responses: {
      200: {
        schema: appointmentSchema,
      },
    },
  }),
);

/*
{
  id: number;
  anamnesis: string;
  id_appointment: number;
  id_vitalsigns: number;
  id_physicalexploration: number;
  id_workplan: number;
}
*/

const consultationSchema = z.object({
  id: z.number(),
  anamnesis: z.string(),
  id_appointment: z.number(),
  id_vitalsigns: z.number(),
  id_physicalexploration: z.number(),
  id_workplan: z.number(),
});

// ✅ Inicia la consulta para la cita {cita_id}.
router.post(
  "/:id/citas/:cita_id/iniciar",
  authWithUserMiddleware,
  async (req, res) => {
    const { appointment, error, status, consultation } =
      await appointmentService.startAppointment(
        Number(req.params.id),
        Number(req.params.cita_id),
        Number(req.user?.id),
      );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send({ consultation, appointment });
  },
  docs({
    description: `Inicia la consulta para la cita {cita_id}.
La consulta se inicia sobre un paciente en específico, sobre una cita previamente programada.

Esto marca la cita como atendida, pues se contó con la presencia del paciente.

Además, inicia TODOS los datos de la consulta (Consultation) como campos vacíos, para que puedan
empezar a ser rellenados por el médico.
`,
    responses: {
      200: {
        schema: z.object({
          appointment: appointmentSchema,
          consultation: consultationSchema,
        }),
      },
    },
  }),
);

/**
{
  appointment: {
    id: number;
    date: Date;
    patient: {
      names: string;
      surnames: string;
    };
  };
}[]
 */

const basicConsultationSchema = z.object({
  appointment: z.object({
    id: z.number(),
    date: z.string(),
    patient: z.object({
      names: z.string(),
      surnames: z.string(),
    }),
  }),
});

// ✅ returns basic info of all patient's consultations
router.get(
  "/:id/consultas/",
  authMiddleware,
  async (req, res) => {
    const { consultations, error, status } =
      await appointmentService.getBasicConsultation(Number(req.params.id));
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(consultations);
  },
  docs({
    description: `Devuelve información básica de todas las consultas del paciente.
Esta ruta puede ser útil para mostrar una lista de consultas pasadas.`,
    responses: {
      200: {
        schema: z.array(basicConsultationSchema),
      },
    },
  }),
);

// ✅ returns basic info of all patient's appointments
router.get(
  "/:id/citas",
  authMiddleware,
  async (req, res) => {
    const { appointments, error, status } =
      await appointmentService.getAllAppointments(Number(req.params.id));
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(appointments);
  },
  docs({
    description: `Devuelve información básica de todas las citas del paciente.

Esta ruta puede ser útil para mostrar una lista de citas pasadas.`,
    responses: {
      200: {
        schema: z.array(
          z.object({
            date: z.string(),
            has_attended: z.boolean(),
          }),
        ),
      },
    },
  }),
);

// ✅ La consulta {cid} del paciente {id}. Esta sí debe contener TODA la información de la consulta.
router.get(
  "/:id/consultas/:cid",
  authMiddleware,
  async (req, res) => {
    const { consultation, error, status } =
      await appointmentService.getFullConsultation(
        Number(req.params.id),
        Number(req.params.cid),
      );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(consultation);
  },
  docs({
    description: `Devuelve información completa de la consulta {cid} del paciente {id}.

Esta ruta puede ser útil para mostrar una consulta en específico. Contiene TODA la información de una consulta.`,
    responses: {
      200: {
        schema: consultationSchema,
      },
    },
  }),
);

/**
{
  id: number;
  presion_arterial: number | null;
  temperatura: number | null;
  frecuencia_respiratoria: number | null;
  frecuencia_cardiaca: number | null;
  peso: number | null;
  talla: number | null;
  imc: number | null;
}
 */

const vitalSignsSchema = z.object({
  id: z.number(),
  presion_arterial: z.number().nullable(),
  temperatura: z.number().nullable(),
  frecuencia_respiratoria: z.number().nullable(),
  frecuencia_cardiaca: z.number().nullable(),
  peso: z.number().nullable(),
  talla: z.number().nullable(),
  imc: z.number().nullable(),
});

// ✅ Las constantes vitales del paciente para la cita {cid}
router.put(
  "/:id/consultas/:cid/constantesvitales",
  authMiddleware,
  async (req, res) => {
    const { vitalSigns, error, status } =
      await appointmentService.updateVitalSigns(
        Number(req.params.id),
        Number(req.params.cid),
        req.body,
      );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(vitalSigns);
  },
  docs({
    description: `Edita las constantes vitales para la cita {cid} del paciente {id}.`,
    body: z.object({
      blood_pressure: z.string(),
      heart_rate: z.string(),
      respiratory_rate: z.string(),
      temperature: z.string(),
    }),
    responses: {
      200: {
        schema: vitalSignsSchema,
      },
    },
  }),
);

// ✅ El plan de trabajo del paciente con id {id} en su consulta {cid}
router.put(
  "/:id/consultas/:cid/plandetrabajo",
  authMiddleware,
  async (req, res) => {
    const { workplan, error, status } = await appointmentService.updateWorkplan(
      Number(req.params.id),
      Number(req.params.cid),
      req.body,
    );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(workplan);
  },
  docs({
    description: `Edita el plan de trabajo para la cita {cid} del paciente {id}.`,
    body: WorkPlanSchema,
    responses: {
      200: {
        schema: WorkPlanSchema,
      },
    },
  }),
);

// ✅ Postea la exploración física para la consulta {cid}
router.put(
  "/:id/consultas/:cid/exploracionfisica",
  authMiddleware,
  async (req, res) => {
    const { physicalExploration, error, status } =
      await appointmentService.updatePhysicalExploration(
        Number(req.params.id),
        Number(req.params.cid),
        req.body,
      );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(physicalExploration);
  },
  docs({
    description: `Edita la exploración física para la cita {cid} del paciente {id}. Retorna el objeto editado.`,
    body: PhysicalExplorationSchema,
    responses: {
      200: {
        schema: PhysicalExplorationSchema,
      },
    },
  }),
);

/**
{
  id: number;
  name: string;
  value: string;
  id_patient: number;
}[]
 */

const medicalAntecedentResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  value: z.string(),
  id_patient: z.number(),
});

// ✅ Obtiene los antecedentes de un paciente. Los antecedentes no están atados a ninguna cita.
router.get(
  "/:id/antecedentes",
  authMiddleware,
  async (req, res) => {
    const { medicalAntecedent, error, status } =
      await appointmentService.getMedicalAntecedent(Number(req.params.id));
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(medicalAntecedent);
  },
  docs({
    description: `Obtiene los antecedentes de un paciente. Los antecedentes no están atados a ninguna cita. En caso de no haber, devuelve un array vacío.`,
    responses: {
      200: {
        schema: z.array(medicalAntecedentResponseSchema),
      },
    },
  }),
);

router.post(
  "/:id/antecedentes",
  authMiddleware,
  async (req, res) => {
    const { medicalAntecedent, error, status } =
      await appointmentService.createMedicalAntecedent(
        Number(req.params.id),
        req.body,
      );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(medicalAntecedent);
  },
  docs({
    description: `Crea un nuevo antecedente para el paciente {id}.`,
    body: medicalAntecedentResponseSchema,
    responses: {
      200: {
        schema: medicalAntecedentResponseSchema,
      },
    },
  }),
);

router.delete(
  "/:id/antecedentes/:aid",
  authMiddleware,
  async (req, res) => {
    const { medicalAntecedent, error, status } =
      await appointmentService.deleteMedicalAntecedent(
        Number(req.params.id),
        Number(req.params.aid),
      );
    if (error) {
      res.status(status).send({
        error: error,
      });
      return;
    }
    res.send(medicalAntecedent);
  },
  docs({
    description: `Elimina el antecedente {aid} del paciente {id}.`,
    responses: {
      200: {
        schema: medicalAntecedentResponseSchema,
      },
    },
  }),
);

export { router };
