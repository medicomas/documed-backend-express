import { Router } from "express";
import { readdirSync } from "fs";

// Routes that shouldn't be visible to the router
const IGNORED_ROUTES = ["index", "router"];
const ROUTING_DIRECTORY = __dirname;

// The main router that will be used in src/server.ts
const router = Router();

readdirSync(ROUTING_DIRECTORY).forEach(async (file) => {
  const route = file.split(".")[0];
  if (IGNORED_ROUTES.includes(route)) return;

  try {
    const module = await import(`./${route}`);
    router.use(`/${route}`, module.router);
  } catch (err) {
    console.log(err);
  }
});

export { router };
