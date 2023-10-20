import { Router } from "express";
import { prisma } from "../db";

const router = Router();

// show all patients
router.get("/", async (req, res) => {
  try {
    const patients = await prisma.patient.findMany();
    res.send(patients);
  } catch (error) {
    res.sendStatus(500);
  }
});

// search patient
router.get("/:id", async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    if (isNaN(patientId) || patientId <= 0) {
      res.sendStatus(400);
    } else {
      const foundPatient = await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
      });
      if (!foundPatient) {
        res.sendStatus(404);
      } else {
        res.send(foundPatient);
        console.log("patient succesfully found");
      }
    }
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

// create one patient
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
      gender.trim() === "" ||
      !isValidGender(gender)
    ) {
      res.sendStatus(400);
    } else {
      const patient = await prisma.patient.create({ data: req.body });
      res.send(patient);
      console.log(req.body);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// update one patient
router.put("/:id", async (req, res) => {
  try {
    const { names, surnames, documentType, document, gender } = req.body;
    const patientId = parseInt(req.params.id);

    if (isNaN(patientId) || patientId <= 0) {
      res.sendStatus(400);
    } else {
      const foundPatient = await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
      });
      if (!foundPatient) {
        res.sendStatus(404);
      } else {
        if (
          (names && (typeof names !== "string" || names.trim() === "")) ||
          (surnames &&
            (typeof surnames !== "string" || surnames.trim() === "")) ||
          (documentType &&
            (typeof documentType !== "string" || documentType.trim() === "")) ||
          (document &&
            (typeof document !== "string" || document.trim() === "")) ||
          (gender &&
            (typeof gender !== "string" ||
              gender.trim() === "" ||
              !isValidGender(gender)))
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
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//delete one patient
router.delete("/:id", async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);

    if (isNaN(patientId) || patientId <= 0) {
      res.sendStatus(400);
    } else {
      const foundPatient = await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
      });
      if (!foundPatient) {
        res.sendStatus(404);
      } else {
        const deletedPatient = await prisma.patient.delete({
          where: {
            id: patientId,
          },
        });
        res.send(deletedPatient);
      }
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

function isValidGender(gender: string) {
  return gender === "M" || gender === "F";
}

export { router };

//:,)
