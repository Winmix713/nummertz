/**
 * Project Browser
 * Displays list of projects and allows selection/creation
 */

import React, { useState, useCallback } from "react";
import { Plus, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useProjects,
  useCreateProject,
  useDeleteProject,
} from "@/hooks/useProjects";
import { NewProjectDialog } from "@/components/dialogs/NewProjectDialog";
import { formatDistanceToNow } from "date-fns";

interface ProjectBrowserProps {
  onSelectProject: (projectId: string) => void;
  activeProjectId?: string;
}

/**
 * Component for browsing and managing projects
 */
export const ProjectBrowser: React.FC<ProjectBrowserProps> = React.memo(
  ({ onSelectProject, activeProjectId }) => {
    const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
    const { data: projects = [], isLoading, error } = useProjects();
    const createProjectMutation = useCreateProject();
    const deleteProjectMutation = useDeleteProject();

    const handleCreateProject = useCallback(
      async (name: string, description?: string) => {
        await createProjectMutation.mutateAsync({ name, description });
      },
      [createProjectMutation],
    );

    const handleDeleteProject = useCallback(
      (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this project?")) {
          deleteProjectMutation.mutate(projectId);
        }
      },
      [deleteProjectMutation],
    );

    if (isLoading) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          Loading projects...
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-center text-destructive">
          Failed to load projects
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Projects</h2>
            <Button
              size="sm"
              onClick={() => setNewProjectDialogOpen(true)}
              aria-label="Create new project"
            >
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No projects yet</p>
              <p className="text-sm mt-2">
                Click "New" to create your first project
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    activeProjectId === project.id
                      ? "bg-primary/20 border border-primary"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{project.name}</h3>
                      {project.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {project.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {project.files.length} file
                        {project.files.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        title="Project settings"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        title="Delete project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Project Dialog */}
        <NewProjectDialog
          open={newProjectDialogOpen}
          onOpenChange={setNewProjectDialogOpen}
          onCreateProject={handleCreateProject}
          isLoading={createProjectMutation.isPending}
        />
      </div>
    );
  },
);

ProjectBrowser.displayName = "ProjectBrowser";
