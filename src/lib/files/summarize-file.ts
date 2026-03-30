import { getAIProvider } from "@/lib/ai/provider";
import { fillTemplate, FILE_SUMMARY_PROMPT } from "@/lib/ai/prompts";
import { normalizeMarkdownMath } from "@/lib/markdown-math";

export async function summarizeExtractedText(
  text: string,
  fileName: string,
): Promise<{ zh: string; en: string }> {
  const provider = getAIProvider();
  const prompt = fillTemplate(FILE_SUMMARY_PROMPT, {
    fileName,
    extractedText: text,
  });

  const result = await provider.generate([{ role: "user", content: prompt }]);
  return parseBilingualSummary(result);
}

function parseBilingualSummary(result: string): { zh: string; en: string } {
  const zhMatch = result.match(/---LANG:zh---\s*([\s\S]*?)(?:---LANG:en---|$)/);
  const enMatch = result.match(/---LANG:en---\s*([\s\S]*?)$/);
  return {
    zh: normalizeMarkdownMath(zhMatch?.[1]?.trim() || result.trim()),
    en: normalizeMarkdownMath(enMatch?.[1]?.trim() || result.trim()),
  };
}
