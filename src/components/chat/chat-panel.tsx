"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { isCreateCourseOption } from "@/lib/ai/conversation-language";
import { normalizeMarkdownMath } from "@/lib/markdown-math";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import type { ChatMessage } from "@/types";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  onOptionSelect?: (option: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
  animatePrimaryOption?: boolean;
  wideLayout?: boolean;
  headerSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  hideComposer?: boolean;
}

type ParsedPart =
  | { type: "text"; value: string }
  | { type: "options"; value: string; options: string[] };

function sanitizeDisplayContent(content: string) {
  return content
    .replace(/\[PLAN_READY\]\s*$/g, "")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => !/^\s*(\*\*|__)\s*$/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseMessageContent(content: string): ParsedPart[] {
  const parts: ParsedPart[] = [];
  const normalized = sanitizeDisplayContent(content);
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
      .replace(/\s+(?=[A-D][.)]\s)/g, "\n")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => /^[A-D][.)]\s/.test(line))
      .slice(0, 4);

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
      .split(/(?=[A-D][.)]\s)/)
      .map((line) => line.trim())
      .filter((line) => /^[A-D][.)]\s/.test(line))
      .slice(0, 4);

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
  animatePrimaryOption = false,
  wideLayout = false,
  headerSlot,
  leftSlot,
  footerSlot,
  hideComposer = false,
}: ChatPanelProps) {
  const { lang } = useLanguage();
  const [input, setInput] = useState("");
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
    <div className={cn("flex h-full min-h-0 flex-col overflow-hidden", className)}>
      <ScrollArea
        className={cn(
          "min-h-0 flex-1 overscroll-contain p-4",
          wideLayout && "px-5 sm:px-6 lg:px-8"
        )}
        ref={scrollRef}
      >
        <div className={cn("space-y-4", wideLayout && "mx-auto w-full max-w-6xl")}>
          {messages.map((msg, idx) => {
            const isLast = idx === messages.length - 1;
            const parts =
              msg.role === "assistant" ? parseMessageContent(msg.content) : null;
            const messageWidthClass =
              msg.role === "assistant"
                ? wideLayout
                  ? "w-full max-w-[min(100%,72rem)]"
                  : "max-w-[85%]"
                : wideLayout
                  ? "w-full max-w-[min(100%,44rem)]"
                  : "max-w-[85%]";

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(messageWidthClass, "space-y-3")}>
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
                            className="rounded-2xl border border-border/40 bg-muted/40 px-4 py-3 text-sm leading-relaxed shadow-sm dark:border-white/10 dark:bg-white/[0.06]"
                          >
                            <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 dark:prose-invert">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                              >
                                {normalizeMarkdownMath(part.value)}
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
                                        : "cursor-pointer border-primary/25 bg-emerald-50/70 hover:border-primary/45 hover:bg-emerald-100/70 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/90 dark:hover:border-primary/40 dark:hover:bg-white/[0.10]"
                                      : "cursor-default border-border/20 bg-muted/30 opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50"
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
                            {isLast && showClickableOptions && (
                              <p className="mt-1 text-center text-base font-semibold text-foreground">
                                {lang === "en"
                                  ? "or type your own response below"
                                  : "也可以直接打字输入你的想法"}
                              </p>
                            )}
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
              <div className="rounded-2xl border border-border/30 bg-muted/50 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {suggestions && messages.length === 0 && (
        <div className="shrink-0 border-t border-border/40 px-4 py-2">
          <div className="flex flex-wrap gap-2">
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
        </div>
      )}

      <div className="shrink-0 border-t border-border/50 bg-background p-2 dark:border-white/10">
        {footerSlot ? (
          <div className="flex items-center gap-1.5">
            <div className="min-w-0 flex-1">{footerSlot}</div>
            {headerSlot}
          </div>
        ) : hideComposer ? (
          headerSlot ? <div className="flex justify-end">{headerSlot}</div> : null
        ) : (
          <div className="flex items-center gap-1.5">
            {leftSlot}
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="min-h-[36px] max-h-28 flex-1 resize-none bg-input/50 px-3 py-2 text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/40"
              rows={1}
            />
            <Button
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
            {headerSlot}
          </div>
        )}
      </div>
    </div>
  );
}
