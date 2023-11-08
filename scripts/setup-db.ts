import { prisma } from "../src/db";
import chalk from "chalk";

const SUPER_USER = {
  email: "damaris@ieee.org",
  hashed_password:
    "51227fbc10cf81386272858f9b7d0261adb477d301154fbf9188a8a948cd9bdd",
  names: "Damaris Marian",
  surnames: "Del Carpio Martinez",
  roles: {
    create: [{ name: "ADMIN" }, { name: "DOCTOR" }],
  },
};

async function main() {
  // Check if the super user already exists
  const superUserExists = await prisma.user.findFirst({
    where: { email: "damaris@ieee.org" },
  });

  if (!superUserExists) {
    doing("Creating roles");
    await prisma.$executeRaw`DELETE FROM UserRole`;
    await prisma.$executeRaw`ALTER TABLE UserRole AUTO_INCREMENT = 1`;

    const admin = await prisma.userRole.create({ data: { name: "ADMIN" } });
    const doctor = await prisma.userRole.create({ data: { name: "DOCTOR" } });

    done("Created roles ADMIN =", admin.id, "DOCTOR =", doctor.id);
    doing("Creating super user");

    const superUser = await prisma.user.create({
      data: SUPER_USER,
    });
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
