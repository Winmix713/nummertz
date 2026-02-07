/**
 * Projects API endpoints
 * Handles CRUD operations for projects
 */

import { RequestHandler } from "express";
import { projectStore } from "../lib/projectStore";
import type { ErrorResponse } from "@shared/types/editor";

interface ProjectRequest {
  name: string;
  description?: string;
}

interface UpdateProjectRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

/**
 * Create a new project
 * POST /api/projects
 */
export const createProject: RequestHandler = (req, res) => {
  try {
    const { name, description } = req.body as ProjectRequest;

    if (!name || typeof name !== "string") {
      const error: ErrorResponse = {
        error: "Invalid project name",
        code: "INVALID_NAME",
      };
      return res.status(400).json(error);
    }

    const project = projectStore.createProject(name, description);
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to create project",
      code: "CREATE_ERROR",
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * List all projects
 * GET /api/projects
 */
export const listProjects: RequestHandler = (_req, res) => {
  try {
    const projects = projectStore.listProjects();
    res.json(projects);
  } catch (error) {
    console.error("Error listing projects:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to list projects",
      code: "LIST_ERROR",
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * Get a specific project
 * GET /api/projects/:projectId
 */
export const getProject: RequestHandler = (req, res) => {
  try {
    const { projectId } = req.params;

    const project = projectStore.getProject(projectId);
    if (!project) {
      const error: ErrorResponse = {
        error: "Project not found",
        code: "NOT_FOUND",
      };
      return res.status(404).json(error);
    }

    res.json(project);
  } catch (error) {
    console.error("Error getting project:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to get project",
      code: "GET_ERROR",
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * Update a project
 * PATCH /api/projects/:projectId
 */
export const updateProject: RequestHandler = (req, res) => {
  try {
    const { projectId } = req.params;
    const updates = req.body as UpdateProjectRequest;

    const project = projectStore.getProject(projectId);
    if (!project) {
      const error: ErrorResponse = {
        error: "Project not found",
        code: "NOT_FOUND",
      };
      return res.status(404).json(error);
    }

    const updated = projectStore.updateProject(projectId, updates);
    if (!updated) {
      const error: ErrorResponse = {
        error: "Failed to update project",
        code: "UPDATE_ERROR",
      };
      return res.status(500).json(error);
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating project:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to update project",
      code: "UPDATE_ERROR",
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * Delete a project
 * DELETE /api/projects/:projectId
 */
export const deleteProject: RequestHandler = (req, res) => {
  try {
    const { projectId } = req.params;

    const success = projectStore.deleteProject(projectId);
    if (!success) {
      const error: ErrorResponse = {
        error: "Project not found",
        code: "NOT_FOUND",
      };
      return res.status(404).json(error);
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting project:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to delete project",
      code: "DELETE_ERROR",
    };
    res.status(500).json(errorResponse);
  }
};
