import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./router";

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});

async function main() {
  // const user = await prisma.users.create({
  //   data: {
  //     email: "damaris@ieee.org",
  //     hashed_password: "******",
  //     names: "Damaris Marian",
  //     surnames: "Del Carpio Martinez",
  //   },
  // });
  // console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
