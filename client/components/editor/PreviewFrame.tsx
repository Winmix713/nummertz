import React, { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { ProjectFile } from "@/hooks/use-project-files";

interface PreviewFrameProps {
  files: ProjectFile[];
  onElementSelect?: (data: any) => void;
  isInspectorActive?: boolean;
}

interface PreviewError {
  type: string;
  message: string;
  stack?: string;
  line?: number;
  column?: number;
}

/**
 * Enhanced preview frame component with real-time updates
 * Supports live CSS/JS updates and error handling
 */
export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  files,
  onElementSelect,
  isInspectorActive = false,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewError, setPreviewError] = useState<PreviewError | null>(null);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  const generateSrcDoc = () => {
    const htmlFile = files.find((f) => f.language === "html");
    const cssFile = files.find((f) => f.language === "css");
    const jsFile = files.find((f) => f.language === "javascript");

    if (!htmlFile) {
      return "<html><body><div style='color: #666; padding: 20px;'>No HTML file found</div></body></html>";
    }

    let content = htmlFile.content;

    // Add CSS
    const styleTag = `<style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      ${cssFile?.content || ""}
    </style>`;

    if (content.includes("</head>")) {
      content = content.replace("</head>", `${styleTag}\n</head>`);
    } else {
      content = styleTag + content;
    }

    // Add error handling and inspector script
    const scriptTag = `<script>
      (function() {
        // Error logging
        const errors = [];
        window.addEventListener('error', (e) => {
          const error = {
            type: 'ERROR',
            message: e.message,
            stack: e.error?.stack || '',
            line: e.lineno,
            column: e.colno
          };
          errors.push(error);
          window.parent.postMessage(error, '*');
        });

        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (e) => {
          const error = {
            type: 'UNHANDLED_REJECTION',
            message: e.reason?.message || String(e.reason),
            stack: e.reason?.stack || ''
          };
          errors.push(error);
          window.parent.postMessage(error, '*');
        });

        // Script ready signal
        window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');

        try {
          ${jsFile?.content || ""}
        } catch (error) {
          const err = {
            type: 'SCRIPT_ERROR',
            message: error.message,
            stack: error.stack
          };
          window.parent.postMessage(err, '*');
        }

        // Inspector functionality
        window.addEventListener('click', (e) => {
          if (${isInspectorActive}) {
            e.preventDefault();
            e.stopPropagation();

            const el = e.target;
            const style = window.getComputedStyle(el);

            const inspectorData = {
              type: 'ELEMENT_SELECTED',
              elementId: el.id || 'aura-' + Math.random().toString(36).substr(2, 9),
              elementTag: el.tagName.toLowerCase(),
              textContent: (el.innerText || '').substring(0, 100),
              tailwindClasses: el.className || '',
              padding: {
                top: parseInt(style.paddingTop) || 0,
                bottom: parseInt(style.paddingBottom) || 0,
                left: parseInt(style.paddingLeft) || 0,
                right: parseInt(style.paddingRight) || 0
              },
              margin: {
                top: parseInt(style.marginTop) || 0,
                bottom: parseInt(style.marginBottom) || 0,
                left: parseInt(style.marginLeft) || 0,
                right: parseInt(style.marginRight) || 0
              },
              typography: {
                fontSize: parseInt(style.fontSize) || 16,
                fontWeight: style.fontWeight,
                textAlign: style.textAlign,
                lineHeight: style.lineHeight
              },
              background: {
                color: style.backgroundColor
              }
            };

            window.parent.postMessage(inspectorData, '*');
          }
        }, true);

        // Hover effects for inspector
        window.addEventListener('mouseover', (e) => {
          if (${isInspectorActive} && e.target !== document.body) {
            const target = e.target;
            target.style.outline = '2px solid #6366f1';
            target.style.outlineOffset = '-2px';
            target.style.cursor = 'crosshair';
          }
        });

        window.addEventListener('mouseout', (e) => {
          if (${isInspectorActive}) {
            const target = e.target;
            target.style.outline = '';
          }
        });
      })();
    </script>`;

    if (content.includes("</body>")) {
      content = content.replace("</body>", `${scriptTag}\n</body>`);
    } else {
      content += scriptTag;
    }

    return content;
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our iframe
      if (iframeRef.current && event.source !== iframeRef.current.contentWindow) {
        return;
      }

      const data = event.data;

      // Handle preview ready
      if (data?.type === "PREVIEW_READY") {
        setPreviewLoaded(true);
        setPreviewError(null);
        return;
      }

      // Handle inspector element selection
      if (data?.type === "ELEMENT_SELECTED" && onElementSelect) {
        onElementSelect(data);
        return;
      }

      // Handle errors
      if (["ERROR", "SCRIPT_ERROR", "UNHANDLED_REJECTION"].includes(data?.type)) {
        setPreviewError(data);
        return;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onElementSelect]);

  // Clear error when files change
  useEffect(() => {
    setPreviewError(null);
  }, [files]);

  return (
    <div className="w-full h-full bg-white overflow-hidden rounded-lg shadow-xl relative flex flex-col">
      {/* Inspector indicator */}
      {isInspectorActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-primary px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg pointer-events-none animate-bounce">
          INSPECTOR ACTIVE - CLICK TO EDIT
        </div>
      )}

      {/* Error display */}
      {previewError && (
        <div className="bg-destructive/10 border-b border-destructive/20 p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-destructive">
              {previewError.type === "SCRIPT_ERROR"
                ? "Script Error"
                : previewError.type === "UNHANDLED_REJECTION"
                  ? "Promise Rejection"
                  : "Runtime Error"}
            </h3>
            <p className="text-xs text-destructive/80 mt-1 font-mono break-words">
              {previewError.message}
            </p>
            {previewError.line && (
              <p className="text-xs text-destructive/60 mt-1">
                Line {previewError.line}
                {previewError.column && `, Column ${previewError.column}`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading state */}
      {!previewLoaded && !previewError && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Preview iframe */}
      <iframe
        ref={iframeRef}
        title="Live Preview"
        srcDoc={generateSrcDoc()}
        className="flex-1 w-full border-none"
        sandbox="allow-scripts allow-modals allow-same-origin"
        onLoad={() => setPreviewLoaded(true)}
      />
    </div>
  );
};
