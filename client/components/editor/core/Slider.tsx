import * as React from "react";
import { useCallback } from "react";
import "./slider.css";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

/**
 * Slider component with accessibility
 * Extracted from PropertiesPanel for reusability
 */
export const Slider: React.FC<SliderProps> = React.memo(
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
