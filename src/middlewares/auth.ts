import express from "express";
import jwt from "jsonwebtoken";
import { UserClaims } from "../types/types";
import { UsersService } from "../services/users.services";
import { ADMIN_ROLE, DOCTOR_ROLE } from "../schemas/user.schema";

const userService = new UsersService();

export async function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (!req.headers.authorization) {
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }

  const splitHeader = req.headers.authorization.split(" ");

  if (
    splitHeader[0] !== "Bearer" ||
    splitHeader.length !== 2 ||
    !splitHeader[1]
  ) {
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }

  const token = splitHeader[1]; // user's JWT token

  try {
    // throws error when token is invalid
    jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch {
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }
}

export async function authWithUserMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (!req.headers.authorization) {
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }

  const splitHeader = req.headers.authorization.split(" ");

  if (
    splitHeader[0] !== "Bearer" ||
    splitHeader.length !== 2 ||
    !splitHeader[1]
  ) {
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }

  const token = splitHeader[1]; // user's JWT token

  try {
    const claims = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as UserClaims;
    console.log({ claims });
    const { error, user } = await userService.getById(
      claims.user_id.toString(),
    );
    if (!error && user) {
      req.user = user;
      // algun role... "programación funcional"
      req.isAdmin = user.roles.some((role) => {
        return role.name === ADMIN_ROLE.name;
      });
      req.isDoctor = user.roles.some((role) => {
        return role.name === DOCTOR_ROLE.name;
      });
    }
    next();
  } catch (e) {
    console.error({ e });
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }
}
