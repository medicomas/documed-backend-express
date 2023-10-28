// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      // request
      user?: {
        id: number;
        names: string;
        surnames: string;
        email: string;
        roles: {
          id: number;
          name: string;
        }[];
      };
      isAdmin?: boolean;
      isDoctor?: boolean;
    }
  }
}
