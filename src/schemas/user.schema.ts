import { z } from "zod";

export const ADMIN_ROLE = {
  id: 1,
  name: "ADMIN",
};
export const DOCTOR_ROLE = {
  id: 2,
  name: "DOCTOR",
};

export const getRoleIdByName = (name: string) => {
  switch (name) {
    case ADMIN_ROLE.name:
      return ADMIN_ROLE.id;
    case DOCTOR_ROLE.name:
      return DOCTOR_ROLE.id;
    default:
      return -1;
  }
};

// Roles are pretty much hardcoded,
// we need a way to sync the roles from the database
export const userRoleSchema = z.union([
  z.literal(ADMIN_ROLE.name),
  z.literal(DOCTOR_ROLE.name),
]);

/**
 * Schema to use when validating POST /users
 */
export const createUserSchema = z.object({
  names: z.string().min(1),
  surnames: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6), // password validation or smth like that
  roles: z.array(userRoleSchema).min(1),
});

/**
 * Schema to use when validating PUT /users/:id
 *
 * Note that there is no password nor email field, because
 * we don't want to update the password using this endpoint.
 */
export const updateUserSchema = z.object({
  names: z.string().min(1),
  surnames: z.string().min(1),
  roles: z.array(userRoleSchema).min(1),
});

/**
 * The purpose of this schema is to document the returning type of GET /user/:id
}
 */
export const userResponseSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  names: z.string().min(1),
  surnames: z.string().min(1),
  roles: z.array(
    z.object({
      id: z.number().int(),
      name: z.string(),
    }),
  ),
});

export const idSchema = z.number().min(1).int();

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserRoleInput = z.infer<typeof userRoleSchema>;
