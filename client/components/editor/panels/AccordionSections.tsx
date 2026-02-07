import React, { useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  PropertyInput,
  PropertySelect,
  PropertyNumber,
  PropertySlider,
} from "./PropertyControls";
import { DebouncedInput } from "@/components/editor/core/DebouncedInput";
import { Slider } from "@/components/editor/core/Slider";
import type { InspectorState } from "@/hooks/use-inspector";

interface AccordionSectionsProps {
  state: InspectorState;
  expandedSections: string[];
  onToggleSection: (section: string) => void;
  onUpdateState: (key: string, value: any) => void;
  onUpdateNestedState: (parent: string, key: string, value: any) => void;
}

/**
 * Component that renders all property accordion sections
 * Extracted from PropertiesPanel to reduce component complexity
 */
export const AccordionSections: React.FC<AccordionSectionsProps> = React.memo(
  ({
    state,
    expandedSections,
    onToggleSection,
    onUpdateState,
    onUpdateNestedState,
  }) => {
    // Handlers for different property types
    const handleTextContentChange = useCallback(
      (value: string) => {
        onUpdateState("textContent", value);
      },
      [onUpdateState],
    );

    const handleLinkChange = useCallback(
      (value: string) => {
        onUpdateState("link", value);
      },
      [onUpdateState],
    );

    const handleSizeChange = useCallback(
      (dimension: "width" | "height", value: string) => {
        onUpdateNestedState("size", dimension, value);
      },
      [onUpdateNestedState],
    );

    const handlePaddingChange = useCallback(
      (side: "top" | "bottom" | "left" | "right", value: string) => {
        onUpdateNestedState("padding", side, value);
      },
      [onUpdateNestedState],
    );

    const handleMarginChange = useCallback(
      (side: "top" | "bottom" | "left" | "right", value: string) => {
        onUpdateNestedState("margin", side, value);
      },
      [onUpdateNestedState],
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
        onUpdateNestedState("transforms", transform, value);
      },
      [onUpdateNestedState],
    );

    const handleTransform3DChange = useCallback(
      (
        transform: "rotateX" | "rotateY" | "rotateZ" | "perspective",
        value: number,
      ) => {
        onUpdateNestedState("transforms3d", transform, value);
      },
      [onUpdateNestedState],
    );

    const handleOpacityChange = useCallback(
      (value: number) => {
        onUpdateState("opacity", value);
      },
      [onUpdateState],
    );

    const handleBlurChange = useCallback(
      (value: number) => {
        onUpdateState("blur", value);
      },
      [onUpdateState],
    );

    return (
      <Accordion
        type="multiple"
        value={expandedSections}
        onValueChange={(values) => {
          // This is handled by parent component through onToggleSection
        }}
        className="space-y-2"
      >
        {/* CONTENT SECTION */}
        <AccordionItem
          value="content"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={() => onToggleSection("content")}
          >
            Content
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-2">
            <PropertyInput
              label="Text"
              value={state.textContent}
              onChange={handleTextContentChange}
              placeholder="Enter text..."
              aria-label="Element text content"
            />
            <PropertyInput
              label="Link (href)"
              value={state.link}
              onChange={handleLinkChange}
              placeholder="https://..."
              aria-label="Element link URL"
            />
          </AccordionContent>
        </AccordionItem>

        {/* SIZING SECTION */}
        <AccordionItem
          value="sizing"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={() => onToggleSection("sizing")}
          >
            Sizing
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <PropertyInput
                label="Width"
                value={state.size.width}
                onChange={(value) => handleSizeChange("width", value)}
                placeholder="auto"
                aria-label="Element width"
              />
              <PropertyInput
                label="Height"
                value={state.size.height}
                onChange={(value) => handleSizeChange("height", value)}
                placeholder="auto"
                aria-label="Element height"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SPACING SECTION */}
        <AccordionItem
          value="spacing"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={() => onToggleSection("spacing")}
          >
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

        {/* 3D TRANSFORMATIONS SECTION */}
        <AccordionItem
          value="transforms"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={() => onToggleSection("transforms")}
          >
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

        {/* TYPOGRAPHY SECTION */}
        <AccordionItem
          value="typography"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={() => onToggleSection("typography")}
          >
            Typography
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-2">
            <PropertyNumber
              label="Font Size (px)"
              value={state.typography.fontSize}
              onChange={(value) =>
                onUpdateNestedState("typography", "fontSize", value)
              }
              aria-label="Font size"
            />
            <div className="grid grid-cols-2 gap-2">
              <PropertySelect
                label="Weight"
                value={state.typography.fontWeight}
                onChange={(value) =>
                  onUpdateNestedState("typography", "fontWeight", value)
                }
                options={[
                  { value: "", label: "Default" },
                  { value: "thin", label: "Thin" },
                  { value: "light", label: "Light" },
                  { value: "normal", label: "Normal" },
                  { value: "medium", label: "Medium" },
                  { value: "semibold", label: "Semibold" },
                  { value: "bold", label: "Bold" },
                  { value: "extrabold", label: "Extrabold" },
                ]}
                aria-label="Font weight"
              />
              <PropertySelect
                label="Align"
                value={state.typography.textAlign}
                onChange={(value) =>
                  onUpdateNestedState("typography", "textAlign", value)
                }
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                  { value: "justify", label: "Justify" },
                ]}
                aria-label="Text alignment"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <PropertySelect
                label="Tracking"
                value={state.typography.letterSpacing}
                onChange={(value) =>
                  onUpdateNestedState("typography", "letterSpacing", value)
                }
                options={[
                  { value: "", label: "Default" },
                  { value: "tighter", label: "Tighter" },
                  { value: "tight", label: "Tight" },
                  { value: "normal", label: "Normal" },
                  { value: "wide", label: "Wide" },
                  { value: "wider", label: "Wider" },
                ]}
                aria-label="Letter spacing"
              />
              <PropertySelect
                label="Leading"
                value={state.typography.lineHeight}
                onChange={(value) =>
                  onUpdateNestedState("typography", "lineHeight", value)
                }
                options={[
                  { value: "", label: "Default" },
                  { value: "none", label: "None" },
                  { value: "tight", label: "Tight" },
                  { value: "snug", label: "Snug" },
                  { value: "normal", label: "Normal" },
                  { value: "relaxed", label: "Relaxed" },
                  { value: "loose", label: "Loose" },
                ]}
                aria-label="Line height"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* BACKGROUND SECTION */}
        <AccordionItem
          value="background"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={() => onToggleSection("background")}
          >
            Background
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-2">
            <PropertyInput
              label="Color"
              value={state.background.color}
              onChange={(value) =>
                onUpdateNestedState("background", "color", value)
              }
              placeholder="#000000 or rgb(...)"
              aria-label="Background color"
            />
          </AccordionContent>
        </AccordionItem>

        {/* BORDER SECTION */}
        <AccordionItem
          value="border"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={() => onToggleSection("border")}
          >
            Border
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <PropertyNumber
                label="Width (px)"
                value={state.border.width}
                onChange={(value) =>
                  onUpdateNestedState("border", "width", value)
                }
                placeholder="0"
                aria-label="Border width"
              />
              <PropertyNumber
                label="Radius (px)"
                value={state.border.radius}
                onChange={(value) =>
                  onUpdateNestedState("border", "radius", value)
                }
                placeholder="0"
                aria-label="Border radius"
              />
            </div>
            <PropertyInput
              label="Color"
              value={state.border.color}
              onChange={(value) =>
                onUpdateNestedState("border", "color", value)
              }
              placeholder="#000000 or rgb(...)"
              aria-label="Border color"
            />
          </AccordionContent>
        </AccordionItem>

        {/* 2D TRANSFORMATIONS SECTION */}
        <AccordionItem
          value="transforms2d"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={() => onToggleSection("transforms2d")}
          >
            2D Transformations
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-3">
            <Slider
              label="Translate X"
              value={state.transforms.translateX}
              min={-200}
              max={200}
              unit="px"
              onChange={(value) => handleTransform2DChange("translateX", value)}
            />
            <Slider
              label="Translate Y"
              value={state.transforms.translateY}
              min={-200}
              max={200}
              unit="px"
              onChange={(value) => handleTransform2DChange("translateY", value)}
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

        {/* EFFECTS SECTION */}
        <AccordionItem
          value="effects"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={() => onToggleSection("effects")}
          >
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
                  onUpdateState("backdropBlur", parseInt(e.target.value) || 0)
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
    );
  },
);

AccordionSections.displayName = "AccordionSections";
