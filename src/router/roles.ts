import { Router } from "express";
import { prisma } from "../db";
import { docs } from "../docs/middleware";
import { z } from "zod";

const router = Router();

// NOTE!!
// Business rules disallow the deletion or creation of new roles.
router.get(
  "/",
  async (req, res) => {
    const roles = await prisma.userRole.findMany();
    res.send(roles);
  },
  docs({
    description: "Returns all the roles in the system",
    responses: {
      200: {
        schema: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          }),
        ),
      },
    },
  }),
);

export { router };
