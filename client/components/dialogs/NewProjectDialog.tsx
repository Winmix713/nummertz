/**
 * New Project Dialog
 * Dialog for creating a new project with name and description
 */

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (name: string, description?: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Dialog for creating a new project
 */
export const NewProjectDialog: React.FC<NewProjectDialogProps> = React.memo(
  ({ open, onOpenChange, onCreateProject, isLoading = false }) => {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");

    const handleSubmit = useCallback(async () => {
      if (!projectName.trim()) {
        return;
      }

      try {
        await onCreateProject(projectName, projectDescription);
        setProjectName("");
        setProjectDescription("");
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to create project:", error);
      }
    }, [projectName, projectDescription, onCreateProject, onOpenChange]);

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        if (!newOpen) {
          // Reset form when closing
          setProjectName("");
          setProjectDescription("");
        }
        onOpenChange(newOpen);
      },
      [onOpenChange],
    );

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new project to start coding. You can add files and edit
              them in the editor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="My Awesome Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isLoading}
                aria-label="Project name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="project-desc" className="text-sm font-medium">
                Description (optional)
              </label>
              <Input
                id="project-desc"
                placeholder="Describe your project..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                disabled={isLoading}
                aria-label="Project description"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !projectName.trim()}
              aria-label="Create project"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

NewProjectDialog.displayName = "NewProjectDialog";
