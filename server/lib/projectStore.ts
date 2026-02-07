/**
 * In-memory project store
 * Stores projects and files for anonymous users
 * In production, this would be replaced with a database
 */

import { Project, ProjectFile } from "@shared/types/editor";
import { randomUUID } from "crypto";

interface StoredProject extends Project {
  files: ProjectFile[];
}

class ProjectStore {
  private projects: Map<string, StoredProject> = new Map();

  /**
   * Create a new project
   */
  createProject(name: string, description?: string): StoredProject {
    const project: StoredProject = {
      id: randomUUID(),
      name,
      description,
      files: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
    };

    this.projects.set(project.id, project);
    return project;
  }

  /**
   * Get project by ID
   */
  getProject(projectId: string): StoredProject | undefined {
    return this.projects.get(projectId);
  }

  /**
   * List all projects
   */
  listProjects(): StoredProject[] {
    return Array.from(this.projects.values());
  }

  /**
   * Update project metadata
   */
  updateProject(
    projectId: string,
    updates: Partial<Omit<Project, "id" | "files" | "createdAt">>,
  ): StoredProject | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;

    const updated: StoredProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };

    this.projects.set(projectId, updated);
    return updated;
  }

  /**
   * Delete project
   */
  deleteProject(projectId: string): boolean {
    return this.projects.delete(projectId);
  }

  /**
   * Add file to project
   */
  addFile(projectId: string, file: ProjectFile): ProjectFile | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;

    const newFile: ProjectFile = {
      ...file,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    project.files.push(newFile);
    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return newFile;
  }

  /**
   * Get file from project
   */
  getFile(projectId: string, fileId: string): ProjectFile | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;

    return project.files.find((f) => f.id === fileId);
  }

  /**
   * Update file in project
   */
  updateFile(
    projectId: string,
    fileId: string,
    updates: Partial<Omit<ProjectFile, "id" | "createdAt">>,
  ): ProjectFile | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;

    const fileIndex = project.files.findIndex((f) => f.id === fileId);
    if (fileIndex === -1) return undefined;

    const updated: ProjectFile = {
      ...project.files[fileIndex],
      ...updates,
      updatedAt: new Date(),
    };

    project.files[fileIndex] = updated;
    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return updated;
  }

  /**
   * Delete file from project
   */
  deleteFile(projectId: string, fileId: string): boolean {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const fileIndex = project.files.findIndex((f) => f.id === fileId);
    if (fileIndex === -1) return false;

    project.files.splice(fileIndex, 1);
    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return true;
  }

  /**
   * List files in project
   */
  listFiles(projectId: string): ProjectFile[] | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;

    return project.files;
  }

  /**
   * Clear all projects (for testing)
   */
  clear(): void {
    this.projects.clear();
  }
}

// Singleton instance
export const projectStore = new ProjectStore();
