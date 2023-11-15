import { Router } from "express";
import { UsersService } from "../services/users.services";
import { docs } from "../docs/middleware";
import { createUserSchema, userResponseSchema } from "../schemas/user.schema";
import { z } from "zod";

const router = Router();
const userService = new UsersService();

router.get(
  "/",
  async (req, res) => {
    const { users, error, status } = await userService.getAllUsers();
    if (error) {
      res.status(status).send({
        message: error,
      });
      return;
    }
    res.status(status).send(users);
  },
  docs({
    description: "Get all users",
    responses: {
      200: {
        schema: z.array(userResponseSchema),
      },
    },
  }),
);

router.post(
  "/",
  async (req, res) => {
    const { user, error, status } = await userService.createUser(req.body);
    if (error) {
      res.status(status).send({
        message: error,
      });
      return;
    }
    res.status(status).send(user);
  },
  docs({
    description: "Create a new user",
    body: createUserSchema,
    responses: {
      200: {
        schema: userResponseSchema,
      },
    },
  }),
);

router.get(
  "/:id",
  async (req, res) => {
    const { user, error, status } = await userService.getById(req.params.id);
    if (error) {
      res.status(status).send({
        message: error,
      });
      return;
    }
    res.status(status).send(user);
  },
  docs({
    description: "Get user by id",
    responses: {
      200: {
        schema: userResponseSchema,
      },
    },
  }),
);

// WARNING: destructive operation
router.delete(
  "/:id",
  async (req, res) => {
    const { user, error, status } = await userService.deleteUser(req.params.id);
    if (error) {
      res.status(status).send({
        message: error,
      });
      return;
    }
    res.status(status).send(user);
  },
  docs({
    description: "Delete user by id",
    responses: {
      200: {
        schema: userResponseSchema,
      },
    },
  }),
);

export { router };
