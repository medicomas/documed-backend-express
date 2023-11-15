import swaggerUi from "swagger-ui-express";
import { schema } from "./register";

export const docsStatics = swaggerUi.serve;

export const docsHandler = () => {
  return swaggerUi.setup(schema(), {
    customSiteTitle: "Documed API",
    customCss: ".curl-command { display: none }",
  });
};
