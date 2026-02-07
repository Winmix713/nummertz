/**
 * React Query hooks for project management
 * Provides data fetching, caching, and state management for projects
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { projectsApi } from "@/lib/api";
import type { Project } from "@shared/types/editor";

const PROJECTS_QUERY_KEY: QueryKey = ["projects"];
const projectQueryKey = (id: string): QueryKey => ["projects", id];

/**
 * Hook to list all projects
 */
export const useProjects = () => {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: () => projectsApi.list(),
  });
};

/**
 * Hook to get a specific project
 */
export const useProject = (projectId: string | null) => {
  return useQuery({
    queryKey: projectQueryKey(projectId || ""),
    queryFn: () => projectsApi.get(projectId!),
    enabled: !!projectId,
  });
};

/**
 * Hook to create a new project
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { name: string; description?: string }) =>
      projectsApi.create(params.name, params.description),
    onSuccess: (newProject) => {
      // Invalidate projects list to refetch
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      // Add new project to cache
      queryClient.setQueryData(projectQueryKey(newProject.id), newProject);
    },
  });
};

/**
 * Hook to update a project
 */
export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: {
      name?: string;
      description?: string;
      isPublic?: boolean;
    }) => projectsApi.update(projectId, updates),
    onSuccess: (updatedProject) => {
      // Update cache
      queryClient.setQueryData(projectQueryKey(projectId), updatedProject);
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
};

/**
 * Hook to delete a project
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsApi.delete(projectId),
    onSuccess: (_data, projectId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: projectQueryKey(projectId) });
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
};
