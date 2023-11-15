import { Router } from "express";
import { readdirSync } from "fs";
import { docsHandler, docsStatics } from "../docs/handler";
import { extractRouterDocumentation } from "../docs/register";

// The main router that will be used in src/server.ts
const router = Router();

router.use("/docs", docsStatics);
router.get("/docs", (req, res, next) => {
  docsHandler()(req, res, next);
});

// Routes that shouldn't be visible to the router
const IGNORED_ROUTES = ["index"];

readdirSync(__dirname).forEach(async (file) => {
  const route = file.split(".")[0];
  if (IGNORED_ROUTES.includes(route)) return;

  try {
    const module = await import(`./${route}`);
    extractRouterDocumentation(route, module.router);
    router.use(`/api/v1/${route}`, module.router);
  } catch (err) {
    console.log(err);
  }
});

export { router };
