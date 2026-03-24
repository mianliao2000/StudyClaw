"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
  showModelSelector?: boolean;
  model?: string;
  onModelChange?: (model: string) => void;
  reasoning?: string;
  onReasoningChange?: (reasoning: string) => void;
}

/** Parse [OPTIONS]...[/OPTIONS] blocks from message content */
function parseMessageContent(content: string) {
  const parts: { type: "text" | "options"; value: string; options?: string[] }[] = [];
  const regex = /\[OPTIONS\]\s*([\s\S]*?)\s*\[\/OPTIONS\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    const optionsText = match[1].trim();
    const options = optionsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => /^[A-Z]\./.test(line));
    parts.push({ type: "options", value: optionsText, options });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    // Strip [PLAN_READY] marker from display
    const remaining = content.slice(lastIndex).replace(/\[PLAN_READY\]\s*$/g, "").trimEnd();
    if (remaining) {
      parts.push({ type: "text", value: remaining });
    }
  }

  if (parts.length === 0) {
    const cleaned = content.replace(/\[PLAN_READY\]\s*$/g, "").trimEnd();
    parts.push({ type: "text", value: cleaned });
  }

  return parts;
}

export function ChatPanel({
  messages,
  onSend,
  isLoading = false,
  placeholder = "输入消息...",
  suggestions,
  className,
  showModelSelector = false,
  model = "gpt-5.4-mini",
  onModelChange,
  reasoning = "medium",
  onReasoningChange,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    onSend(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Check if the last assistant message is the latest and contains options
  const lastMsg = messages[messages.length - 1];
  const showClickableOptions =
    lastMsg?.role === "assistant" && !isLoading;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, idx) => {
            const isLast = idx === messages.length - 1;
            const parts = msg.role === "assistant" ? parseMessageContent(msg.content) : null;

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className="max-w-[85%] space-y-3">
                  {msg.role === "user" ? (
                    <div className="rounded-lg px-4 py-2.5 text-sm whitespace-pre-wrap bg-primary/90 text-primary-foreground">
                      {msg.content}
                    </div>
                  ) : (
                    <>
                      {parts?.map((part, pi) =>
                        part.type === "text" ? (
                          <div
                            key={pi}
                            className="rounded-lg px-4 py-2.5 text-sm whitespace-pre-wrap bg-muted/50 border border-border/30"
                          >
                            {part.value}
                          </div>
                        ) : (
                          <div key={pi} className="flex flex-wrap gap-2">
                            {part.options?.map((opt) => (
                              <button
                                key={opt}
                                disabled={!isLast || !showClickableOptions || isLoading}
                                onClick={() => onSend(opt)}
                                className={cn(
                                  "px-4 py-2 text-sm rounded-lg border transition-all text-left",
                                  isLast && showClickableOptions
                                    ? "border-primary/30 bg-primary/5 hover:bg-primary/15 hover:border-primary/50 cursor-pointer"
                                    : "border-border/20 bg-muted/30 opacity-60 cursor-default"
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted/50 border border-border/30 rounded-lg px-4 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {suggestions && messages.length === 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSend(s)}
              className="px-3 py-1.5 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border/50 p-4 space-y-3">
        {showModelSelector && showSettings && (
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">模型:</span>
              <div className="flex rounded-md border border-border/50 overflow-hidden">
                {[
                  { value: "gpt-5.4", label: "GPT-5.4" },
                  { value: "gpt-5.4-mini", label: "5.4 Mini" },
                ].map((m) => (
                  <button
                    key={m.value}
                    onClick={() => onModelChange?.(m.value)}
                    className={cn(
                      "px-3 py-1 transition-colors",
                      model === m.value
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">推理:</span>
              <div className="flex rounded-md border border-border/50 overflow-hidden">
                {[
                  { value: "low", label: "低" },
                  { value: "medium", label: "中" },
                  { value: "high", label: "高" },
                ].map((r) => (
                  <button
                    key={r.value}
                    onClick={() => onReasoningChange?.(r.value)}
                    className={cn(
                      "px-3 py-1 transition-colors",
                      reasoning === r.value
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {showModelSelector && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className={cn("h-4 w-4", showSettings && "text-primary")} />
            </Button>
          )}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[44px] max-h-32 resize-none bg-input/50"
            rows={1}
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
