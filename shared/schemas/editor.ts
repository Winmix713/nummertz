/**
 * Zod schemas for editor types
 * Used for runtime validation on both client and server
 */

import { z } from "zod";

/**
 * Breakpoint schema
 */
export const BreakpointSchema = z
  .enum(["auto", "base", "sm", "md", "lg", "xl", "2xl"])
  .describe("Responsive design breakpoint");

/**
 * File language schema
 */
export const FileLanguageSchema = z
  .enum(["html", "css", "javascript"])
  .describe("File language");

/**
 * Typography style schema
 */
export const TypographyStyleSchema = z.object({
  fontFamily: z.string().default(""),
  fontSize: z.string().default(""),
  fontWeight: z.string().default(""),
  letterSpacing: z.string().default(""),
  lineHeight: z.string().default(""),
  textAlign: z.enum(["left", "center", "right", "justify"]).default("left"),
});

/**
 * Spacing style schema (padding/margin)
 */
export const SpacingStyleSchema = z.object({
  top: z.string().default(""),
  right: z.string().default(""),
  bottom: z.string().default(""),
  left: z.string().default(""),
});

/**
 * Size style schema
 */
export const SizeStyleSchema = z.object({
  width: z.string().default(""),
  height: z.string().default(""),
  maxWidth: z.string().default(""),
  maxHeight: z.string().default(""),
});

/**
 * 2D Transform schema
 */
export const Transform2DSchema = z.object({
  translateX: z.number().default(0),
  translateY: z.number().default(0),
  rotate: z.number().default(0),
  scale: z.number().default(100),
  skewX: z.number().default(0),
  skewY: z.number().default(0),
});

/**
 * 3D Transform schema
 */
export const Transform3DSchema = z.object({
  rotateX: z.number().default(0),
  rotateY: z.number().default(0),
  rotateZ: z.number().default(0),
  perspective: z.number().default(0),
});

/**
 * Border style schema
 */
export const BorderStyleSchema = z.object({
  color: z.string().default(""),
  width: z.string().default(""),
  radius: z.string().default(""),
});

/**
 * Background style schema
 */
export const BackgroundStyleSchema = z.object({
  color: z.string().default(""),
  image: z.string().default(""),
});

/**
 * Inspector state schema
 */
export const InspectorStateSchema = z.object({
  elementId: z.string(),
  elementTag: z.string(),
  textContent: z.string().default(""),
  link: z.string().default(""),
  tailwindClasses: z.string().default(""),
  margin: SpacingStyleSchema,
  padding: SpacingStyleSchema,
  size: SizeStyleSchema,
  typography: TypographyStyleSchema,
  background: BackgroundStyleSchema,
  border: BorderStyleSchema,
  transforms: Transform2DSchema,
  transforms3d: Transform3DSchema,
  opacity: z.number().min(0).max(100).default(100),
  blur: z.number().min(0).max(50).optional(),
  backdropBlur: z.number().min(0).max(50).optional(),
  breakpoint: BreakpointSchema.default("base"),
});

/**
 * Project file schema
 */
export const ProjectFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  language: FileLanguageSchema,
  content: z.string().default(""),
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()),
});

/**
 * Project schema
 */
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  files: z.array(ProjectFileSchema),
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()),
  isPublic: z.boolean().default(false),
  ownerId: z.string().optional(),
});

/**
 * View mode schema
 */
export const ViewModeSchema = z
  .enum(["code", "split", "design"])
  .describe("Editor view mode");

/**
 * Device type schema
 */
export const DeviceTypeSchema = z
  .enum(["mobile", "tablet", "desktop"])
  .describe("Preview device type");

/**
 * Sidebar tab schema
 */
export const SidebarTabSchema = z
  .enum(["files", "layers"])
  .describe("Active sidebar tab");

/**
 * Toast message schema
 */
export const ToastMessageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["default", "success", "error", "warning"]).default("default"),
});

/**
 * Error response schema
 */
export const ErrorResponseSchema = z.object({
  error: z.string(),
  code: z.string(),
  details: z.record(z.unknown()).optional(),
});

/**
 * Type inference utilities
 */
export type InspectorState = z.infer<typeof InspectorStateSchema>;
export type ProjectFile = z.infer<typeof ProjectFileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Breakpoint = z.infer<typeof BreakpointSchema>;
export type FileLanguage = z.infer<typeof FileLanguageSchema>;
export type ViewMode = z.infer<typeof ViewModeSchema>;
export type DeviceType = z.infer<typeof DeviceTypeSchema>;
export type SidebarTab = z.infer<typeof SidebarTabSchema>;
export type ToastMessage = z.infer<typeof ToastMessageSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
