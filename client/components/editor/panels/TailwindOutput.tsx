import React, { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TailwindOutputProps {
  generatedTailwind: string;
}

/**
 * Component for displaying and copying generated Tailwind classes
 * Extracted from PropertiesPanel for better modularity
 */
export const TailwindOutput: React.FC<TailwindOutputProps> = React.memo(
  ({ generatedTailwind }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyTailwind = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(generatedTailwind);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }, [generatedTailwind]);

    return (
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
    );
  },
);

TailwindOutput.displayName = "TailwindOutput";
