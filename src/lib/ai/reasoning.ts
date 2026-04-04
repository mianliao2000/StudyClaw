import type { AIOptions } from "./provider";

export type ReasoningLevel = NonNullable<AIOptions["reasoning"]>;

export type ReasoningTask =
  | "planning-chat"
  | "planning-generate"
  | "tutoring-chat"
  | "lesson-main"
  | "lesson-summary"
  | "lesson-quiz";

const TASK_REASONING: Record<ReasoningTask, ReasoningLevel> = {
  "planning-chat": "medium",
  "planning-generate": "medium",
  "tutoring-chat": "low",
  "lesson-main": "low",
  "lesson-summary": "low",
  "lesson-quiz": "low",
};

const REASONING_RANK: Record<ReasoningLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function toReasoningLevel(value?: string | null): ReasoningLevel | null {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  return null;
}

export function sanitizeExplicitReasoning(
  value?: string | null
): ReasoningLevel | undefined {
  return toReasoningLevel(value) ?? undefined;
}

export function resolveReasoningForTask(args: {
  task: ReasoningTask;
  userPreference?: string | null;
  explicitReasoning?: AIOptions["reasoning"];
}): ReasoningLevel {
  const { task, userPreference, explicitReasoning } = args;

  const explicit = sanitizeExplicitReasoning(explicitReasoning);
  if (explicit) {
    return explicit;
  }

  const recommended = TASK_REASONING[task];
  const preferred = toReasoningLevel(userPreference);

  if (!preferred) {
    return recommended;
  }

  return REASONING_RANK[preferred] < REASONING_RANK[recommended]
    ? preferred
    : recommended;
}
