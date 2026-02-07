/**
 * Type guards and validation utilities
 * Used for safe type narrowing and runtime validation
 */

import {
  Breakpoint,
  FileLanguage,
  ViewMode,
  DeviceType,
  SidebarTab,
  InspectorState,
  ProjectFile,
  Project,
} from "@shared/types/editor";

/**
 * Breakpoint type guard
 */
export const isBreakpoint = (value: unknown): value is Breakpoint => {
  return (
    typeof value === "string" &&
    ["auto", "base", "sm", "md", "lg", "xl", "2xl"].includes(value)
  );
};

/**
 * FileLanguage type guard
 */
export const isFileLanguage = (value: unknown): value is FileLanguage => {
  return (
    typeof value === "string" && ["html", "css", "javascript"].includes(value)
  );
};

/**
 * ViewMode type guard
 */
export const isViewMode = (value: unknown): value is ViewMode => {
  return (
    typeof value === "string" && ["code", "split", "design"].includes(value)
  );
};

/**
 * DeviceType type guard
 */
export const isDeviceType = (value: unknown): value is DeviceType => {
  return (
    typeof value === "string" && ["mobile", "tablet", "desktop"].includes(value)
  );
};

/**
 * SidebarTab type guard
 */
export const isSidebarTab = (value: unknown): value is SidebarTab => {
  return typeof value === "string" && ["files", "layers"].includes(value);
};

/**
 * Check if value is an InspectorState
 */
export const isInspectorState = (value: unknown): value is InspectorState => {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.elementId === "string" &&
    typeof obj.elementTag === "string" &&
    typeof obj.textContent === "string" &&
    typeof obj.opacity === "number"
  );
};

/**
 * Check if value is a ProjectFile
 */
export const isProjectFile = (value: unknown): value is ProjectFile => {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    isFileLanguage(obj.language) &&
    typeof obj.content === "string"
  );
};

/**
 * Check if value is a Project
 */
export const isProject = (value: unknown): value is Project => {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    Array.isArray(obj.files) &&
    obj.files.every(isProjectFile)
  );
};

/**
 * Safe type assertion with fallback
 * Returns value if it passes type guard, otherwise returns fallback
 */
export const assertType = <T>(
  value: unknown,
  guard: (val: unknown) => val is T,
  fallback: T,
): T => {
  return guard(value) ? value : fallback;
};

/**
 * Validate and cast value to specific type
 * Throws error if validation fails
 */
export const validateType = <T>(
  value: unknown,
  guard: (val: unknown) => val is T,
  errorMessage: string,
): T => {
  if (!guard(value)) {
    throw new Error(errorMessage);
  }
  return value;
};
