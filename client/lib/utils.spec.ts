import { describe, it, expect, expectTypeOf } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  describe("Basic functionality", () => {
    it("should merge multiple class strings", () => {
      expect(cn("text-red-500", "bg-blue-500")).toBe(
        "text-red-500 bg-blue-500",
      );
    });

    it("should handle single class", () => {
      expect(cn("single-class")).toBe("single-class");
    });

    it("should handle empty arguments", () => {
      expect(cn()).toBe("");
    });

    it("should handle empty strings", () => {
      expect(cn("", "", "valid-class")).toBe("valid-class");
    });
  });

  describe("Conditional class handling", () => {
    it("should include classes when condition is true", () => {
      const isActive = true;
      expect(cn("base-class", isActive && "active-class")).toBe(
        "base-class active-class",
      );
    });

    it("should exclude classes when condition is false", () => {
      const isActive = false;
      expect(cn("base-class", isActive && "active-class")).toBe("base-class");
    });

    it("should handle multiple conditional classes", () => {
      const isActive = true;
      const isDisabled = false;
      const isHovered = true;

      expect(
        cn(
          "base",
          isActive && "active",
          isDisabled && "disabled",
          isHovered && "hovered",
        ),
      ).toBe("base active hovered");
    });

    it("should filter out null and undefined values", () => {
      expect(cn("base-class", null, undefined, "valid-class")).toBe(
        "base-class valid-class",
      );
    });
  });

  describe("Tailwind class merging", () => {
    it("should override conflicting padding classes", () => {
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    });

    it("should override conflicting margin classes", () => {
      expect(cn("mx-4", "mx-8")).toBe("mx-8");
    });

    it("should merge different utilities without conflict", () => {
      expect(cn("text-sm font-bold", "text-lg")).toBe("font-bold text-lg");
    });

    it("should handle complex tailwind overrides", () => {
      expect(cn("p-4 px-8", "p-2")).toBe("px-8 p-2");
    });

    it("should preserve non-conflicting modifiers", () => {
      expect(cn("hover:bg-blue-500", "focus:bg-red-500")).toBe(
        "hover:bg-blue-500 focus:bg-red-500",
      );
    });

    it("should override same modifier classes", () => {
      expect(cn("hover:bg-blue-500", "hover:bg-red-500")).toBe(
        "hover:bg-red-500",
      );
    });

    it("should handle responsive variants correctly", () => {
      expect(cn("text-sm md:text-base", "md:text-lg")).toBe(
        "text-sm md:text-lg",
      );
    });
  });

  describe("Object notation", () => {
    it("should handle object with boolean values", () => {
      expect(
        cn("base", {
          conditional: true,
          "not-included": false,
        }),
      ).toBe("base conditional");
    });

    it("should handle multiple objects", () => {
      expect(
        cn(
          { "class-1": true, "class-2": false },
          { "class-3": true, "class-4": true },
        ),
      ).toBe("class-1 class-3 class-4");
    });

    it("should mix strings and objects", () => {
      expect(
        cn("base-class", { active: true }, "another-class", {
          disabled: false,
        }),
      ).toBe("base-class active another-class");
    });
  });

  describe("Array handling", () => {
    it("should handle arrays of classes", () => {
      expect(cn(["class-1", "class-2"], "class-3")).toBe(
        "class-1 class-2 class-3",
      );
    });

    it("should handle nested arrays", () => {
      expect(cn(["class-1", ["class-2", "class-3"]])).toBe(
        "class-1 class-2 class-3",
      );
    });

    it("should handle arrays with conditionals", () => {
      const isActive = true;
      expect(cn(["base", isActive && "active"])).toBe("base active");
    });
  });

  describe("Edge cases", () => {
    it("should handle duplicate classes", () => {
      expect(cn("duplicate", "duplicate")).toBe("duplicate");
    });

    it("should trim whitespace", () => {
      expect(cn("  spaced-class  ", "another-class")).toBe(
        "spaced-class another-class",
      );
    });

    it("should handle very long class strings", () => {
      const longClass = "a b c d e f g h i j k l m n o p q r s t u v w x y z";
      expect(cn(longClass)).toBe(longClass);
    });

    it("should handle special characters in class names", () => {
      expect(
        cn("class-with-dash", "class_with_underscore", "class:colon"),
      ).toBe("class-with-dash class_with_underscore class:colon");
    });
  });

  describe("Real-world component scenarios", () => {
    it("should handle button variant pattern", () => {
      type Variant = "primary" | "secondary";
      type Size = "sm" | "lg";

      const variant: Variant = "primary";
      const size: Size = "lg";

      expect(
        cn(
          "btn",
          variant === "primary" && "btn-primary",
          (variant as Variant) === "secondary" && "btn-secondary",
          size === "lg" && "btn-lg",
          (size as Size) === "sm" && "btn-sm",
        ),
      ).toBe("btn btn-primary btn-lg");
    });

    it("should handle disabled and loading states", () => {
      const isDisabled = true;
      const isLoading = false;

      expect(
        cn(
          "button",
          isDisabled && "opacity-50 cursor-not-allowed",
          isLoading && "animate-pulse",
        ),
      ).toBe("button opacity-50 cursor-not-allowed");
    });

    it("should handle form input states", () => {
      const hasError = true;
      const isFocused = false;

      expect(
        cn(
          "input border rounded",
          hasError ? "border-red-500" : "border-gray-300",
          isFocused && "ring-2 ring-blue-500",
        ),
      ).toBe("input border rounded border-red-500");
    });

    it("should override default props with user props", () => {
      const defaultClasses = "px-4 py-2 bg-blue-500";
      const userClasses = "px-6 bg-red-500";

      expect(cn(defaultClasses, userClasses)).toBe("py-2 px-6 bg-red-500");
    });
  });

  describe("Performance and type safety", () => {
    it("should handle undefined without errors", () => {
      expect(() => cn(undefined)).not.toThrow();
    });

    it("should handle null without errors", () => {
      expect(() => cn(null)).not.toThrow();
    });

    it("should handle boolean values", () => {
      expect(cn(true, false, "valid")).toBe("valid");
    });

    it("should handle numbers (edge case)", () => {
      // Numbers shouldn't typically be passed, but shouldn't break
      expect(cn("class", 0, 1, "another")).toBe("class another");
    });
  });

  describe("Integration patterns", () => {
    it("should work with className prop pattern", () => {
      const getButtonClasses = (className?: string) => {
        return cn(
          "px-4 py-2 rounded font-medium transition-colors",
          "bg-blue-500 hover:bg-blue-600",
          "text-white",
          className,
        );
      };

      expect(getButtonClasses("bg-red-500")).toBe(
        "px-4 py-2 rounded font-medium transition-colors hover:bg-blue-600 text-white bg-red-500",
      );
    });

    it("should work with variant config objects", () => {
      const variants = {
        primary: "bg-blue-500 text-white",
        secondary: "bg-gray-500 text-white",
        ghost: "bg-transparent text-gray-700",
      };

      const variant = "primary";
      expect(cn("btn", variants[variant])).toBe("btn bg-blue-500 text-white");
    });
  });
});
