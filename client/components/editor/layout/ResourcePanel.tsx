import React from "react";
import { AIPrompt } from "@/components/editor/AIPrompt";

interface ResourcePanelProps {
  onAIApply: (prompt: string) => Promise<void>;
}

/**
 * ResourcePanel - displays resources and AI assistant
 * Contains the AI prompt section extracted from Sidebar
 */
export const ResourcePanel: React.FC<ResourcePanelProps> = React.memo(
  ({ onAIApply }) => {
    return (
      <div className="mt-auto border-t border-white/5 bg-[#121214]">
        <div className="p-4 pb-0 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Nexus Assistant
          </span>
        </div>
        <AIPrompt onApply={onAIApply} />
      </div>
    );
  },
);

ResourcePanel.displayName = "ResourcePanel";

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-sparkles"
    >
      <path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
