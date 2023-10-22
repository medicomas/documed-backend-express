import { prisma } from "../src/db";
import chalk from "chalk";

async function main() {
  doing("Creating roles");
  await prisma.$executeRaw`DELETE FROM UserRole`;
  await prisma.$executeRaw`ALTER TABLE UserRole AUTO_INCREMENT = 1`;

  await prisma.userRole.deleteMany();
  const adminRole = await prisma.userRole.create({ data: { name: "ADMIN" } });
  const doctorRole = await prisma.userRole.create({ data: { name: "DOCTOR" } });

  done("Created roles ADMIN =", adminRole.id, "DOCTOR =", doctorRole.id);
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
