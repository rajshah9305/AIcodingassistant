import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = express();
const server = createServer(app);

app.use(express.json({ limit: "10mb" }));

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist/client"));
  app.get("*", (_req, res) => {
    res.sendFile("index.html", { root: "dist/client" });
  });
}

const port = parseInt(process.env.PORT || "3000");

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
