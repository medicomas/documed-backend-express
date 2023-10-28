import jwt from "jsonwebtoken";
import { Router } from "express";
import { PatientService } from "../services/patient.services";

const router = Router();
const service = new PatientService();

type UserClaims = {
  user_id: number;
  iat: number;
  exp: number;
};

// show all patients
router.get("/", async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }

  const splitHeader = req.headers.authorization.split(" ");

  if (
    splitHeader[0] !== "Bearer" ||
    splitHeader.length !== 2 ||
    !splitHeader[1]
  ) {
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }

  const token = splitHeader[1]; // user's JWT token

  try {
    const claims = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as UserClaims;
    console.log({ claims });
  } catch {
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }

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
