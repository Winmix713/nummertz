import * as React from "react";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useProjectFiles } from "@/hooks/use-project-files";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PreviewFrame } from "@/components/editor/PreviewFrame";
import { Sidebar } from "@/components/editor/Sidebar";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { StatusBar } from "@/components/editor/StatusBar";
import { TopNav } from "@/components/editor/TopNav";
import { useToast } from "@/hooks/use-toast";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { InspectorProvider, useInspector } from "@/hooks/use-inspector";

export default function Index() {
  return (
    <InspectorProvider>
      <IndexContent />
    </InspectorProvider>
  );
}

function IndexContent() {
  const {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    updateFileContent,
    resetProject,
  } = useProjectFiles();

  const { state: inspectorState, updateState: updateInspectorState } =
    useInspector();

  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );
  const [isInspectorActive, setIsInspectorActive] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"files" | "layers">("files");
  const [viewMode, setViewMode] = useState<"code" | "split" | "design">(
    "split",
  );
  const { toast } = useToast();

  useKeyboardShortcuts({
    "mod+s": () => {
      toast({
        title: "Saved",
        description: "Changes are automatically saved to local storage.",
      });
    },
    "mod+shift+f": () => {
      toast({ title: "Format", description: "Auto-formatting code..." });
    },
    "mod+1": () => setActiveFileId(files[0].id),
    "mod+2": () => setActiveFileId(files[1].id),
    "mod+3": () => setActiveFileId(files[2].id),
  });

  const handleExport = async () => {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.name, file.content);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nexus-project.zip";
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Project Exported",
      description: "Your project has been downloaded.",
    });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the project?")) {
      resetProject();
      toast({ title: "Project Reset" });
    }
  };

  const handleElementSelect = (data: any) => {
    toast({
      title: "Element Selected",
      description: `Target: ${data.elementTag}#${data.elementId}`,
    });

    // Sync preview properties to Inspector state
    updateInspectorState("elementId", data.elementId);
    updateInspectorState("elementTag", data.elementTag);
    updateInspectorState("textContent", data.textContent);
    updateInspectorState("tailwindClasses", data.tailwindClasses);
    updateInspectorState("padding", {
      top: String(data.padding.top),
      bottom: String(data.padding.bottom),
      left: String(data.padding.left),
      right: String(data.padding.right),
    });
    updateInspectorState("typography", {
      ...inspectorState.typography,
      fontSize: String(data.typography.fontSize),
      fontWeight: data.typography.fontWeight,
      textAlign: data.typography.textAlign,
    });

    setIsInspectorActive(false);
  };

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#09090b] text-foreground overflow-hidden font-sans">
      <TopNav
        onExport={handleExport}
        onReset={handleReset}
        isInspectorActive={isInspectorActive}
        toggleInspector={() => setIsInspectorActive(!isInspectorActive)}
        device={device}
        setDevice={setDevice}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          files={files}
          activeFileId={activeFileId}
          onFileSelect={setActiveFileId}
          activeTab={sidebarTab}
          setActiveTab={setSidebarTab}
          onAIApply={async (p) => {
            await new Promise((r) => setTimeout(r, 1500));
            toast({ title: "AI Thinking...", description: p });
          }}
        />

        <main className="flex-1 overflow-hidden flex flex-col">
          <ResizablePanelGroup direction="horizontal">
            {viewMode !== "design" && (
              <ResizablePanel
                defaultSize={viewMode === "code" ? 100 : 50}
                minSize={20}
              >
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex-1 relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFileId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="h-full w-full"
                      >
                        <CodeEditor
                          file={activeFile}
                          onChange={updateFileContent}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </ResizablePanel>
            )}

            {viewMode === "split" && (
              <ResizableHandle withHandle className="bg-white/5 w-1" />
            )}

            {viewMode !== "code" && (
              <ResizablePanel
                defaultSize={viewMode === "design" ? 100 : 50}
                minSize={20}
              >
                <div className="h-full bg-[#0a0a0a] p-8 flex items-center justify-center overflow-auto relative">
                  <div
                    className="transition-all duration-300 ease-in-out shadow-2xl h-full relative"
                    style={{ width: getDeviceWidth() }}
                  >
                    <PreviewFrame
                      files={files}
                      onElementSelect={handleElementSelect}
                      isInspectorActive={isInspectorActive}
                    />
                  </div>
                </div>
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </main>

        <PropertiesPanel />
      </div>

      <StatusBar />
    </div>
  );
}
