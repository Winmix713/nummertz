import * as React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

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
export const DebouncedInput: React.FC<DebouncedInputProps> = React.memo(
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
