import React, { useEffect, useRef } from "react";
import { ProjectFile } from "@/hooks/use-project-files";

interface PreviewFrameProps {
  files: ProjectFile[];
  onElementSelect?: (data: any) => void;
  isInspectorActive?: boolean;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  files,
  onElementSelect,
  isInspectorActive = false,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generateSrcDoc = () => {
    const htmlFile = files.find((f) => f.language === "html");
    const cssFile = files.find((f) => f.language === "css");
    const jsFile = files.find((f) => f.language === "javascript");

    if (!htmlFile) return "";

    let content = htmlFile.content;

    const styleTag = `<style>${cssFile?.content || ""}</style>`;
    if (content.includes("</head>")) {
      content = content.replace("</head>", `${styleTag}\n</head>`);
    } else {
      content = styleTag + content;
    }

    const scriptTag = `<script>
      (function() {
        ${jsFile?.content || ""}
        
        // Advanced Inspector Script
        window.addEventListener('click', (e) => {
          if (${isInspectorActive}) {
            e.preventDefault();
            e.stopPropagation();
            
            const el = e.target;
            const style = window.getComputedStyle(el);
            
            // Extract useful properties for the Inspector
            const inspectorData = {
              type: 'ELEMENT_SELECTED',
              elementId: el.id || 'aura-' + Math.random().toString(36).substr(2, 9),
              elementTag: el.tagName.toLowerCase(),
              textContent: el.innerText || '',
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

        // Hover effects
        window.addEventListener('mouseover', (e) => {
          if (${isInspectorActive}) {
            e.target.style.outline = '2px solid #6366f1';
            e.target.style.outlineOffset = '-2px';
            e.target.style.cursor = 'crosshair';
          }
        });
        window.addEventListener('mouseout', (e) => {
          if (${isInspectorActive}) {
            e.target.style.outline = '';
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
      if (event.data?.type === "ELEMENT_SELECTED" && onElementSelect) {
        onElementSelect(event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onElementSelect]);

  return (
    <div className="w-full h-full bg-white overflow-hidden rounded-lg shadow-xl relative">
      {isInspectorActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-primary px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg pointer-events-none animate-bounce">
          INSPECTOR ACTIVE - CLICK TO EDIT
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="preview"
        srcDoc={generateSrcDoc()}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-modals"
      />
    </div>
  );
};
