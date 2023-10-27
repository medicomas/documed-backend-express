import { Router } from "express";
import { UsersService } from "../services/users.services";

const router = Router();
const userService = new UsersService();

router.get("/", async (req, res) => {
  const { users, error, status } = await userService.getAllUsers();
  if (error) {
    res.status(status).send({
      message: error,
    });
    return;
  }
  res.status(status).send(users);
});

router.post("/", async (req, res) => {
  const { user, error, status } = await userService.createUser(req.body);
  if (error) {
    res.status(status).send({
      message: error,
    });
    return;
  }
  res.status(status).send(user);
});

router.get("/:id", async (req, res) => {
  const { user, error, status } = await userService.getById(req.params.id);
  if (error) {
    res.status(status).send({
      message: error,
    });
    return;
  }
  res.status(status).send(user);
});

// WARNING: destructive operation
router.delete("/:id", async (req, res) => {
  const { user, error, status } = await userService.deleteUser(req.params.id);
  if (error) {
    res.status(status).send({
      message: error,
    });
    return;
  }
  res.status(status).send(user);
});

export { router };
