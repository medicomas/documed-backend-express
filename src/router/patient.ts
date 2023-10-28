import { Router } from "express";
import { PatientService } from "../services/patient.services";
import { authWithUserMiddleware } from "../middlewares/auth";

const router = Router();
const service = new PatientService();

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
