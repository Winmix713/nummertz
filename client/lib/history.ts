/**
 * History management for undo/redo functionality
 * Provides a stack-based history system with state snapshots
 */

export interface HistoryState<T> {
  state: T;
  timestamp: number;
  description?: string;
}

export interface HistoryManager<T> {
  push: (state: T, description?: string) => void;
  undo: () => T | null;
  redo: () => T | null;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  getHistory: () => HistoryState<T>[];
}

/**
 * Creates a history manager for undo/redo functionality
 */
export const createHistoryManager = <T>(
  initialState: T,
  maxHistory: number = 50,
): HistoryManager<T> => {
  const history: HistoryState<T>[] = [
    {
      state: structuredClone(initialState),
      timestamp: Date.now(),
    },
  ];

  let currentIndex = 0;

  const push = (state: T, description?: string) => {
    // Remove any states after current index (redo stack)
    history.splice(currentIndex + 1);

    // Add new state
    history.push({
      state: structuredClone(state),
      timestamp: Date.now(),
      description,
    });

    // Limit history size
    if (history.length > maxHistory) {
      history.shift();
    } else {
      currentIndex++;
    }
  };

  const undo = (): T | null => {
    if (currentIndex === 0) return null;
    currentIndex--;
    return structuredClone(history[currentIndex].state);
  };

  const redo = (): T | null => {
    if (currentIndex === history.length - 1) return null;
    currentIndex++;
    return structuredClone(history[currentIndex].state);
  };

  return {
    push,
    undo,
    redo,
    get canUndo() {
      return currentIndex > 0;
    },
    get canRedo() {
      return currentIndex < history.length - 1;
    },
    clear: () => {
      history.splice(1);
      currentIndex = 0;
    },
    getHistory: () => [...history],
  };
};

/**
 * Hook-friendly history manager with cleanup
 */
export const useHistoryManager = <T>(
  initialState: T,
  maxHistory?: number,
): HistoryManager<T> => {
  return createHistoryManager(initialState, maxHistory);
};
