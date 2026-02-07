import React from "react";
import {
  FolderTree,
  Layers,
  Search,
  ChevronDown,
  FileCode,
  FileJson,
  FileType as FileHtml,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectFile } from "@/hooks/use-project-files";

import { AIPrompt } from "./AIPrompt";

interface SidebarProps {
  files: ProjectFile[];
  activeFileId: string;
  onFileSelect: (id: string) => void;
  activeTab: "files" | "layers";
  setActiveTab: (tab: "files" | "layers") => void;
  onAIApply: (prompt: string) => Promise<void>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  files,
  activeFileId,
  onFileSelect,
  activeTab,
  setActiveTab,
  onAIApply,
}) => {
  const getIcon = (language: string) => {
    switch (language) {
      case "html":
        return <FileHtml className="w-4 h-4 text-orange-400" />;
      case "css":
        return <FileCode className="w-4 h-4 text-blue-400" />;
      case "javascript":
        return <FileJson className="w-4 h-4 text-yellow-400" />;
      default:
        return <FileCode className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-64 flex flex-col border-r border-white/5 bg-[#121214] h-full overflow-hidden">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab("files")}
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
          onClick={() => setActiveTab("layers")}
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

      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
            Project Root
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-white/5 rounded cursor-pointer group">
              <ChevronDown className="w-3 h-3" />
              <FolderTree className="w-4 h-4" />
              <span>src</span>
              <Plus className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="ml-4 flex flex-col gap-1 border-l border-white/5 pl-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => onFileSelect(file.id)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer transition-colors",
                    activeFileId === file.id
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {getIcon(file.language)}
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-white/5 bg-[#121214]">
        <div className="p-4 pb-0 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Nexus Assistant
          </span>
        </div>
        <AIPrompt onApply={onAIApply} />
      </div>
    </div>
  );
};

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
