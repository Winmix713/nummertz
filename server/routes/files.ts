/**
 * Files API endpoints
 * Handles file operations within projects
 */

import { RequestHandler } from "express";
import { projectStore } from "../lib/projectStore";
import type {
  FileLanguage,
  ErrorResponse,
  ProjectFile,
} from "@shared/types/editor";

// Valid file languages
const VALID_LANGUAGES = ["html", "css", "javascript"];

interface CreateFileRequest {
  name: string;
  language: FileLanguage;
  content?: string;
}

interface UpdateFileRequest {
  name?: string;
  language?: FileLanguage;
  content?: string;
}

/**
 * Create a new file in project
 * POST /api/projects/:projectId/files
 */
export const createFile: RequestHandler = (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, language, content } = req.body as CreateFileRequest;

    if (!name || !language) {
      const error: ErrorResponse = {
        error: "Invalid file parameters",
        code: "INVALID_PARAMS",
      };
      return res.status(400).json(error);
    }

    // Validate language
    if (!VALID_LANGUAGES.includes(language)) {
      const error: ErrorResponse = {
        error: "Invalid file language",
        code: "INVALID_LANGUAGE",
      };
      return res.status(400).json(error);
    }

    const project = projectStore.getProject(projectId);
    if (!project) {
      const error: ErrorResponse = {
        error: "Project not found",
        code: "NOT_FOUND",
      };
      return res.status(404).json(error);
    }

    const newFile: ProjectFile = {
      id: "", // Will be generated in store
      name,
      language,
      content: content || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = projectStore.addFile(projectId, newFile);
    if (!created) {
      const error: ErrorResponse = {
        error: "Failed to create file",
        code: "CREATE_ERROR",
      };
      return res.status(500).json(error);
    }

    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating file:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to create file",
      code: "CREATE_ERROR",
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * Get all files in project
 * GET /api/projects/:projectId/files
 */
export const listFiles: RequestHandler = (req, res) => {
  try {
    const { projectId } = req.params;

    const files = projectStore.listFiles(projectId);
    if (!files) {
      const error: ErrorResponse = {
        error: "Project not found",
        code: "NOT_FOUND",
      };
      return res.status(404).json(error);
    }

    res.json(files);
  } catch (error) {
    console.error("Error listing files:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to list files",
      code: "LIST_ERROR",
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * Get a specific file
 * GET /api/projects/:projectId/files/:fileId
 */
export const getFile: RequestHandler = (req, res) => {
  try {
    const { projectId, fileId } = req.params;

    const file = projectStore.getFile(projectId, fileId);
    if (!file) {
      const error: ErrorResponse = {
        error: "File not found",
        code: "NOT_FOUND",
      };
      return res.status(404).json(error);
    }

    res.json(file);
  } catch (error) {
    console.error("Error getting file:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to get file",
      code: "GET_ERROR",
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * Update a file
 * PATCH /api/projects/:projectId/files/:fileId
 */
export const updateFile: RequestHandler = (req, res) => {
  try {
    const { projectId, fileId } = req.params;
    const updates = req.body as UpdateFileRequest;

    const file = projectStore.getFile(projectId, fileId);
    if (!file) {
      const error: ErrorResponse = {
        error: "File not found",
        code: "NOT_FOUND",
      };
      return res.status(404).json(error);
    }

    const updated = projectStore.updateFile(projectId, fileId, updates);
    if (!updated) {
      const error: ErrorResponse = {
        error: "Failed to update file",
        code: "UPDATE_ERROR",
      };
      return res.status(500).json(error);
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating file:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to update file",
      code: "UPDATE_ERROR",
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * Delete a file
 * DELETE /api/projects/:projectId/files/:fileId
 */
export const deleteFile: RequestHandler = (req, res) => {
  try {
    const { projectId, fileId } = req.params;

    const success = projectStore.deleteFile(projectId, fileId);
    if (!success) {
      const error: ErrorResponse = {
        error: "File not found",
        code: "NOT_FOUND",
      };
      return res.status(404).json(error);
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting file:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to delete file",
      code: "DELETE_ERROR",
    };
    res.status(500).json(errorResponse);
  }
};
