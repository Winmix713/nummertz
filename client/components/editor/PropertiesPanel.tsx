import * as React from "react";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Undo2,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useInspector } from "@/hooks/use-inspector";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import the CSS file for slider and accordion styles
import "./PropertiesPanel.css";

// ─── DEBOUNCED INPUT COMPONENTS ────────────────────────────────

interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
  "aria-label"?: string;
}

/**
 * Debounced text input component - prevents excessive state updates
 * Debounce delay: 100ms for smooth UX
 */
const DebouncedInput: React.FC<DebouncedInputProps> = React.memo(
  ({
    value,
    onChange,
    placeholder,
    className,
    type = "text",
    "aria-label": ariaLabel,
  }) => {
    const [localValue, setLocalValue] = useState(value);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync with external value changes
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Cleanup timer on unmount
    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, []);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        // Clear existing timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        // Set new debounce timer
        timerRef.current = setTimeout(() => {
          onChange(newValue);
        }, 100);
      },
      [onChange],
    );

    return (
      <Input
        type={type}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        aria-label={ariaLabel}
      />
    );
  },
);

DebouncedInput.displayName = "DebouncedInput";

// ─── SLIDER COMPONENT WITH ACCESSIBILITY ────────────────────────

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = React.memo(
  ({ label, value, min, max, step = 1, unit = "", onChange }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(e.target.value));
      },
      [onChange],
    );

    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="space-y-1">
        <div className="flex justify-between text-[9px]">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-primary font-medium" aria-live="polite">
            {value}
            {unit}
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="slider-input w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${percentage}%, rgba(255,255,255,0.05) ${percentage}%)`,
            }}
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
          />
        </div>
      </div>
    );
  },
);

Slider.displayName = "Slider";

