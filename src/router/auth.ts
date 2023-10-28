import jwt from "jsonwebtoken";
import { userLoginSchema } from "../schemas/user.schema";
import { sha256 } from "../utils";
import { Router } from "express";
import { prisma } from "../db";

const router = Router();

const ONE_MONTH = 30 * 24 * 60 * 60;

router.post("/login", async (req, res) => {
  const validCredential = userLoginSchema.safeParse(req.body);
  if (!validCredential.success) {
    res.status(400).send({
      message: "Credenciales inválidas :(",
    });
    return;
  }

  const userLogin = await prisma.users.findUnique({
    where: {
      email: validCredential.data.email,
      hashed_password: sha256(validCredential.data.password),
    },
  });

  if (userLogin === null) {
    res.status(404).send({
      message: "email or password do not exist!!",
    });
    return;
  }

  // payload
  const token = jwt.sign(
    {
      user_id: userLogin.id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: ONE_MONTH,
    },
  );

  res.send({
    token: token,
  });
});

router.get("/user", async (req, res) => {
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
