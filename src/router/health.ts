import { Router } from "express";
import { docs } from "../docs/middleware";
import { z } from "zod";

const router = Router();

router.get(
  "/",
  (req, res) =>
    res.send({
      status: "UP",
    }),
  docs({
    description: "Returns the status of the server",
    responses: {
      200: {
        schema: z.object({
          status: z.literal("UP"),
        }),
      },
    },
  }),
);

export { router };
