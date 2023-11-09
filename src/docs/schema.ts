/**
 * Programmatic documentation for the Documed API
 */

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

const docsRegistry = new OpenAPIRegistry();

docsRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "Bearer",
  bearerFormat: "JWT",
});

docsRegistry.registerPath({
  method: "get",
  path: "/health",
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["UP", "DOWN"],
              },
            },
          },
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(docsRegistry.definitions);

export const schema = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    version: "0.0.1",
    title: "Documed API",
    description: "The documed API",
  },
  servers: [
    {
      url: "/api/v1",
      description: process.env.NODE_ENV || "development",
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
});
