/**
 * Notification utilities
 * Provides consistent notification interface for user feedback
 */

import { toast } from "sonner";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show success notification
 */
export const notifySuccess = (options: NotificationOptions) => {
  toast.success(options.title, {
    description: options.description,
    duration: options.duration || 3000,
  });
};

/**
 * Show error notification
 */
export const notifyError = (options: NotificationOptions) => {
  toast.error(options.title, {
    description: options.description,
    duration: options.duration || 4000,
  });
};

/**
 * Show warning notification
 */
export const notifyWarning = (options: NotificationOptions) => {
  toast.warning(options.title, {
    description: options.description,
    duration: options.duration || 3500,
  });
};

/**
 * Show info notification
 */
export const notifyInfo = (options: NotificationOptions) => {
  toast.info(options.title, {
    description: options.description,
    duration: options.duration || 3000,
  });
};

/**
 * Show loading notification with promise
 */
export const notifyPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};

/**
 * Dismiss all notifications
 */
export const dismissAllNotifications = () => {
  toast.dismiss();
};

/**
 * Common notification messages
 */
export const NOTIFICATIONS = {
  SAVED: {
    title: "Saved",
    description: "Your changes have been saved.",
  },
  SAVED_AUTO: {
    title: "Auto-saved",
    description: "Your changes were automatically saved.",
  },
  COPIED: {
    title: "Copied",
    description: "Code copied to clipboard.",
  },
  PROJECT_CREATED: {
    title: "Project created",
    description: "Your new project has been created successfully.",
  },
  PROJECT_DELETED: {
    title: "Project deleted",
    description: "The project has been deleted.",
  },
  FILE_CREATED: {
    title: "File created",
    description: "New file has been created.",
  },
  FILE_DELETED: {
    title: "File deleted",
    description: "The file has been deleted.",
  },
  ERROR_SAVE_FAILED: {
    title: "Save failed",
    description: "Failed to save your changes. Please try again.",
  },
  ERROR_PROJECT_CREATE_FAILED: {
    title: "Failed to create project",
    description: "Could not create the project. Please try again.",
  },
  RESET_CONFIRM: {
    title: "Reset project?",
    description: "This will clear all changes. This action cannot be undone.",
  },
  CODE_FORMATTED: {
    title: "Code formatted",
    description: "Your code has been formatted.",
  },
  INSPECTOR_ENABLED: {
    title: "Inspector enabled",
    description: "Click elements in the preview to inspect them.",
  },
  INSPECTOR_DISABLED: {
    title: "Inspector disabled",
    description: "Click to select and edit elements normally.",
  },
} as const;
