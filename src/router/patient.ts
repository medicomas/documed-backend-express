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
  const patient = await prisma.patient.create({ data: req.body });
  res.send(patient);
  console.log(req.body);
});

router.put("/:id", (req, res) => {
  res.setHeader("content-type", "text/plain");
  res.send("editing patient no. " + req.params.id);
});

export { router };

//:,)
