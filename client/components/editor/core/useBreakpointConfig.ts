import { useMemo } from "react";
import { Maximize2, Monitor, Smartphone, Tablet } from "lucide-react";

export type BreakpointValue = "auto" | "base" | "sm" | "md" | "lg";

export interface BreakpointConfig {
  value: BreakpointValue;
  label: string;
  icon: React.ReactNode;
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
        icon: <Maximize2 className="w-3 h-3" />,
      },
      {
        value: "base" as const,
        label: "Base",
        icon: <Monitor className="w-3 h-3" />,
      },
      {
        value: "sm" as const,
        label: "SM",
        icon: <Smartphone className="w-3 h-3" />,
      },
      {
        value: "md" as const,
        label: "MD",
        icon: <Tablet className="w-3 h-3" />,
      },
      {
        value: "lg" as const,
        label: "LG",
        icon: <Monitor className="w-3 h-3" />,
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