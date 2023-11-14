import { Router } from "express";
import { PatientService } from "../services/patient.services";
import { authWithUserMiddleware } from "../middlewares/auth";
import { AppointmentService } from "../services/appointment.services";

const router = Router();
const patientService = new PatientService();
const appointmentService = new AppointmentService();

// show all patients
router.get("/", authWithUserMiddleware, async (req, res) => {
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
});

// search patient
router.get("/:id", async (req, res) => {
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
});

// create one patient
router.post("/", async (req, res) => {
  const { patient, error } = await patientService.create(req.body);
  if (error) {
    res.status(500).send({
      error: error,
    });
    return;
  }
  res.send(patient);
});

// update one patient
router.put("/:id", async (req, res) => {
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
});

//delete one patient
router.delete("/:id", async (req, res) => {
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
});

// ✅ Crea una nueva cita; se crea sobre el paciente {id} y tiene una consulta (Consultation) inicialmente nula (null).
router.post("/:id/citas/nueva", authWithUserMiddleware, async (req, res) => {
  const { appointment, error, status } =
    await appointmentService.createEmptyAppointment(
      Number(req.params.id),
      Number(req.user?.id),
      req.body.date,
    );
  if (error) {
    res.status(status).send({
      error: error,
    });
    return;
  }
  res.send(appointment);
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
);

// ✅ returns basic info of all patient's consultations
router.get("/:id/consultas/", async (req, res) => {
  const { consultations, error, status } =
    await appointmentService.getBasicConsultation(Number(req.params.id));
  if (error) {
    res.status(status).send({
      error: error,
    });
    return;
  }
  res.send(consultations);
});

// ✅ returns basic info of all patient's appointments
router.get("/:id/citas", async (req, res) => {
  const { appointments, error, status } =
    await appointmentService.getAllAppointments(Number(req.params.id));
  if (error) {
    res.status(status).send({
      error: error,
    });
    return;
  }
  res.send(appointments);
});

// ✅ La consulta {cid} del paciente {id}. Esta sí debe contener TODA la información de la consulta.
router.get("/:id/consultas/:cid", async (req, res) => {
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
});

// ✅ Las constantes vitales del paciente para la cita {cid}
router.put("/:id/consultas/:cid/constantesvitales", async (req, res) => {
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
});

// ✅ El plan de trabajo del paciente con id {id} en su consulta {cid}
router.put("/:id/consultas/:cid/plandetrabajo", async (req, res) => {
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
});

// ✅ Postea la exploración física para la consulta {cid}
router.put("/:id/consultas/:cid/exploracionfisica", async (req, res) => {
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
});

// ✅ Obtiene los antecedentes de un paciente. Los antecedentes no están atados a ninguna cita.
router.get("/:id/antecedentes", async (req, res) => {
  const { medicalAntecedent, error, status } =
    await appointmentService.getMedicalAntecedent(Number(req.params.id));
  if (error) {
    res.status(status).send({
      error: error,
    });
    return;
  }
  res.send(medicalAntecedent);
});

export { router };
