import { useEffect } from "react";

interface Shortcuts {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMod = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;

      let key = "";
      if (isMod) key += "mod+";
      if (isShift) key += "shift+";
      key += event.key.toLowerCase();

      if (shortcuts[key]) {
        event.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
