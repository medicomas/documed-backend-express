import { Router } from "express";
import { PatientService } from "../services/patient.services";

const router = Router();
const service = new PatientService();

// show all patients
router.get("/", async (req, res) => {
  const { patients, error } = await service.getAllPatients();
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
});

// create one patient
router.post("/", async (req, res) => {
  const { patient, error } = await service.create(req.body);
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
});

//delete one patient
router.delete("/:id", async (req, res) => {
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
});

export { router };

//:,)
