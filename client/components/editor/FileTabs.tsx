import React from "react";
import { ProjectFile } from "@/hooks/use-project-files";
import { cn } from "@/lib/utils";
import { FileCode, FileJson, FileType as FileHtml } from "lucide-react";

interface FileTabsProps {
  files: ProjectFile[];
  activeFileId: string;
  onSelect: (id: string) => void;
}

export const FileTabs: React.FC<FileTabsProps> = ({
  files,
  activeFileId,
  onSelect,
}) => {
  const getIcon = (language: string) => {
    switch (language) {
      case "html":
        return <FileHtml className="w-4 h-4 text-orange-500" />;
      case "css":
        return <FileCode className="w-4 h-4 text-blue-500" />;
      case "javascript":
        return <FileJson className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileCode className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex bg-[#1e1e1e] border-b border-white/5 overflow-x-auto scrollbar-none">
      {files.map((file) => (
        <button
          key={file.id}
          onClick={() => onSelect(file.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-r border-white/5 min-w-fit",
            activeFileId === file.id
              ? "bg-[#1e1e1e] text-foreground border-b-2 border-b-primary"
              : "bg-[#252526] text-muted-foreground hover:bg-[#2d2d2d]",
          )}
        >
          {getIcon(file.language)}
          {file.name}
        </button>
      ))}
    </div>
  );
};
