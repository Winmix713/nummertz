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
        key: COMMON_SHORTCUTS.SAVE.key,
        modifiers: [...COMMON_SHORTCUTS.SAVE.modifiers],
        description: COMMON_SHORTCUTS.SAVE.description,
        action: () => {
          config.onSave?.();
          notifySuccess({ title: "Changes saved" });
        },
      });
    }

    // Undo
    if (config.onUndo) {
      shortcuts.push({
        key: COMMON_SHORTCUTS.UNDO.key,
        modifiers: [...COMMON_SHORTCUTS.UNDO.modifiers],
        description: COMMON_SHORTCUTS.UNDO.description,
        action: () => {
          config.onUndo?.();
        },
      });
    }

    // Redo
    if (config.onRedo) {
      shortcuts.push({
        key: COMMON_SHORTCUTS.REDO.key,
        modifiers: [...COMMON_SHORTCUTS.REDO.modifiers],
        description: COMMON_SHORTCUTS.REDO.description,
        action: () => {
          config.onRedo?.();
        },
      });
    }

    // Format code
    if (config.onFormat) {
      shortcuts.push({
        key: COMMON_SHORTCUTS.FORMAT.key,
        modifiers: [...COMMON_SHORTCUTS.FORMAT.modifiers],
        description: COMMON_SHORTCUTS.FORMAT.description,
        action: () => {
          config.onFormat?.();
          notifyInfo({ title: "Code formatted" });
        },
      });
    }

    // Search
    if (config.onSearch) {
      shortcuts.push({
        key: COMMON_SHORTCUTS.SEARCH.key,
        modifiers: [...COMMON_SHORTCUTS.SEARCH.modifiers],
        description: COMMON_SHORTCUTS.SEARCH.description,
        action: () => {
          config.onSearch?.();
        },
      });
    }

    // Focus editor
    if (config.onFocusEditor) {
      shortcuts.push({
        key: COMMON_SHORTCUTS.FOCUS_EDITOR.key,
        modifiers: [...COMMON_SHORTCUTS.FOCUS_EDITOR.modifiers],
        description: COMMON_SHORTCUTS.FOCUS_EDITOR.description,
        action: () => {
          config.onFocusEditor?.();
        },
      });
    }

    // Focus preview
    if (config.onFocusPreview) {
      shortcuts.push({
        key: COMMON_SHORTCUTS.FOCUS_PREVIEW.key,
        modifiers: [...COMMON_SHORTCUTS.FOCUS_PREVIEW.modifiers],
        description: COMMON_SHORTCUTS.FOCUS_PREVIEW.description,
        action: () => {
          config.onFocusPreview?.();
        },
      });
    }

    // Toggle inspector
    if (config.onToggleInspector) {
      shortcuts.push({
        key: COMMON_SHORTCUTS.TOGGLE_INSPECTOR.key,
        modifiers: [...COMMON_SHORTCUTS.TOGGLE_INSPECTOR.modifiers],
        description: COMMON_SHORTCUTS.TOGGLE_INSPECTOR.description,
        action: () => {
          config.onToggleInspector?.();
        },
      });
    }

    // Reset project
    if (config.onReset) {
      shortcuts.push({
        key: COMMON_SHORTCUTS.RESET_PROJECT.key,
        modifiers: [...COMMON_SHORTCUTS.RESET_PROJECT.modifiers],
        description: COMMON_SHORTCUTS.RESET_PROJECT.description,
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
