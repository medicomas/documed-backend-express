import { Router } from "express";
import { prisma } from "../db";

const router = Router();

// NOTE!!
// Business rules disallow the deletion or creation of new roles.
router.get("/", async (req, res) => {
  const roles = await prisma.userRole.findMany();
  res.send(roles);
});

export { router };
