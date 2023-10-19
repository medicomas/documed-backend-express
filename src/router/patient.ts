import { Router } from "express";
import { prisma } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const patients = await prisma.patient.findMany();
  res.send(patients);
});

router.get("/two", async (req, res) => {
  const patientTwo = await prisma.patient.findUnique({
    where: {
      id: 1,
    },
  });
  res.send(patientTwo);
});

router.post("/", async (req, res) => {
  try {
    const { names, surnames, documentType, document, gender } = req.body;

    if (
      typeof names !== "string" ||
      names.trim() === "" ||
      typeof surnames !== "string" ||
      surnames.trim() === "" ||
      typeof documentType !== "string" ||
      documentType.trim() === "" ||
      typeof document !== "string" ||
      document.trim() === "" ||
      typeof gender !== "string" ||
      gender.trim() === ""
    ) {
      res.sendStatus(400);
    } else {
      const patient = await prisma.patient.create({ data: req.body });
      res.send(patient);
    }
    console.log(req.body);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { names, surnames, documentType, document, gender } = req.body;
    const patientId = parseInt(req.params.id);

    if (
      typeof names !== "string" ||
      names.trim() === "" ||
      typeof surnames !== "string" ||
      surnames.trim() === "" ||
      typeof documentType !== "string" ||
      documentType.trim() === "" ||
      typeof document !== "string" ||
      document.trim() === "" ||
      typeof gender !== "string" ||
      gender.trim() === ""
    ) {
      res.sendStatus(400);
    } else {
      const updatedPatient = await prisma.patient.update({
        where: {
          id: patientId,
        },
        data: {
          names,
          surnames,
          documentType,
          document,
          gender,
        },
      });
      res.send(updatedPatient);
      console.log(updatedPatient);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export { router };

//:,)
