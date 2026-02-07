import React from "react";
import Editor, { OnChange } from "@monaco-editor/react";
import { ProjectFile } from "@/hooks/use-project-files";

interface CodeEditorProps {
  file: ProjectFile;
  onChange: (id: string, value: string | undefined) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ file, onChange }) => {
  const handleEditorChange: OnChange = (value) => {
    onChange(file.id, value);
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={file.language}
        value={file.content}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16 },
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: "on",
          roundedSelection: false,
          cursorStyle: "line",
          wordWrap: "on",
          theme: "vs-dark",
        }}
        loading={
          <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
            Initializing editor...
          </div>
        }
      />
    </div>
  );
};
