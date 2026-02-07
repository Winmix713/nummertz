import * as React from "react";
import { useState, useCallback } from "react";
import { Undo2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInspector } from "@/hooks/use-inspector";
import { BreakpointSelector } from "./BreakpointSelector";
import { AccordionSections } from "./AccordionSections";
import { TailwindOutput } from "./TailwindOutput";
import { BreakpointValue } from "@/components/editor/core/useBreakpointConfig";

/**
 * PropertiesPanel - Refactored version using extracted sub-components
 * Now much simpler and more maintainable with clear separation of concerns
 */
export const PropertiesPanel: React.FC = () => {
  const {
    state,
    updateState,
    updateNestedState,
    undo,
    canUndo,
    resetState,
    generatedTailwind,
  } = useInspector();

  // Local state for accordion
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "content",
    "sizing",
    "spacing",
  ]);

  const handleBreakpointChange = useCallback(
    (value: BreakpointValue) => {
      updateState("breakpoint", value);
    },
    [updateState],
  );

  const handleToggleSection = useCallback((section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  }, []);

  return (
    <div className="w-80 border-l border-white/5 bg-[#121214] h-full overflow-y-auto hidden lg:flex flex-col select-none">
      {/* HEADER */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#121214] z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
            Properties
          </span>
          <h3 className="text-xs font-bold tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            {state.elementTag.toUpperCase()}{" "}
            <span className="text-muted-foreground font-normal">
              #{state.elementId.slice(0, 8)}
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo last change"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={resetState}
            aria-label="Reset to defaults"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* BREAKPOINT SELECTION */}
        <BreakpointSelector
          currentBreakpoint={state.breakpoint}
          onChange={handleBreakpointChange}
        />

        {/* ACCORDION SECTIONS */}
        <AccordionSections
          state={state}
          expandedSections={expandedSections}
          onToggleSection={handleToggleSection}
          onUpdateState={updateState}
          onUpdateNestedState={updateNestedState}
        />

        {/* TAILWIND OUTPUT */}
        <TailwindOutput generatedTailwind={generatedTailwind} />
      </div>
    </div>
  );
};

export default PropertiesPanel;
