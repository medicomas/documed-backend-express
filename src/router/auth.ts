import jwt from "jsonwebtoken";
import { userLoginSchema } from "../schemas/user.schema";
import { sha256 } from "../utils";
import { Router } from "express";
import { prisma } from "../db";
import { authWithUserMiddleware } from "../middlewares/auth";

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

router.get("/profile", authWithUserMiddleware, (req, res) =>
  res.send(req.user),
);

export { router };
