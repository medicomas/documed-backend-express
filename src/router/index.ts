import { Router } from "express";
import { readdirSync } from "fs";

const EXCEPTION_ROUTE_NAMES = ["index", "router"];
const ROUTING_DIRECTORY = `${__dirname}`;

const router = Router();

readdirSync(ROUTING_DIRECTORY).forEach(async (file) => {
  const route = file.split(".")[0];

  try {
    if (!EXCEPTION_ROUTE_NAMES.includes(route)) {
      const module = await import(`./${route}`);
      router.use(`/${route}`, module.router);
    }
  } catch (err) {
    console.log(err);
  }
});

export { router };
