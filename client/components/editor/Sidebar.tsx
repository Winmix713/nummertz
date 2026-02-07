import React from "react";
import { ProjectFile } from "@/hooks/use-project-files";
import { SidebarTabs } from "./layout/SidebarTabs";
import { FileExplorer } from "./layout/FileExplorer";
import { ResourcePanel } from "./layout/ResourcePanel";

interface SidebarProps {
  files: ProjectFile[];
  activeFileId: string;
  onFileSelect: (id: string) => void;
  activeTab: "files" | "layers";
  setActiveTab: (tab: "files" | "layers") => void;
  onAIApply: (prompt: string) => Promise<void>;
}

/**
 * Sidebar - Refactored to use extracted sub-components
 * Now orchestrates FileExplorer, SidebarTabs, and ResourcePanel
 */
export const Sidebar: React.FC<SidebarProps> = React.memo(
  ({
    files,
    activeFileId,
    onFileSelect,
    activeTab,
    setActiveTab,
    onAIApply,
  }) => {
    return (
      <div className="w-64 flex flex-col border-r border-white/5 bg-[#121214] h-full overflow-hidden">
        {/* Tab selector */}
        <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* File explorer - shown when files tab is active */}
        {activeTab === "files" && (
          <FileExplorer
            files={files}
            activeFileId={activeFileId}
            onFileSelect={onFileSelect}
          />
        )}

        {/* Layers - placeholder for future implementation */}
        {activeTab === "layers" && (
          <div className="p-4 text-muted-foreground text-sm">
            Layers view coming soon...
          </div>
        )}

        {/* AI Assistant and resources */}
        <ResourcePanel onAIApply={onAIApply} />
      </div>
    );
  },
);

Sidebar.displayName = "Sidebar";
