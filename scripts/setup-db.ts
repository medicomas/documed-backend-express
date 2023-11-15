import { prisma } from "../src/db";
import chalk from "chalk";

const SUPER_USER = {
  email: "damaris@comp-soc.com",
  hashed_password:
    "51227fbc10cf81386272858f9b7d0261adb477d301154fbf9188a8a948cd9bdd",
  names: "Damaris Marian",
  surnames: "Del Carpio Martinez",
};

async function main() {
  // Check if the super user already exists
  const superUserExists =
    (await prisma.user.findFirst({
      where: { email: "damaris@comp-soc.com" },
    })) !== null;

  if (!superUserExists) {
    doing("Creating roles");
    const admin = await prisma.userRole.create({ data: { name: "ADMIN" } });
    const doctor = await prisma.userRole.create({ data: { name: "DOCTOR" } });

    done("Created roles ADMIN =", admin.id, "DOCTOR =", doctor.id);
    doing("Creating super user");

    let roles = await prisma.userRole.findMany();

    const superUser = await prisma.user.create({
      data: {
        ...SUPER_USER,
        roles: {
          connect: roles.map((role) => ({ name: role.name })),
        },
      },
    });
    roles = await prisma.userRole.findMany();
    done("Created super user with id =", superUser.id);
  } else {
    console.log("Super user already exists.");
  }
}

main()
  .then(async () => {
    console.log();
    await prisma.$disconnect();
    bye();
  })
  .catch(async (e) => {
    error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function doing(...args: any[]) {
  console.log(chalk.yellowBright("[DOIN]"), ...args);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function done(...args: any[]) {
  console.log(chalk.greenBright("[DONE]"), ...args);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function error(...args: any[]) {
  console.error(chalk.redBright("[ERR!]"), ...args);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bye() {
  console.log(chalk.blueBright("[BYE!] 🐢"));
}
