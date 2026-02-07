import React from "react";
import { cn } from "@/lib/utils";

interface SidebarTabsProps {
  activeTab: "files" | "layers";
  onTabChange: (tab: "files" | "layers") => void;
}

/**
 * SidebarTabs - manages tab selection for Files and Layers
 * Extracted from Sidebar for better modularity
 */
export const SidebarTabs: React.FC<SidebarTabsProps> = React.memo(
  ({ activeTab, onTabChange }) => {
    return (
      <div className="flex border-b border-white/5">
        <button
          onClick={() => onTabChange("files")}
          className={cn(
            "flex-1 py-3 text-[11px] font-bold tracking-wider uppercase transition-colors",
            activeTab === "files"
              ? "text-foreground border-b-2 border-primary bg-white/5"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Files
        </button>
        <button
          onClick={() => onTabChange("layers")}
          className={cn(
            "flex-1 py-3 text-[11px] font-bold tracking-wider uppercase transition-colors",
            activeTab === "layers"
              ? "text-foreground border-b-2 border-primary bg-white/5"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Layers
        </button>
      </div>
    );
  },
);

SidebarTabs.displayName = "SidebarTabs";
