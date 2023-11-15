import jwt from "jsonwebtoken";
import { userLoginSchema } from "../schemas/user.schema";
import { sha256 } from "../utils";
import { Router } from "express";
import { prisma } from "../db";
import { authWithUserMiddleware } from "../middlewares/auth";
import { docs } from "../docs/middleware";
import { z } from "zod";

const router = Router();

const ONE_MONTH = 30 * 24 * 60 * 60;

router.post(
  "/login",
  async (req, res) => {
    const validCredential = userLoginSchema.safeParse(req.body);
    if (!validCredential.success) {
      res.status(400).send({
        message: "Credenciales inválidas :(",
      });
      return;
    }

    const userLogin = await prisma.user.findUnique({
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
  },
  docs({
    description: `Recibe un email y un password, y devuelve un token de autenticación que luego se usará para autenticar peticiones subsiguientes.`,
    body: userLoginSchema,
    responses: {
      200: {
        schema: z.object({
          token: z.string(),
        }),
      },
    },
  }),
);

const userResponseSchema = z.object({
  email: z.string(),
  id: z.number(),
  names: z.string(),
  surnames: z.string(),
  roles: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
});

router.get(
  "/profile",
  authWithUserMiddleware,
  (req, res) => res.send(req.user),
  docs({
    description: `Recibe un token a través de un header de autentiación, y devuelve el usuario asociado a él.

El token se envía a través del header \`Authorization: Bearer <token>\``,
    responses: {
      200: {
        schema: userResponseSchema,
      },
    },
  }),
);

export { router };
