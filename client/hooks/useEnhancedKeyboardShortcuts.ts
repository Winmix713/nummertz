/**
 * Enhanced keyboard shortcuts hook
 * Integrates keyboard shortcuts with editor actions
 */

import { useEffect, useRef } from "react";
import {
  registerKeyboardShortcuts,
  KeyboardShortcutConfig,
  COMMON_SHORTCUTS,
} from "@/lib/keyboardShortcuts";
import { notifySuccess, notifyInfo } from "@/lib/notifications";

export interface EnhancedKeyboardShortcutsConfig {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onFormat?: () => void;
  onSearch?: () => void;
  onFocusEditor?: () => void;
  onFocusPreview?: () => void;
  onToggleInspector?: () => void;
  onReset?: () => void;
  customShortcuts?: KeyboardShortcutConfig[];
}

/**
 * Hook to register and manage keyboard shortcuts
 */
export const useEnhancedKeyboardShortcuts = (
  config: EnhancedKeyboardShortcutsConfig,
) => {
  const unregisterRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const shortcuts: KeyboardShortcutConfig[] = [];

    // Save
    if (config.onSave) {
      shortcuts.push({
        ...COMMON_SHORTCUTS.SAVE,
        action: () => {
          config.onSave?.();
          notifySuccess({ title: "Changes saved" });
        },
      });
    }

    // Undo
    if (config.onUndo) {
      shortcuts.push({
        ...COMMON_SHORTCUTS.UNDO,
        action: () => {
          config.onUndo?.();
        },
      });
    }

    // Redo
    if (config.onRedo) {
      shortcuts.push({
        ...COMMON_SHORTCUTS.REDO,
        action: () => {
          config.onRedo?.();
        },
      });
    }

    // Format code
    if (config.onFormat) {
      shortcuts.push({
        ...COMMON_SHORTCUTS.FORMAT,
        action: () => {
          config.onFormat?.();
          notifyInfo({ title: "Code formatted" });
        },
      });
    }

    // Search
    if (config.onSearch) {
      shortcuts.push({
        ...COMMON_SHORTCUTS.SEARCH,
        action: () => {
          config.onSearch?.();
        },
      });
    }

    // Focus editor
    if (config.onFocusEditor) {
      shortcuts.push({
        ...COMMON_SHORTCUTS.FOCUS_EDITOR,
        action: () => {
          config.onFocusEditor?.();
        },
      });
    }

    // Focus preview
    if (config.onFocusPreview) {
      shortcuts.push({
        ...COMMON_SHORTCUTS.FOCUS_PREVIEW,
        action: () => {
          config.onFocusPreview?.();
        },
      });
    }

    // Toggle inspector
    if (config.onToggleInspector) {
      shortcuts.push({
        ...COMMON_SHORTCUTS.TOGGLE_INSPECTOR,
        action: () => {
          config.onToggleInspector?.();
        },
      });
    }

    // Reset project
    if (config.onReset) {
      shortcuts.push({
        ...COMMON_SHORTCUTS.RESET_PROJECT,
        action: () => {
          if (window.confirm("Are you sure you want to reset the project?")) {
            config.onReset?.();
            notifyInfo({ title: "Project reset" });
          }
        },
      });
    }

    // Custom shortcuts
    if (config.customShortcuts) {
      shortcuts.push(...config.customShortcuts);
    }

    // Register all shortcuts
    unregisterRef.current = registerKeyboardShortcuts(shortcuts);

    return () => {
      if (unregisterRef.current) {
        unregisterRef.current();
      }
    };
  }, [config]);

  return {
    /**
     * Unregister all keyboard shortcuts
     */
    unregister: () => {
      if (unregisterRef.current) {
        unregisterRef.current();
        unregisterRef.current = null;
      }
    },
  };
};
