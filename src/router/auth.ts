import { Router } from "express";
import { prisma } from "../db";

const router = Router();

router.get("/users", async (req, res) => {
  const users = await prisma.users.findMany({
    include: {
      roles: true,
    },
  });

  res.send(users);
});

router.get("/users/:id", async (req, res) => {
  const user_id = Number(req.params.id);

  if (isNaN(user_id) || user_id <= 0) {
    res.sendStatus(400);
    return;
  }
  try {
    const user = await prisma.users.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });
    if (user != null) {
      res.send(user);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

export { router };
