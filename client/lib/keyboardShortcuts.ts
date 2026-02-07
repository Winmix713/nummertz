/**
 * Keyboard shortcuts utilities and configuration
 * Provides keyboard event handling and shortcut registration
 */

export interface KeyboardShortcutConfig {
  key: string;
  modifiers?: ("ctrl" | "shift" | "alt" | "meta")[];
  action: () => void;
  description?: string;
  preventDefault?: boolean;
}

/**
 * Parses keyboard event to determine shortcut key and modifiers
 */
export const parseKeyboardEvent = (
  event: KeyboardEvent,
): {
  key: string;
  modifiers: ("ctrl" | "shift" | "alt" | "meta")[];
} => {
  const modifiers: ("ctrl" | "shift" | "alt" | "meta")[] = [];

  if (event.ctrlKey || event.metaKey) modifiers.push("ctrl");
  if (event.shiftKey) modifiers.push("shift");
  if (event.altKey) modifiers.push("alt");

  return {
    key: event.key.toLowerCase(),
    modifiers,
  };
};

/**
 * Checks if a keyboard event matches a shortcut configuration
 */
export const matchesShortcut = (
  event: KeyboardEvent,
  shortcut: KeyboardShortcutConfig,
): boolean => {
  const { key, modifiers } = parseKeyboardEvent(event);

  // Check key match
  const keyMatch =
    key === shortcut.key.toLowerCase() || event.code === shortcut.key;

  if (!keyMatch) return false;

  // Check modifiers
  const expectedModifiers = shortcut.modifiers || [];
  const hasCorrectModifiers =
    modifiers.length === expectedModifiers.length &&
    expectedModifiers.every((mod) => modifiers.includes(mod));

  return hasCorrectModifiers;
};

/**
 * Registers keyboard shortcuts
 */
export const registerKeyboardShortcuts = (
  shortcuts: KeyboardShortcutConfig[],
): (() => void) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input/textarea
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      if (matchesShortcut(event, shortcut)) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.action();
        break;
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => window.removeEventListener("keydown", handleKeyDown);
};

/**
 * Common keyboard shortcuts
 */
export const COMMON_SHORTCUTS = {
  SAVE: { key: "s", modifiers: ["ctrl"] as const, description: "Save" },
  UNDO: { key: "z", modifiers: ["ctrl"] as const, description: "Undo" },
  REDO: {
    key: "z",
    modifiers: ["ctrl", "shift"] as const,
    description: "Redo",
  },
  FORMAT: {
    key: "f",
    modifiers: ["ctrl", "shift"] as const,
    description: "Format code",
  },
  SEARCH: {
    key: "f",
    modifiers: ["ctrl"] as const,
    description: "Search",
  },
  FOCUS_EDITOR: {
    key: "1",
    modifiers: ["ctrl"] as const,
    description: "Focus editor",
  },
  FOCUS_PREVIEW: {
    key: "2",
    modifiers: ["ctrl"] as const,
    description: "Focus preview",
  },
  TOGGLE_INSPECTOR: {
    key: "i",
    modifiers: ["ctrl", "shift"] as const,
    description: "Toggle inspector",
  },
  RESET_PROJECT: {
    key: "r",
    modifiers: ["ctrl", "shift"] as const,
    description: "Reset project",
  },
} as const;

/**
 * Format keyboard shortcut for display
 */
export const formatKeyboardShortcut = (
  shortcut: KeyboardShortcutConfig,
): string => {
  const parts = [];

  if (shortcut.modifiers?.includes("ctrl")) {
    parts.push("Ctrl");
  }
  if (shortcut.modifiers?.includes("shift")) {
    parts.push("Shift");
  }
  if (shortcut.modifiers?.includes("alt")) {
    parts.push("Alt");
  }
  if (shortcut.modifiers?.includes("meta")) {
    parts.push("Cmd");
  }

  parts.push(shortcut.key.toUpperCase());

  return parts.join("+");
};
