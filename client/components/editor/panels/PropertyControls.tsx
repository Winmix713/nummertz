import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { DebouncedInput } from "@/components/editor/core/DebouncedInput";
import { Slider } from "@/components/editor/core/Slider";

interface PropertyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  "aria-label"?: string;
}

/**
 * Simple text property input control
 */
export const PropertyInput: React.FC<PropertyInputProps> = React.memo(
  ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    "aria-label": ariaLabel,
  }) => (
    <div className="space-y-1">
      <span className="text-[9px] text-muted-foreground">{label}</span>
      <DebouncedInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-[#1e1e20] border-white/5 text-xs h-8"
        type={type}
        aria-label={ariaLabel}
      />
    </div>
  ),
);

PropertyInput.displayName = "PropertyInput";

interface PropertySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  "aria-label"?: string;
}

/**
 * Select/dropdown property control
 */
export const PropertySelect: React.FC<PropertySelectProps> = React.memo(
  ({ label, value, onChange, options, "aria-label": ariaLabel }) => (
    <div className="space-y-1">
      <span className="text-[9px] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1e1e20] border border-white/5 rounded-md text-xs h-8 px-2"
        aria-label={ariaLabel}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
);

PropertySelect.displayName = "PropertySelect";

interface PropertyNumberProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  "aria-label"?: string;
}

/**
 * Number property input control
 */
export const PropertyNumber: React.FC<PropertyNumberProps> = React.memo(
  ({
    label,
    value,
    onChange,
    placeholder,
    min,
    max,
    "aria-label": ariaLabel,
  }) => (
    <div className="space-y-1">
      <span className="text-[9px] text-muted-foreground">{label}</span>
      <DebouncedInput
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-[#1e1e20] border-white/5 text-xs h-8"
        aria-label={ariaLabel}
      />
    </div>
  ),
);

PropertyNumber.displayName = "PropertyNumber";

interface PropertySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

/**
 * Slider property control for numeric values
 */
export const PropertySlider: React.FC<PropertySliderProps> = React.memo(
  ({ label, value, onChange, min, max, step, unit }) => (
    <Slider
      label={label}
      value={value}
      min={min}
      max={max}
      step={step}
      unit={unit}
      onChange={onChange}
    />
  ),
);

PropertySlider.displayName = "PropertySlider";
