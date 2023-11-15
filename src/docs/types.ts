import { z } from "zod";

export type APIMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options"
  | "trace";

// I assumed that all params will be integer ids
export type UrlParam = {
  in: "path";
  name: string;
  schema: {
    type: "integer";
  };
  required: boolean;
};

export type EndpointResponses = {
  [status: number]: {
    description?: string;
    schema: z.ZodTypeAny;
  };
};

export interface EndpointDocumentation {
  description: string;
  body?: z.ZodTypeAny | null;
  verbose?: boolean;
  responses: EndpointResponses;
}

export type EndpointGatheredInformation = {
  method: APIMethod;
  path: string;
  requiresAuth: boolean;
  params: UrlParam[];
  tags: string[];
  docs: EndpointDocumentation | null;
};
