import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../db";
import {
  createUserSchema,
  idSchema,
  updateUserSchema,
} from "../schemas/user.schema";

export class UsersService {
  constructor() {}

  private hashPassword(password: string) {
    // TODO: hash password or smth like that
    return password;
  }

  async createUser(userData: object) {
    const result = createUserSchema.safeParse(userData);
    if (!result.success) {
      return { user: null, error: result.error.errors[0].message, status: 400 };
    }

    const { email, names, surnames, password, roles } = result.data;
    const hashed_password = this.hashPassword(password);

    try {
      const user = await prisma.users.create({
        data: {
          names,
          surnames,
          hashed_password,
          email,
          roles: {
            create: roles.map((roleName) => ({
              role: {
                create: {
                  name: roleName,
                },
              },
            })),
          },
        },
      });
      return { user, error: null, status: 201 };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          user: null,
          error: "Email already exists",
          status: 400,
        };
      }
      return { user: null, error: "something went wrong!", status: 500 };
    }
  }

  async getAllUsers() {
    try {
      const users = await prisma.users.findMany({
        include: {
          roles: {
            select: {
              userId: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      return { users, error: null, status: 200 };
    } catch (error) {
      return { users: null, error: "something went wrong!", status: 500 };
    }
  }

  async getById(id: string) {
    const result = idSchema.safeParse(Number(id));
    if (!result.success) {
      return { user: null, error: result.error.errors[0].message, status: 400 };
    }
    const { data: userId } = result;

    try {
      const user = await prisma.users.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          names: true,
          surnames: true,
          email: true,
          roles: true,
        },
      });
      if (!user) {
        return { user: null, error: "User not found", status: 404 };
      }
      return { user, error: null, status: 200 };
    } catch (error) {
      return { user: null, error: "something went wrong!", status: 500 };
    }
  }

  async updateUser(id: string, userData: object) {
    // allow empty fields
    const result = updateUserSchema.partial().safeParse(userData);
    if (!result.success) {
      return { user: null, error: result.error.errors[0].message, status: 400 };
    }

    const { names, surnames } = result.data;

    try {
      const user = await prisma.users.update({
        where: {
          id: Number(id),
        },
        data: {
          names,
          surnames,
          // roles: [], // TODO: update roles
        },
      });
      return { user, error: null, status: 200 };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          user: null,
          error: "Email already exists",
          status: 400,
        };
      }
      return { user: null, error: "something went wrong!", status: 500 };
    }
  }

  async changeUserPassword(id: string, newPassword: string) {
    const hashed_password = this.hashPassword(newPassword);
    try {
      const user = await prisma.users.update({
        where: {
          id: Number(id),
        },
        data: {
          hashed_password,
        },
      });
      return { user, error: null, status: 200 };
    } catch (error) {
      return { user: null, error: "something went wrong!", status: 500 };
    }
  }

  async deleteUser(id: string) {
    const result = idSchema.safeParse(Number(id));
    if (!result.success) {
      return { user: null, error: result.error.errors[0].message, status: 400 };
    }
    const { data: userId } = result;

    if (userId === 1) {
      return {
        user: null,
        error: "Cannot delete user with id 1",
        status: 401,
      };
    }

    try {
      const user = await prisma.users.delete({
        where: {
          id: userId,
        },
      });
      return { user, error: null, status: 200 };
    } catch (error) {
      return { user: null, error: "something went wrong!", status: 500 };
    }
  }
}
