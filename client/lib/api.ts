/**
 * Centralized API client
 * Type-safe API communication with the backend
 */

import type {
  Project,
  ProjectFile,
  FileLanguage,
  ErrorResponse,
} from "@shared/types/editor";

const API_BASE = "/api";

/**
 * Helper to handle API responses
 */
async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    throw new Error(error.error || "API request failed");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Projects API
 */
export const projectsApi = {
  /**
   * Create a new project
   */
  create: async (name: string, description?: string): Promise<Project> => {
    return apiCall("/projects", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  },

  /**
   * List all projects
   */
  list: async (): Promise<Project[]> => {
    return apiCall("/projects");
  },

  /**
   * Get a specific project
   */
  get: async (projectId: string): Promise<Project> => {
    return apiCall(`/projects/${projectId}`);
  },

  /**
   * Update a project
   */
  update: async (
    projectId: string,
    updates: {
      name?: string;
      description?: string;
      isPublic?: boolean;
    },
  ): Promise<Project> => {
    return apiCall(`/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete a project
   */
  delete: async (projectId: string): Promise<void> => {
    return apiCall(`/projects/${projectId}`, {
      method: "DELETE",
    });
  },
};

/**
 * Files API
 */
export const filesApi = {
  /**
   * Create a new file in a project
   */
  create: async (
    projectId: string,
    name: string,
    language: FileLanguage,
    content?: string,
  ): Promise<ProjectFile> => {
    return apiCall(`/projects/${projectId}/files`, {
      method: "POST",
      body: JSON.stringify({ name, language, content }),
    });
  },

  /**
   * List all files in a project
   */
  list: async (projectId: string): Promise<ProjectFile[]> => {
    return apiCall(`/projects/${projectId}/files`);
  },

  /**
   * Get a specific file
   */
  get: async (projectId: string, fileId: string): Promise<ProjectFile> => {
    return apiCall(`/projects/${projectId}/files/${fileId}`);
  },

  /**
   * Update a file
   */
  update: async (
    projectId: string,
    fileId: string,
    updates: {
      name?: string;
      language?: FileLanguage;
      content?: string;
    },
  ): Promise<ProjectFile> => {
    return apiCall(`/projects/${projectId}/files/${fileId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete a file
   */
  delete: async (projectId: string, fileId: string): Promise<void> => {
    return apiCall(`/projects/${projectId}/files/${fileId}`, {
      method: "DELETE",
    });
  },
};
