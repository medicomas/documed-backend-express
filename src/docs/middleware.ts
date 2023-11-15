import express from "express";
import { EndpointDocumentation } from "./types";

export const DOCS_MIDDLEWARE_NAME = "docsHandlerMiddleware";

export function docs(docs: EndpointDocumentation) {
  return function docsHandlerMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (next) next();
    return docs;
  };
}
