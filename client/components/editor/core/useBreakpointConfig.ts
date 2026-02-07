import { useMemo } from "react";

export type BreakpointValue = "auto" | "base" | "sm" | "md" | "lg";

export interface BreakpointConfig {
  value: BreakpointValue;
  label: string;
  icon: string; // Icon name from lucide-react
}

/**
 * Hook for managing breakpoint configuration
 * Provides consistent breakpoint definitions across the editor
 */
export const useBreakpointConfig = () => {
  const breakpoints: BreakpointConfig[] = useMemo(
    () => [
      {
        value: "auto" as const,
        label: "Auto",
        icon: "maximize-2",
      },
      {
        value: "base" as const,
        label: "Base",
        icon: "monitor",
      },
      {
        value: "sm" as const,
        label: "SM",
        icon: "smartphone",
      },
      {
        value: "md" as const,
        label: "MD",
        icon: "tablet",
      },
      {
        value: "lg" as const,
        label: "LG",
        icon: "monitor",
      },
    ],
    [],
  );

  const getBreakpointLabel = (value: BreakpointValue): string => {
    const bp = breakpoints.find((b) => b.value === value);
    return bp?.label || "AUTO";
  };

  return {
    breakpoints,
    getBreakpointLabel,
  };
};
