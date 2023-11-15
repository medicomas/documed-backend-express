import { Router } from "express";
import { z } from "zod";
import chalk from "chalk";
import groupBy from "object.groupby";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  ResponseConfig,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { DOCS_MIDDLEWARE_NAME } from "./middleware";
import {
  APIMethod,
  EndpointGatheredInformation,
  UrlParam,
  EndpointDocumentation,
} from "./types";

/**
 * The registry is the object that will hold all the information that will be
 * used to generate the final OpenAPI document.
 */
const docsRegistry = new OpenAPIRegistry();

docsRegistry.registerComponent("securitySchemes", "jwtAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

/**
 * Converts /patient/:id to /patient/{id}
 *
 * @param path The Express-like string path
 */
function expressPathToOASPath(path: string) {
  const withoutTrailingSlash = path.endsWith("/") ? path.slice(0, -1) : path;
  return withoutTrailingSlash
    .split(/:(\w+)/g)
    .map((part, index) => {
      if (index % 2 === 0) return part;
      return `{${part}}`;
    })
    .join("");
}

/**
 * Given a router, it extracts as much information as possible from the endpoints
 * and registers them in the docsRegistry.
 *
 * @param path The router path that is being documented
 * @param router The actual { router } object exported from the file
 */
export function extractRouterDocumentation(path: string, router: Router) {
  const { stack } = router;
  const routesByPath = groupBy(stack, (endpoint: any) => endpoint.route.path); // eslint-disable-line
  // Iterate over all the endpoints defined for the current router, grouped by Path
  // (a path can have multiple endpoints, typically multiple HTTP methods)

  let allRoutesDocumented = true;
  for (const [route, endpoints] of Object.entries(routesByPath)) {
    // Gather information about each endpoint
    const endpointsInfo = endpoints.map((endpoint) => {
      const { stack, methods } = endpoint.route;
      const method = Object.keys(methods)[0] as APIMethod;
      // Finds the 'docs()' middleware
      const documentation = stack.find(
          (layer: any) => layer.name === DOCS_MIDDLEWARE_NAME, // eslint-disable-line
      )?.handle;
      const requiresAuth = stack.some(
        (layer: any) => layer.name.includes('auth'), // eslint-disable-line
      );

      if (!documentation) {
        console.warn(
          `${chalk.yellow("[warn]")} ${chalk.green(
            method.toUpperCase(),
          )} ${chalk.cyan(
            path + route,
          )} has no documentation for the frontend team >:(`,
        );
        allRoutesDocumented = false;
      }

      return {
        method,
        path: expressPathToOASPath(`/${path}${route}`),
        tags: [path],
        requiresAuth: requiresAuth,
        params: endpoint.keys.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (param: any) =>
            ({
              in: "path",
              name: param.name,
              schema: { type: "integer" },
              required: !param.optional,
            }) satisfies UrlParam,
        ),
        docs: documentation
          ? documentation()
          : (null as EndpointDocumentation | null),
      } satisfies EndpointGatheredInformation;
    });

    endpointsInfo.forEach((endpoint) => {
      if (!endpoint.docs) return;
      docsRegistry.registerPath(endpointToSchema(endpoint));
    });
  }
  if (allRoutesDocumented) {
    console.log(
      `${chalk.green("[nice]")} ${chalk.cyan(path)} is fully documented!`,
    );
  }
}

/**
 *
 * @param endpoint The information that has been programatically collected from the
 * endpoints that use the docs() middleware
 * @returns A valid RouteConfig object that will be registered in the docsRegistry.
 */
function endpointToSchema(endpoint: EndpointGatheredInformation): RouteConfig {
  const schema: RouteConfig = {
    method: endpoint.method,
    path: endpoint.path,
    tags: endpoint.tags,
    parameters: endpoint.params,
    responses: {},
  };

  if (endpoint.requiresAuth) {
    schema.security = [
      {
        jwtAuth: [],
      },
    ];
  }
  if (!endpoint.docs) return schema;

  schema.description = endpoint.docs.description;

  Object.entries(endpoint.docs.responses).map(([code, response]) => {
    schema.responses[code] = {
      description: response.description || "",
      content: {
        "application/json": {
          schema: response.schema,
        },
      },
    } satisfies ResponseConfig;
  });
  if (endpoint.docs.body) {
    schema.request = {
      body: {
        content: {
          "application/json": {
            schema: endpoint.docs.body,
          },
        },
      },
    };
  }

  if (endpoint.docs.verbose) {
    schema.responses[500] ??= {
      description: "Internal server error D:",
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
    } satisfies ResponseConfig;

    schema.responses[401] ??= {
      description: "Error: Unauthorized (No JWT was provided D:)",
      content: {
        "application/json": {
          schema: z.object({ error: z.literal("Unauthorized") }),
        },
      },
    } satisfies ResponseConfig;
  }

  return schema;
}

/**
 * Creates the final OpenAPI Document schema for the whole API based on the
 * registry definitions above.
 */
export const schema = () =>
  new OpenApiGeneratorV3(docsRegistry.definitions).generateDocument({
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
  });
