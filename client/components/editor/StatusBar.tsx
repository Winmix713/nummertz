import React from "react";

export const StatusBar: React.FC = () => {
  return (
    <div className="h-6 bg-[#18181b] border-t border-white/5 px-3 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-medium z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Prettier Ready
        </div>
        <div>UTF-8</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>HTML</span>
          <span>Ln 508, Col 8</span>
        </div>
        <div>Spaces: 4</div>
      </div>
    </div>
  );
};