// ─── MAIN PROPERTIES PANEL COMPONENT ────────────────────────────

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

  // Copy state
  const [copied, setCopied] = useState(false);

  // Memoized breakpoint configuration - matches InspectorState type
  const breakpoints = useMemo(
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

  // Memoized breakpoint label
  const breakpointLabel = useMemo(() => {
    const bp = breakpoints.find((b) => b.value === state.breakpoint);
    return bp?.label || "AUTO";
  }, [state.breakpoint, breakpoints]);

  // Memoized handlers with useCallback
  const handleBreakpointChange = useCallback(
    (value: string) => {
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

  const handleCopyTailwind = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedTailwind);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [generatedTailwind]);

  // Debounced text content handler
  const handleTextContentChange = useCallback(
    (value: string) => {
      updateState("textContent", value);
    },
    [updateState],
  );

  // Debounced link handler
  const handleLinkChange = useCallback(
    (value: string) => {
      updateState("link", value);
    },
    [updateState],
  );

  // Spacing input handlers with debounce
  const handlePaddingChange = useCallback(
    (side: "top" | "bottom" | "left" | "right", value: string) => {
      updateNestedState("padding", side, value);
    },
    [updateNestedState],
  );

  const handleMarginChange = useCallback(
    (side: "top" | "bottom" | "left" | "right", value: string) => {
      updateNestedState("margin", side, value);
    },
    [updateNestedState],
  );

  // Size handlers
  const handleSizeChange = useCallback(
    (dimension: "width" | "height", value: string) => {
      updateNestedState("size", dimension, value);
    },
    [updateNestedState],
  );

  // Transform handlers
  const handleTransform3DChange = useCallback(
    (
      transform: "rotateX" | "rotateY" | "rotateZ" | "perspective",
      value: number,
    ) => {
      updateNestedState("transforms3d", transform, value);
    },
    [updateNestedState],
  );

  const handleTransform2DChange = useCallback(
    (
      transform:
        | "translateX"
        | "translateY"
        | "rotate"
        | "scale"
        | "skewX"
        | "skewY",
      value: number,
    ) => {
      updateNestedState("transforms", transform, value);
    },
    [updateNestedState],
  );

  // Effect handlers
  const handleOpacityChange = useCallback(
    (value: number) => {
      updateState("opacity", value);
    },
    [updateState],
  );

  const handleBlurChange = useCallback(
    (value: number) => {
      updateState("blur", value);
    },
    [updateState],
  );

  return (
    <div className="w-80 border-l border-white/5 bg-[#121214] h-full overflow-y-auto hidden lg:flex flex-col select-none">
      {/* ─── HEADER ─────────────────────────────────────────── */}
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
        {/* ─── BREAKPOINT SELECTION ──────────────────────────── */}
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
                  state.breakpoint === bp.value
                    ? "bg-[#252526] text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={state.breakpoint === bp.value}
                aria-label={`Set breakpoint to ${bp.label}`}
                title={bp.label}
              >
                {bp.icon}
                <span className="hidden xl:inline text-[8px]">{bp.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ─── ACCORDION SECTIONS ────────────────────────────── */}
        <Accordion
          type="multiple"
          value={expandedSections}
          onValueChange={setExpandedSections}
          className="space-y-2"
        >
          {/* ─── CONTENT SECTION ─────────────────────────────── */}
          <AccordionItem
            value="content"
            className="border border-white/5 rounded-lg bg-[#1a1a1c]"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Content
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <div className="space-y-1">
                <span className="text-[9px] text-muted-foreground">Text</span>
                <DebouncedInput
                  value={state.textContent}
                  onChange={handleTextContentChange}
                  className="bg-[#1e1e20] border-white/5 text-xs h-8"
                  placeholder="Enter text..."
                  aria-label="Element text content"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-muted-foreground">
                  Link (href)
                </span>
                <DebouncedInput
                  value={state.link}
                  onChange={handleLinkChange}
                  placeholder="https://..."
                  className="bg-[#1e1e20] border-white/5 text-xs h-8"
                  aria-label="Element link URL"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── SIZING SECTION ──────────────────────────────── */}
          <AccordionItem
            value="sizing"
            className="border border-white/5 rounded-lg bg-[#1a1a1c]"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Sizing
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">
                    Width
                  </span>
                  <DebouncedInput
                    value={state.size.width}
                    onChange={(value) => handleSizeChange("width", value)}
                    placeholder="auto"
                    className="bg-[#1e1e20] border-white/5 text-xs h-8"
                    aria-label="Element width"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">
                    Height
                  </span>
                  <DebouncedInput
                    value={state.size.height}
                    onChange={(value) => handleSizeChange("height", value)}
                    placeholder="auto"
                    className="bg-[#1e1e20] border-white/5 text-xs h-8"
                    aria-label="Element height"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── SPACING SECTION ─────────────────────────────── */}
          <AccordionItem
            value="spacing"
            className="border border-white/5 rounded-lg bg-[#1a1a1c]"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Spacing
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-4">
              {/* Visual Box Model */}
              <div className="bg-[#1e1e20] p-4 rounded-xl border border-white/5 relative aspect-square max-w-[200px] mx-auto flex items-center justify-center">
                <div className="absolute inset-2 border border-dashed border-white/10 rounded-lg flex items-center justify-center">
                  <span className="absolute top-1 text-[8px] text-muted-foreground uppercase">
                    Margin
                  </span>
                  <div className="w-2/3 h-2/3 bg-primary/5 border border-primary/20 rounded-md relative flex items-center justify-center">
                    <span className="absolute top-1 text-[8px] text-primary/60 uppercase">
                      Padding
                    </span>
                    <div className="text-[10px] font-bold text-primary">
                      Content
                    </div>
                  </div>
                </div>
              </div>

              {/* Spacing Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-muted-foreground block">
                    Padding
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    <DebouncedInput
                      value={state.padding.top}
                      onChange={(value) => handlePaddingChange("top", value)}
                      placeholder="T"
                      className="h-7 text-[10px] bg-black/20"
                      aria-label="Padding top"
                    />
                    <DebouncedInput
                      value={state.padding.bottom}
                      onChange={(value) => handlePaddingChange("bottom", value)}
                      placeholder="B"
                      className="h-7 text-[10px] bg-black/20"
                      aria-label="Padding bottom"
                    />
                    <DebouncedInput
                      value={state.padding.left}
                      onChange={(value) => handlePaddingChange("left", value)}
                      placeholder="L"
                      className="h-7 text-[10px] bg-black/20"
                      aria-label="Padding left"
                    />
                    <DebouncedInput
                      value={state.padding.right}
                      onChange={(value) => handlePaddingChange("right", value)}
                      placeholder="R"
                      className="h-7 text-[10px] bg-black/20"
                      aria-label="Padding right"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-muted-foreground block">
                    Margin
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    <DebouncedInput
                      value={state.margin.top}
                      onChange={(value) => handleMarginChange("top", value)}
                      placeholder="T"
                      className="h-7 text-[10px] bg-black/20"
                      aria-label="Margin top"
                    />
                    <DebouncedInput
                      value={state.margin.bottom}
                      onChange={(value) => handleMarginChange("bottom", value)}
                      placeholder="B"
                      className="h-7 text-[10px] bg-black/20"
                      aria-label="Margin bottom"
                    />
                    <DebouncedInput
                      value={state.margin.left}
                      onChange={(value) => handleMarginChange("left", value)}
                      placeholder="L"
                      className="h-7 text-[10px] bg-black/20"
                      aria-label="Margin left"
                    />
                    <DebouncedInput
                      value={state.margin.right}
                      onChange={(value) => handleMarginChange("right", value)}
                      placeholder="R"
                      className="h-7 text-[10px] bg-black/20"
                      aria-label="Margin right"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── 3D TRANSFORMATIONS SECTION ──────────────────── */}
          <AccordionItem
            value="transforms"
            className="border border-white/5 rounded-lg bg-[#1a1a1c]"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              3D Transformations
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-3">
              <Slider
                label="Rotate X"
                value={state.transforms3d.rotateX}
                min={-180}
                max={180}
                unit="°"
                onChange={(value) => handleTransform3DChange("rotateX", value)}
              />
              <Slider
                label="Rotate Y"
                value={state.transforms3d.rotateY}
                min={-180}
                max={180}
                unit="°"
                onChange={(value) => handleTransform3DChange("rotateY", value)}
              />
              <Slider
                label="Rotate Z"
                value={state.transforms3d.rotateZ}
                min={-180}
                max={180}
                unit="°"
                onChange={(value) => handleTransform3DChange("rotateZ", value)}
              />
              <Slider
                label="Perspective"
                value={state.transforms3d.perspective}
                min={0}
                max={10}
                step={1}
                unit="00px"
                onChange={(value) =>
                  handleTransform3DChange("perspective", value)
                }
              />
            </AccordionContent>
          </AccordionItem>

          {/* ─── TYPOGRAPHY SECTION ──────────────────────────── */}
          <AccordionItem
            value="typography"
            className="border border-white/5 rounded-lg bg-[#1a1a1c]"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Typography
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <div className="space-y-1">
                <span className="text-[9px] text-muted-foreground">
                  Font Size (px)
                </span>
                <DebouncedInput
                  type="number"
                  value={state.typography.fontSize}
                  onChange={(value) =>
                    updateNestedState("typography", "fontSize", value)
                  }
                  className="bg-[#1e1e20] border-white/5 text-xs h-8"
                  aria-label="Font size"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">
                    Weight
                  </span>
                  <select
                    value={state.typography.fontWeight}
                    onChange={(e) =>
                      updateNestedState(
                        "typography",
                        "fontWeight",
                        e.target.value,
                      )
                    }
                    className="w-full bg-[#1e1e20] border border-white/5 rounded-md text-xs h-8 px-2"
                  >
                    <option value="">Default</option>
                    <option value="thin">Thin</option>
                    <option value="light">Light</option>
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="semibold">Semibold</option>
                    <option value="bold">Bold</option>
                    <option value="extrabold">Extrabold</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">
                    Align
                  </span>
                  <select
                    value={state.typography.textAlign}
                    onChange={(e) =>
                      updateNestedState(
                        "typography",
                        "textAlign",
                        e.target.value,
                      )
                    }
                    className="w-full bg-[#1e1e20] border border-white/5 rounded-md text-xs h-8 px-2"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">
                    Tracking
                  </span>
                  <select
                    value={state.typography.letterSpacing}
                    onChange={(e) =>
                      updateNestedState(
                        "typography",
                        "letterSpacing",
                        e.target.value,
                      )
                    }
                    className="w-full bg-[#1e1e20] border border-white/5 rounded-md text-xs h-8 px-2"
                  >
                    <option value="">Default</option>
                    <option value="tighter">Tighter</option>
                    <option value="tight">Tight</option>
                    <option value="normal">Normal</option>
                    <option value="wide">Wide</option>
                    <option value="wider">Wider</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">
                    Leading
                  </span>
                  <select
                    value={state.typography.lineHeight}
                    onChange={(e) =>
                      updateNestedState(
                        "typography",
                        "lineHeight",
                        e.target.value,
                      )
                    }
                    className="w-full bg-[#1e1e20] border border-white/5 rounded-md text-xs h-8 px-2"
                  >
                    <option value="">Default</option>
                    <option value="none">None</option>
                    <option value="tight">Tight</option>
                    <option value="snug">Snug</option>
                    <option value="normal">Normal</option>
                    <option value="relaxed">Relaxed</option>
                    <option value="loose">Loose</option>
                  </select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── BACKGROUND SECTION ──────────────────────────── */}
          <AccordionItem
            value="background"
            className="border border-white/5 rounded-lg bg-[#1a1a1c]"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Background
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <div className="space-y-1">
                <span className="text-[9px] text-muted-foreground">Color</span>
                <DebouncedInput
                  value={state.background.color}
                  onChange={(value) =>
                    updateNestedState("background", "color", value)
                  }
                  placeholder="#000000 or rgb(...)"
                  className="bg-[#1e1e20] border-white/5 text-xs h-8"
                  aria-label="Background color"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── BORDER SECTION ──────────────────────────────── */}
          <AccordionItem
            value="border"
            className="border border-white/5 rounded-lg bg-[#1a1a1c]"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Border
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">
                    Width (px)
                  </span>
                  <DebouncedInput
                    type="number"
                    value={state.border.width}
                    onChange={(value) =>
                      updateNestedState("border", "width", value)
                    }
                    placeholder="0"
                    className="bg-[#1e1e20] border-white/5 text-xs h-8"
                    aria-label="Border width"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">
                    Radius (px)
                  </span>
                  <DebouncedInput
                    type="number"
                    value={state.border.radius}
                    onChange={(value) =>
                      updateNestedState("border", "radius", value)
                    }
                    placeholder="0"
                    className="bg-[#1e1e20] border-white/5 text-xs h-8"
                    aria-label="Border radius"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-muted-foreground">Color</span>
                <DebouncedInput
                  value={state.border.color}
                  onChange={(value) =>
                    updateNestedState("border", "color", value)
                  }
                  placeholder="#000000 or rgb(...)"
                  className="bg-[#1e1e20] border-white/5 text-xs h-8"
                  aria-label="Border color"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── 2D TRANSFORMATIONS SECTION ──────────────────── */}
          <AccordionItem
            value="transforms2d"
            className="border border-white/5 rounded-lg bg-[#1a1a1c]"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              2D Transformations
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-3">
              <Slider
                label="Translate X"
                value={state.transforms.translateX}
                min={-200}
                max={200}
                unit="px"
                onChange={(value) =>
                  handleTransform2DChange("translateX", value)
                }
              />
              <Slider
                label="Translate Y"
                value={state.transforms.translateY}
                min={-200}
                max={200}
                unit="px"
                onChange={(value) =>
                  handleTransform2DChange("translateY", value)
                }
              />
              <Slider
                label="Rotate"
                value={state.transforms.rotate}
                min={-180}
                max={180}
                unit="°"
                onChange={(value) => handleTransform2DChange("rotate", value)}
              />
              <Slider
                label="Scale"
                value={state.transforms.scale}
                min={0}
                max={200}
                unit="%"
                onChange={(value) => handleTransform2DChange("scale", value)}
              />
              <Slider
                label="Skew X"
                value={state.transforms.skewX}
                min={-45}
                max={45}
                unit="°"
                onChange={(value) => handleTransform2DChange("skewX", value)}
              />
              <Slider
                label="Skew Y"
                value={state.transforms.skewY}
                min={-45}
                max={45}
                unit="°"
                onChange={(value) => handleTransform2DChange("skewY", value)}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ─── EFFECTS SECTION ─────────────────────────────── */}
          <AccordionItem
            value="effects"
            className="border border-white/5 rounded-lg bg-[#1a1a1c]"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Effects
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">
                    Opacity
                  </span>
                  <Input
                    type="number"
                    value={state.opacity}
                    onChange={(e) =>
                      handleOpacityChange(parseInt(e.target.value) || 0)
                    }
                    className="h-8 text-xs bg-[#1e1e20]"
                    min={0}
                    max={100}
                    aria-label="Element opacity"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">Blur</span>
                  <Input
                    type="number"
                    value={state.blur || 0}
                    onChange={(e) =>
                      handleBlurChange(parseInt(e.target.value) || 0)
                    }
                    className="h-8 text-xs bg-[#1e1e20]"
                    min={0}
                    max={50}
                    aria-label="Element blur amount"
                  />
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <span className="text-[9px] text-muted-foreground">
                  Backdrop Blur
                </span>
                <Input
                  type="number"
                  value={state.backdropBlur || 0}
                  onChange={(e) =>
                    updateState("backdropBlur", parseInt(e.target.value) || 0)
                  }
                  className="h-8 text-xs bg-[#1e1e20]"
                  min={0}
                  max={50}
                  aria-label="Backdrop blur amount"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* ─── TAILWIND OUTPUT ────────────────────────────────── */}
        <section className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Tailwind Output
            </label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopyTailwind}
              aria-label="Copy Tailwind classes"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
          <div className="p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-[10px] text-primary break-all leading-relaxed min-h-[60px] max-h-[120px] overflow-y-auto">
            {generatedTailwind || (
              <span className="text-muted-foreground italic">
                No modifications...
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertiesPanel;
