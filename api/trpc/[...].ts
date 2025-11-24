import "dotenv/config";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/router";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";

export default async function handler(req: ExpressRequest, res: ExpressResponse) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: req as any,
    router: appRouter,
    createContext: () => ({ req, res }),
    onError: ({ error, path }) => {
      console.error(`tRPC error on '${path}':`, error);
    },
  });
}

