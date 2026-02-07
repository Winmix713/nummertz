/**
 * React Query hooks for file management
 * Provides data fetching, caching, and state management for project files
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { filesApi } from "@/lib/api";
import type { ProjectFile, FileLanguage } from "@shared/types/editor";

const filesQueryKey = (projectId: string): QueryKey => [
  "projects",
  projectId,
  "files",
];
const fileQueryKey = (projectId: string, fileId: string): QueryKey => [
  "projects",
  projectId,
  "files",
  fileId,
];

/**
 * Hook to list all files in a project
 */
export const useFiles = (projectId: string) => {
  return useQuery({
    queryKey: filesQueryKey(projectId),
    queryFn: () => filesApi.list(projectId),
  });
};

/**
 * Hook to get a specific file
 */
export const useFile = (projectId: string, fileId: string | null) => {
  return useQuery({
    queryKey: fileQueryKey(projectId, fileId || ""),
    queryFn: () => filesApi.get(projectId, fileId!),
    enabled: !!fileId,
  });
};

/**
 * Hook to create a new file
 */
export const useCreateFile = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      name: string;
      language: FileLanguage;
      content?: string;
    }) =>
      filesApi.create(projectId, params.name, params.language, params.content),
    onSuccess: (newFile) => {
      // Invalidate files list
      queryClient.invalidateQueries({ queryKey: filesQueryKey(projectId) });
      // Add to cache
      queryClient.setQueryData(fileQueryKey(projectId, newFile.id), newFile);
    },
  });
};

/**
 * Hook to update a file
 */
export const useUpdateFile = (projectId: string, fileId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: {
      name?: string;
      language?: FileLanguage;
      content?: string;
    }) => filesApi.update(projectId, fileId, updates),
    onSuccess: (updatedFile) => {
      // Update cache
      queryClient.setQueryData(fileQueryKey(projectId, fileId), updatedFile);
      // Invalidate files list
      queryClient.invalidateQueries({ queryKey: filesQueryKey(projectId) });
    },
  });
};

/**
 * Hook to delete a file
 */
export const useDeleteFile = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => filesApi.delete(projectId, fileId),
    onSuccess: (_data, fileId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: fileQueryKey(projectId, fileId),
      });
      // Invalidate files list
      queryClient.invalidateQueries({ queryKey: filesQueryKey(projectId) });
    },
  });
};

/**
 * Hook for bulk file operations
 */
export const useFileOperations = (projectId: string) => {
  const files = useFiles(projectId);
  const createFile = useCreateFile(projectId);
  const updateFile = (fileId: string) => useUpdateFile(projectId, fileId);
  const deleteFile = useDeleteFile(projectId);

  return {
    files,
    createFile,
    updateFile,
    deleteFile,
    isLoading: files.isLoading,
    error: files.error,
  };
};
