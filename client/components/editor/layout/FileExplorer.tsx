import React, { useCallback } from "react";
import {
  FolderTree,
  ChevronDown,
  FileCode,
  FileJson,
  FileType as FileHtml,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectFile } from "@/hooks/use-project-files";

interface FileExplorerProps {
  files: ProjectFile[];
  activeFileId: string;
  onFileSelect: (id: string) => void;
}

/**
 * FileExplorer component - displays file tree and allows file selection
 * Extracted from Sidebar for better modularity
 */
export const FileExplorer: React.FC<FileExplorerProps> = React.memo(
  ({ files, activeFileId, onFileSelect }) => {
    const getIcon = useCallback((language: string) => {
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
    }, []);

    return (
      <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
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
    );
  },
);

FileExplorer.displayName = "FileExplorer";
