import type { AIOptions } from "./provider";

const DEFAULT_OPENROUTER_MODEL_STRONG = "stepfun/step-3.5-flash:free";
const DEFAULT_OPENROUTER_MODEL_MEDIUM = "stepfun/step-3.5-flash:free";
const DEFAULT_OPENROUTER_MODEL_WEAK = "nvidia/nemotron-3-super-120b-a12b:free";

export function resolveModelForReasoning(args: {
  explicitModel?: AIOptions["model"];
  reasoning?: AIOptions["reasoning"];
}): string | undefined {
  const { explicitModel, reasoning } = args;

  if (explicitModel) {
    return explicitModel;
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return undefined;
  }

  const weakModel =
    process.env.OPENROUTER_MODEL_WEAK || DEFAULT_OPENROUTER_MODEL_WEAK;
  const mediumModel =
    process.env.OPENROUTER_MODEL_MEDIUM || DEFAULT_OPENROUTER_MODEL_MEDIUM;
  const strongModel =
    process.env.OPENROUTER_MODEL_STRONG || DEFAULT_OPENROUTER_MODEL_STRONG;

  if (reasoning === "low") {
    return weakModel;
  }

  if (reasoning === "high") {
    return strongModel;
  }

  return mediumModel;
}
