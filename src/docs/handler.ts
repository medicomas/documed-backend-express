import swaggerUi from "swagger-ui-express";
import { schema } from "../docs/schema";

export const docsStatics = swaggerUi.serve;

export const docsHandler = swaggerUi.setup(schema, {
  customSiteTitle: "Documed API",
  customCss: ".curl-command { display: none }",
});
