"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Send, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { isCreateCourseOption } from "@/lib/ai/conversation-language";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  onOptionSelect?: (option: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
  showModelSelector?: boolean;
  model?: string;
  onModelChange?: (model: string) => void;
  reasoning?: string;
  onReasoningChange?: (reasoning: string) => void;
  animatePrimaryOption?: boolean;
}

type ParsedPart =
  | { type: "text"; value: string }
  | { type: "options"; value: string; options: string[] };

function parseMessageContent(content: string): ParsedPart[] {
  const parts: ParsedPart[] = [];
  const normalized = content.replace(/\[PLAN_READY\]\s*$/g, "").trim();
  const regex = /\[OPTIONS\]\s*([\s\S]*?)(?:\s*\[\/OPTIONS\]|$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      const textBeforeOptions = normalized.slice(lastIndex, match.index).trim();
      if (textBeforeOptions) {
        parts.push({ type: "text", value: textBeforeOptions });
      }
    }

    const optionsText = match[1].trim();
    const options = optionsText
      .replace(/\s+(?=[A-C][.)]\s)/g, "\n")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => /^[A-C][.)]\s/.test(line))
      .slice(0, 3);

    parts.push({ type: "options", value: optionsText, options });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < normalized.length) {
    const remaining = normalized.slice(lastIndex).trim();
    if (remaining) {
      parts.push({ type: "text", value: remaining });
    }
  }

  if (parts.length > 0) {
    return parts;
  }

  const fallbackOptionsMatch = normalized.match(/\[OPTIONS\]\s*([\s\S]*)$/);
  if (fallbackOptionsMatch) {
    const beforeOptions = normalized.slice(0, fallbackOptionsMatch.index).trim();
    if (beforeOptions) {
      parts.push({ type: "text", value: beforeOptions });
    }

    const inlineOptions = fallbackOptionsMatch[1]
      .split(/(?=[A-C][.)]\s)/)
      .map((line) => line.trim())
      .filter((line) => /^[A-C][.)]\s/.test(line))
      .slice(0, 3);

    if (inlineOptions.length > 0) {
      parts.push({
        type: "options",
        value: fallbackOptionsMatch[1].trim(),
        options: inlineOptions,
      });
      return parts;
    }
  }

  return [{ type: "text", value: normalized }];
}

function cleanOptionLabel(option: string) {
  return option
    .replace(/\*\*/g, "")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function isPrimaryOption(option: string) {
  return isCreateCourseOption(cleanOptionLabel(option));
}

export function ChatPanel({
  messages,
  onSend,
  onOptionSelect,
  isLoading = false,
  placeholder = "Type a message...",
  suggestions,
  className,
  showModelSelector = false,
  model = "gpt-5.4-mini",
  onModelChange,
  reasoning = "medium",
  onReasoningChange,
  animatePrimaryOption = false,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [animatedMessageId, setAnimatedMessageId] = useState<string | null>(
    null
  );
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

  const lastMsg = messages[messages.length - 1];
  const showClickableOptions = lastMsg?.role === "assistant" && !isLoading;

  useEffect(() => {
    if (!animatePrimaryOption || lastMsg?.role !== "assistant") return;
    const parts = parseMessageContent(lastMsg.content);
    const hasPrimaryOption = parts.some(
      (part) =>
        part.type === "options" &&
        part.options.some((option) => isPrimaryOption(option))
    );

    if (!hasPrimaryOption) return;

    setAnimatedMessageId(lastMsg.id);
    const timeout = window.setTimeout(() => setAnimatedMessageId(null), 550);
    return () => window.clearTimeout(timeout);
  }, [animatePrimaryOption, lastMsg]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, idx) => {
            const isLast = idx === messages.length - 1;
            const parts =
              msg.role === "assistant" ? parseMessageContent(msg.content) : null;

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
                    <div className="whitespace-pre-wrap rounded-2xl bg-primary/90 px-4 py-3 text-sm text-primary-foreground shadow-sm">
                      {msg.content}
                    </div>
                  ) : (
                    <>
                      {parts?.map((part, partIndex) =>
                        part.type === "text" ? (
                          <div
                            key={`${msg.id}-text-${partIndex}`}
                            className="rounded-2xl border border-border/40 bg-muted/40 px-4 py-3 text-sm leading-7 shadow-sm"
                          >
                            <div className="prose prose-sm max-w-none prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {part.value}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={`${msg.id}-options-${partIndex}`}
                            className="flex flex-col gap-3"
                          >
                            {part.options.map((option) => {
                              const primary = isPrimaryOption(option);
                              const shouldAnimatePrimary =
                                primary &&
                                isLast &&
                                animatedMessageId === msg.id &&
                                animatePrimaryOption;
                              const shouldBreathePrimary =
                                primary && isLast && animatePrimaryOption;

                              return (
                                <button
                                  key={option}
                                  disabled={
                                    !isLast || !showClickableOptions || isLoading
                                  }
                                  onClick={() =>
                                    (onOptionSelect ?? onSend)(
                                      cleanOptionLabel(option)
                                    )
                                  }
                                  className={cn(
                                    "rounded-2xl border px-4 py-3 text-left text-sm leading-6 shadow-sm transition-all",
                                    isLast && showClickableOptions
                                      ? primary
                                        ? cn(
                                            "cursor-pointer border-primary bg-primary text-primary-foreground hover:bg-primary/90",
                                            shouldBreathePrimary &&
                                              "assistant-option-breathe"
                                          )
                                        : "cursor-pointer border-primary/25 bg-emerald-50/70 hover:border-primary/45 hover:bg-emerald-100/70"
                                      : "cursor-default border-border/20 bg-muted/30 opacity-60"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "block",
                                      shouldAnimatePrimary &&
                                        "animate-[assistant-option-shake_0.55s_ease-in-out_1]"
                                    )}
                                  >
                                    {cleanOptionLabel(option)}
                                  </span>
                                </button>
                              );
                            })}
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
              <div className="rounded-2xl border border-border/30 bg-muted/50 px-4 py-3 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {suggestions && messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSend(suggestion)}
              className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/10"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3 border-t border-border/50 p-4">
        {showModelSelector && showSettings && (
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Model:</span>
              <div className="flex overflow-hidden rounded-md border border-border/50">
                {[
                  { value: "gpt-5.4", label: "GPT-5.4" },
                  { value: "gpt-5.4-mini", label: "5.4 Mini" },
                ].map((modelOption) => (
                  <button
                    key={modelOption.value}
                    onClick={() => onModelChange?.(modelOption.value)}
                    className={cn(
                      "px-3 py-1 transition-colors",
                      model === modelOption.value
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {modelOption.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Reasoning:</span>
              <div className="flex overflow-hidden rounded-md border border-border/50">
                {[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Med" },
                  { value: "high", label: "High" },
                ].map((reasoningOption) => (
                  <button
                    key={reasoningOption.value}
                    onClick={() => onReasoningChange?.(reasoningOption.value)}
                    className={cn(
                      "px-3 py-1 transition-colors",
                      reasoning === reasoningOption.value
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {reasoningOption.label}
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
              onClick={() => setShowSettings((prev) => !prev)}
            >
              <Settings2
                className={cn("h-4 w-4", showSettings && "text-primary")}
              />
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
