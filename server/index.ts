import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import * as projectsApi from "./routes/projects";
import * as filesApi from "./routes/files";
import { requestLogger } from "./middleware/logger";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Projects API routes
  app.post("/api/projects", projectsApi.createProject);
  app.get("/api/projects", projectsApi.listProjects);
  app.get("/api/projects/:projectId", projectsApi.getProject);
  app.patch("/api/projects/:projectId", projectsApi.updateProject);
  app.delete("/api/projects/:projectId", projectsApi.deleteProject);

  // Files API routes
  app.post("/api/projects/:projectId/files", filesApi.createFile);
  app.get("/api/projects/:projectId/files", filesApi.listFiles);
  app.get("/api/projects/:projectId/files/:fileId", filesApi.getFile);
  app.patch("/api/projects/:projectId/files/:fileId", filesApi.updateFile);
  app.delete("/api/projects/:projectId/files/:fileId", filesApi.deleteFile);

  // Error handling - must be last
  // Only handle API route 404s, let Vite handle the rest
  app.use(/^\/api/, notFoundHandler);
  app.use(errorHandler);

  return app;
}
