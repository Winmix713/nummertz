import React, { useCallback } from "react";
import { Maximize2, Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useBreakpointConfig,
  BreakpointValue,
} from "@/components/editor/core/useBreakpointConfig";

interface BreakpointSelectorProps {
  currentBreakpoint: BreakpointValue;
  onChange: (value: BreakpointValue) => void;
}

/**
 * Breakpoint selector component - allows users to select responsive design breakpoints
 * Extracted from PropertiesPanel for better modularity
 */
export const BreakpointSelector: React.FC<BreakpointSelectorProps> = React.memo(
  ({ currentBreakpoint, onChange }) => {
    const { breakpoints } = useBreakpointConfig();

    const handleBreakpointChange = useCallback(
      (value: BreakpointValue) => {
        onChange(value);
      },
      [onChange],
    );

    const getIcon = (iconName: string) => {
      const iconMap: Record<string, React.ReactNode> = {
        "maximize-2": <Maximize2 className="w-3 h-3" />,
        monitor: <Monitor className="w-3 h-3" />,
        smartphone: <Smartphone className="w-3 h-3" />,
        tablet: <Tablet className="w-3 h-3" />,
      };
      return iconMap[iconName] || null;
    };

    return (
      <section className="space-y-3">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Target Breakpoint
        </label>
        <div className="grid grid-cols-5 bg-[#1e1e20] p-1 rounded-md border border-white/5 h-9">
          {breakpoints.map((bp) => (
            <button
              key={bp.value}
              onClick={() => handleBreakpointChange(bp.value)}
              className={cn(
                "flex items-center justify-center gap-1 rounded-[4px] text-[9px] font-bold uppercase transition-all",
                currentBreakpoint === bp.value
                  ? "bg-[#252526] text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={currentBreakpoint === bp.value}
              aria-label={`Set breakpoint to ${bp.label}`}
              title={bp.label}
            >
              {getIcon(bp.icon)}
              <span className="hidden xl:inline text-[8px]">{bp.label}</span>
            </button>
          ))}
        </div>
      </section>
    );
  },
);

BreakpointSelector.displayName = "BreakpointSelector";
