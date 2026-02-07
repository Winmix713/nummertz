/**
 * Shared editor types for both client and server
 * Ensures type safety across the application
 */

/**
 * Responsive design breakpoints
 */
export type Breakpoint = "auto" | "base" | "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * File languages supported by the editor
 */
export type FileLanguage = "html" | "css" | "javascript";

/**
 * Typography properties
 */
export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  letterSpacing: string;
  lineHeight: string;
  textAlign: "left" | "center" | "right" | "justify";
}

/**
 * Spacing properties (padding/margin)
 */
export interface SpacingStyle {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

/**
 * Size properties
 */
export interface SizeStyle {
  width: string;
  height: string;
  maxWidth: string;
  maxHeight: string;
}

/**
 * 2D Transform properties
 */
export interface Transform2D {
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  skewX: number;
  skewY: number;
}

/**
 * 3D Transform properties
 */
export interface Transform3D {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  perspective: number;
}

/**
 * Border style properties
 */
export interface BorderStyle {
  color: string;
  width: string;
  radius: string;
}

/**
 * Background properties
 */
export interface BackgroundStyle {
  color: string;
  image: string;
}

/**
 * Inspector state for element property editing
 * Represents all editable properties of an element
 */
export interface InspectorState {
  // Element identification
  elementId: string;
  elementTag: string;

  // Content
  textContent: string;
  link: string;
  tailwindClasses: string;

  // Layout
  margin: SpacingStyle;
  padding: SpacingStyle;
  size: SizeStyle;

  // Styling
  typography: TypographyStyle;
  background: BackgroundStyle;
  border: BorderStyle;

  // Transformations
  transforms: Transform2D;
  transforms3d: Transform3D;

  // Effects
  opacity: number;
  blur?: number;
  backdropBlur?: number;

  // Responsive design
  breakpoint: Breakpoint;
}

/**
 * Project file structure
 */
export interface ProjectFile {
  id: string;
  name: string;
  language: FileLanguage;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project structure
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  files: ProjectFile[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  ownerId?: string; // For future authentication
}

/**
 * Editor view modes
 */
export type ViewMode = "code" | "split" | "design";

/**
 * Device types for preview
 */
export type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * Sidebar active tabs
 */
export type SidebarTab = "files" | "layers";

/**
 * Toast notification type
 */
export interface ToastMessage {
  title: string;
  description?: string;
  type?: "default" | "success" | "error" | "warning";
}

/**
 * Keyboard shortcut configuration
 */
export interface KeyboardShortcut {
  key: string;
  modifiers?: ("ctrl" | "shift" | "alt" | "meta")[];
  action: () => void;
}

/**
 * Error response format
 */
export interface ErrorResponse {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}

/**
 * Type guards for discriminated unions
 */
export const isValidBreakpoint = (value: unknown): value is Breakpoint => {
  return (
    typeof value === "string" &&
    ["auto", "base", "sm", "md", "lg", "xl", "2xl"].includes(value)
  );
};

export const isValidFileLanguage = (value: unknown): value is FileLanguage => {
  return (
    typeof value === "string" && ["html", "css", "javascript"].includes(value)
  );
};

export const isValidViewMode = (value: unknown): value is ViewMode => {
  return (
    typeof value === "string" && ["code", "split", "design"].includes(value)
  );
};

export const isValidDeviceType = (value: unknown): value is DeviceType => {
  return (
    typeof value === "string" && ["mobile", "tablet", "desktop"].includes(value)
  );
};

export const isValidSidebarTab = (value: unknown): value is SidebarTab => {
  return typeof value === "string" && ["files", "layers"].includes(value);
};
