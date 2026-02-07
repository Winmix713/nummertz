import React from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  MousePointer2,
  Cpu,
  Share2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopNavProps {
  onExport: () => void;
  onReset: () => void;
  isInspectorActive: boolean;
  toggleInspector: () => void;
  device: "mobile" | "tablet" | "desktop";
  setDevice: (device: "mobile" | "tablet" | "desktop") => void;
  projectName?: string;
  viewMode: "code" | "split" | "design";
  setViewMode: (mode: "code" | "split" | "design") => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onExport,
  onReset,
  isInspectorActive,
  toggleInspector,
  device,
  setDevice,
  projectName = "marketing-site",
  viewMode,
  setViewMode,
}) => {
  return (
    <nav className="h-12 border-b border-white/5 bg-[#09090b] flex items-center justify-between px-3 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">
              Nexus AI
            </span>
            <span className="text-[11px] font-bold tracking-tight">EDITOR</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-md border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
          <span className="text-xs font-medium text-muted-foreground">
            {projectName}
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/5 p-1 rounded-md border border-white/5">
        {(["code", "split", "design"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all",
              viewMode === mode
                ? "bg-[#18181b] text-white shadow-sm"
                : "text-muted-foreground hover:text-white",
            )}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDevice("desktop")}
          className={cn(
            "h-7 w-7",
            device === "desktop" && "bg-[#18181b] shadow-sm text-primary",
          )}
        >
          <Monitor className="h-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDevice("tablet")}
          className={cn(
            "h-7 w-7",
            device === "tablet" && "bg-[#18181b] shadow-sm text-primary",
          )}
        >
          <Tablet className="h-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDevice("mobile")}
          className={cn(
            "h-7 w-7",
            device === "mobile" && "bg-[#18181b] shadow-sm text-primary",
          )}
        >
          <Smartphone className="h-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleInspector}
            className={cn(
              "h-8 w-8",
              isInspectorActive && "text-primary bg-primary/10",
            )}
          >
            <MousePointer2 className="h-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-8 w-8"
          >
            <RotateCcw className="h-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExport}
            className="h-8 w-8"
          >
            <Download className="h-4 h-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-white/5" />

        <Button
          size="sm"
          className="h-8 px-4 text-xs font-bold gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
        >
          <Share2 className="h-3.5 w-3.5" />
          Deploy
        </Button>
      </div>
    </nav>
  );
};
