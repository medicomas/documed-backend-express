import { Router } from "express";
import { PatientService } from "../services/patient.services";
import { authWithUserMiddleware } from "../middlewares/auth";
import { docs } from "../docs/middleware";
import { z } from "zod";
import {
  createPatientSchema,
  patientResponseSchema,
} from "../schemas/patient.schema";

const router = Router();
const service = new PatientService();

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
    const { patients, error } = await service.getAllPatients();

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
  async (req, res) => {
    const { patient, error, status } = await service.findById(
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
  async (req, res) => {
    const { patient, error } = await service.create(req.body);
    if (error) {
      res.status(500).send({
        error: error,
      });
      return;
    }
    res.send(patient);
  },
  docs({
    description: "Create a new patient",
    body: createPatientSchema,
    responses: {
      200: {
        description: "Returns the newly created patient",
        schema: patientResponseSchema,
      },
    },
  }),
);

// update one patient
router.put(
  "/:id",
  async (req, res) => {
    const { patient, error, status } = await service.updatePatient(
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
    description: "Edits one patient",
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
  async (req, res) => {
    const { patient, error, status } = await service.deleteById(
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
      "Deletes one patient. WARNIG. This action is quite destructive. It deletes the patient and all its associated appointments.",
    body: null,
    responses: {
      200: {
        description: "Returns the deleted patient",
        schema: patientResponseSchema,
      },
    },
  }),
);

export { router };

//:,)
