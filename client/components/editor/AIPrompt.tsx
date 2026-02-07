import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2 } from "lucide-react";

interface AIPromptProps {
  onApply: (prompt: string) => Promise<void>;
}

export const AIPrompt: React.FC<AIPromptProps> = ({ onApply }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      await onApply(prompt);
      setPrompt("");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-3 bg-[#121214] relative">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Edit code with AI..."
            className="pl-3 pr-10 py-5 bg-[#1e1e20] border-white/5 focus-visible:ring-primary/30 text-[11px] h-9"
            disabled={isGenerating}
          />
          <Button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            variant="ghost"
            size="icon"
            className="absolute right-1 h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
          >
            {isGenerating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
